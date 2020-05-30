import React, { Component } from 'react';
import { View, Button, Text, TextInput, StyleSheet, TouchableWithoutFeedback, Keyboard, Image } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
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