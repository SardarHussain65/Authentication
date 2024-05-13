import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCULuBZCQIG9BEzLrAc4p1O10lwkh8h-k8",
  authDomain: "authentication-d45eb.firebaseapp.com",
  projectId: "authentication-d45eb",
  storageBucket: "authentication-d45eb.appspot.com",
  messagingSenderId: "800796404441",
  appId: "1:800796404441:web:faaa95e6fcf4c44d532cc8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, app };
