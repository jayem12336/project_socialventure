import React, { useState, useEffect } from 'react'
import firebase from '../../../utils/firebase';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Header from '../../Header/Header'
import SideBarDrawer from '../../Drawer/SideBarDrawer'
import MobileViewHeader from '../../Header/MobileViewHeader/MobileViewHeader'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Avatar from '@material-ui/core/Avatar'
import { DropzoneDialog } from 'material-ui-dropzone';
import CameraIcon from '@material-ui/icons/Camera';
import Resizer from 'react-image-file-resizer';
import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ProfileModal from './EditProfileModal';
import moment from 'moment';


const useStyles = makeStyles((theme) => ({
    root: {
        overflow: "hidden",
        maxWidth: 1500,
        width: '100%',
        margin: '0px auto',
    },
    profileBorder: {
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        padding: 10,
    },
    listStyle: {
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        borderRadius: 5,
        maxWidth: 460,
        marginTop: 20,
        padding: 20,
    },
    cameraStyle: {
        position: 'relative',
        top: 85,
        right: 40,
        height: 5,
        "@media (max-width: 600px)": {
            top: 65,
            right: 30,
            height: 5,
        }

    },
    emailtextStyle: {
        "@media (max-width: 600px)": {
            fontSize: 15
        }
    },
    avatarStyle: {
        width: 100,
        height: 100,
        marginTop: 10,
        "@media (max-width: 600px)": {
            width: 50,
            height: 50,
            marginTop: 35,
            marginLeft: 50
        }
    },
    textStyle: {
        "@media (max-width: 600px)": {
            fontSize: 15
        }
    },
    btnStyle: {
        width: 220,
        fontSize: 15,
        padding: 10,
        marginBottom: 10,
        '&:hover': {
            background: '#4877c2',
        },
        "@media (max-width: 600px)": {
            width: 120,
            fontSize: 12,
        },
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },

}))

export default function UserInfo({ userProfile }) {

    const classes = useStyles();

    const theme = useTheme();

    const isMatch = useMediaQuery(theme.breakpoints.down('sm'));

    const [values, setValues] = useState({
        user: {},
        userUid: "",
        isLoading: true,
    });

    const [upload, setUpload] = useState({
        open: false
    })

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                const db = firebase.firestore();

                db.collection("users")
                    .doc(user.uid)
                    .onSnapshot((doc) => {
                        setValues({ user: doc.data(), isLoading: false, userUid: user.uid })
                    });
            } else {
                // No user is signed in.
            }
        });
        return () => {
            setValues({}); // This worked for me
        };
    }, [])

    const handleOpenDropzone = () => {
        setUpload({ ...upload, open: true })
    }

    const handleCloseDropzone = () => {
        setUpload({ ...upload, open: false })
    }

    //#region //Upload Photo
    const uploadFileToFirebase = (files) => {
        console.log("upload")
        setUpload({
            open: false,
        })


        try {
            Resizer.imageFileResizer(
                files[0],
                300, //maxWidth
                300, //maxHeight
                "JPEG", //compress type format [JPEG, PNG, WEBP]
                100, //compress quality
                0, //rotation
                (uri) => {

                    //response uri

                    var uploadTask = firebase.storage().ref(`user_profile/${values.userUid}`)
                        .put(uri);

                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Observe state change events such as progress, pause, and resume
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                        },
                        (error) => {
                            // Handle unsuccessful uploads
                        },
                        () => {
                            // Handle successful uploads on complete
                            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {

                                const db = firebase.firestore();
                                db.collection("users").doc(values.userUid).set({
                                    photourl: downloadURL
                                },
                                    { merge: true }
                                );

                                setValues({
                                    ...values,
                                    user: { ...values.user, photo_url: downloadURL },
                                    error: "",
                                });

                            });
                        }
                    );
                },
                "file", //ouput type [base64, file, blob]
                200, //minWidth
                200 //minHeight
            );
        } catch (err) {
            console.log(err);
        }
    }

    //#endregion


    return (
        <div className={classes.root}>
            <Header userProfile={values.user} />
            {isMatch ?
                <MobileViewHeader />
                : ""
            }
            <SideBarDrawer userProfile={values.user} profile={true}>
                <Grid container justifyContent='center' className={classes.profileBorder}>
                    <Grid container justifyContent="center">
                        <Grid container justifyContent="center" >
                            <Avatar src={values.user && values.user.photourl} className={classes.avatarStyle} />
                            <IconButton className={classes.cameraStyle} onClick={handleOpenDropzone}>
                                <CameraIcon />
                            </IconButton>
                            <DropzoneDialog
                                open={upload.open}
                                onSave={uploadFileToFirebase}
                                acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                                showPreviews={true}
                                maxFileSize={25000000}
                                filesLimit={1}
                                onClose={handleCloseDropzone}
                            />
                        </Grid>
                        <Grid container justifyContent="center" style={{ marginTop: 30 }}>
                            <Typography variant="h4" className={classes.emailtextStyle}>{values.user && values.user.firstname} {values.user && values.user.lastname}</Typography>
                        </Grid>
                        <Grid container justifyContent="center">
                            <Typography variant="h5" className={classes.emailtextStyle}>{values.user && values.user.email}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid container className={classes.listStyle}>
                            <Typography variant="h5" className={classes.textStyle}>Name: {values.user && values.user.firstname} {values.user && values.user.lastname}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid container className={classes.listStyle}>
                            <Typography variant="h5" className={classes.textStyle}>Email: {values.user && values.user.email}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid container className={classes.listStyle}>
                            <Typography variant="h5" className={classes.textStyle}>Gender: {values.user && values.user.gender}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid container className={classes.listStyle}>
                            {values.user && values.user.birthday === "" ? <Typography variant="h5" className={classes.textStyle} >Birthday: Hello World</Typography> :
                                <Typography variant="h5" className={classes.textStyle}>Birthday: {moment(values.user && values.user.birthday && values.user.birthday.toDate().toISOString()).format('LL')} </Typography>
                            }
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center" style={{ marginTop: 20 }} spacing={2}>
                        <Grid container justifyContent="center">
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.btnStyle}
                                onClick={handleOpen}
                            >
                                Edit Profile
                            </Button>
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
                            <ProfileModal
                                userInfo={values.user}
                                userId={values.userUid}
                                setOpen={setOpen}
                            />
                        </Fade>
                    </Modal>
                </Grid>
            </SideBarDrawer>
        </div>
    )
}
