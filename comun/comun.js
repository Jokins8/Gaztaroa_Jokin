import Firebase from 'firebase';
let config = {
    apiKey: "AIzaSyCGSqNJuwxTLagZhIQf1bGKXtjRCD9ODsQ",
    authDomain: "gaztaroa-2faee.firebaseapp.com",
    databaseURL: "https://gaztaroa-2faee.firebaseio.com",
    projectId: "gaztaroa-2faee",
    storageBucket: "gaztaroa-2faee.appspot.com",
    messagingSenderId: "803076546180",
    appId: "1:803076546180:web:3be75ac13e5431b6f92cd1",
    measurementId: "G-1D0XX61JLP"
};
let app = Firebase.initializeApp(config);
export const db = app.database();

export const colorGaztaroaOscuro = '#015afc';
export const colorGaztaroaClaro = '#c2d3da';