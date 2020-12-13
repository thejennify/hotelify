import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import SearchBox from './SearchBox.jsx';
import LoginPage from './LoginPage.jsx';
import SignUpPage from './SignupPage.jsx';
import axios from 'axios';

export default class LandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: [{img: '#'}, {img: '#'}],
      c: 1,
      style1: {},
      style2: {},
      options: false,
    };
  }

  componentDidMount() {
    this.props.updateAppBarStyle({height: 0});
    axios.get('/api/cities')
    .then(resp => {
      this.setState({
        cities: resp.data.cities,
        style1: {opacity: 1, backgroundImage: `url(${resp.data.cities[0].img})`},
        style2: {opacity: 0, backgroundImage: `url(${resp.data.cities[1].img})`},
      }, () => {
        setInterval(() => {
          let fadeIn = {
            animationName: 'fade-in',
            animationDuration: '1.5s',
            animationFillMode: 'forwards',
          };
          let fadeOut = {
            animationName: 'fade-out',
            animationDuration: '1.5s',
            animationFillMode: 'forwards',
          };
          if (this.state.style1.opacity) {
            this.setState({
              style1: Object.assign(fadeOut, this.state.style1),
              style2: Object.assign(fadeIn, this.state.style2),
            });
            setTimeout(() => this.setState({c: (this.state.c + 1) % this.state.cities.length}), 200);
            setTimeout(() => this.setState({
              style1: {opacity: 0, backgroundImage: `url(${this.state.cities[this.state.c].img})`},
              style2: {opacity: 1, backgroundImage: this.state.style2.backgroundImage},
            }), 1500);
          } else {
            this.setState({
              style2: Object.assign(fadeOut, this.state.style2),
              style1: Object.assign(fadeIn, this.state.style1),
            });
            setTimeout(() => this.setState({c: (this.state.c + 1) % this.state.cities.length}), 200);
            setTimeout(() => this.setState({
              style2: {opacity: 0, backgroundImage: `url(${this.state.cities[this.state.c].img})`},
              style1: {opacity: 1, backgroundImage: this.state.style1.backgroundImage},
            }), 1500);
          }
        }, 6000);
      });
    })
  }

  showOptions() {
    if (!this.state.options) this.setState({options: true});
  }

  hide(e) {
    if (e.target.className === 'landing-page-container') {
      if (this.state.options) this.setState({options: false});
      if (this.props.show) this.props.hide();
    }
  }

  render() {
    return (
      <div className="landing-page-container" onClick={(e) => this.hide(e)}>
        <div id="background-1" style={this.state.style1} />
        <div id="background-2" style={this.state.style2} />
        <Route exact path="/main" render={() => <SearchBox options={this.state.options} showOptions={() => this.showOptions()}
          city={this.props.city} from={this.props.from} to={this.props.to} guests={this.props.guests}
          updateCity={(val) => this.props.updateCity(val)} updateFrom={(val) => this.props.updateFrom(val)}
          updateTo={(val) => this.props.updateTo(val)} updateGuests={(val) => this.props.updateGuests(val)}
          text={this.state.cities[(this.state.c + this.state.cities.length - 1) % this.state.cities.length].name}/>} />
        <Route exact path="/main/login" render={() => this.props.auth || !this.props.show ? <Redirect to="/main" /> :
        <LoginPage login={() => this.props.login()} updateUser={(user) => this.props.updateUser(user)}/>} />
        <Route exact path="/main/signup" render={() => this.props.auth || !this.props.show ? <Redirect to="/main" /> :
        <SignUpPage hide={() => this.props.hide()}/>} />
      </div>
    )
  }
}
