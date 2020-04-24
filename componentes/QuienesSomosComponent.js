import React, { Component } from 'react';
import { FlatList, ScrollView, View, Text } from 'react-native';
import { ListItem, Card } from 'react-native-elements';
import { ACTIVIDADES } from '../comun/actividades';
import {baseUrl} from '../comun/comun';
function Historia() {
    return (
        <Card
            title='Un poquito de historia'>
            <Text style={{ margin: 10 }}>
                El nacimiento del club de montaña Gaztaroa se remonta a la primavera de 1976 cuando jóvenes aficionados a la montaña y pertenecientes a un club juvenil decidieron crear la sección montañera de dicho club. Fueron unos comienzos duros debido sobre todo a la situación política de entonces. Gracias al esfuerzo económico de sus socios y socias se logró alquilar una bajera. Gaztaroa ya tenía su sede social.
            </Text>
            <Text style={{ margin: 10 }}>
                Desde aquí queremos hacer llegar nuestro agradecimiento a todos los montañeros y montañeras que alguna vez habéis pasado por el club aportando vuestro granito de arena.
            </Text>
            <Text style={{ margin: 10 }}>
                Gracias!
            </Text>
        </Card>
    );
}


class QuienesSomos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            actividades: ACTIVIDADES
        };
    }

    render() {

        const renderActividadesItem = ({ item, index }) => {
            return (
                <ListItem
                    key={index}
                    title={item.nombre}
                    subtitle={item.descripcion}
                    hideChevron={true}
                    leftAvatar={{ source: { uri: baseUrl + item.imagen }}}
                />
            );
        }

        return (
            <ScrollView>
                <Historia />
                <Card title='Actividades y recursos'>
                    <FlatList
                        data={this.state.actividades}
                        renderItem={renderActividadesItem}
                        keyExtractor={item => item.id.toString()}
                    />
                </Card>
            </ScrollView>
        );
    };
}

export default QuienesSomos;