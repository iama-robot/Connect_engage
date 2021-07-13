// firebase configuration
import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCmKKRs4AZG0WtJ81uOzIYwC3VQee8OwdQ",
    authDomain: "connect-app-bac80.firebaseapp.com",
    projectId: "connect-app-bac80",
    storageBucket: "connect-app-bac80.appspot.com",
    messagingSenderId: "815274637737",
    appId: "1:815274637737:web:4f2dd4002e26862ead2cb8",
    measurementId: "G-75M46JW3B4"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore(); 
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth,provider};
export default db;