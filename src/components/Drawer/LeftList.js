import React from 'react';
import { useHistory, Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from "@material-ui/core/Grid"
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography';

//icon
import PhotoSizeSelectActualIcon from '@material-ui/icons/PhotoSizeSelectActual';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PersonIcon from '@material-ui/icons/Person';
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
  userDetailsContainer: {
    boxShadow: theme.palette.colors.boxShadow,
    width: 300,
    paddingBottom: 10,
    borderRadius: 10
  },
  listStyle: {
    boxShadow: theme.palette.colors.boxShadow,
    width: 300,
    marginLeft: 10,
    borderBottom: 'none',
    borderRadius: 5
  },
  lastListStyle: {
    boxShadow: theme.palette.colors.boxShadow,
    width: 300,
    marginLeft: 10,
    borderRadius: 5
  },
  listtextStyle: {
    fontSize: '1rem'
  },
  iconStyle: {
    fontSize: 40,
    marginLeft: 10
  },
  textStyle: {
    fontSize: 20,
    marginLeft: 40
  },
  linkStyle: {
    textDecoration: 'none',
    color: 'black',
    '&:hover': {
      color: '#4877c2',
      textDecoration: 'underline'
    },
  }
}));

export default function NestedList({ userProfile }) {

  const classes = useStyles();

  const history = useHistory();

  return (

    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      <ListItem style={{ marginBottom: 30, marginTop: 20 }}>
        <Grid container spacing={2} className={classes.userDetailsContainer}>
          <Grid container justifyContent="center">
            <Avatar src={userProfile && userProfile.photourl} style={{ width: 50, height: 50, marginTop: 10 }} />
          </Grid>
          <Grid container justifyContent="center">
            <Link to="/profile" className={classes.linkStyle}>
              <Typography variant="h6" style={{ textAlign: 'center', marginTop: 10 }}>{userProfile && userProfile.firstname} {userProfile && userProfile.lastname}</Typography>
            </Link>
            <Grid container justifyContent="center">
              <Typography>{userProfile && userProfile.email}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </ListItem>
      <ListItem button className={classes.listStyle} onClick={() => history.push('/home')}>
        <ListItemIcon>
          <LibraryBooksIcon className={classes.iconStyle} />
        </ListItemIcon>
        <ListItemText primary="News Feed" classes={{ primary: classes.textStyle }} />
      </ListItem>
      <ListItem button className={classes.listStyle} onClick={() => history.push('/photos')}>
        <ListItemIcon>
          <PhotoSizeSelectActualIcon className={classes.iconStyle} />
        </ListItemIcon>
        <ListItemText primary="Photos" classes={{ primary: classes.textStyle }} />
      </ListItem>
      <ListItem button className={classes.listStyle} onClick={() => history.push('/userinfo')}>
        <ListItemIcon>
          <PersonIcon className={classes.iconStyle} />
        </ListItemIcon>
        <ListItemText primary="Profile" classes={{ primary: classes.textStyle }} />
      </ListItem>
    </List>

  );
}
