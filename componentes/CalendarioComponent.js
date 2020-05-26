import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import IndicadorActividad from './IndicadorActividadComponent';
import * as Animatable from 'react-native-animatable';


const mapStateToProps = state => {
    return {
        excursiones: state.excursiones
    }
}

class Calendario extends Component {

    render() {
      
        const { navigate } = this.props.navigation;

        const renderCalendarioItem = ({ item, index }) => {
            return (
                <Animatable.View animation="fadeInRight" duration={2000} delay={10}>
                <ListItem
                    key={index}
                    title={item.nombre}
                    subtitle={item.descripcion}
                    hideChevron={true}
                    onPress={() => navigate('DetalleExcursion', { excursionId: item.id })}
                    leftAvatar={{ source: { uri: item.imagen } }}
                />
                </Animatable.View>
            );
        }

        if (this.props.excursiones.isLoading) {
            return (
                <IndicadorActividad />
            );
        }
        else if (this.props.excursiones.errMess) {
            return (
                <View> 
                    <Text>{this.props.actividades.errMess}</Text>
                </View>
                );
        }
        else {
            return (
                <FlatList
                    data={this.props.excursiones.excursiones}
                    renderItem={renderCalendarioItem}
                    keyExtractor={item => item.id.toString()}
                />
            );
        }
    };
}

export default connect(mapStateToProps)(Calendario);