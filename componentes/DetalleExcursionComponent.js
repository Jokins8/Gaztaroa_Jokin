import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { baseUrl } from '../comun/comun';
import { connect } from 'react-redux';

import { postFavorito, postComentario } from '../redux/ActionCreators';
import { colorGaztaroaOscuro } from '../comun/comun';


const mapStateToProps = state => {
    return {
        excursiones: state.excursiones,
        comentarios: state.comentarios,
        favoritos: state.favoritos
    }
}
const mapDispatchToProps = dispatch => ({
    postFavorito: (excursionId) => dispatch(postFavorito(excursionId)),
    postComentario: (excursionId, valoracion, autor, comentario) => dispatch(postComentario(excursionId, valoracion, autor, comentario))
})



function RenderExcursion(props) {

    const excursion = props.excursion;

    if (excursion != null) {
        return (
            <Card
                featuredTitle={excursion.nombre}
                image={{ uri: baseUrl + excursion.imagen }}>
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
                </View>
            </Card>
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
        <Card title='Comentarios' >
            <FlatList
                data={comentarios}
                renderItem={renderCommentarioItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}


class DetalleExcursion extends Component {

    constructor(props) {
        super(props);

        this.state = {
            valoracion: 3,
            autor: '',
            comentario:'',
            showModal: false
        }
    }

    marcarFavorito(excursionId) {
        this.props.postFavorito(excursionId);
    }

    resetForm() {
        this.setState({
            valoracion: 3,
            autor: '',
            comentario:'',
            showModal: false
        });
    }
    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }
    gestionarComentario(excursionId, valoracion, autor, comentario){
        this.props.postComentario(excursionId, valoracion, autor, comentario);
        this.toggleModal()
    }

    render() {
        const { excursionId } = this.props.route.params;
        return (
            <ScrollView>
                <RenderExcursion
                    excursion={this.props.excursiones.excursiones[+excursionId]}
                    favorita={this.props.favoritos.some(el => el === excursionId)}
                    onPressFav={() => this.marcarFavorito(excursionId)}
                    onPressCom={() => this.toggleModal()}
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
                                ratingCount={5}
                                defaultRating={3}
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
                                onPress={() => { this.gestionarComentario(excursionId, this.state.valoracion, this.state.autor, this.state.comentario); this.resetForm(); }}
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