import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from "@material-ui/core/Grid"
import Avatar from '@material-ui/core/Avatar'
import Drawer from '@material-ui/core/Drawer'
import Typography from '@material-ui/core/Typography'

//icon
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PersonIcon from '@material-ui/icons/Person';

import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Swal from 'sweetalert2'
import firebase from '../../../utils/firebase'
import { alpha } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: alpha(theme.palette.background.paper),
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    gridContainer: {
        border: 50
    },
    iconButtonContainer: {
        height: 30,
        width: 30
    }
}));

export default function NestedListComponents({ userProfile }) {

    const classes = useStyles();

    const history = useHistory();

    const [openDrawer, setOpenDrawer] = useState(false);

    const logout = () => {
        setOpenDrawer(false);
        Swal.fire({
            title: 'Are you sure you want to Logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'Logout!',
                    'Successfully Logout.',
                    'success'

                ).then(() => {
                    firebase.auth().signOut().then(() => {
                        history.push('/login');
                    }).catch((error) => {
                        // An error happened.
                    });
                })
            }
        })
    }

    return (
        <>
            <Drawer
                anchor='left'
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    className={classes.root}
                >
                    <ListItem button>
                        <Grid container>
                            <Grid item>
                                <Grid container>
                                    <Avatar src={userProfile && userProfile.photourl} />
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container>
                                    <Typography variant="overline" style={{ marginLeft: 5 }}>{userProfile && userProfile.firstname} {userProfile && userProfile.lastname}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem button onClick={() => history.push('/home')}>
                        <ListItemIcon>
                            <LibraryBooksIcon />
                        </ListItemIcon>
                        <ListItemText primary="News Feed" />
                    </ListItem>
                    <ListItem button onClick={() => history.push('/photos')}>
                        <ListItemIcon>
                            <PhotoSizeSelectActualIcon />
                        </ListItemIcon>
                        <ListItemText primary="Photos" />
                    </ListItem>
                    <ListItem button onClick={() => history.push('/profile')}>
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                    </ListItem>
                    <ListItem button onClick={() => history.push('/userinfo')}>
                        <ListItemIcon>
                            <ListAltIcon />
                        </ListItemIcon>
                        <ListItemText primary="User Information" />
                    </ListItem>
                    <ListItem button onClick={logout}>
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Drawer>
            <IconButton onClick={() => setOpenDrawer(!openDrawer)} className={classes.iconButtonContainer}>
                <MenuIcon style={{ color: 'white' }} />
            </IconButton>


        </>
    );
}
