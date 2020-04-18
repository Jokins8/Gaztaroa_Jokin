import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Card } from 'react-native-elements';
import { CONTACTO } from '../comun/contacto';

function RenderContacto(props) {

    const contacto = props.contacto;
    
    if (contacto != null) {
        return(
            <Card
            title='Información de contacto'>
                <Text style={{margin: 10}}>{contacto.saludo}</Text>
                <Text style={{margin: 10}}>{contacto.texto}</Text>
                <Text style={{margin: 10}}> {contacto.adios}</Text>
                <Text style={{margin: 10}}>{contacto.telefono}</Text>
                <Text style={{margin: 10}}>{contacto.email}</Text>
            </Card>
        );
    }
    else {
        return(<View></View>);
    }
}

class Contacto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contacto: CONTACTO
        };
    }

    render(){
        return(<RenderContacto contacto={this.state.contacto} />);
    } 
}

export default Contacto;