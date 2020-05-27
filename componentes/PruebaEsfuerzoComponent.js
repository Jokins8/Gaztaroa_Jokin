import React, { Component, useEffect } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-datepicker'
import { colorGaztaroaOscuro } from '../comun/comun';
import * as Calendar from 'expo-calendar';


class PruebaEsfuerzo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            edad: 18,
            federado: false,
            fecha: '',
            showModal: false,
            calendario: ''
        }
    }

    gestionarReserva() {
        //console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            edad: 18,
            federado: false,
            fecha: '',
            showModal: false
        });
    }
    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    async  getDefaultCalendarSource() {
        const calendars = await Calendar.getCalendarsAsync();
        const defaultCalendars = calendars.filter(each => each.source.name === 'iCloud');
        return defaultCalendars[0].source;
    }

    async  createEvent(details) {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            this.setState({ calendario: await Calendar.getCalendarsAsync() });
            //Creamos un calendario Gaztaroa dentro de iCloud en caso de que no exista
            if (this.state.calendario.filter(each => each.title === 'Gaztaroa') == false) {
                const defaultCalendarSource =
                    Platform.OS === 'ios'
                        ? await this.getDefaultCalendarSource()
                        : { isLocalAccount: true, name: 'Gaztaroa' };

                const newCalendarID = await Calendar.createCalendarAsync({
                    title: 'Gaztaroa',
                    color: 'blue',
                    entityType: Calendar.EntityTypes.EVENT,
                    sourceId: defaultCalendarSource.id,
                    source: defaultCalendarSource,
                    name: 'internalCalendarName',
                    ownerAccount: 'personal',
                    accessLevel: Calendar.CalendarAccessLevel.OWNER,
                });
                //console.log(`Your new calendar ID is: ${newCalendarID}`);
            }
            //Añadimos el evento al calendario gaztaroa
            this.setState({ calendario: await Calendar.getCalendarsAsync() });
            const calendarioGaztaroa = this.state.calendario.filter(each => each.title === 'Gaztaroa');
            console.log(calendarioGaztaroa[0].id);
            Calendar.createEventAsync(calendarioGaztaroa[0].id, details)
        }
    }

    EventoAlert = (details) =>
        Alert.alert(
            "Añadir evento al calendario?",
            "El evento se añadira al calendario Gaztaroa dentro de los calendarios de iCloud ",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log(' Evento no guardado'),
                    style: "Cancelar"
                },
                { text: "OK", onPress: () => { this.createEvent(details); this.toggleModal(); this.resetForm(); } }
            ],
            { cancelable: false }
        );

    render() {


        var date = new Date(this.state.fecha);
        const details = {
            endDate: date,
            location: "Gaztaroa mediku zentroa",
            startDate: date,
            title: "Prueba de esfuerzo Gaztaroa",
            url: "http://www.Gaztaroa.eus"
        };

        return (

            <ScrollView>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Edad</Text>
                    <Picker
                        style={styles.formItem}
                        selectedValue={this.state.edad}
                        onValueChange={(itemValue, itemIndex) => this.setState({ edad: itemValue })}>
                        <Picker.Item label="< 20" value="< 20" />
                        <Picker.Item label="20 - 30" value="20 - 30" />
                        <Picker.Item label="31 - 40" value="31 - 40" />
                        <Picker.Item label="41 - 50" value="41 - 50" />
                        <Picker.Item label="51 - 60" value="51 - 60" />
                        <Picker.Item label="> 60" value="> 60" />
                    </Picker>
                </View>

                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Federado/No-federado?</Text>
                    <Switch
                        style={styles.formItem}
                        value={this.state.federado}
                        trackColor={colorGaztaroaOscuro}
                        onValueChange={(value) => this.setState({ federado: value })}>
                    </Switch>
                </View>

                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Día y hora</Text>
                    <DatePicker
                        style={{ flex: 2, marginRight: 20 }}
                        date={this.state.fecha}
                        format=''
                        mode="datetime"
                        placeholder="Seleccionar fecha y hora"
                        minDate="2020-01-01"
                        confirmBtnText="Confirmar"
                        cancelBtnText="Cancelar"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => { this.setState({ fecha: date }) }}
                    />
                </View>

                <View style={styles.formRow}>
                    <Button
                        onPress={() => this.gestionarReserva()}
                        title="Reservar"
                        color={colorGaztaroaOscuro}
                        accessibilityLabel="Gestionar reserva..."
                    />
                </View>

                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => { this.toggleModal(); this.resetForm(); }} onRequestClose={() => { this.toggleModal(); this.resetForm(); }}>
                    <View style={styles.modal}>
                        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
                            <Text style={styles.modalTitle}>Detalle de la reserva</Text>
                            <Text style={styles.modalText}>Edad: {this.state.edad}</Text>
                            <Text style={styles.modalText}>Federado?: {this.state.federado ? 'Si' : 'No'}</Text>
                            <Text style={styles.modalText}>Día y hora: {this.state.fecha}</Text>
                            <Button
                                onPress={() => { this.toggleModal(); this.resetForm(); }}
                                color={colorGaztaroaOscuro} title="Cerrar"
                            />
                            <Button
                                onPress={() => { this.EventoAlert(details); }}
                                color={colorGaztaroaOscuro} title="Añadir a calendario"
                            />
                        </SafeAreaView>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
};

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center', margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold', backgroundColor: '#512DA8', textAlign: 'center', color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default PruebaEsfuerzo;

