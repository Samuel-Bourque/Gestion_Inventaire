import "./App.css";
import { React, useState } from "react";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

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
  console.log("login");
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
};

const logout = () => {
  auth.signOut();
};

const ChatBox = () => {
  const messageCollection = firestore.collection("messages");
  const messageQuery = messageCollection.orderBy("createAt").limit(25);
  const [messages] = useCollectionData(messageQuery);

  const [chatText, setText] = useState("");
  const sendMessage = (e) => {
    e.preventDefault();

    if (chatText !== "") {
      messageCollection.add({
        text: chatText,
        createAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: auth.currentUser.uid,
        photoURL: auth.currentUser.photoURL,
      });
    }
    // send Message

    //vider le chat
    setText("");
  };
  return (
    <div>
      <main>
        {messages &&
          messages.map((msg) => {
            return (
              <div className="message sent" key={msg.id}>
                <p>{msg.text}</p>
              </div>
            );
          })}
      </main>
      <form>
        <input
          value={chatText}
          onChange={(event) => setText(event.target.value)}
        />
        <button onClick={(e) => sendMessage(e)}>GO!</button>
        <button onClick={logout}>Log out</button>
      </form>
    </div>
  );
};

function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <section>
        {user ? <ChatBox /> : <button onClick={login}>Log in</button>}
        <button onClick={logout}>Log out</button>
      </section>
    </div>
  );
}

export default App;
