import { createMuiTheme } from '@material-ui/core'

const theme = createMuiTheme(
    {
        "palette": {
            "common": {
                "black": "#000", "white": "#fff"
            }, "background": {
                "paper": "#fff",
                "default": "#fafafa"
            }, "primary":
            {
                "light": "rgba(234, 124, 167, 1)",
                "main": "rgba(234, 76, 137, 1)",
                "dark": "rgba(206, 30, 99, 1)",
                "contrastText": "#fff"
            }, "secondary": {
                "light": "rgba(183, 183, 189, 1)"
                , "main": "rgba(129, 129, 132, 1)"
                , "dark": "rgba(91, 91, 94, 1)"
                , "contrastText": "#fff"
            }, "error": {
                "light": "#e57373",
                "main": "#f44336",
                "dark": "#d32f2f",
                "contrastText": "#fff"
            }, "text": {
                "primary": "rgba(0, 0, 0, 0.87)",
                "secondary": "rgba(0, 0, 0, 0.54)",
                "disabled": "rgba(0, 0, 0, 0.38)",
                "hint": "rgba(0, 0, 0, 0.38)"
            }
        }
    })
export default theme;