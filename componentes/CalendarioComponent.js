import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { EXCURSIONES } from '../comun/excursiones';

class Calendario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            excursiones: EXCURSIONES
        };
    }

    render(){
        const { navigate } = this.props.navigation;

        const renderCalendarioItem = ({item, index}) => {
            return (
                    <ListItem
                        key={index}
                        title={item.nombre}
                        subtitle={item.descripcion}
                        hideChevron={true}
                        onPress={() => navigate('DetalleExcursion', { excursionId: item.id })}
                        leftAvatar={{ source: require('./imagenes/40Años.png')}}
                    />                                
            );
        }

        return (
            <FlatList 
                data={this.state.excursiones}
                renderItem={renderCalendarioItem}
                keyExtractor={item => item.id.toString()}
                />
        );
    };
}

export default Calendario;