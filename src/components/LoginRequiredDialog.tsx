import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {Button} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import {useNavigate} from "react-router-dom";

export default function LoginRequiredDialog() {
  const navigate = useNavigate();

  function handleRedirect() {
    navigate("/user/login");
  }

  return (
    <Dialog
      open={true}
      aria-labelledby="session-expired-dialog-title"
      aria-describedby="session-expired-dialog-description"
    >
      <DialogTitle id="session-expired-dialog-title">
        Logging in required
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="session-expired-dialog-description">
          You need to sign in to your account to get started
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleRedirect} autoFocus size="large">
          Sign in
        </Button>
      </DialogActions>
    </Dialog>
  );
}