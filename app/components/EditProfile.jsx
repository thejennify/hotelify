import React from 'react';
import axios from 'axios';
import { TextField, Button, Radio, RadioGroup, FormControl, FormControlLabel, Select, MenuItem, InputLabel, InputAdornment, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core/';
import { AccountCircle, Email, Phone, Lock, Cake, InsertPhoto } from '@material-ui/icons/';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: {name: {fname: '', lname: ''}, email: '', phone: '', birthday: '', gender: '', imgUrl: '', bio: '', languages: []},
      user: {name: {fname: '', lname: ''}, email: '', phone: '', birthday: '', gender: '', imgUrl: '', bio: '', languages: []},
      extraFields: 0,
      openDialog: false,
      dialogUpdate: false,
    }
  }
  componentDidMount() {
    this.props.updateAppBarStyle({height: 60, background: "#009090"});
    axios.get('/api/account')
    .then(res => {
      if(res.data.success) {
        this.setState({input: Object.assign({}, res.data.user), user: Object.assign({}, Object.assign(res.data.user, {name: Object.assign({}, res.data.user.name)}))});
      }
    })
    .catch(err => console.log("err", err));
  }

  editLanguage(e, index) {
    let lang = this.state.input.languages.slice();
    lang[index] = e.target.value;
    this.setState({input: Object.assign(this.state.input, {languages: lang})});
  }

  saveLanguage(e) {
    let lang = this.state.input.languages.slice();
    lang.push(e.target.value);
    this.setState({extraFields: this.state.extraFields - 1, input: Object.assign(this.state.input, {languages: lang})});
  }

  removeLanguage(e, index) {
    let lang = this.state.input.languages.slice();
    lang.splice(index, 1);
    this.setState({input: Object.assign(this.state.input, {languages: lang})});
  }

  submitChanges() {
    let { user, input } = this.state;
    let keys = ["name", "email", "phone", "birthday", "gender", "imgUrl", "bio", "languages"];
    let update = {};
    if(input.name.fname !== user.name.fname || input.name.lname !== user.name.lname) update.name = input.name;
    for(let i = 1; i < 8; i++) {
      if(input[keys[i]] !== user[keys[i]]) update[keys[i]] = input[keys[i]];
    }
    if(Object.keys(update).length) {
      axios.post('/api/account', update)
      .then(res => {
        if(res.data.success) this.setState({openDialog: true, dialogUpdate: true})
      })
      this.props.updateUser(input);
      this.props.account.setState({user: input})
    } else {this.setState({openDialog: true, dialogUpdate: false})}
  }

  render() {
    const languages = ['Arabic', 'Dutch', 'Czech', 'English', 'French', 'German', 'Greek', 'Hindi', 'Italian', 'Japanese', 'Korean', 'Mandarin', 'Persian', 'Polish', 'Portuguese', 'Punjabi', 'Romanian', 'Russian', 'Spanish', 'Ukranian', 'Urdu', 'Vietnamese'];
    return (
      <div className="account-container">
        <div className="edit-profile-box">
          <div className="row">
            <TextField
              label="First Name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              value={this.state.input.name.fname}
              style={{marginBottom: 20}}
              onChange={(e) => this.setState({input: Object.assign(this.state.input, {name: Object.assign(this.state.input.name, {fname: e.target.value})})})}
            />
            <TextField
              label="Last Name"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              value={this.state.input.name.lname}
              style={{marginBottom: 20}}
              onChange={(e) => this.setState({input: Object.assign(this.state.input, {name: Object.assign(this.state.input.name, {lname: e.target.value})})})}
            />
          </div>
          <div className="row">
            <TextField
              label="Email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
              value={this.state.input.email}
              style={{marginBottom: 20}}
              onChange={(e) => this.setState({input: Object.assign(this.state.input, {email: e.target.value})})}
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
              value={this.state.input.phone}
              style={{marginBottom: 20}}
              onChange={(e) => this.setState({input: Object.assign(this.state.input, {phone: e.target.value})})}
            />
          </div>
          <div className="row">
            <TextField
              label="Birthday"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Cake />
                  </InputAdornment>
                ),
              }}
              value={this.state.input.birthday}
              style={{marginBottom: 20}}
              type="date"
              onChange={(e) => this.setState({input: Object.assign(this.state.input, {birthday: e.target.value})})}
            />
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Gender"
                value={this.state.input.gender}
                onChange={(e) => this.setState({input: Object.assign(this.state.input, {gender: e.target.value})})}
                style={{display: "flex", flexDirection: "row"}}
              >
                <FormControlLabel style={{display: "flex", alignItems: "flex-end"}} value="Female" control={<Radio style={{display: "flex", alignItems: "flex-end"}} color="default" />} label="Female" />
                <FormControlLabel style={{display: "flex", alignItems: "flex-end"}} value="Male" control={<Radio style={{display: "flex", alignItems: "flex-end"}} color="default" />} label="Male" />
              </RadioGroup>
            </FormControl>
          </div>
          <TextField
            label="Profile Pic Url"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <InsertPhoto />
                </InputAdornment>
              ),
            }}
            style={{width: "100%", margin: 20}}
            value={this.state.input.imgUrl}
            onChange={(e) => this.setState({input: Object.assign(this.state.input, {imgUrl: e.target.value})})}
          />
          <TextField
            label="Bio"
            multiline={true}
            rows={2}
            rowsMax={4}
            style={{width: "100%", marginBottom: 20}}
            value={this.state.input.bio}
            onChange={(e) => this.setState({input: Object.assign(this.state.input, {bio: e.target.value})})}
          />
          <FormControl style={{width: "100%", minWidth: 200}}>
            {this.state.input.languages.length ?
              <InputLabel>Languages you speak</InputLabel> : null}
            <div className="row wrap">
              {this.state.input.languages.map((language, index) =>
                <div><Select value={language} onChange={(e) => this.editLanguage(e, index)} style={{marginBottom: 20}}>
                  {languages.map(language => <MenuItem value={language}>{language}</MenuItem>)}</Select>
                  <Button variant="fab" style={{backgroundColor: '#009090', marginLeft: 5, color: 'white', height: 40, width: 40}} onClick={(e) => this.removeLanguage(e, index)}><DeleteIcon /></Button></div>)}
            </div>
          </FormControl>
          {Array(this.state.extraFields).fill(0).map((item, index) => <FormControl style={{minWidth: 200, marginBottom: 20}}>
                      <Select onChange={(e) => this.saveLanguage(e)}>{languages.map(language => <MenuItem value={language}>{language}</MenuItem>)}</Select>
                    </FormControl>)}
          <div className="wrap">
            <Button variant="contained" onClick={() => this.setState({extraFields: this.state.extraFields + 1})} style={{backgroundColor: '#009090', color: 'white', marginRight: 20}}><AddIcon />Language</Button>
            <Button variant="contained" onClick={() => this.submitChanges()} style={{backgroundColor: '#009090', color: 'white'}}>Save changes</Button>
            <Dialog open={this.state.openDialog} onClose={() => this.setState({openDialog: false})}>
              <DialogTitle>{this.state.dialogUpdate ? "Success" : "Attention"}</DialogTitle>
              <DialogContent>
                <DialogContentText>
                    {this.state.dialogUpdate ? "Your profile was successfully updated." : "You have not made any updates."}
                </DialogContentText>
                <DialogActions>
                  <Button onClick={() => this.props.account.setState({edit: false})}>
                    Dismiss
                  </Button>
                </DialogActions>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    );
  }
}
