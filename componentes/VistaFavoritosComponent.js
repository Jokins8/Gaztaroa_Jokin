import React, { Component } from 'react';
import { FlatList, Alert } from 'react-native';
import Swipeout from 'react-native-swipeout';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import IndicadorActividad from './IndicadorActividadComponent';
import { borrarFavorito } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
        favoritos: state.favoritos,
        actualuser: state.actualuser
    }
}

const mapDispatchToProps = dispatch => ({
    borrarFavorito: (excursionId, user) => dispatch(borrarFavorito(excursionId, user)),
})

class VistaFavoritos extends Component {

    BorrarAlert = (name, id) =>
        Alert.alert(
            "Borrar excursión favorita?",
            "Confirme que desea borrar la excursion: " + name,
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log(name + ' Favorito no borrado'),
                    style: "cancel"
                },
                { text: "OK", onPress: () => this.props.borrarFavorito(id, this.props.actualuser) }
            ],
            { cancelable: false }
        );

    render() {
        const { navigate } = this.props.navigation;
        const favsuser=[];
        for (i = 0; i <this.props.favoritos.user.length; i++) {
            if (this.props.favoritos.user[i] === this.props.actualuser) {
                favsuser[favsuser.length]=this.props.favoritos.excursion[i];
            }
        }

        const renderFavoritoItem = ({ item, index }) => {

            const rightButton = [
                {
                    text: 'Borrar',
                    type: 'delete',
                    onPress: () => this.BorrarAlert(item.nombre, item.id)
                }];

            if (favsuser.some(el => el === item.id)) {
                return (
                    <Swipeout right={rightButton} autoClose={true} >
                        <ListItem
                            key={index}
                            title={item.nombre}
                            subtitle={item.descripcion}
                            hideChevron={true}
                            onPress={() => navigate('DetalleExcursion', { excursionId: item.id })}
                            onLongPress={() =>  this.BorrarAlert(item.nombre, item.id)}
                            leftAvatar={{ source: { uri: item.imagen } }}
                        />
                    </Swipeout>
                );
            }
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
                    renderItem={renderFavoritoItem}
                    keyExtractor={item => item.id.toString()}
                />
            );
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(VistaFavoritos);