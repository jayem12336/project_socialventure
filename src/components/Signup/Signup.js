import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import firebase, { db } from '../../utils/firebase'

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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Alert } from "@material-ui/lab"
import CircularProgress from '@material-ui/core/CircularProgress';
import Footer from './../Footer/Footer'

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

import bgImage from '../../assets/images/bgImage_2.png'
import Logo from '../../assets/images/socialventureLogo_1.png'

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
        height: '820px',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            height: '100%'
        },
    },
    formContainer: {
        backgroundColor: 'white',
        padding: 30,
        borderRadius: 25,
        boxShadow: theme.palette.colors.boxShadow,
    },
    containerPosition: {
        margin: '10px auto',
        [theme.breakpoints.down('sm')]: {
            margin: '50px auto'
        },
    },
    textMargin: {
        marginTop: 10
    },
    btnStyle: {
        marginTop: 15,
        borderRadius: 15,
        padding: 10,
        width: '80%'
    },
    googleBtn: {
        marginTop: 25,
        fontSize: 15,
        borderRadius: 15
    },
    errorMessage: {
        fontSize: 13,
        marginBottom: 5
    },
}))

export default function Login() {

    const history = useHistory();

    const classes = useStyles();

    const [values, setValues] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        showPassword: false,
        isLoading: false,
        errors: "",
        firstname: "",
        lastname: "",
        photo_url: "",
        gender: "male",
        birthday: "",
        cover_url: ""
    })

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value })
    }

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // The first commit of Material-UI
    const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const signup = (e) => {
        e.preventDefault();
        if (!values.email || !values.password || !values.confirmPassword || !values.firstname || !values.lastname) {
            setValues({ ...values, errors: "Please Complete all fields" })
        } else if (values.password !== values.confirmPassword) {
            setValues({ ...values, errors: "Password do not match!" })
        } else {
            setValues({ ...values, errors: "", isLoading: true })

            firebase.auth()
                .createUserWithEmailAndPassword(values.email, values.password)
                .then((userCredential) => {
                    var user = userCredential.user;
                    db.collection("users").doc(user.uid).set({
                        email: values.email,
                        firstname: values.firstname,
                        lastname: values.lastname,
                        photourl: values.photo_url,
                        gender: values.gender,
                        birthday: selectedDate,
                        userid: user.uid,
                        coverurl: values.cover_url,
                        signinwithgoole: "false",
                    })
                        .then(() => {
                        })
                        .catch((error) => {
                        });
                    setValues({ isLoading: false });
                    history.push('/home');
                })
                .catch((error) => {
                    //var errorCode = error.code;
                    var errorMessage = error.message;
                    // ..
                    setValues({ ...values, errors: errorMessage, isLoading: false })
                });
        }
    }


    if (values.isLoading) {
        return (
            <div className={classes.root}>
                <CircularProgress color="primary" size={200} />
            </div>
        );
    }

    return (
        <>
            <Grid className={classes.bgStyle}>
                <Grid container justifyContent="center" className={classes.containerPosition}>
                    <Grid style={{ width: '80%' }}>
                        <Grid container justifyContent="flex-start">
                            <Grid className={classes.formContainer}>
                                <Grid align='center' style={{ marginBottom: 10, marginTop: -10 }}>
                                    <img src={Logo} alt="Logo" style={{ width: 70, height: 60 }} />
                                    <Typography variant="h5">Sign Up</Typography>
                                    <Typography variant="subtitle1">It's quick and easy.</Typography>
                                </Grid>
                                {values.errors && (
                                    <Alert className={classes.errorMessage} severity="error">
                                        {values.errors}
                                    </Alert>)}
                                <form>
                                    <Grid container justifyContent="center" spacing={3}>
                                        <Grid item xs={6}>
                                            <TextField
                                                name="firstname"
                                                type="name"
                                                label="First name"
                                                placeholder="First name"
                                                variant="outlined"
                                                size="small"
                                                onChange={handleChange("firstname")}
                                                value={values.firstname}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                name="lastname"
                                                type="name"
                                                label="Last name"
                                                placeholder="Last name"
                                                variant="outlined"
                                                size="small"
                                                onChange={handleChange("lastname")}
                                                value={values.lastname}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <TextField
                                            name="username"
                                            type="name"
                                            label="EMAIL"
                                            placeholder="Email"
                                            variant="outlined"
                                            size="small"
                                            onChange={handleChange("email")}
                                            value={values.email}
                                            className={classes.textMargin}
                                            autoFocus={true}
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
                                            size="small"
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
                                    <Grid container>
                                        <TextField
                                            label='Confirm Password'
                                            placeholder='Confirm Password'
                                            name="confirmPassword"
                                            variant="outlined"
                                            size="small"
                                            onChange={handleChange("confirmPassword")}
                                            value={values.confirmPassword}
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
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <Grid container justifyContent="space-around">
                                            <KeyboardDatePicker
                                                margin="normal"
                                                id="date-picker-dialog"
                                                label="Birthday"
                                                format="MMM/dd/yyyy"
                                                variant="dialog"
                                                inputVariant="outlined"
                                                size="small"
                                                fullWidth
                                                value={selectedDate}
                                                onChange={handleDateChange}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                }}
                                            />
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend">Gender</FormLabel>
                                        <RadioGroup aria-label="gender" name="gender1" value={values.gender} onChange={handleChange('gender')}>
                                            <Grid container justifyContent="center" spacing={3}>
                                                <Grid item xs={6}>
                                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                                </Grid>
                                            </Grid>
                                        </RadioGroup>
                                    </FormControl>
                                    <Grid container>
                                        <Typography variant="caption">
                                            By clicking Sign Up, you agree to our Terms, Data Policy and Cookies Policy.
                                        </Typography>
                                    </Grid>
                                    <Grid container>
                                        <Typography variant="caption">
                                            You may recieve SMS Notifications from us and can opt out any time.
                                        </Typography>
                                    </Grid>
                                    <Grid container justifyContent="center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className={classes.btnStyle}
                                            fullWidth
                                            size="small"
                                            onClick={signup}
                                        >Signup</Button>
                                    </Grid>
                                    <Grid container justifyContent="center">
                                        <Button
                                            variant="contained"
                                            color="inherit"
                                            className={classes.btnStyle}
                                            fullWidth
                                            size="small"
                                            onClick={() => history.push('/login')}
                                        >Back to Login</Button>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Footer />
        </>
    )
}
