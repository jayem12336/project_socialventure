import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

import { db, auth } from '../../../utils/firebase'

import { CircularProgress } from '@material-ui/core'

import Logo from '../../../assets/images/SV1.png'

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
    }
}))

export default function ProfileModal({ userInfo, userId, setOpen }) {

    const classes = useStyles();

    const [values, setValues] = useState({
        firstname: "",
        lastname: "",
        email: "",
        gender: "",
        birthday: "",
        errors: "",
        isLoading: false,
    })

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value })
    }

    // The first commit of Material-UI
    const [selectedDate, setSelectedDate] = useState(userInfo.birthday.toDate().toISOString());

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const editProfile = (e) => {
        e.preventDefault();
        if (values.firstname !== "") {
            setValues({ ...values, isLoading: true });
            db.collection("users").doc(userId).update({
                firstname: values.firstname
            })
        }
        if (values.lastname !== "") {
            setValues({ ...values, isLoading: true });
            db.collection("users").doc(userId).update({
                lastname: values.lastname
            })
        }
        if (values.gender !== "") {
            setValues({ ...values, isLoading: true });
            db.collection("users").doc(userId).update({
                gender: values.gender
            })
        }
        if (values.email !== "") {
            setValues({ ...values, isLoading: true });
            const user = auth.currentUser;
            user.updateEmail(values.email).then(() => {
                db.collection("users").doc(userId).update({
                    email: values.email
                })
            }).catch((error) => { console.log(error); });
        }
        if (selectedDate !== userInfo.birthday.toDate().toISOString()) {
            setValues({ ...values, isLoading: true });
            db.collection("users").doc(userId).update({
                birthday: selectedDate
            })
        }
        setValues({ ...values, isLoading: false });
        setOpen(false);
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
                <Grid container justifyContent="center" style={{ marginBottom: 20, marginTop: 20 }}>
                    <img src={Logo} alt="Logo" style={{ width: 70, height: 60 }} />
                </Grid>
                <Grid container justifyContent="center" style={{ marginBottom: 20, marginTop: 20 }}>
                    <Typography variant="h5">Edit Profile</Typography>
                </Grid>
                <Grid container className={classes.margin}>
                    <TextField
                        variant="outlined"
                        label="Enter New First Name"
                        onChange={handleChange("firstname")}
                        value={values.firstname}
                        fullWidth
                    />
                </Grid>
                <Grid container className={classes.margin}>
                    <TextField
                        variant="outlined"
                        label="Enter New Last Name"
                        onChange={handleChange("lastname")}
                        value={values.lastname}
                        fullWidth
                    />
                </Grid>
                {userInfo && userInfo.signinwithgoogle === false ? "" :
                    <Grid container className={classes.margin}>
                        <TextField
                            variant="outlined"
                            label="Enter New Email Address"
                            onChange={handleChange("email")}
                            value={values.email}
                            fullWidth
                        />
                    </Grid>
                }
                <Grid container justifyContent="center">
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
                </Grid>
                <Grid container className={classes.margin}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Grid container justifyContent="center">
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
                </Grid>
                <Grid container className={classes.btnContainer}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={editProfile}
                    >Edit</Button>
                </Grid>
            </Grid>
        </div>
    )
}
