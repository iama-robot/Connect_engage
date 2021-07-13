// firebase configuration
import firebase from "firebase";

const firebaseConfig = {
    // your config here
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore(); 
const auth = firebaseApp.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth,provider};
export default db;
