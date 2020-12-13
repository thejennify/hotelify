import axios from 'axios';
import React from 'react';
import _ from 'underscore';
import GoogleMapReact from 'google-map-react';
import { Avatar, Typography, Divider, List, ListItem, Button,
   ListItemText, ListItemIcon, IconButton, Dialog, DialogContent} from '@material-ui/core/';
import { People, LocationOn, AccountCircle} from '@material-ui/icons/';

const AnyReactComponent = ({ text }) => <div><LocationOn style={{color:'red'}}/></div>;

export default class Bookings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bookingsHost: [],
      bookingsGuest: [],
      openMap: false,
      lat: null,
      long: null,
      booking: {}
    }
  }

  handleMapClose() {
    this.setState({
      openMap: false,
      lat: null,
      long: null,
      booking: {}
    })
  }

  handleOpenMap(latitude, longitude, bkg) {
    this.setState({
      openMap: true,
      lat: latitude,
      long: longitude,
      booking: bkg
    })
  }

  renderGuest(bg) {
    return (
      <div style={{display: "flex", justifyContent: "center"}}>
      <div className="bookGuest-line">
        <div className="host-info">
          {bg.host.imgUrl ? <Avatar src={bg.host.imgUrl} style={{marginRight: 10, marginBottom: 10}}/> : bg.host.gender === 'Male' ? <Avatar src='https://cdn.iconscout.com/public/images/icon/free/png-256/avatar-user-boy-389cd1eb1d503149-256x256.png' style={{marginRight: 10, marginBottom: 10}}/> : <Avatar src='https://curaflo.com/wp-content/uploads/2017/04/female-avatar3.png' style={{marginRight: 10, marginBottom: 10}}/>}
          <span className="host-center">{bg.host.name.fname} {bg.host.name.lname}</span>
        </div>
        <div className="hotel-info">
          <div className="hotel-info-city">
            <span style={{fontSize: 14}}>{bg.from} - {bg.to}</span>
          </div>
          <span className="hotel-name">
            {bg.hotel.name}
            <IconButton onClick={() => this.handleOpenMap(bg.hotel.location.lat, bg.hotel.location.long, bg)}>
              <LocationOn />
            </IconButton>
          </span>
        </div>
      </div>
</div>
  )
  }

  renderHost(bg) {
    return (
      <div style={{display: "flex", justifyContent: "center"}}>
      <div className="bookGuest-line">
        <div className="host-info">
          {bg.guest.imgUrl ?
            <Avatar src={bg.guest.imgUrl} style={{marginRight: 10, marginBottom: 10}}/> :
            bg.guest.gender === 'Male' ?
            <Avatar src='https://cdn.iconscout.com/public/images/icon/free/png-256/avatar-user-boy-389cd1eb1d503149-256x256.png' style={{marginRight: 10, marginBottom: 10}}/> :
            <Avatar src='https://curaflo.com/wp-content/uploads/2017/04/female-avatar3.png' style={{marginRight: 10, marginBottom: 10}}/>}
          <span className="host-center">{bg.guest.name.fname} {bg.guest.name.lname}</span>
        </div>
        <div className="hotel-info">
          <div className="hotel-info-city">
            <span style={{fontSize: 14}}>{bg.from} - {bg.to}</span>
          </div>
          <span className="hotel-name">{bg.hotel.name}</span>
          <IconButton onClick={() => this.handleOpenMap(bg.hotel.location.lat, bg.hotel.location.long, bg)}>
            <LocationOn />
          </IconButton>
        </div>
      </div>
    </div>
    )
  }

  orderBookings(bgs) {
    return _.groupBy(bgs, (booking) => (booking.hotel.city))
  }

  componentDidMount() {
    this.props.updateAppBarStyle({height: 60, background: "#009090"});
    this.getBookings();
    setInterval(() => this.getBookings(), 10000);
  }
  getBookings() {
    let bookingsGuest = axios.get('/api/bookingsGuest');
    let bookingsHost = axios.get('/api/bookingsHost');
    Promise.all([bookingsGuest, bookingsHost])
    .then(res => {
      if(res[0].data.success && res[1].data.success) {
        this.setState({bookingsGuest: res[0].data.bookings, bookingsHost: res[1].data.bookings})
      }
    });
  }
  render() {
    const orderedBksGuest = this.orderBookings(this.state.bookingsGuest);
    const orderedBksHost = this.orderBookings(this.state.bookingsHost);

    return (
      <div className="bookings-container">
        <Dialog
          open={this.state.openMap}
          onClose={() => this.handleMapClose()}
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title"
        >
          <DialogContent style={{ height: '75vh', width: '75vh'}}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'Google Maps Key'}}
              defaultCenter={{lat: this.state.lat, lng: this.state.long}}
              defaultZoom={14}
            >
              <AnyReactComponent
                lat={this.state.lat}
                lng={this.state.long}
              />
            </GoogleMapReact>
          </DialogContent>
          </Dialog>
        <div style={{flex:1}}>
          <Typography variant="headline" gutterBottom='true' align='center' color='inherit' style={{fontWeight: "bold", fontSize: '1.75rem'}}> GUEST </Typography>
          {this.state.bookingsGuest.length ? Object.keys(orderedBksGuest).map((city) =>
            <div style={{display: "flex", justifyContent:'center'}}>
              <List style={{width: '100%'}}>
                <ListItem style={{display: "flex", justifyContent: "center", flex: 1}}>
                  <Typography variant="title" align='center' color='inherit' style={{fontSize: '1.55rem'}}>{city}</Typography>
                </ListItem>
                {orderedBksGuest[city].map(bg => this.renderGuest(bg))}
              </List>
            </div>
          ): null}
        </div>
        <div style={{flex:1}}>
          <Typography variant="headline" gutterBottom='true' align='center' color='inherit' style={{fontWeight: 'bold', fontSize: '1.75rem'}}> HOST </Typography>
          {this.state.bookingsHost.length ? Object.keys(orderedBksHost).map((city) =>
            <div style={{display: "flex", justifyContent:'center', flex: 1}}>
              <List style={{width: '100%'}}>
                <ListItem style={{display: "flex", justifyContent: "center", flex: 1}}>
                  <Typography variant="title" align='left' color='inherit' style={{fontSize: '1.55rem'}}>{city}</Typography>
                </ListItem>
                {orderedBksHost[city].map(bg => this.renderHost(bg))}
              </List>
            </div>
          ): null}
        </div>
      </div>
    )
  }
}
