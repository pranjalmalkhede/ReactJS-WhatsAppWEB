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
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles } from "@material-ui/core/styles";
import { motion, AnimatePresence } from "framer-motion";
import Tick from "../../assets/whatsappweb.mp3";

import "./UI.css";

const BlueOnGreenTooltip = withStyles({
  tooltip: {
    fontSize: "15px",
  },
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
  const [open, setopen] = useState(false);
  let audio = new Audio(Tick);

  useEffect(() => {
    for (const user in filteredContacts) {
      let collectionName = getCollectionName(
        mainUser.id,
        filteredContacts[user].contact.id
      );
      if (filteredContacts[user].messages.length > 0) {
        filteredContacts[user].messages.forEach((msg) => {
          if (
            mainUser &&
            msg?.status === "sent" &&
            msg.sender !== mainUser.id
          ) {
            firebase
              .firestore()
              .collection(collectionName)
              .doc(msg.uid)
              .update({ status: "received" });
          }
        });
      }
    }
    return () => {};
  }, [filteredContacts, mainUser]);

  useEffect(() => {
    if (currentMessages.length > 0) {
      currentMessages.forEach((msg) => {
        if (
          msg.sender !== mainUser.id &&
          msg.status !== "sent" &&
          msg.status === "received"
        ) {
          firebase
            .firestore()
            .collection(getCollectionName(msg.sender, msg.receiver))
            .doc(msg.uid)
            .update({ status: "read" });
        }
      });
    }

    return () => {};
  }, [currentMessages, mainUser.id]);

  useEffect(() => {
    var unsubscribe1 = null;
    var unsubscribe2 = null;
    unsubscribe1 = firebase
      .firestore()
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
          unsubscribe2 = firebase
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

    return () => {
      unsubscribe1 && unsubscribe1();
      unsubscribe2 && unsubscribe2();
    };
  }, [dispatch, mainUser]);

  useEffect(() => {
    const currContact = data.find((d) => d.contact.id === contactSelected.id);
    setCurrentMessages((currContact && currContact.messages) || []);
    const filterContacts = () => {
      let result = data.filter(({ contact }) => {
        return (
          !search || contact.name.toLowerCase().includes(search.toLowerCase())
        );
      });
      let newChat = result.filter((d) => d.messages.length === 0);
      let oldChat = result.filter((d) => d.messages.length !== 0);

      let result1 = oldChat.sort((a, b) => {
        const maxTsA = Math.max(
          ...a.messages.map((m) => new Date(m.date).getTime())
        );
        const lastMsgA = a.messages.find(
          (m) => new Date(m.date).getTime() === maxTsA
        );
        const maxTsB = Math.max(
          ...b.messages.map((m) => new Date(m.date).getTime())
        );
        const lastMsgB = b.messages.find(
          (m) => new Date(m.date).getTime() === maxTsB
        );
        return new Date(lastMsgB.date) - new Date(lastMsgA.date);
      });
      let finalChat = result1.concat(newChat);
      setFilterContacts(finalChat);
    };
    filterContacts();
    return () => {};
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
    firebase
      .firestore()
      .collection(dbcollection)
      .add({
        msg: message,
        sender: mainUser.id,
        receiver: contactSelected.id,
        date: new Date().toString(),
        dateCreated: firebase.firestore.FieldValue.serverTimestamp(),
        status: "sent",
      })
      .then(() => {
        audio.play();
      });
    setMessage("");
  };

  const logout = () => {
    dispatch({
      type: actionTypes.REMOVE_MAIN_USER,
    });
    firebase.auth().signOut();
  };

  const getCollectionName = (mainUserId, otherId) => {
    return mainUserId < otherId
      ? mainUserId + ":" + otherId
      : otherId + ":" + mainUserId;
  };

  const handleSetContactSelected = (contact) => {
    setContactSelected(contact);
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
          {mainUser?.name && (
            <BlueOnGreenTooltip title="logout">
              <Logout onClick={() => setopen(true)} />
            </BlueOnGreenTooltip>
          )}
        </header>
        <Search search={search} setSearch={setSearch} />
        <div className="contact-boxes">
          <AnimatePresence>
            {filteredContacts.map(({ contact, messages }) => (
              <motion.div
                key={contact.id}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                positionTransition
              >
                <ContactBox
                  contact={contact}
                  setContactSelected={handleSetContactSelected}
                  setMessage={setMessage}
                  messages={messages}
                  onClick={() => toggleEmojiTray(false)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
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
            contactSelected={contactSelected}
          />
        </main>
      ) : (
        <Welcome />
      )}
    </div>
  );
};

export default UI;
