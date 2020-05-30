import React, { Component } from 'react';
import { View, Button, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as Google from "expo-google-app-auth";
import firebase from 'firebase'
require('firebase/auth')
//import GoogleButton from 'react-google-button'

class Login extends Component {
    state = {
        email: "",
        password: "",
    };
    updateInputState = (key, val) => {
        if (key === "email") {
            this.setState(prevState => {
                return {
                    ...prevState,
                    email: val
                }
            });
        }
        if (key === "password") {
            this.setState(prevState => {
                return {
                    ...prevState,
                    password: val
                }
            });
        }
    };

    loginHandler = () => {
        const { navigate } = this.props.navigation;
        const apiKey = "AIzaSyCGSqNJuwxTLagZhIQf1bGKXtjRCD9ODsQ";
        let url =
            "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=" +
            apiKey;
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                returnSecureToken: true
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .catch(err => {
                console.log(err);
                alert("Authentication failed, please try again!");
            })
            .then(res => res.json())
            .then(parsedRes => {
                console.log(parsedRes);
                if (!parsedRes.idToken) {
                    alert("Email o contraseña incorrectos. Pruebe de nuevo");
                } else {
                    navigate('Drawer', { user: this.state.email })
                }
            });
    };

    signInWithGoogle = async () => {
        const IOS_CLIENT_ID =
            "373083290781-3fcscsa04jolfq15q9qju18cgngk2hfe.apps.googleusercontent.com";
        const ANDROID_CLIENT_ID =
            "your-android-client-id";
        try {
            const result = await Google.logInAsync({
                iosClientId: IOS_CLIENT_ID,
                androidClientId: ANDROID_CLIENT_ID,
                scopes: ["profile", "email"]
            });

            if (result.type === "success") {
                //console.log("LoginScreen.js.js 21 | ", result.user.givenName);
                this.onSignIn(result);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            console.log('LoginScreen.js.js 30 | Error with login', e);
            return { error: true };
        }
    };
    isUserEqual = (googleUser, firebaseUser) => {
        //console.log(googleUser.user.id);
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.user.id) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    };
    onSignIn = googleUser => {
        const { navigate } = this.props.navigation;
        //console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(
            function (firebaseUser) {
                unsubscribe();
                // Check if we are already signed-in Firebase with the correct user.
                if (!this.isUserEqual(googleUser, firebaseUser)) {
                    // Build Firebase credential with the Google ID token.
                    var credential = firebase.auth.GoogleAuthProvider.credential(
                        googleUser.idToken,
                        googleUser.accessToken
                    );
                    // Sign in with credential from the Google user.
                    firebase
                        .auth()
                        .signInWithCredential(credential)
                        .then(function (result) {
                            console.log('user signed in ');
                            if (result.additionalUserInfo.isNewUser) {
                                firebase
                                    .database()
                                    .ref('/users/' + result.user.uid)
                                    .set({
                                        gmail: result.user.email,
                                        profile_picture: result.additionalUserInfo.profile.picture,
                                        first_name: result.additionalUserInfo.profile.given_name,
                                        last_name: result.additionalUserInfo.profile.family_name,
                                        created_at: Date.now()
                                    })
                                    .then(function (snapshot) {
                                        // console.log('Snapshot', snapshot);
                                    });
                            } else {
                                firebase
                                    .database()
                                    .ref('/users/' + result.user.uid)
                                    .update({
                                        last_logged_in: Date.now()
                                    });
                            }
                            navigate('Drawer')
                        })
                        .catch(function (error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            // The email of the user's account used.
                            var email = error.email;
                            // The firebase.auth.AuthCredential type that was used.
                            var credential = error.credential;
                            // ...
                        });
                } else {
                    navigate('Drawer')
                    console.log('User already signed-in Firebase.');
                }
            }.bind(this)
        );
    };

    render() {
        const { navigate } = this.props.navigation;

        return (
            <KeyboardAwareScrollView
                style={{ backgroundColor: '#d6edff' }}
                enableResetScrollToCoords={true}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.contianer} >
                        <Image source={require('./imagenes/logo.png')} style={styles.Image} />
                        <TextInput
                            placeholder="Email"
                            placeholderTextColor="#adb5bd"
                            autoCapitalize="none"
                            value={this.state.email}
                            onChangeText={val => this.updateInputState("email", val)}
                            underlineColor="#1E90FF"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Contraseña"
                            placeholderTextColor="#adb5bd"
                            autoCapitalize="none"
                            value={this.state.password}
                            onChangeText={val => this.updateInputState("password", val)}
                            underlineColorAndroid="#1E90FF"
                            style={styles.input}
                            secureTextEntry
                        />
                        <View style={styles.button}>
                            <Button title="Login" onPress={this.loginHandler} buttonStyle={styles.button} disabled={(this.state.email === "" || this.state.password === "")} />
                            <Button title="Login con Google" onPress={this.signInWithGoogle} buttonStyle={styles.button}  />

                        </View>
                        <Text style={styles.text}>Todavía no estás registrado?
                         <Text onPress={() => navigate('SignUp', { user: this.state.email })} style={styles.navigateText}>  Regístrate</Text>
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAwareScrollView>
        )
    }
}
const styles = StyleSheet.create({
    contianer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        bottom: 0,
        top: 50,
    },
    text: {
        color: "black",
    },
    navigateText: {
        color: "#1E90FF"
    },
    input: {
        width: "70%",
        fontSize: 15,
        color: '#212529',
        borderBottomColor: '#212529',
        borderBottomWidth: 2,
        marginBottom: 40

    },
    button: {
        marginTop: 25,
        marginBottom: 25,

    },
    Image: {
        margin: 150,
        width: 120,
        height: 80
    }
});
export default Login;