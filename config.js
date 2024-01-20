// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getDatabase, set } from "firebase/database";
import { initializeFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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

const messaging = getMessaging(app);

const db = getDatabase(app);

export const onMessageListener = () => {
	new Promise((resolve) => {
		onMessage(messaging, (payload) => {
			resolve(payload);
		});
	});
};
export const getTokenFromFireBase = async (setTokenFound) => {
	let currentToken = "";

	try {
		currentToken = await getToken(messaging, {
			vapidKey:
				"BBvgoz95Qp6tYpzKJ8MkZ4GH7PrzUjxXRpKvVJGmVnuIlbFBNXU1QLYTrkx2I3Fx8sWuKOwhlRzkr2ICOwSJq28",
		});

		if (currentToken) {
			console.log("current token for client: ", currentToken);
			localStorage.setItem("tokenFCM", currentToken);
			setTokenFound(true);
		} else {
			console.log(
				"No registration token available. Request permission to generate one."
			);
			setTokenFound(false);
		}
	} catch (error) {
		console.log("An error occurred while retrieving token. ", error);
		setTimeout(async () => {
			currentToken = await getToken(messaging, {
				vapidKey:
					"BBvgoz95Qp6tYpzKJ8MkZ4GH7PrzUjxXRpKvVJGmVnuIlbFBNXU1QLYTrkx2I3Fx8sWuKOwhlRzkr2ICOwSJq28",
			});
			if (currentToken) {
				console.log("current token for client: ", currentToken);
				localStorage.setItem("tokenFCM", currentToken);
				setTokenFound(true);
			} else {
				console.log(
					"No registration token available. Request permission to generate one."
				);
				setTokenFound(false);
			}
			console.log("here");
		}, 4000);
	}
};
export default db;
