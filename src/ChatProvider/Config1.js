import Firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAq-9NyTW9keWLZenhlug-YRHn5R4EQbsE",
    authDomain: "constructionapp-5f1c7.firebaseapp.com",
    projectId: "constructionapp-5f1c7",
    storageBucket: "constructionapp-5f1c7.appspot.com",
    messagingSenderId: "150305848004",
    databaseURL: "https://constructionapp-5f1c7-default-rtdb.firebaseio.com",
    appId: "1:150305848004:web:afa892f37e0557bdee6791"
  };


let firebase = Firebase.initializeApp(config);
export default firebase