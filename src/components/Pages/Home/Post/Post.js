import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Avatar from '@material-ui/core/Avatar'
import { IconButton, makeStyles } from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button'
import { useTheme } from '@material-ui/core/styles'
import { db, storage } from '../../../../utils/firebase'
import moment from 'moment'
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ChatIcon from '@material-ui/icons/Chat';
import TextField from '@material-ui/core/TextField'
import Divider from '@material-ui/core/Divider';
import { InputAdornment } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Swal from 'sweetalert2'

const useStyles = makeStyles((theme) => ({
    postContainer: {
        padding: 40,
        marginTop: 40,
        boxShadow: theme.palette.colors.boxShadow,
    },
    btnStyle: {
        width: 150,
        '&:hover': {
            background: '#4877c2',
        },
        [theme.breakpoints.down('sm')]: {
            width: 120,
        },
    },
    comment_show: {
        display: "flex",
        flexDirection: "row",
    },
    container_comments: {
        boxShadow: theme.palette.colors.boxShadow,
        padding: 10,
        width: "100%",
        borderRadius: 10,
        [theme.breakpoints.down('sm')]: {
            padding: 10,
            borderRadius: 10,
            width: "100%",
        },
    },
    like: {
        marginTop: 10,
        display: "flex",
        [theme.breakpoints.down('sm')]: {
            paddingLeft: 0
        },
    },
    commentContainer: {
        width: "100%",
        [theme.breakpoints.down('sm')]: {
            width: "100%",
        },
    },
    commentNameStyle: {
        color: "blue",
        paddingTop: 10,
        [theme.breakpoints.down('sm')]: {
            paddingTop: 5,
        },
    },
    commentTextStyle: {
        paddingTop: 10,
        [theme.breakpoints.down('sm')]: {
            paddingTop: 5,
        },
    },
    commentAvatar: {
        [theme.breakpoints.down('sm')]: {
            width: 30,
            height: 30
        },
    },
    deleteContainer: {
        marginTop: -70,
        [theme.breakpoints.down('sm')]: {
            marginTop: -60,
            marginLeft: '0px auto'
        },
    },
    commentStyle: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: 50
        },
    }
}))

export default function Post({
    postId,
    userName,
    userId,
    caption,
    imageUrl,
    noLikes,
    timestamp,
    userProfile,
    photourl,
    owner,
    imageid
}) {

    const classes = useStyles();

    const theme = useTheme();

    const isMatch = useMediaQuery(theme.breakpoints.down('md'));

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [show, setShow] = useState('like2');
    const [show2, setShow2] = useState('textforlike');
    const [open, setOpen] = useState(false);
    const [totalDoclNumbers, setTotalDoclNumbers] = useState(0);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        let unsubscribe;

        if (postId) {
            unsubscribe = db.collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map(doc => ({
                        id: doc.id,
                        comment: doc.data(),
                    })))
                    setTotalDoclNumbers(snapshot.docs.length);
                })
        }

        return () => {
            unsubscribe();
        }
    }, [postId])

    useEffect(() => {
        db.collection("posts")
            .doc(postId)
            .collection("likes")
            .doc(userId)
            .get()
            .then(doc2 => {
                if (doc2.data()) {
                    if (show === 'like2') {
                        setShow('like2 blue');
                        setShow2('textforlike bluetextforlike')
                    } else {
                        setShow('like2');
                        setShow2('textforlike')
                    }
                }
            })
    }, [postId, userId, show]);


    const likeHandle = (event) => {

        event.preventDefault();
        if (show === 'like2') {
            setShow('like2 blue');
            setShow2('textforlike bluetextforlike')
        } else {
            setShow('like2');
            setShow2('textforlike')
        }

        db.collection('posts')
            .doc(postId)
            .get()
            .then(docc => {
                const data = docc.data()
                console.log(show)
                if (show === 'like2') {
                    db.collection("posts")
                        .doc(postId)
                        .collection("likes")
                        .doc(userId)
                        .get()
                        .then(doc2 => {
                            if (doc2.data()) {
                                console.log(doc2.data())
                            } else {
                                db.collection("posts").doc(postId).collection("likes").doc(userId).set({
                                    likes: 1
                                });
                                db.collection('posts').doc(postId).update({
                                    noLikes: data.noLikes + 1
                                });
                            }
                        })

                } else {
                    db.collection('posts').doc(postId).collection('likes').doc(userId).delete().then(function () {
                        db.collection('posts').doc(postId).update({
                            noLikes: data.noLikes - 1
                        });
                    })
                }
            })
    }

    const postComment = (e) => {
        e.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            userName: userProfile.firstname,
            timestamp: new Date(),
            photourl: userProfile.photourl
        })
        setOpen(true);
        setComment("")
    }

    const handleOpen = () => {
        setOpen(!open);
    }

    const deletePost = () => {
        setAnchorEl(null)
        if (owner === userId) {

            if (imageUrl !== "") {
                // Create a reference to the file to delete
                const desertRef = storage.ref(`images/${imageid}`);

                // Delete the file
                desertRef.delete().then(() => {
                    // File deleted successfully
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                });
            }
            db.collection('posts').doc(postId).delete();
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'You can only delete your own post!',
            })
        }
    }

    return (
        <Grid>
            <Grid container className={classes.postContainer}>
                <Grid item sm={11}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Avatar src={photourl} />
                        </Grid>
                        <Grid item>
                            <Typography variant="subtitle1">{userName}</Typography>
                            <Grid container justifyContent="flex-start">
                                <Typography variant="caption">{moment(timestamp.toDate().toISOString()).fromNow()}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container className={classes.deleteContainer}>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <IconButton onClick={handleClick}>
                                <MoreHorizIcon />
                            </IconButton>
                            <Menu
                                id="simple-menu"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                style={{ marginTop: 40 }}
                            >
                                <MenuItem onClick={deletePost}>Delete</MenuItem>
                            </Menu>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justifyContent="flex-start" style={{ margin: 20 }}>
                    {caption}
                </Grid >
                {
                    imageUrl === "" ? "" :
                        <Grid container justifyContent="center" >
                            <img src={imageUrl} alt="" style={{ width: isMatch ? "100%" : "100%", height: "100%" }} />
                        </Grid>
                }
                <Grid container spacing={1} className={classes.like}>
                    <Grid item >
                        <Grid container>
                            <Grid item>
                                <ThumbUpAltIcon style={{ color: "blue", fontSize: 30 }} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={1}>
                        <Grid container>
                            <Grid item>
                                <Typography variant="h5">{noLikes}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={10}>
                        <Grid container justifyContent="flex-end" className={classes.commentStyle}>
                            <Grid item>
                                <Button onClick={handleOpen}>{totalDoclNumbers} Comment</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid container justifyContent="center" spacing={3} style={{ marginTop: 10 }}>
                    <Divider variant="middle" color="primary" style={{ width: "100%", background: 'pink' }} />
                    <Grid item onClick={likeHandle}>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.btnStyle}
                        >
                            <ThumbUpAltIcon className={show} />
                            <Typography className={show2}>Like</Typography>
                        </Button>

                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="inherit"
                            className={classes.btnStyle}
                            onClick={handleOpen}
                        >
                            <ChatIcon />
                            <Typography>Comment</Typography>
                        </Button>
                    </Grid>
                    <Divider variant="middle" style={{ width: "100%", background: 'pink' }} />
                </Grid>
                <form onSubmit={postComment} className={classes.commentContainer}>
                    <Grid container style={{ paddingTop: 30 }}>
                        <Grid container >
                            <TextField
                                placeholder={`What's on your mind ${userProfile && userProfile.firstname} ?`}
                                variant="outlined"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Avatar src={userProfile && userProfile.photourl} color="primary" className={classes.commentAvatar} />
                                        </InputAdornment>
                                    ),
                                    className: classes.textSize
                                }}
                            />
                            <input type="submit" disabled={!comment} style={{ display: "none" }} />
                        </Grid>
                    </Grid>
                </form>


                {open ? <Grid container>
                    {
                        comments.map(({ id, comment }) => (
                            <Grid container justifyContent="flex-start" style={{ marginTop: 10 }} key={id}>
                                <Grid container className={classes.container_comments}>
                                    <Grid container spacing={1}>
                                        <Grid item>
                                            <Avatar src={comment.photourl} className={classes.commentAvatar} />
                                        </Grid>
                                        <Grid item>
                                            <Typography className={classes.commentNameStyle}>{comment.userName}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography className={classes.commentTextStyle}>{comment.text}</Typography>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Grid>
                        ))
                    }
                </Grid> : ""

                }
            </Grid>
        </Grid>
    )
}
