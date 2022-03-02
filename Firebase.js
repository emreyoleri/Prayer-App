import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATgQU_GsQPuBa7IKUI8nKbO0VgNOBkmWo",
  authDomain: "react-native-todo-app-645c5.firebaseapp.com",
  projectId: "react-native-todo-app-645c5",
  storageBucket: "react-native-todo-app-645c5.appspot.com",
  messagingSenderId: "217628297584",
  appId: "1:217628297584:web:c2ee7bb75f5aef9c0b27b5",
  measurementId: "G-9VCNTK3CVT",
};

class Fire {
  constructor(callback) {
    this.init(callback);
  }

  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) callback(null, user);
      else {
        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            callback(error);
          });
      }
    });
  }

  getLists(callback) {
    let ref = firebase
      .firestore()
      .collection("users")
      .doc("ot5DKyWskNXBN204vQM0b8N9swB3")
      .collection("lists");

    this.unsubscribe = ref.onSnapshot((snapshot) => {
      lists = [];

      snapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data() });
      });

      callback(lists);
    });
  }

  get userId() {
    return firebase.auth().currentUser.uid;
  }

  detach() {
    this.unsubscribe();
  }
}

export default Fire;
