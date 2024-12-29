// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBfXY2Spe-Nw2JOMaQHY61VuGq1iZoUBuE",
    authDomain: "food-order-e80f8.firebaseapp.com",
    projectId: "food-order-e80f8",
    storageBucket: "food-order-e80f8.firebasestorage.app",
    messagingSenderId: "89122358081",
    appId: "1:89122358081:web:8e485e5616b99afebed7c0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };