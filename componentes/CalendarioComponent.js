import React from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

function Calendario(props) {
    const renderCalendarioItem = ({ item, index }) => {
        return (
            <ListItem
                key={index}
                title={item.nombre}
                subtitle={item.descripcion}
                hideChevron={true}
                leftAvatar={{ source: require('./imagenes/40Años.png') }}
            />
        );
    };
    return (
        <FlatList
            data={props.excursiones} 
            renderItem={renderCalendarioItem} 
            keyExtractor={item => item.id.toString()} 
            />
    );
}
export default Calendario;