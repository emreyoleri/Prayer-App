import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBN2uQ2YB9E36kb1mbMY54qK0qi2I6jKJw",
  authDomain: "prayer-app-2.firebaseapp.com",
  projectId: "prayer-app-2",
  storageBucket: "prayer-app-2.appspot.com",
  messagingSenderId: "535526149407",
  appId: "1:535526149407:web:4749b8c6c2dbd4922d742a",
  measurementId: "G-Z0H31PH161",
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
  getPrayers(callback) {
    this.unsubscribe = this.ref.orderBy("order").onSnapshot((snapshot) => {
      prayers = [];
      snapshot.forEach((doc) => {
        prayers.push({ id: doc.id, ...doc.data() });
      });
      callback(prayers);
    });
  }
  addPrayer(prayer) {
    let ref = this.ref;
    ref.add(prayer);
  }

  get ref() {
    return firebase.firestore().collection("prayers");
  }
  detach() {
    this.unsubscribe();
  }
}
export default Fire;
