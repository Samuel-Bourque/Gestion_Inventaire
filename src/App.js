import { React, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyC0AaLShGgxR3257LJUZySXZVp_shHwEgg",
  authDomain: "w5-tpfinal.firebaseapp.com",
  projectId: "w5-tpfinal",
  storageBucket: "w5-tpfinal.appspot.com",
  messagingSenderId: "317982673747",
  appId: "1:317982673747:web:6d073b5e3490fbd9f32fa6",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const login = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

const logout = () => {
  auth.signOut();
};

const ChatBox = () => {
  const itemCollection = firestore.collection("inventaire");
  const itemQuery = itemCollection.limit(25);
  const [snapshot, loading] = useCollection(itemQuery);
  const items = [];

  if (loading === false) {
    snapshot.forEach((item) => {
      const objet = item.data();
      items.push({
        name: objet.name,
        price: objet.price,
        stock: objet.stock,
        id: item.ref.path, //id
      });
    });
  }

  const [name, setTextName] = useState("");
  const [price, setTextPrice] = useState("");
  const [stock, setTextStock] = useState("");
  const sendMessage = (e) => {
    e.preventDefault();

    if ((name, price, stock !== "")) {
      itemCollection.add({
        name: name,
        price: price,
        stock: stock,
      });
    }
    setTextName("");
    setTextPrice("");
    setTextStock("");
  };
  const retirer = async (id) => {
    console.log(id);
    //await itemCollection.doc(id).delete();
  };
  return (
    <div>
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
      >
        {items.map((item) => {
          return (
            <div key={item.id}>
              <p>Article: {item.name}</p>
              <p>Prix: {item.price}</p>
              <p>Nb en inventaire: {item.stock}</p>
              <Button variant="outlined" onClick={() => retirer(item.id)}>
                Retirer de l'inventaire
              </Button>
            </div>
          );
        })}
      </Grid>
      <br />
      <Grid container direction="row" justify="center" alignItems="center">
        <p>Entrer le nom </p>
        <input
          value={name}
          onChange={(event) => setTextName(event.target.value)}
        />
        <p>Entrer le prix ($) </p>
        <input
          value={price}
          onChange={(event) => setTextPrice(event.target.value)}
        />
        <p>Entrer le stock (u) </p>
        <input
          value={stock}
          onChange={(event) => setTextStock(event.target.value)}
        />
      </Grid>
      <br />
      <Grid container direction="row" justify="center" alignItems="center">
        <Button variant="outlined" onClick={(e) => sendMessage(e)}>
          Ajouter à l'inventaire
        </Button>
        <Button variant="outlined" onClick={logout}>
          Log out
        </Button>
      </Grid>
    </div>
  );
};

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <Grid container direction="column" alignItems="center">
        <h1>Bienvenue sur la Gestion de l'Inventaire</h1>
      </Grid>

      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
      >
        <section>
          {user ? (
            <ChatBox />
          ) : (
            <Button variant="outlined" onClick={login}>
              Log in
            </Button>
          )}
        </section>
      </Grid>
    </div>
  );
}

export default App;
