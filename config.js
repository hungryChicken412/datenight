// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getDatabase } from "firebase/database";
import {
	getFirestore,
	collection,
	getDocs,
	initializeFirestore,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyC5A-SqiaWxo58TTu-wYNqEbPBvKzqc6uM",
	authDomain: "meapp-601f1.firebaseapp.com",
	databaseURL: "https://meapp-601f1-default-rtdb.firebaseio.com",
	projectId: "meapp-601f1",
	storageBucket: "meapp-601f1.appspot.com",
	messagingSenderId: "997391260154",
	appId: "1:997391260154:web:1c683fd820c020e9c66c43",
	measurementId: "G-CF1RRDCRKL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const fireStore = initializeFirestore(app, {
	ignoreUndefinedProperties: true,
	experimentalForceLongPolling: true, // this line
	useFetchStreams: false, // and this line
});
//const db = getFirestore();
const db = getDatabase(app);

export default db;
