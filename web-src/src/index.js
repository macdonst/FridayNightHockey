import '@babel/polyfill'
import ReactDOM from 'react-dom'
import React from 'react'
import App from './App'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import grey from '@material-ui/core/colors/grey'

const theme = createMuiTheme({
  palette: {
    primary: grey
  }
})

// Render it!
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,

  document.getElementById('root')
)
