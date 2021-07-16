import React from "react";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import {
    Security,
    Info
} from "@material-ui/icons";

const Footer = () =>
    <>
        <Grid container justifyContent="center" style={{ backgroundColor: 'white', padding: '50px', minHeight: "212px" }}>
            <Grid container item sm={6} xs={11} justifyContent="space-between" style={{ maxWidth: '1200px' }}>
                <Grid item sm={5} xs={12}>
                    <Security color="inherit" />
                    <Typography paragraph>
                        The donations made on this site are sent through a secured connection and processed by Stripe. This site is compliant with the Payment Card Industry and Data Security Standard. Read more about Stripe security <Link href="https://stripe.com/docs/security/stripe" target="_blank" alt="Stripe">here</Link>.
                    </Typography>
                </Grid>
                <Grid item sm={5} xs={11}>
                    <Info color="inherit" />
                    <Typography paragraph>
                        This Web App is fully responsive. Made in <Link href="https://reactjs.org/" target="_blank">ReactJS</Link>, using <Link href="https://material-ui.com" target="_blank">Material-UI</Link> and <Link href="https://stripe.com/docs/stripe-js/react" target="_blank">React Stripe</Link>. It's given free of use by <Link href="https://angeloron.com" target="_blank">Ange loron</Link>. react-material-ui-stripe-payment is under the MIT license and can be dowloaded <Link href="https://gitlab.com/angeloron/react-material-ui-stripe-payment" target="_blank">here</Link>.
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
        <AppBar position="static" elevation={0} component="footer" color="primary">
            <Toolbar style={{ justifyContent: "center" }}>
                <Typography variant="subtitle1">Social Venture    ©2020</Typography>
            </Toolbar>
        </AppBar>
    </>

export default Footer;