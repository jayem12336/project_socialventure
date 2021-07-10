import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyD3rIqtJoQEM9Kcq8_l2bzOpnOLLbAj3t0",
    authDomain: "socialventure-53667.firebaseapp.com",
    projectId: "socialventure-53667",
    storageBucket: "socialventure-53667.appspot.com",
    messagingSenderId: "807899228771",
    appId: "1:807899228771:web:4dc34e4c4e963f345fa656",
    measurementId: "G-P4YHCSX9WM"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const storage = firebase.storage();
export {db, auth, provider, storage }

export default firebase;