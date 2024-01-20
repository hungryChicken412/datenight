importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.1/firebase-messaging.js");

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




firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
	console.log("notification received", payload);

	const notificationTitle = payload.notification.title;
	const notificationOptions = {
		body: payload.notification.body,
		icon: payload.notification.icon,
	};

	return self.registration.showNotification(
		notificationTitle,
		notificationOptions
	);
});
