import React, { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import SideBarDrawer from '../../Drawer/SideBarDrawer'
import MobileViewHeader from '../../Header/MobileViewHeader/MobileViewHeader'
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles'
import Header from '../../Header/Header'
import firebase, { db } from '../../../utils/firebase'
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
    root: {
        overflow: "hidden",
        maxWidth: 1500,
        width: '100%',
        margin: '0px auto',
    },
    profileBorder: {
        boxShadow: theme.palette.colors.boxShadow,
        padding: 20,
    },
    imageList: {
        width: 500,
        height: 450,
        // Promote the list into its own layer in Chrome. This cost memory, but helps keep FPS high.
        transform: 'translateZ(0)',
    },
    titleBar: {
        background:
            'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' +
            'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    icon: {
        color: 'white',
    },
}))

export default function Photos() {

    const classes = useStyles();

    const theme = useTheme();

    const isMatch = useMediaQuery(theme.breakpoints.down('sm'));

    const [docs, setDocs] = useState([]);

    const [values, setValues] = useState({
        isLoading: false,
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
            setDocs(snapshot.docs.map(doc => ({
                id: doc.id,
                image: doc.data(),
            })));
        })
        return () => {
            setDocs([]);
        };
    }, []);

    return (
        <div className={classes.root}>
            <Header userProfile={values.user} />
            {isMatch ?
                <MobileViewHeader />
                : ""
            }
            <SideBarDrawer userProfile={values.user} profile={true}>
                <Typography variant="h5">Photos</Typography>


                {
                    docs.map(({ id, image }) => (
                        <Grid container key={id}>
                            {image.imageUrl === "" ? "" :
                                <Grid container justifyContent='center' className={classes.profileBorder} >
                                    <>
                                        <Grid container justifyContent="flex-start">
                                            <Typography variant="h5">
                                                {image.firstname}{image.lastname}
                                            </Typography>

                                        </Grid>
                                        <Grid container justifyContent="flex-start">
                                            <Typography variant="caption">
                                                {moment(image.timestamp.toDate().toISOString()).calendar()}
                                            </Typography>
                                        </Grid>
                                        <Grid container justifyContent="center">
                                            <img src={image.imageUrl} alt="" style={{ height: '100%', width: '100%' }} />
                                        </Grid>
                                    </>
                                </Grid>
                            }
                        </Grid>
                    ))
                }
            </SideBarDrawer>

        </div>
    )
}
