import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import React from "react";

const LogoutDialog = ({ open, logout, setopen }) => {
  return (
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
  );
};

export default LogoutDialog;
