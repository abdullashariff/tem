import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
//import Draggable from 'react-draggable';
// function PaperComponent(props) {
//     return (
//         <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
//             <Paper {...props} />
//         </Draggable>
//     );
// }

const MyDialog = ({msg, showAlert, handleClose}) => {
    // const [open, setOpen] = React.useState(false);

    // const handleClose = () => {
    //     setOpen(false);
    // };

    return (
        <div>

            <Dialog
                open={showAlert}
                onClose={handleClose}
                // PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title">
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">{msg.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText> {msg.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose} color="primary"> ok</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MyDialog;