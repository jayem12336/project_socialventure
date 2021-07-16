import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import NestedList from './LeftList';
import RightNestedList from './RightNestedList';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles'


const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginTop: 60
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    margin: 200
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: -58,
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    },
  },
}));

function SideBarDrawer({ children, userProfile, profile }) {

  const classes = useStyles();

  const theme = useTheme();

  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));

  const isMatchIpad = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div className={classes.root}>
      {isMatch ? "" : (
        <>
          <nav className={classes.drawer} aria-label="Button folders">
            <NestedList userProfile={userProfile} />
          </nav>
        </>
      )}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
      {isMatch || profile || isMatchIpad ? "" : (
        <>
          <nav className={classes.drawer} aria-label="Button folders">
            <RightNestedList userProfile={userProfile} />
          </nav>
        </>
      )}
    </div>
  );
}
export default SideBarDrawer;
