import {TextField} from "@mui/material";
import {withStyles} from "@mui/styles";

const CustomTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: '#303030',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#b28c6e',
        },
        '& .MuiInput-autoComplete:after': {
            backgroundColor: '#202020',
        },
        '& .MuiInput-input:-webkit-autofill': {
            WebkitBoxShadow: "0 0 0 1000px #b28c6e inset",
            borderRadius: 3,
        },
    },
})(TextField);

export default CustomTextField;
