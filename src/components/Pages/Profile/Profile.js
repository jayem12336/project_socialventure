import React, { useState, useEffect } from 'react';
import firebase, { db, storage } from '../../../utils/firebase';

import { IconButton, makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar'
import CameraIcon from '@material-ui/icons/Camera';
import { DropzoneDialog } from 'material-ui-dropzone';
import Resizer from 'react-image-file-resizer';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles'

import Header from '../../Header/Header';
import MobileViewHeader from '../../Header/MobileViewHeader/MobileViewHeader';
import SideBarDrawer from '../../Drawer/SideBarDrawer';

import { v4 as uuidV4 } from "uuid";
import TextField from '@material-ui/core/TextField'
import { InputAdornment } from '@material-ui/core';
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Button from '@material-ui/core/Button'
import Post from '../Home/Post/Post';
import MonochromePhotosIcon from '@material-ui/icons/MonochromePhotos';

const useStyles = makeStyles((theme) => ({
    root: {
        overflow: "hidden",
        maxWidth: 1500,
        width: '100%',
        margin: '0px auto'
    },
    profileBorder: {
        boxShadow: theme.palette.colors.boxShadow,
        padding: 10
    },
    cameraStyle: {
        position: 'relative',
        top: 85,
        right: 40,
        height: 5
    },
    coverPhotoStyle: {
        height: 400,
        width: '95%',
        [theme.breakpoints.down('sm')]: {
            height: 200,
        },
    },
    postContainer: {
        boxShadow: theme.palette.colors.boxShadow,
        padding: 25,
        marginBottom: 50,
        marginTop: 20

    },
    btnStyle: {
        marginLeft: 20,
        '&:hover': {
            background: '#4877c2',
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: 100,
            marginTop: 10,
        },
    },
    icon: {
        fontSize: 40,
    },
    coverBtn: {
        marginRight: 50,
        [theme.breakpoints.down('sm')]: {
            marginRight: 20,
            fontSize: 5
        },
    },
    coverStyle: {
        height: 400,
        width: '100%',
        boxShadow: theme.palette.colors.boxShadow,
        [theme.breakpoints.down('sm')]: {
            height: 200,
        },
    },
    coverIconBtn: {
        background: "white",
    }
}))

export default function Profile() {

    const classes = useStyles();

    const theme = useTheme();

    const isMatch = useMediaQuery(theme.breakpoints.down('sm'));

    const [values, setValues] = useState({
        email: "",
        password: "",
        showPassword: false,
        isLoading: true,
        user: {},
        userUid: "",
        noLikes: 0,
        progress: '',
    });

    const [posts, setPosts] = useState([]);

    const [image, setImage] = useState('');

    const [caption, setCaption] = useState("");

    const [upload, setUpload] = useState({
        open: false
    })
    const [cover, setCover] = useState({
        open: false
    })


    const uploadFileWithClick = () => {
        document.getElementsByClassName('imageFile')[0].click()
    }

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

    useEffect(() => {
        db.collection('posts')
            .orderBy('timestamp', 'desc')
            .where("owner", "==", values.userUid)
            .onSnapshot(snapshot => {
                setPosts(snapshot.docs.map(doc => ({
                    id: doc.id,
                    post: doc.data(),
                })));
            })
        return () => {
            setPosts([]);
        };
    }, [values.userUid]);

    //#region //PostBtn

    const handleUpload = (event) => {
        event.preventDefault()
        const id = uuidV4();
        if (!caption && image === '') {
            alert("please fill up the following fields")
            setValues({ ...values, isLoading: false });
        }
        else if (image === '') {
            setValues({ ...values, isLoading: true });
            db.collection("posts").add({
                owner: values.userUid,
                photourl: values.user.photourl,
                timestamp: new Date(),
                caption: caption,
                imageUrl: image,
                noLikes: "",
                firstname: values.user.firstname,
                lastname: values.user.lastname,
                imageid: ""
            })
            setValues({ ...values, isLoading: false });
            setCaption("");

        } else {
            const uploadTask = storage.ref(`images/${id}`).put(image);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100

                    );
                    setValues({ ...values, progress: progress });
                },
                (error) => {
                    console.log(error);
                    alert(error.message);
                },
                () => {
                    setValues({ ...values, isLoading: true });
                    storage
                        .ref("images")
                        .child(id)
                        .getDownloadURL()
                        .then(url => {
                            db.collection("posts").add({
                                owner: values.userUid,
                                photourl: values.user.photourl,
                                timestamp: new Date(),
                                caption: caption,
                                imageUrl: url,
                                noLikes: "",
                                firstname: values.user.firstname,
                                lastname: values.user.lastname,
                                imageid: id
                            })
                            setValues({ ...values, progress: 0, isLoading: false })
                            setCaption("");
                            setImage('');
                        })
                }
            )
        }
    }

    //#endregion

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const handleOpenDropzone = () => {
        setUpload({ ...upload, open: true })
    }

    const handleCloseDropzone = () => {
        setUpload({ ...upload, open: false })
    }

    //#region //Upload Photo
    const uploadFileToFirebase = (files) => {
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
    const coverOpenDropzone = () => {
        setCover({ ...cover, open: true })
    }

    const coverCloseDropzone = () => {
        setCover({ ...cover, open: false })
    }
    //#region //Upload Photo
    const uploadCover = (files) => {
        setCover({
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

                    var uploadTask = firebase.storage().ref(`user_Cover/${values.userUid}`)
                        .put(uri);

                    uploadTask.on('state_changed',
                        (snapshot) => {
                            // Observe state change events such as progress, pause, and resume
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
                                    coverurl: downloadURL
                                },
                                    { merge: true }
                                );

                                setValues({
                                    ...values,
                                    user: { ...values.user, cover_url: downloadURL },
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
                    <Grid container className={classes.coverPhotoStyle} >
                        {values.user === "" ? "" :
                            <img src={values.user && values.user.coverurl} className={classes.coverStyle} alt="" />
                        }
                    </Grid>
                    <Grid container justifyContent="center" style={{ marginTop: -70 }}>
                        <Grid container justifyContent="flex-end" className={classes.coverBtn}>
                            {isMatch ?

                                <IconButton className={classes.coverIconBtn} onClick={coverOpenDropzone}>
                                    <MonochromePhotosIcon color="primary" />
                                </IconButton>
                                :
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={coverOpenDropzone}
                                >
                                    Select Cover Photo
                                </Button>

                            }

                            <DropzoneDialog
                                open={cover.open}
                                onSave={uploadCover}
                                acceptedFiles={["image/jpeg", "image/png", "image/bmp"]}
                                showPreviews={true}
                                maxFileSize={25000000}
                                filesLimit={1}
                                onClose={coverCloseDropzone}
                            />
                        </Grid>

                        <Grid container justifyContent="center" >
                            <Avatar src={values.user && values.user.photourl} style={{ width: 100, height: 100, marginLeft: 50, marginTop: 10 }} />
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
                        <Grid container justifyContent="center">
                            <Typography variant="h6">{values.user && values.user.firstname} {values.user && values.user.lastname}</Typography>
                        </Grid>
                        <Grid container justifyContent="center">
                            <Typography>{values.user && values.user.email}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container className={classes.postContainer} >
                    <Grid item sm={10}>
                        <Grid container justifyContent="flex-start">
                            <TextField
                                fullWidth
                                variant="outlined"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder={`What's on your mind ${values.user && values.user.firstname} ?`}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Avatar src={values.user && values.user.photourl} color="primary" />
                                        </InputAdornment>
                                    ),
                                    className: classes.textSize
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Grid item sm={2}>
                        <Grid container justifyContent="flex-end" >
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.btnStyle}
                                onClick={handleUpload}
                                fullWidth
                            >
                                Post it
                            </Button>
                        </Grid>

                    </Grid>
                    <Grid container>
                        <Grid
                            container
                            style={{ marginTop: 20, width: "3%", cursor: "pointer" }}
                            onClick={uploadFileWithClick}
                        >
                            <PhotoSizeSelectActualIcon color="primary" className={classes.icon} />
                            <input type="file" className="imageFile" onChange={handleChange} style={{ display: "none" }} />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid container spacing={2}>
                            <Grid item>
                                <CheckCircleIcon color="primary" />
                            </Grid>
                            <Grid item>
                                <MenuBookIcon color="primary" />
                            </Grid>
                            <Grid item>
                                <Typography>News Feed</Typography>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="center">
                            {image === "" ? "" :
                                <Typography variant="subtitle1" className={`imageText ${image && 'show'}`}>Image is added and will be displayed after clicking the Post button</Typography>
                            }
                        </Grid>
                    </Grid>
                </Grid>
                {
                    posts.map(({ id, post }) => (
                        <Post
                            key={id}
                            postId={id}
                            userName={post.firstname}
                            userId={values.user && values.user.userUid}
                            userProfile={values.user}
                            timestamp={post.timestamp}
                            caption={post.caption}
                            imageUrl={post.imageUrl}
                            noLikes={post.noLikes}
                            photourl={post.photourl}
                            imageid={post.imageid}
                        />
                    ))
                }
            </SideBarDrawer>
        </div>
    )
}
