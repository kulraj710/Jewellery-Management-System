import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function ConfirmDelete({open, setOpen, idToDelete, setIdToDelete, getDataAgainExplicitly}) {
  
  const handleClose = () => {
    setOpen(false)
  }

  async function handleDelete(){
    try {
        const documentRef = doc(db, 'invoice', idToDelete)
        await deleteDoc(documentRef)
        await getDataAgainExplicitly()
      } 
      catch (error) {
        console.error('Error deleting document:', error)
        alert("Could not Delete! check your internet and refresh the page.")
      }
      finally{
        setIdToDelete(null)
        setOpen(false)
      }
  }

  return (
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action can not be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant='contained' onClick={handleDelete} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
  );
}