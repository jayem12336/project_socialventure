import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { InputAdornment } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import IconButton from '@material-ui/core/IconButton';
import { auth } from '../../../utils/firebase'
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        [theme.breakpoints.down('sm')]: {
            padding: 20,
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
    margin: {
        marginBottom: 15
    },
    textMargin: {
        marginTop: 30
    },
}))
export default function ChangePasswordModal({ setOpen }) {

    const classes = useStyles();

    const [values, setValues] = useState({
        password: "",
        showPassword: false,
        isLoading: false,
        confirmPassword: "",
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

    const changePassword = () => {
        if (values.password === "" || values.confirmPassword === "") {
            alert("Please fill up the following fields");
        }
        else if (values.password !== values.confirmPassword) {
            alert("Password does not match!")
        }
        else if (values.password.length < 6) {
            alert("Please enter a password minimum of 6 characters")
        }
        else {
            const user = auth.currentUser;
            user.updatePassword(values.password).then(() => {
                alert("Change Password Successfully");
                setOpen(false);
            }).catch((error) => { console.log(error); });
        }
    }

    if (values.isLoading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                // flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                justifyItems: 'center',
                height: '100vh',
                width: '100vw'
            }}>
                <CircularProgress color="secondary" size={200} />
            </div>
        );
    }


    return (
        <div className={classes.root}>
            <Grid className={classes.forgotContainer}>
                <Grid container justifyContent="center">
                    <Typography variant="h5"> Change Password</Typography>
                </Grid>
                <Grid container>
                    <TextField
                        label='Password'
                        placeholder='Password'
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
                                        {values.showPassword ? <Visibility color="primary" /> : <VisibilityOff color="primary" />}
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
                        placeholder='Confirm password'
                        name="confirmPassword"
                        variant="outlined"
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
                                        {values.showPassword ? <Visibility color="primary" /> : <VisibilityOff color="primary" />}
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
                <Grid container className={classes.btnContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={changePassword}
                    >Change Password</Button>
                </Grid>
            </Grid>
        </div>
    )
}
