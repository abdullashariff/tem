
import { createStyles } from '@material-ui/core';

const styles = (theme) => {
    createStyles({
        root: {
            padding: theme.spacing(2)
        },
        margin: {
            margin: theme.spacing.unit * 2,
        },
        padding: {
            padding: theme.spacing.unit
        },
        textField: {
            padding: '0px, 8px, 8px, 8px',
            width: '100%',
            margin: theme.spacing.unit
        },
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: theme.spacing(1),
        },
        submit: {
            margin: theme.spacing(3, 0, 2),
        },
        title: {
            color:theme.palette.primary.main,
            marginTop:theme.spacing(2)
        },
        heading: {
          fontSize: theme.typography.pxToRem(15),
          fontWeight: theme.typography.fontWeightRegular,
        },
        loginContainer: {
            margin: '16px',
            paddingTop: '32px'
        }
    });
}

export default styles;
