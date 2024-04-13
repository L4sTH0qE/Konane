import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "../custom.css";

const CustomDialog = ({ open, children, title, contentText, handleContinue }) => {
    return (
        <Dialog open={open}>
            <DialogTitle sx = {{backgroundColor: '#cda88b'}}>{title}</DialogTitle>
            <DialogContent sx = {{backgroundColor: '#cda88b'}}>
                <DialogContentText sx = {{color: '#191919'}}>
                    {contentText}
                </DialogContentText>
                {children}
            </DialogContent>
            <DialogActions sx = {{backgroundColor: '#cda88b'}}>
                <Button sx = {{color: '#202020', "&:hover": {color: '#191919'}}} onClick={handleContinue}>Continue</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CustomDialog;
