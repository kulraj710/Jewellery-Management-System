// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsBewlqeJezXhrJ4BrlZyglzDpURryrX0",
  authDomain: "shree-vaibhavjewellers.firebaseapp.com",
  projectId: "shree-vaibhavjewellers",
  storageBucket: "shree-vaibhavjewellers.appspot.com",
  messagingSenderId: "653417050514",
  appId: "1:653417050514:web:30d1fcdee02d27bddb114b"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig)
export const db = getFirestore(firebaseApp)