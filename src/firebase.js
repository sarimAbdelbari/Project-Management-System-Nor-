import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";


// ! Original 
const firebaseConfig = {
  apiKey: "AIzaSyCndxvRziufledf8c1PudU14wH6HhjiA-8",
  authDomain: "nor-project-99935.firebaseapp.com",
  projectId: "nor-project-99935",
  storageBucket: "nor-project-99935.appspot.com",
  messagingSenderId: "315145784490",
  appId: "1:315145784490:web:4681768893da0f571c94d3",
  measurementId: "G-DPTR83TVEH"
};

// ! Copy Test
// const firebaseConfig = {
//   apiKey: "AIzaSyDQTi7_eWUP3g1kCGKjOE6HMRDc7XC2cxE",
//   authDomain: "test-nor.firebaseapp.com",
//   projectId: "test-nor",
//   storageBucket: "test-nor.appspot.com",
//   messagingSenderId: "129335704548",
//   appId: "1:129335704548:web:9c03e4d48408b3e6e165f1",
//   measurementId: "G-2VK80HZ04G"
// };




export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);