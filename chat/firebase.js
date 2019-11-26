const firebaseConfig = {
  apiKey: "AIzaSyBgRThatckW3C04oPynTVASkoTzjLQzo8U",
  authDomain: "chat-6f474.firebaseapp.com",
  databaseURL: "https://chat-6f474.firebaseio.com",
  projectId: "chat-6f474",
  storageBucket: "chat-6f474.appspot.com",
  messagingSenderId: "743308533373",
  appId: "1:743308533373:web:51277b59a0882874421b14",
  measurementId: "G-9L3XMNZ3ZH"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const fStore = firebaseApp.firestore();