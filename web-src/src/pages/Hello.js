import React from 'react'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Action from '../services/Action'
import logo from '../../resources/adobe-logo.png'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import ErrorIcon from '@material-ui/icons/Error'

export default class App extends React.Component {
  constructor () {
    super()
    this.state = {
      greeting: 'Hello there',
      name: '',
      errorMsg: ''
    }

    this.inputChange = this.inputChange.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.hello = this.hello.bind(this)
  }

  inputChange (event) {
    this.setState({
      name: event.target.value
    })
  }

  handleClose () {
    this.setState({ errorMsg: '' })
  }

  async hello () {
    try {
      const json = await Action.webInvoke(
        'hello',
        { name: this.state.name },
        true
      )
      this.setState({
        greeting: json.message,
        errorMsg: ''
      })
    } catch (e) {
      this.setState({
        errorMsg: (e.status || 'Error') + ': ' + e.message
      })
    }
  }

  render () {
    return (
      <Grid container direction='column' justify='center' alignItems='center'>
        <img src={logo} height='75px' />
        <Typography component='h1' variant='h2'>
          {this.state.greeting}
        </Typography>
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
          style={{
            width: '268px',
            margin: '20px auto'
          }}
        >
          <TextField
            onChange={this.inputChange}
            value={this.state.name}
            placeholder='Text here'
            margin='normal'
          />
          <br />
          <br />
          <Button onClick={this.hello} variant='outlined'>
            Greet
          </Button>
        </Grid>
        {this.state.errorMsg && (
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            open='true'
            onClose={this.handleClose}
          >
            <SnackbarContent
              className='error'
              aria-describedby='client-snackbar'
              message={
                <span id='client-snackbar'>
                  <ErrorIcon className='error' />
                  {this.state.errorMsg}
                </span>
              }
              action={[
                <IconButton
                  key='close'
                  aria-label='Close'
                  color='inherit'
                  onClick={this.handleClose}
                >
                  <CloseIcon />
                </IconButton>
              ]}
            />
          </Snackbar>
        )}
      </Grid>
    )
  }
}
