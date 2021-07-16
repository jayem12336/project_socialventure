import React, { useState } from 'react'

import firebase from '../../../utils/firebase'

import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('sm')]: {
            padding: 20,
            marginTop: -90
        },
    },
    forgotContainer: {
        backgroundColor: "white",
        padding: 30,
        borderRadius: 25,
        width: "100%",
        [theme.breakpoints.down('sm')]: {
            width: "80%",
        },
    },
    btnContainer: {
        marginTop: 30,
        marginBottom: 30
    },
}))

export default function ForgotPassword() {

    const classes = useStyles();

    const [values, setValues] = useState({
        email: "",
        errors: "",
        isLoading: true,
    })

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value })
    }

    const forgotBtn = (e) => {
        e.preventDefault();
        if (values.email === "") {
            alert('Please Fill up the email')
        } else {
            firebase.auth().sendPasswordResetEmail(values.email)
                .then(() => {
                    // Password reset email sent!
                    // ..
                    alert('Please check your email...')
                    window.location.reload();
                })
                .catch((error) => {
                    var errorMessage = error.message;
                    alert(errorMessage);
                    // ..
                });
        }
    }

    return (
        <div className={classes.root}>
            <Grid className={classes.forgotContainer}>
                <Grid container justifyContent="center" style={{ marginBottom: 20, marginTop: 20 }}>
                    <Typography variant="h6">Forgot Password</Typography>
                </Grid>
                <Grid container justifyContent="center" style={{ marginBottom: 10, marginTop: 20 }}>
                    <Typography>Enter your email to recover your account</Typography>
                </Grid>
                <Grid container>
                    <TextField
                        onChange={handleChange("email")}
                        value={values.email}
                        variant="outlined"
                        label="Enter Email Address"
                        fullWidth
                    />
                </Grid>
                <Grid container className={classes.btnContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={forgotBtn}
                        fullWidth
                    >Recover</Button>
                </Grid>
            </Grid>
        </div>
    )
}
