import Firebase from 'firebase';
// const config = {
//     apiKey: "AIzaSyBenz2Tazj3rS7QV7Zam40kG6GTFJnSnnk",
//     authDomain: "breakout-crypto-signals.firebaseapp.com",
//     projectId: "breakout-crypto-signals",
//     storageBucket: "breakout-crypto-signals.appspot.com",
//     messagingSenderId: "8485644192",
//     appId: "1:8485644192:web:9f01e965bde9fdda2666c5",
//     measurementId: "G-Y3DV5919BS"
//   };

const config = {
  apiKey: "AIzaSyAq-9NyTW9keWLZenhlug-YRHn5R4EQbsE",
  authDomain: "constructionapp-5f1c7.firebaseapp.com",
  projectId: "constructionapp-5f1c7",
  storageBucket: "constructionapp-5f1c7.appspot.com",
  messagingSenderId: "150305848004",
  appId: "1:150305848004:web:afa892f37e0557bdee6791"
};
let firebase = Firebase.initializeApp(config);
export default firebase