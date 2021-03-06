import React, { Component, useRef } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';

import { postFavorito, postComentario } from '../redux/ActionCreators';
import { colorGaztaroaOscuro } from '../comun/comun';

import * as Animatable from 'react-native-animatable';



const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
        comentarios: state.comentarios,
        favoritos: state.favoritos,
        actualuser: state.actualuser
    }
}
const mapDispatchToProps = dispatch => ({
    postFavorito: (excursionId, user) => dispatch(postFavorito(excursionId, user)),
    postComentario: (excursionId, valoracion, autor, comentario, id) => dispatch(postComentario(excursionId, valoracion, autor, comentario, id))
})



function RenderExcursion(props) {

    const excursion = props.excursion;

    const cardAnimada = useRef(null);
    const reconocerDragDerechaIzquierda = ({ moveX, moveY, dx, dy }) => {
        if (dx < -50)
            return true;
        else
            return false;
    }
    const reconocerDragIzquierdaDerecha = ({ moveX, moveY, dx, dy }) => {
        if (dx > 50)
            return true;
        else
            return false;
    }
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            cardAnimada.current.rubberBand(1000)
                .then(endState => console.log(endState.finished ? 'terminado' : 'cancelado'));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log("PanResponder finalizado", gestureState);
            if (reconocerDragDerechaIzquierda(gestureState)) {
                Alert.alert(
                    'Añadir favorito',
                    'Confirmar que desea añadir' + excursion.nombre + ' a favoritos:',
                    [
                        { text: 'Cancelar', onPress: () => console.log('Excursión no añadida a favoritos'), style: 'cancel' },
                        { text: 'OK', onPress: () => { props.favorita ? console.log('La excursión ya se encuentra entre las favoritas') : props.onPressFav() } },
                    ],
                    { cancelable: false }
                );

                return true;
            } else if (reconocerDragIzquierdaDerecha(gestureState)) {
                props.onPressCom();
                return true;
            }
        }
    })


    if (excursion != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={500} ref={cardAnimada}
                {...panResponder.panHandlers} >
                <Card
                    featuredTitle={excursion.nombre}
                    image={{ uri: excursion.imagen }}>
                    <Text style={{ margin: 10 }}>
                        {excursion.descripcion}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Icon
                            raised
                            reverse
                            name={props.favorita ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorita ? console.log('La excursión ya se encuentra entre las favoritas') : props.onPressFav()}
                        />
                        <Icon
                            raised
                            reverse
                            name={'pencil'}
                            type='font-awesome'
                            color={colorGaztaroaOscuro}
                            onPress={() => props.onPressCom()}
                        />
                        <Icon
                            raised
                            reverse
                            name={'share-square'}
                            type='font-awesome'
                            color='black'
                            onPress={() => props.onPressShare()}
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComentario(props) {

    const comentarios = props.comentarios;

    const renderCommentarioItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comentario}</Text>
                <Text style={{ fontSize: 12 }}>{item.valoracion} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.autor + ', ' + item.dia} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comentarios' >
                <FlatList
                    data={comentarios}
                    renderItem={renderCommentarioItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}



class DetalleExcursion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            valoracion: 3,
            autor: '',
            comentario: '',
            showModal: false
        }
    }

    marcarFavorito(excursionId, user) {
        this.props.postFavorito(excursionId, user);
    }

    resetForm() {
        this.setState({
            valoracion: 3,
            autor: '',
            comentario: '',
            showModal: false
        });
    }
    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }
    gestionarComentario(excursionId, valoracion, autor, comentario, id) {
        this.props.postComentario(excursionId, valoracion, autor, comentario, id);
        this.toggleModal()
    }
    async onShare(name) {
        try {
            const result = await Share.share({
                message: 'Cuanto me ha gustado la excursión ' + name + ' organizada por el club de montaña Gaztaroa. Entra en Gaztaroa y disfruta de esta excursión y muchas más! Únete!',
                url: 'https://www.gaztaroa.eus'
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    render() {
        //console.log(this.props.favoritos);
        const { excursionId } = this.props.route.params;
        const favsuser=[];
        for (i = 0; i <this.props.favoritos.user.length; i++) {
            if (this.props.favoritos.user[i] === this.props.actualuser) {
                favsuser[favsuser.length]=this.props.favoritos.excursion[i];
            }
        }
        //console.log(favsuser);
        return (
            <ScrollView>
                <RenderExcursion
                    excursion={this.props.excursiones.excursiones[+excursionId]}
                    favorita={favsuser.some(el => el === excursionId)}
                    onPressFav={() => this.marcarFavorito(excursionId, this.props.actualuser)}
                    onPressCom={() => this.toggleModal()}
                    onPressShare={() => this.onShare(this.props.excursiones.excursiones[+excursionId].nombre)}
                />
                <RenderComentario
                    comentarios={this.props.comentarios.comentarios.filter((comentario) => comentario.excursionId === excursionId)}
                />
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => { this.toggleModal(); this.resetForm(); }} onRequestClose={() => { this.toggleModal(); this.resetForm(); }}>
                    <View style={styles.modal}>
                        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                            <Rating
                                showRating
                                onFinishRating={value => this.setState({ valoracion: value })}
                            />
                            <Input
                                placeholder='   Autor'
                                leftIcon={{ type: 'font-awesome', name: 'user-o' }}
                                onChangeText={value => this.setState({ autor: value })}
                            />
                            <Input
                                placeholder='   Comentario'
                                leftIcon={{ type: 'font-awesome', name: 'comment-o' }}
                                onChangeText={value => this.setState({ comentario: value })}
                            />
                            <Button
                                onPress={() => { this.gestionarComentario(excursionId, this.state.valoracion, this.state.autor, this.state.comentario, this.props.comentarios.comentarios.length); this.resetForm(); }}
                                color={colorGaztaroaOscuro} title="ENVIAR"
                            />
                            <Button
                                onPress={() => { this.toggleModal(); this.resetForm(); }}
                                color={colorGaztaroaOscuro} title="CANCELAR"
                            />
                        </SafeAreaView>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center', margin: 20
    },

});

export default connect(mapStateToProps, mapDispatchToProps)(DetalleExcursion);