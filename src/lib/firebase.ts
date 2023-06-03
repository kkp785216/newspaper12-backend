// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxLnauPiSKjkg4VISvM2RNLMrIAjiywys",
  authDomain: "newspaper-12-74161.firebaseapp.com",
  projectId: "newspaper-12-74161",
  storageBucket: "newspaper-12-74161.appspot.com",
  messagingSenderId: "1058521079669",
  appId: "1:1058521079669:web:4793ec8cba945114d33d3c",
  measurementId: "G-L6TJFS93MH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

export { app, storage };
