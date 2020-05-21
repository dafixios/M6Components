import { firestorePlugin } from "vuefire";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import EventBus from "../Eventbus";

const install = Vue => {
  Vue.use(firestorePlugin);
};

export let db = {};
export let storage = {};
export default install;
export let initFirebase = () => {
  firebase.initializeApp(window.Drupal.settings.m6_platform.f_base.config);
  function init() {
    // Authenticate through token
    firebase
      .auth()
      .signInWithCustomToken(window.Drupal.settings.m6_platform.f_base.token)
      .then(() => EventBus.$emit("loaded:firebase"))
      .catch(function(error) {
        // eslint-disable-next-line no-console
        console.log("Error: ", error);

        setTimeout(init, 500);
      });
    console.log("Firebase Ready");
  }

  init();
  db = firebase.firestore();
  storage = firebase.storage();
};

// Install by default if included from script tag
if (typeof window !== "undefined" && window.Vue) {
  window.Vue.use(install);
}
