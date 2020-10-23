import React, { useState, useEffect } from "react";

import Avatar from "../../components/Avatar";
import ContactBox from "../../components/ContactBox";
import MessagesBox from "../../components/MessagesBox";
import ChatInputBox from "../../components/ChatInputBox";
import Search from "../../components/Search";
import Welcome from "../../components/Welcome";
import { useStateValue } from "../../utils/stateprovider";
import firebase from "../../firebase";
import { actionTypes } from "../../utils/reducer";
import { ReactComponent as Logout } from "../../assets/logout.svg";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from "@material-ui/core/styles";

import "./UI.css";

const BlueOnGreenTooltip = withStyles({
  tooltip: {
   fontSize:"15px"
  }
})(Tooltip);

const UI = () => {
  const [{ mainUser }, dispatch] = useStateValue();
  const [data, setData] = useState([]);
  const [contactSelected, setContactSelected] = useState({});
  const [currentMessages, setCurrentMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [filteredContacts, setFilterContacts] = useState([]);
  const [showEmojiTray, toggleEmojiTray] = useState(false);
  const { firestore } = firebase;
  const [open, setopen] = useState(false);



  useEffect(() => {
    firestore()
      .collection("whatsapp-users")
      .onSnapshot((users) => {
        let userData = users.docs
          .map((user) => user.data())
          .filter((d) => d.id !== mainUser.id);
        let payloadData = userData.map((d) => {
          return {
            contact: d,
            messages: [],
          };
        });
        setData(payloadData);
        userData.forEach((d) => {
          let collectionName = null;
          if (mainUser.id < d.id) {
            collectionName = mainUser.id + ":" + d.id;
          } else {
            collectionName = d.id + ":" + mainUser.id;
          }
          firebase
            .firestore()
            .collection(collectionName)
            .orderBy("dateCreated", "desc")
            .onSnapshot((msgs) => {
              let currUserId = d.id;
              if (!msgs.empty) {
                payloadData = payloadData.map((a) => {
                  if (a.contact.id === currUserId) {
                    return {
                      ...a,
                      messages: msgs.docs.map((msg) => {
                        return { ...msg.data(), uid: msg.id };
                      }),
                    };
                  } else
                    return {
                      ...a,
                    };
                });
                setData(payloadData);
              }
            });
        });
      });
  }, [dispatch, firestore, mainUser]);

  useEffect(() => {
    const currContact = data.find((d) => d.contact.id === contactSelected.id);
    setCurrentMessages((currContact && currContact.messages) || []);
    const filterContacts = () => {
      let result = data.filter(({ contact }) => {
        return (
          !search || contact.name.toLowerCase().includes(search.toLowerCase())
        );
      });
      let newChat = result.filter(d=>d.messages.length===0)
      let oldChat = result.filter(d=>d.messages.length!==0)
  
      let result1 =  oldChat.sort((a,b)=>{
        const maxTsA = Math.max(...a.messages.map((m) => (new Date(m.date)).getTime()))
        const lastMsgA = a.messages.find((m) =>(new Date(m.date)).getTime() === maxTsA)
        const maxTsB = Math.max(...b.messages.map((m) => (new Date(m.date)).getTime()))
        const lastMsgB = b.messages.find((m) =>(new Date(m.date)).getTime() === maxTsB)
        return (new Date(lastMsgB.date)) - (new Date(lastMsgA.date))
      })
      let finalChat = result1.concat(newChat)
      setFilterContacts(finalChat);
    };
    filterContacts();
  }, [contactSelected, data, search]);

  const pushMessage = () => {
    if (message === "") {
      return;
    }
    let dbcollection = null;
    if (mainUser.id < contactSelected.id) {
      dbcollection = mainUser.id + ":" + contactSelected.id;
    } else {
      dbcollection = contactSelected.id + ":" + mainUser.id;
    }
    firebase.firestore().collection(dbcollection).add({
      msg: message,
      sender: mainUser.id,
      receiver: contactSelected.id,
      date: new Date().toString(),
      dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setMessage("");
  };



  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type: actionTypes.REMOVE_MAIN_USER,
    });
  };

  return (
    <div className="whatsapp_content">
      <Dialog
        open={open}
        onClose={() => setopen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to Logout?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            On clicking <b>Logout</b>, you will be logged out from the WhatsApp
            WEB. If you don't want to logout, click <b>Cancel</b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setopen(false)} color="primary">
            cancel
          </Button>
          <Button variant="contained" onClick={logout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      <aside>
        <header>
          <Avatar user={mainUser} />
          <h4>Hi, {mainUser?.name}!</h4>
          {mainUser?.name && <BlueOnGreenTooltip title="logout"><Logout onClick={() => setopen(true)} /></BlueOnGreenTooltip>}
        </header>
        <Search search={search} setSearch={setSearch} />
        <div className="contact-boxes">
          {filteredContacts.map(({ contact, messages }) => (
            <ContactBox
              contact={contact}
              key={contact.id}
              setContactSelected={setContactSelected}
              setMessage={setMessage}
              messages={messages}
              onClick={() => toggleEmojiTray(false)}
            />
          ))}
        </div>
      </aside>
      {contactSelected.id ? (
        <main>
          <header>
            <Avatar user={contactSelected} showName />
          </header>
          <MessagesBox messages={currentMessages} />
          <ChatInputBox
            message={message}
            setMessage={setMessage}
            pushMessage={pushMessage}
            showEmojiTray={showEmojiTray}
            toggleEmojiTray={toggleEmojiTray}
          />
        </main>
      ) : (
        <Welcome />
      )}
    </div>
  );
};

export default UI;
