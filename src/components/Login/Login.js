import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import firebase, { db, provider } from '../../utils/firebase'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import { InputAdornment } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import { FcGoogle } from 'react-icons/fc';
import { Alert } from "@material-ui/lab";
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ForgotPassword from './ForgotPassword/ForgotPassword';

import bgImage from '../../assets/bgImage_2.png'

//#region //styles

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        // flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        height: "100vh",
        backgroundColor: 'white'
    },
    bgStyle: {
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        // margin: 'auto',
        height: '100vh',
        display: 'flex',
        "@media (max-width: 600px)": {
            height: '100%'
        },
    },
    gridContainer: {
        width: '75%',
        "@media (max-width: 600px)": {
            width: '95%',
        },
    },
    formContainer: {
        backgroundColor: 'white',
        padding: 40,
        borderRadius: 25,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        width: 400,

    },
    textMargin: {
        marginTop: 20
    },
    btnStyle: {
        marginTop: 20,
        borderRadius: 15,
        padding: 10,
        "@media (max-width: 600px)": {
            fontSize: 10
        },
    },
    googleBtn: {
        marginTop: 25,
        fontSize: 15,
        borderRadius: 15,
        "@media (max-width: 600px)": {
            fontSize: 12
        },
    },
    errorMessage: {
        fontSize: 15,
        marginTop: 10
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 200,
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    forgotStyle: {
        cursor: 'pointer',
        color: 'blue',
        '&:hover': {
            color: '#4877c2',
        },
    }
}))

//#endregion

export default function Login() {

    const history = useHistory();

    const classes = useStyles();

    const [values, setValues] = useState({
        email: "",
        password: "",
        showPassword: false,
        errors: "",
        isLoading: false,
    })

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value })
    }

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const login = (e) => {

        e.preventDefault();

        setValues({ ...values, isLoading: true });

        if (!values.email || !values.password) {
            setValues({ ...values, errors: "Please Complete all fields", isLoading: false, password: "" })
        }
        else {
            firebase.auth().signInWithEmailAndPassword(values.email, values.password)
                .then((userCredential) => {
                    // Signed  
                    //var user = userCredential.user;
                    // ...
                    setValues({ ...values, errors: "", isLoading: false })
                    history.push('/home')
                })
                .catch((error) => {
                    //var errorCode = error.code;
                    var errorMessage = error.message;
                    setValues({ ...values, errors: errorMessage, isLoading: false, password: "" })
                });
        };
    }

    const loginwithGoogle = (e) => {

        e.preventDefault();
        
        const auth = firebase.auth();

        auth.signInWithPopup(provider)
            .then((userCredentials) => {

                const firstName = userCredentials.additionalUserInfo.profile.given_name;
                const lastName = userCredentials.additionalUserInfo.profile.family_name;

                firebase.auth().onAuthStateChanged(function (user) {
                    db.collection("users").doc(user.uid).set({
                        email: user.email,
                        firstname: firstName,
                        lastname: lastName,
                        photourl: user.photoURL,
                        userid: user.uid,
                        gender:"",
                        birthday:""
                    }).then(() => {
                        console.log("document successfully Written")
                    })
                    setValues({ isLoading: false });
                    history.push('/home');
                });
            });    
    }

    if (values.isLoading) {
        return (
            <div className={classes.root}>
                <CircularProgress color="primary" size={200} />
            </div>
        );
    }

    return (
        <Grid className={classes.bgStyle}>
            <Grid container justify="center" style={{ margin: '100px auto' }}>
                <Grid className={classes.gridContainer}>
                    <Grid container justify="flex-start">
                        <Grid className={classes.formContainer}>
                            <Grid align='center'>
                                <h2>Sign In</h2>
                            </Grid>
                            {values.errors && (
                                <Alert className={classes.errorMessage} severity="error">
                                    {values.errors}
                                </Alert>)}
                            <form>
                                <Grid container>
                                    <TextField
                                        name="username"
                                        type="name"
                                        label="EMAIL"
                                        placeholder="Email"
                                        variant="outlined"
                                        className={classes.textMargin}
                                        autoFocus={true}
                                        onChange={handleChange("email")}
                                        value={values.email}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <MailOutlineIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                            className: classes.textSize
                                        }}
                                        InputLabelProps={{
                                            className: classes.labelStyle
                                        }}
                                    />
                                </Grid>
                                <Grid container>
                                    <TextField
                                        label='Password'
                                        placeholder='Enter password'
                                        name="password"
                                        variant="outlined"
                                        onChange={handleChange("password")}
                                        value={values.password}
                                        type={values.showPassword ? 'text' : 'password'}
                                        className={classes.textMargin}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon color="primary" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                    >
                                                        {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                            className: classes.textSize
                                        }}
                                        InputLabelProps={{
                                            className: classes.labelStyle
                                        }}
                                    />
                                </Grid>
                                <Grid container justify="flex-end" style={{ marginTop: 10 }} onClick={handleOpen} >
                                    <Typography className={classes.forgotStyle}>Forgot Password?</Typography>
                                </Grid>
                                <Grid container justify="center" spacing={3}>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.btnStyle}
                                            fullWidth
                                            onClick={login}
                                        >Login Now</Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.btnStyle}
                                            fullWidth
                                            onClick={() => history.push('/signup')}
                                        >Sign up</Button>
                                    </Grid>
                                </Grid>
                                <Button
                                    variant="contained"
                                    size="large"
                                    className={classes.googleBtn}
                                    startIcon={<FcGoogle />}
                                    fullWidth
                                    onClick={loginwithGoogle}
                                >
                                    Sign up with google
                                </Button>
                            </form>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Modal
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <ForgotPassword />
                </Fade>
            </Modal>
        </Grid>
    )
}
