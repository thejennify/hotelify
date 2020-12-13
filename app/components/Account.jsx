import axios from 'axios';
import React from 'react';
import EditProfile from './EditProfile.jsx';
import Button from '@material-ui/core/Button';
import { AccountCircle } from '@material-ui/icons/';

const styles = {
  btn: {
    background: '#009090',
    color: '#fff',
    textTransform: 'capitalize',
    fontSize: 14,
    fontWeight: 'bold',
  }
}

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {name: {fname: '', lname: ''}, email: '', phone: '', birthday: '', gender: '', imgUrl: '', bio: '', languages: []},
      edit: false,
    }
  }

  componentDidMount() {
    this.props.updateAppBarStyle({height: 60, background: "#009090"});
    axios.get('/api/account')
    .then(res => {
      if(res.data.success) this.setState({user: Object.assign({}, res.data.user)});
    });
  }

  render() {
    return (
      <div style={{height: "100%", fontSize: 14}}>
        {this.state.edit ? <EditProfile updateAppBarStyle={(val) => this.props.updateAppBarStyle(val)} updateUser={(user) => this.props.updateUser(user)} account={this} /> :
        <div className="account-container">
          <div className="account-box">
            {this.state.user.imgUrl ? <img src={this.state.user.imgUrl} style={{height: 100, width: 100}} />: <AccountCircle style={{height: 100, width: 100}}/>}
            <div className="display-column">
              <div className="display-row">
                <div className="title">Name</div>
                <div className="info">{this.state.user.name.fname} {this.state.user.name.lname}</div>
              </div>
              <div className="display-row">
                <div className="title">Email</div>
                <div className="info">{this.state.user.email}</div>
              </div>
              <div className="display-row">
                <div className="title">Phone</div>
                <div className="info">{this.state.user.phone}</div>
              </div>
              <div className="display-row">
                <div className="title">Birthday</div>
                <div className="info">{this.state.user.birthday}</div>
              </div>
              <div className="display-row">
                <div className="title">Gender</div>
                <div className="info">{this.state.user.gender}</div>
              </div>
              <div className="display-row">
                <div className="title">Bio</div>
                <div className="info">{this.state.user.bio ? this.state.user.bio : <span style={{color: "#009090"}}>Please add a bio</span>}</div>
              </div>
              <div className="display-row">
                <div className="title">Languages</div>
                <div className="info">{this.state.user.languages.length ? <ul style={{margin: 0, paddingLeft: 20}}>{this.state.user.languages.map(lang => <li>{lang}</li>)}</ul> : <span style={{color: "#009090"}}>Please add your languages</span>}</div>
              </div>
            </div>
            <Button onClick={() => this.setState({edit: true})} style={styles.btn}>Edit Profile</Button>
          </div>
        </div>
        }
      </div>
    )
  }
}
