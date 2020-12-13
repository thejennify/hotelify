import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HotelCard from './HotelCard.jsx'
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import GoogleMapReact from 'google-map-react';
import SearchBox from './SearchBox.jsx';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { Fade } from 'react-slideshow-image';
import sanfrancisco from '../../assets/images/sanfrancisco.jpg'
import chicago from '../../assets/images/chicago.jpg'
import newyork from '../../assets/images/newyork.jpg'
import seattle from '../../assets/images/seattle.jpg'
import pink from '@material-ui/core/colors/pink';
import Avatar from '@material-ui/core/Avatar';
import Marker from './marker.jsx';
import AlternateListing from './AlternateListing.jsx'
import SearchButtons from './SearchButtons.jsx'
var axios = require('axios');

const styles = theme => ({
  card: {
    display: 'flex',
    paddingBottom: 5
  },
  cards: {
    flex: 1,
    flexDirection: 'column'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardContainer : {
    flex: 0,
    padding: 5
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  divContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor:'rgba(0,0,0,0.08)'
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
  hotelMap: {
    paddingBottom: 5,
    flex: 1,
  },
  hotelName: {
    color: '#009090',
    fontWeight: 'bold'
  },
  largeContainer : {
    display:'flex',
  },
  leftTopBar: {
    display:'flex',
    justifyContent:'space-evenly',
    flex: 1
  },
  logo : {
    height: 75,
    width: 75
  },
  rightTopBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    flex: 1,
  },
  avatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: '#009090',
  },
  media: {
    height: 50,
    width: 50
  }
});

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class SimpleMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hotels: [],
      selectedHotel: null,
      center: {
        lat: 37.791161,
        lng: -122.416757
      },
      zoom: 14
    }
  }

  createQueryString(to, from, guests) {
    let queryString = "?"
    if(to) queryString += ("to=" + to + "&")
    if(from) queryString += ("from=" + from + "&")
    if(guests) queryString += ("guests=" + guests)

    return queryString
  }

  setCityData() {
    axios.get('/api/cities')
    .then(res => {
      if(res.data.success){
        console.log("HERE")
        let cityData = res.data.cities.filter((city) => (city.name === this.props.city))[0]
        console.log(cityData)
        this.setState({
          center: {
            lat: cityData.map.lat,
            lng: cityData.map.long
          },
          zoom: cityData.zoom
        })
      }
      console.log("error")
    })
    .catch(err => {
      console.log(err)}
    )
  }

  getHotels() {

    let queryString = (this.props.city.replace(' ', '+') + this.createQueryString(this.props.to, this.props.from, this.props.guests))
    axios.get('/api/search/'+ this.props.city.replace(' ', '+') + this.createQueryString(this.props.to, this.props.from, this.props.guests))
    .then(res => {
      let hotels = res.data.hotels;
      this.setState({
        hotels: hotels
      })
      return hotels
    })
    .catch(err => {
      console.log(err)}
    )
  }

  addSelectedHotel(selected) {
    let selectedHotels = this.state.selectedHotels

    this.setState({
      selectedHotel: selected
    })
  }

  componentWillMount() {
    this.setCityData();
  }

  componentDidMount() {
    this.props.updateAppBarStyle({height: 60, backgroundColor: '#009090'});
    this.getHotels();
  }

  render() {
    const classes = this.props.classStyle
    return (
      <div className={classes.divContainer}>
        <br />
        <SearchButtons updateCity={(val) => this.props.updateCity(val)} getHotels={() => this.getHotels()}
        updateTo={(val) => this.props.updateTo(val)} updateFrom={(val) => this.props.updateFrom(val)}
        updateGuests={(val) => this.props.updateGuests(val)} setCityData={() => this.forceUpdate()}/>
        <br />
        <div className={classes.largeContainer}>
          <div className={classes.cards}>
            <Paper style={{maxHeight: window.innerHeight, overflow:'auto', backgroundColor:'rgba(0,0,0,0.08)'}}>
              <GridList cellHeight={'auto'} className={classes.gridList} cols={1}>
                {
                  this.state.selectedHotel ?
                  <div>
                    <GridListTile key={2}>
                      <AlternateListing to={this.props.to} from={this.props.from} classes={classes} hotel={this.state.selectedHotel}/>
                    </GridListTile>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                      <Button style={{backgroundColor: '#009090', color: '#fff'}} onClick={() => this.setState({selectedHotel: null})}>
                        Reset
                      </Button>
                    </div>
                  </div>
                   : this.state.hotels.map((hotel) => (
                     <GridListTile key={hotel.name}>
                       <AlternateListing to={this.props.to} from={this.props.from} classes={classes} hotel={hotel}/>
                     </GridListTile>
                  ))
                }
              </GridList>
            </Paper>
        </div>
        <div style={{flex:2}}>
          <div style={{ height: '100vh', width: '100%'}}>
            <GoogleMapReact
              bootstrapURLKeys={{key: 'Google Map Key Here'}}
              defaultCenter={this.state.center}
              defaultZoom={this.state.zoom}
            >
              {
                this.state.hotels.map((hotel) => (
                  <Marker
                    id={hotel._id}
                    text={hotel.name}
                    lat={hotel.location.lat}
                    lng={hotel.location.long}
                    price={hotel.listings.length}
                    hotel={hotel}
                    addSelectedHotel={(val) => this.addSelectedHotel(val)}
                    selectedHotel={this.state.selectedHotel}
                  />
                ))
              }
            </GoogleMapReact>
        </div>
      </div>
      </div>
    </div>
    );
  }
}

function ListingsPage(props) {
  const { classes, theme } = props;

  const fadeImages = [
  sanfrancisco,
  chicago,
  newyork,
  seattle
  ];

  const fadeProperties = {
  duration: 5000,
  transitionDuration: 500,
  infinite: true,
  indicators: true
  }

  console.log("ListingsPage: " + props)
  console.log(props)

  return (
    <div style={{backgroundColor:'rgba(0,0,0,0.08)'}}>
      <SimpleMap updateAppBarStyle={props.updateAppBarStyle} city={props.city} from={props.from}
        to={props.to} guests={props.guests} classStyle = {classes} className={classes.hotelMap}
        updateCity={(val) => props.updateCity(val)} updateTo={(val) => props.updateTo(val)}
         updateFrom={(val) => props.updateFrom(val)} updateGuests={(val) => props.updateGuests(val)}
         updateForce={() => props.updateForce()}
       />
    </div>
  );
}

ListingsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(ListingsPage);
