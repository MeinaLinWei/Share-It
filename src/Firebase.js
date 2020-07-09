import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD5JVJOg8UpDAePNzKdJI-KM4usXIsI9LY",
    authDomain: "instagram-clone-eba26.firebaseapp.com",
    databaseURL: "https://instagram-clone-eba26.firebaseio.com",
    projectId: "instagram-clone-eba26",
    storageBucket: "instagram-clone-eba26.appspot.com",
    messagingSenderId: "224195269593",
    appId: "1:224195269593:web:9c4bea4856117ce276bfc8",
    measurementId: "G-5XZRP9CQR6"
});

const db = firebaseApp.firestore(); // to access the database
const auth = firebase.auth(); // to access the authentication
const storage = firebase.storage(); // to upload pictures to firebase and store in the db

export { db, auth, storage };