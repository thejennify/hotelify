import axios from 'axios';
import React from 'react';
import Button from '@material-ui/core/Button';
import { Avatar, CircularProgress } from '@material-ui/core/';
import { AccountCircle } from '@material-ui/icons';

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      sortedMsgs: [],
      newMsg: '',
      clickedMsg: [],
      isLoaded: false,
      clickedMsgIndex: 0,
    }
  }

  componentDidMount() {
    this.props.updateAppBarStyle({height: 60, background: "#009090"});
    this.getMessages();
    setInterval(() => this.getMessages(), 5000);
  }
  getMessages() {
    axios.get('/api/messages')
    .then(res => {
      if(res.data.success) {
        if(res.data.messages.length) {
          this.setState({messages: res.data.messages}, () => {
            if(this.state.messages.length) {
              let messages = this.state.messages.slice();
              let usersIds = [messages[0].from._id];
              let foundUser = false;
              for(let i = 0; i < messages.length; i++) {
                for(let j = 0; j < usersIds.length; j++) {
                  if(messages[i].from._id === usersIds[j]) {
                    foundUser = true;
                  }
                }
                if(!foundUser) usersIds.push(messages[i].from._id);
                foundUser = false;
              }
              usersIds = usersIds.filter(id => id !== this.props.user._id)
              let sortedMsgs = [];
              for(let i = 0; i < usersIds.length; i++) {
                sortedMsgs.push(messages.filter(msg => msg.from._id === usersIds[i] || msg.to._id === usersIds[i]));
              }
              this.setState({sortedMsgs: sortedMsgs, isLoaded: true});
            }
          });
        }
        else this.setState({isLoaded: true});
      }
    });
  }
  getDate(timestamp) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[new Date(timestamp).getDate()]} ${new Date(timestamp).getDay()}`
  }
  getConvo(e, msg, index) {
    this.setState({clickedMsg: msg.reverse(), clickedMsgIndex: index}, () => this.props.app.setState({clickedConvo: true}));
  }
  submitMsg() {
    let to;
    let { sortedMsgs, clickedMsgIndex, newMsg } = this.state;
    if(sortedMsgs[clickedMsgIndex][0].from._id !== this.props.user._id) to = sortedMsgs[clickedMsgIndex][0].from._id;
    else to = sortedMsgs[clickedMsgIndex][0].to._id;
    let clickedMsg = this.state.clickedMsg.slice();
    clickedMsg.push({from: {_id: this.props.user._id, imgUrl: this.props.user.imgUrl}, content: newMsg})
    this.setState({clickedMsg: clickedMsg, newMsg: ''});
    axios.post('/api/message', {to: to, content: newMsg})
  }
  getOtherAvatar(msg) {
    for(let i = 0; i < msg.length; i++) {
      if(msg[i].from.imgUrl !== this.props.user.imgUrl) return msg[i].from.imgUrl;
    }
  }
  getOtherName(msg) {
    for(let i = 0; i < msg.length; i++) {
      if(msg[i].from._id !== this.props.user._id) return msg[i].from.name.fname + '' + msg[i].from.name.lname;
    }
  }
  render() {
    return (
      <div className="inbox-container">
          {this.state.isLoaded ?
          <div className="inbox">
          {this.props.app.state.clickedConvo && this.state.clickedMsg.length ?
            //display specific conversation
          <div>
            {this.state.clickedMsg.map(msg =>
            (msg.from._id === this.props.user._id ?
            <div className="inbox-row" style={{background: 'rgba(0,90,90,0.1)'}}>
              <div className="inbox-adjust" style={{justifyContent: "flex-end"}}>
                <span>{msg.content}</span>
              </div>
              {/* <Avatar src={msg.from.imgUrl}/> */}
              {msg.from.imgUrl ? <Avatar src={msg.from.imgUrl}/> : <Avatar><AccountCircle /></Avatar>}
            </div> :
            <div className="inbox-row">
              {msg.from.imgUrl ? <Avatar src={msg.from.imgUrl}/> : <Avatar><AccountCircle /></Avatar>}
              <div className="inbox-adjust">
                <span>{msg.content}</span>
              </div>
            </div>))}
            <div className="submit-msg-box">
              <div className="submit-msg-textarea">
                <input className="input-msg" placeholder="Type your message here..." onChange={(e) => this.setState({newMsg: e.target.value})} value={this.state.newMsg}/>
                <div className="align-right"><Button style={{background: '#009090', color: 'white', margin: 5}} onClick={() => this.submitMsg()}>Send</Button></div>
              </div>
              {/* <Avatar src={this.props.user.imgUrl} /> */}
              {this.props.user.imgUrl ? <Avatar src={this.props.user.imgUrl}/> : <Avatar><AccountCircle /></Avatar>}
            </div>
          </div> :
          //display list with latest msgs from other users that msg'd you
          (this.state.sortedMsgs.length ?
          this.state.sortedMsgs.map((msg, index) =>
          <div className="inbox-row" onClick={(e) => this.getConvo(e, msg, index)}>
            {this.getOtherAvatar(msg) ? <Avatar src={this.getOtherAvatar(msg)}/> : <Avatar><AccountCircle /></Avatar>}
            <div className="inbox-adjust">
              <div className="inbox-info">
                <span style={{fontWeight: "bold"}}>{this.getOtherName(msg)}</span>
                <span>{this.getDate(msg[0].timestamp)}</span>
              </div>
              <div className="inbox-msg">
                {msg[0].content}
              </div>
            </div>
          </div>) :
          <div className="submit-msg-box">
            You have no messages in your inbox, you should submit your first message to a specific user through his/her listing
          </div>)}</div> : <CircularProgress size={100} style={{color: '#009090'}} />}
      </div>
    )
  }
}
