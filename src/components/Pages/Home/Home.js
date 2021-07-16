import React, { useState, useEffect } from 'react'
import firebase, { db, storage } from '../../../utils/firebase'
import Button from '@material-ui/core/Button'
import Header from '../../Header/Header'
import { makeStyles } from '@material-ui/core/styles'
import SideBarDrawer from '../../Drawer/SideBarDrawer'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import TextField from '@material-ui/core/TextField'
import Post from './Post/Post'
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import Typography from '@material-ui/core/Typography';
import { v4 as uuidV4 } from "uuid";
import CircularProgress from '@material-ui/core/CircularProgress'
import { InputAdornment } from '@material-ui/core';
import MobileViewHeader from '../../Header/MobileViewHeader/MobileViewHeader'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles'
import { alpha } from '@material-ui/core/styles'

import Swal from 'sweetalert2'

const useStyles = makeStyles((theme) => ({
    root: {
        overflow: "hidden",
        maxWidth: 1500,
        width: '100%',
        margin: '0px auto',
    },
    gridContainer: {
        boxShadow: theme.palette.colors.boxShadow,
        marginBottom: 50,

    },
    postContainer: {
        boxShadow: theme.palette.colors.boxShadow,
        padding: 25,
        marginBottom: 50,

    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: alpha(theme.palette.background.paper),
        border: '2pxZ solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(1, 1, 1),
    },
    icon: {
        fontSize: 40,
    },
    btnStyle: {
        marginLeft: 20,
        '&:hover': {
            background: '#4877c2',
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: 90,
            marginTop: 10,
        },
    }
}))
export default function Home({ userProfile }) {

    const classes = useStyles();

    const theme = useTheme();

    const isMatch = useMediaQuery(theme.breakpoints.down('sm'));

    const [posts, setPosts] = useState([]);

    const [image, setImage] = useState('');

    const [caption, setCaption] = useState("");

    const [values, setValues] = useState({
        isLoading: false,
        noLikes: 0,
        progress: '',
        user: {},
        useruid: ""
    });



    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                const db = firebase.firestore();
                db.collection("users")
                    .doc(user.uid)
                    .onSnapshot((doc) => {
                        setValues({ user: doc.data(), userUid: user.uid })
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
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data(),
            })));
        })
        return () => {
            setPosts([]);
        };
    }, []);

    const uploadFileWithClick = () => {
        document.getElementsByClassName('imageFile')[0].click()
    }

    //#region //PostBtn

    const handleUpload = (event) => {
        event.preventDefault()
        const id = uuidV4();
        if (!caption && image === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please Type Something!',
            })
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

    //#endregion

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
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
                <CircularProgress color="primary" size={200} />
            </div>
        );
    }

    return (
        <Grid className={classes.root}>

            <Header userProfile={values.user} />
            {isMatch ?
                <MobileViewHeader />
                : ""
            }
            <SideBarDrawer userProfile={values.user}>
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
                            userId={values.userUid}
                            userProfile={values.user}
                            timestamp={post.timestamp}
                            caption={post.caption}
                            imageUrl={post.imageUrl}
                            noLikes={post.noLikes}
                            photourl={post.photourl}
                            owner={post.owner}
                            imageid={post.imageid}
                        />
                    ))
                }

            </SideBarDrawer>
        </Grid>
    )
}
