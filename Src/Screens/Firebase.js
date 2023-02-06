import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBBkzI_j4OqG0PNAuQOy1Jk9Lfp4718ExQ",
  authDomain: "lifes-dbe60.firebaseapp.com",
  projectId: "lifes-dbe60",
  storageBucket: "lifes-dbe60.appspot.com",
  messagingSenderId: "506663435315",
  appId: "1:506663435315:web:8f9f24807b3246d853b746",
  measurementId: "G-BLJZV6JHPY",
};
firebase.initializeApp(firebaseConfig);
export default firebase;
