import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';

//icon
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton } from '@material-ui/core';
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
    width: 350,
    paddingBottom: 10,
    borderRadius: 10
  },
  listStyle: {
    boxShadow: theme.palette.colors.boxShadow,
    width: 340,
    marginLeft: 10,
    borderRadius: 5,
    marginBottom: 5
  },
  iconStyle: {
    fontSize: 40,
    marginLeft: 10
  },
  textStyle: {
    fontSize: 20,
    marginLeft: 40
  },
  btnStyle: {
    '&:hover': {
      background: '#4877c2',
    },
    width: 100,
  }
}));

export default function RightNestedList() {

  const classes = useStyles();

  return (

    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      className={classes.root}
    >
      <ListItem style={{ marginBottom: 30, marginTop: 20 }}>
        <Grid container spacing={2} className={classes.userDetailsContainer}>
          <Grid item>
            <Avatar style={{ width: 50, height: 50, marginTop: 10 }} />
          </Grid>
          <Grid item>
            <Typography variant="h6" style={{ marginTop: 10, fontWeight: "bold" }}>Jomari Aquino</Typography>
            <Typography variant="subtitle1">Wants to add you to friends</Typography>
          </Grid>
          <Grid container justifyContent="center" spacing={3}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={classes.btnStyle}
              >
                Accept
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="inherit"
                className={classes.btnStyle}
              >
                Decline
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </ListItem>
      <ListItem style={{ marginBottom: 30, marginTop: 20 }}>
        <Grid container spacing={2} className={classes.userDetailsContainer}>
          <Grid item>
            <Avatar style={{ width: 50, height: 50, marginTop: 10 }} />
          </Grid>
          <Grid item>
            <Typography variant="h6" style={{ marginTop: 10, fontWeight: "bold" }}>Jarvis Mariano</Typography>
            <Typography variant="subtitle1">Wants to add you to friends</Typography>
          </Grid>
          <Grid container justifyContent="center" spacing={3}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                className={classes.btnStyle}
              >
                Accept
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="inherit"
                className={classes.btnStyle}
              >
                Decline
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </ListItem>
      <Grid container justifyContent="center">
        <Button>
          See All
        </Button>
      </Grid>
      <hr></hr>
      <Grid container style={{ marginBottom: 20, padding: 10 }}>
        <Grid item sm={11}>
          <Grid container>
            <Typography variant="subtitle1">
              Friends
            </Typography>
          </Grid>
        </Grid>
        <Grid item sm={1}>
          <Grid container>
            <Typography variant="subtitle1">
              2
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <ListItem button className={classes.listStyle}>
        <ListItemIcon>
          <Avatar className={classes.iconStyle} />
        </ListItemIcon >
        <Typography variant="subtitle1" className={classes.textStyle}>
          JM
        </Typography>
        <Grid container justifyContent="flex-end">
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Grid>
      </ListItem>
      <ListItem button className={classes.listStyle}>
        <ListItemIcon>
          <Avatar className={classes.iconStyle} />
        </ListItemIcon >
        <Typography variant="subtitle1" className={classes.textStyle}>
          Jarvis
        </Typography>
        <Grid container justifyContent="flex-end">
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </Grid>
      </ListItem>

    </List>

  );
}
