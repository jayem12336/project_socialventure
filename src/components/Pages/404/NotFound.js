import React from 'react'
import { useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({

    root: {
        overflow: "hidden",
        maxWidth: 1500,
        width: '100%',
        margin: '200px auto',
    },
    errorMessage: {
        fontSize: 100,
    },
    btnStyle: {
        width: 220,
        fontSize: 15,
        padding: 10,
        marginBottom: 10,
        '&:hover': {
            background: '#4877c2',
        },
    },


}))
export default function NotFound() {

    const classes = useStyles();

    const history = useHistory();

    return (
        <div className={classes.root}>
            <Grid container justifyContent="center">
                <Typography className={classes.errorMessage}>404 Not Found</Typography>
            </Grid>
            <Grid container justifyContent="center">
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.btnStyle}
                    onClick={() => history.push('/')}
                >Go Back</Button>
            </Grid>

        </div>
    )
}
