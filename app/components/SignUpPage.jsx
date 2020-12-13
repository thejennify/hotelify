import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { AccountCircle, Email, Phone, Lock, Cake, CropOriginal, Close, Error} from '@material-ui/icons/';
import { Button, Radio, RadioGroup, FormControl, FormControlLabel, Avatar, Snackbar, SnackbarContent, IconButton } from '@material-ui/core/';

export default class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      email: '',
      password: '',
      phone: '',
      birthday: '',
      gender: '',
      verify: false,
      code: '',
      failedSignupAlert: false,
      wrongCodeAlert: false,
    }
  }

  signup(e) {
    e.preventDefault();
    axios.post('/api/register', this.state)
    .then(resp => {
      if (resp.data.success) this.setState({verify: true});
      else this.setState({failedSignupAlert: true});
    });
  }

  verify(e) {
    e.preventDefault();
    axios.post('/api/verify', {phone: this.state.phone, code: this.state.code})
    .then(resp => {
      if (resp.data.success) this.props.hide();
      else this.setState({wrongCodeAlert: true});
    });
  }

  render() {
    if (this.state.verify) return (
      <div>
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          open={this.state.wrongCodeAlert} autoHideDuration={6000} onClose={() => this.setState({wrongCodeAlert: false})}>
          <SnackbarContent aria-describedby="client-snackbar" style={{backgroundColor: "#b03030"}}
            message={
              <span id="client-snackbar" style={{display: "flex", alignItems: "center"}}>
              <Error style={{backgroundColor: "b03030", marginRight: 20}} />Wrong Code!</span>}
            action={[
              <IconButton key="close" aria-label="Close" color="inherit"
                onClick={() => this.setState({wrongCodeAlert: false})}>
                <Close />
              </IconButton>,
            ]}
          />
        </Snackbar>
        <div className="login-box">
          <TextField
            label="Code sent to phone"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
            }}
            value={this.state.code}
            onChange={(e) => {
              if (e.target.value.length < 5) this.setState({code: e.target.value})
            }}
          />
          <Button variant="contained" onClick={(e) => this.verify(e)} style={{margin: 20, backgroundColor: "#009090", color: "white"}}>Verify</Button>
        </div>
      </div>
    );
    return (
      <div>
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}}
          open={this.state.failedSignupAlert} autoHideDuration={6000} onClose={() => this.setState({failedSignupAlert: false})}>
          <SnackbarContent aria-describedby="client-snackbar" style={{backgroundColor: "#b03030"}}
            message={
              <span id="client-snackbar" style={{display: "flex", alignItems: "center"}}>
              <Error style={{backgroundColor: "b03030", marginRight: 20}} />Can't register, please check your information!</span>}
            action={[
              <IconButton key="close" aria-label="Close" color="inherit"
                onClick={() => this.setState({failedSignupAlert: false})}>
                <Close />
              </IconButton>,
            ]}
          />
        </Snackbar>
        <div className="login-box">
          {/*{this.state.fname && this.state.lname ? <Avatar style={{backgroundColor: "#009090"}}>{this.state.fname[0] + this.state.lname[0]}</Avatar> : null}*/}
          <TextField
            label="First name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            onChange={(e) => this.setState({fname: e.target.value})}
          />
          <TextField
            label="Last name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
            onChange={(e) => this.setState({lname: e.target.value})}
          />
          <TextField
            label="Email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            }}
            onChange={(e) => this.setState({email: e.target.value})}
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
          <TextField
            label="Phone"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            }}
            onChange={(e) => this.setState({phone: e.target.value})}
          />
          <TextField
            label="Birthday"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Cake />
                </InputAdornment>
              ),
            }}
            type="date"
            onChange={(e) => this.setState({birthday: e.target.value})}
            style={{width: "95%"}}
          />
          <FormControl component="fieldset">
            <RadioGroup
              aria-label="Gender"
              value={this.state.gender}
              onChange={(e) => this.setState({gender: e.target.value})}
              style={{display: "flex", flexDirection: "row"}}
            >
              <FormControlLabel value="Female" control={<Radio color="default"/>} label="Female" />
              <FormControlLabel value="Male" control={<Radio color="default"/>} label="Male" />
            </RadioGroup>
          </FormControl>
          <Button variant="contained" onClick={(e) => this.signup(e)} style={{margin: 20, backgroundColor: "#009090", color: "white"}}>Sign Up</Button>
        </div>
      </div>
    );
  }
}
