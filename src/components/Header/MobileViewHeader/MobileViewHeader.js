import React from 'react';
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles'
import PersonIcon from '@material-ui/icons/Person';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Swal from 'sweetalert2'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(1),
    },
    iconStyle: {
        fontSize: 30
    }
}));

export default function MobileViewHeader() {

    const classes = useStyles();

    const history = useHistory();

    const theme = useTheme();

    const isMatch = useMediaQuery(theme.breakpoints.down('sm'));

    const notificationButton = () => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'This is only a Design! ',
        })
    }

    const messageButton = () => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'This is only a Design! ',
        })
    }

    return (
        <div className={classes.root}>
            {isMatch ? (
                <AppBar position="fixed" style={{ marginTop: 73 }}>
                    <Toolbar variant="dense">
                        <Grid container justifyContent="space-between">
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit" aria-label="menu"
                                onClick={() => history.push('/home')}
                            >
                                <LibraryBooksIcon className={classes.iconStyle} />
                            </IconButton>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit" aria-label="menu"
                                onClick={() => history.push('/photos')}
                            >
                                <PhotoSizeSelectActualIcon className={classes.iconStyle} />
                            </IconButton>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit" aria-label="menu"
                                onClick={() => history.push('/profile')}
                            >
                                <PersonIcon className={classes.iconStyle} />
                            </IconButton>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit" aria-label="menu"
                                onClick={() => history.push('/userinfo')}
                            >
                                <ListAltIcon className={classes.iconStyle} />
                            </IconButton>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit" aria-label="menu"
                                onClick={messageButton}
                            >
                                <Badge badgeContent={4} color="secondary">
                                    <MailIcon />
                                </Badge>
                            </IconButton>
                            <IconButton
                                edge="start"
                                className={classes.menuButton}
                                color="inherit" aria-label="menu"
                                onClick={notificationButton}
                            >
                                <Badge badgeContent={11} color="secondary">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>
                        </Grid>
                    </Toolbar>
                </AppBar>
            ) : ""
            }
        </div>
    );
}
