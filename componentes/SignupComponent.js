import React, { Component } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableWithoutFeedback, Keyboard, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class SignUp extends Component {
    state = {
        email: "",
        password: {
            val: "",
            valid: true
        },
        confirmPassword: {
            val: "",
            valid: false
        }
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
                    password: {
                        ...prevState.password,
                        val: val
                    },
                    confirmPassword: {
                        ...prevState.confirmPassword,
                        valid: prevState.confirmPassword.val === val
                    }
                }
            });
        }
        if (key === "confirmPassword") {
            this.setState(prevState => {
                return {
                    ...prevState,
                    confirmPassword: {
                        ...prevState.confirmPassword,
                        val: val,
                        valid: val === this.state.password.val
                    }
                }
            });
        }
    };
    signupHandler = () => {
        const { navigate } = this.props.navigation;
        const apiKey = "AIzaSyCGSqNJuwxTLagZhIQf1bGKXtjRCD9ODsQ";
        let url = "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=" + apiKey;
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password.val,
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
                //console.log(parsedRes.error.message);
                if (!parsedRes.idToken) {
                    Alert.alert("Error",parsedRes.error.message);
                } else {
                    Alert.alert( "Bienvenid@!","Te has registrado correctamente. Ahora Logeate con tus nuevas credenciales.");
                    navigate('Login')
                }
            });
    };
    render() {
        return (
            <KeyboardAwareScrollView
                style={{ backgroundColor: '#d6edff' }}
                enableResetScrollToCoords={true}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.contianer}>
                        <Image source={require('./imagenes/logo.png')} style={styles.Image} />
                        <View style={styles.headerView}>
                            <Text style={styles.header}>Regístrate</Text>
                        </View>
                        <TextInput
                            placeholder="Email"
                            autoCapitalize="none"
                            value={this.state.email}
                            onChangeText={val => this.updateInputState("email", val)}
                            underlineColorAndroid="#1E90FF"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Contraseña"
                            autoCapitalize="none"
                            value={this.state.password.val}
                            onChangeText={val => this.updateInputState("password", val)}
                            underlineColorAndroid="#1E90FF"
                            style={styles.input}
                            secureTextEntry
                        />
                        <TextInput
                            placeholder="Confirma la contraseña"
                            autoCapitalize="none"
                            value={this.state.confirmPassword.val}
                            onChangeText={val => this.updateInputState("confirmPassword", val)}
                            underlineColorAndroid="#1E90FF"
                            style={styles.input}
                            secureTextEntry
                        />
                        <View style={styles.button} >
                            <Button title="SignUp" onPress={this.signupHandler} disabled={(this.state.email === "" || !this.state.confirmPassword.valid)} />
                        </View>
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
    headerView: {
        marginBottom: 25
    },
    header: {
        fontWeight: "bold",
        fontSize: 26,
        color: "#212529"
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
export default SignUp;