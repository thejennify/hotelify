import React from 'react';
import { Route, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, InputAdornment, Button, Snackbar, SnackbarContent, IconButton } from '@material-ui/core/';
import { Email, Lock, Close, Error } from '@material-ui/icons/';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      failedLoginAlert: false,
    }
  }

  login(e) {
    e.preventDefault();
    axios.post('/api/login', this.state)
    .then(resp => {
      if (resp.data.success) {
        this.props.login();
        axios.get('/api/account')
        .then(res => this.props.updateUser(res.data.user))
      } else this.setState({failedLoginAlert: true});
    });
  }

  render() {
    return (
    <div>
      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        open={this.state.failedLoginAlert} autoHideDuration={6000} onClose={() => this.setState({failedLoginAlert: false})}>
        <SnackbarContent aria-describedby="client-snackbar" style={{backgroundColor: "#b03030"}}
          message={
            <span id="client-snackbar" style={{display: "flex", alignItems: "center"}}>
            <Error style={{backgroundColor: "b03030", marginRight: 20}} />Wrong login information!</span>}
          action={[
            <IconButton key="close" aria-label="Close" color="inherit"
              onClick={() => this.setState({failedLoginAlert: false})}>
              <Close />
            </IconButton>,
          ]}
        />
      </Snackbar>
      <div className="login-box">
        <TextField
          label="Email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Email />
              </InputAdornment>
            ),
          }}
          onChange={(e) => this.setState({username: e.target.value})}
        />
        <TextField
          label="Password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Lock />
              </InputAdornment>
            ),
          }}
          type="password"
          onChange={(e) => this.setState({password: e.target.value})}
        />
        <Button variant="contained" onClick={(e) => this.login(e)} style={{margin: 20, backgroundColor: "#009090", color: "white"}}>Login</Button>
      </div>
    </div>
    );
  }
}
