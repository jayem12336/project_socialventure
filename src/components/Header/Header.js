import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Grid from '@material-ui/core/Grid';
import Logo from '../../assets/images/SV1.png';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles'
import NestedListComponents from '../Drawer/MobileViewDrawer/LeftNestedList';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2'
import firebase from '../../utils/firebase'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { alpha } from '@material-ui/core/styles'

//#region //Styles
const useStyles = makeStyles((theme) => ({
    root: {
        overflow: "hidden",
        maxWidth: 1500,
        width: '100%',
        margin: '0px auto'
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        [theme.breakpoints.up('sm')]: {
            marginRight: theme.spacing(2),
        },
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
            width: "15%"
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: '50%',
            height: 45
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        paddingTop: 5
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    iconStyle: {
        fontSize: 35,
        color: "white",
        marginRight: 5
    },
    iconBtn: {
        marginLeft: 10
    },
}));

//#endregion

export default function Header({ userProfile }) {

    const history = useHistory();

    const theme = useTheme();

    const isMatch = useMediaQuery(theme.breakpoints.down('xs'));

    const classes = useStyles();

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

    const logout = () => {
        Swal.fire({
            title: 'Are you sure you want to Logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
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

    const menuId = 'primary-search-account-menu';


    return (
        <div className={classes.grow}>

            <AppBar position="fixed" style={{ borderBottom: 'none' }}>
                <Grid className={classes.root}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                            // style={{marginLeft: isMatch ? 20 : 0}}
                            onClick={() => history.push('/home')}
                        >
                            <img style={{ width: 50, height: 50 }} src={Logo} alt="Logo" />
                        </IconButton>
                        <Typography className={classes.title} variant="h6" noWrap>
                            Social Venture
                        </Typography>
                        <Grid container justifyContent="center" style={{ width: '80%' }}>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                        </Grid>
                        <div className={classes.grow} />
                        <div className={classes.sectionDesktop}>
                            <IconButton
                                edge="start"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                color="inherit"
                                onClick={() => history.push('/profile')}
                                className={classes.iconBtn}
                            >
                                <Avatar src={userProfile && userProfile.photourl} className={classes.iconStyle} />
                                {userProfile && userProfile.firstname}
                            </IconButton>
                            <IconButton
                                aria-label="show 4 new mails"
                                color="inherit"
                                className={classes.iconBtn}
                                onClick={notificationButton}
                            >
                                <Badge badgeContent={4} color="secondary">
                                    <MailIcon className={classes.iconStyle} />
                                </Badge>
                            </IconButton>
                            <IconButton
                                aria-label="show 17 new notifications"
                                color="inherit"
                                className={classes.iconBtn}
                                onClick={messageButton}
                            >
                                <Badge badgeContent={17} color="secondary">
                                    <NotificationsIcon className={classes.iconStyle} />
                                </Badge>
                            </IconButton>
                            <IconButton
                                aria-label="show 17 new notifications"
                                color="inherit"
                                className={classes.iconBtn}
                                onClick={logout}
                            >
                                <ExitToAppIcon className={classes.iconStyle} />
                            </IconButton>
                        </div>
                        {isMatch ? <NestedListComponents userProfile={userProfile} /> : ""}
                    </Toolbar>
                </Grid>
            </AppBar>
        </div>
    );
}
