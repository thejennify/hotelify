import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Popper from '@material-ui/core/Popper';
import InputAdornment from '@material-ui/core/InputAdornment';
import { DateRange, People, LocationCity} from '@material-ui/icons/';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  typography: {
    padding: theme.spacing.unit * 2,
  },
});

class SearchButtons extends React.Component {
  constructor(props){
    console.log(props)
    super(props)
    this.state = {
      anchorEl : null,
      cityFill : false,
      openCity : false,
      updatedCity: null,
      dateFill : false,
      openDates : false,
      updatedTo: null,
      updatedFrom: null,
      guestsFill : false,
      openGuests : false,
      updatedGuests: null
    }
  }

  handleClick(event, btn) {
   const { currentTarget } = event;
   switch (btn) {
     case 'openGuests':
       this.setState({
         anchorEl: currentTarget,
         openGuests: !this.state.openGuests,
         openCity: false,
         openDates : false
       });
       break;
     case 'openDates':
       this.setState({
         anchorEl: currentTarget,
         openDates: !this.state.openDates,
         openCity: false,
         openGuests: false
       });
       break;
     default:
     this.setState({
       anchorEl: currentTarget,
       openCity: !this.state.openCity,
       openGuests: false,
       openDates: false
     });
   }
 };

  updateHotels(getHotels) {
    let state = this.state
    let city;
    let todo;
    let from ;
    let guests;

    if(state.updatedCity) city = this.props.updateCity(state.updatedCity)
    if(state.updatedTo) to = this.props.updateTo(state.updatedTo)
    if(state.updatedFrom) from = this.props.updateFrom(state.updatedFrom)
    if(state.updatedGuests) guests = this.props.updateGuests(state.updatedGuests)

    Promise.all(city, todo, from, guests)
    .then(() => {
      this.props.setCityData()
      getHotels()})

    this.setState({
      updatedTo: null,
      updatedFrom: null,
      updatedCity: null,
      updatedGuests: null,
      openCity: false,
      openDates: false,
      openGuests: false,
    })
  }

  render() {
    const { classes } = this.props;
    const anchorEl = this.state.anchorEl;
    const openCity = this.state.openCity
    const idCity = openCity ? 'simple-popper' : null;
    const openDates = this.state.openDates
    const idDates = openDates ? 'simple-popper' : null;
    const openGuests = this.state.openGuests
    const idGuests = openGuests ? 'simple-popper' : null;

    return (
      <div style={{display: 'flex'}}>
        <div style={{display: 'flex', justifyContent:'space-evenly', flex: 1}}>
          <Button style={{color:'#009090', padding: '10px'}} variant={this.state.cityFill ? "contained": "outlined"}
            onMouseOver={() => (this.setState({cityFill : true}))} onMouseLeave={() => (this.setState({cityFill : false}))}
            onClick={(e) => this.handleClick(e, 'openCity')}>
            City
          </Button>
          <Popper id={idCity} open={openCity} anchorEl={anchorEl} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <TextField
                    label="City"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCity />
                        </InputAdornment>
                      ),
                    }}
                    type="text"
                    style={{width: "50%", margin: 2}}
                    onChange={((e) => this.setState({updatedCity: e.target.value}))}
                  />
                  <Button variant="contained" onClick={() => this.updateHotels(this.props.getHotels)} style={{margin: 20, backgroundColor: "orange", color: "white"}}>
                    Update
                  </Button>
                </Paper>
              </Fade>
            )}
          </Popper>
          <Button style={{color:'#009090', padding: '10px'}} variant={this.state.dateFill ? "contained": "outlined"}
            onMouseOver={() => (this.setState({dateFill : true}))} onMouseLeave={() => (this.setState({dateFill : false}))}
            onClick={(e) => this.handleClick(e, 'openDates')}>
            Dates
          </Button>
          <Popper id={idDates} open={openDates} anchorEl={anchorEl} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <TextField
                    label="From"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRange />
                        </InputAdornment>
                      ),
                    }}
                    type="date"
                    style={{width: "50%", margin: 2}}
                    onChange={(e) => this.setState({updatedFrom: e.target.value})}
                  />
                  <TextField
                    label="To"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRange />
                        </InputAdornment>
                      ),
                    }}
                    type="date"
                    style={{width: "50%", margin: 2}}
                    onChange={(e) => this.setState({updatedTo: e.target.value})}
                  />
                  <Button variant="contained" onClick={() => this.updateHotels()} style={{margin: 20, backgroundColor: "orange", color: "white"}}>
                    Update
                  </Button>
                </Paper>
              </Fade>
            )}
          </Popper>
          <Button style={{color:'#009090', padding: '10px'}} variant={this.state.guestsFill ? "contained": "outlined"}
            onMouseOver={() => (this.setState({guestsFill : true}))} onMouseLeave={() => (this.setState({guestsFill : false}))}
            onClick={(e) => this.handleClick(e, 'openGuests')}>
            Guests
          </Button>
          <Popper id={idGuests} open={openGuests} anchorEl={anchorEl} transition>
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper>
                  <TextField
                    label="Guests"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <People />
                        </InputAdornment>
                      ),
                    }}
                    type="number"
                    style={{width: "50%", margin: 2}}
                    onChange={(e) => this.setState({updatedGuests: e.target.value})}
                  />
                  <Button variant="contained" onClick={() => this.updateHotels()} style={{margin: 20, backgroundColor: "orange", color: "white"}}>
                    Update
                  </Button>
                </Paper>
              </Fade>
            )}
          </Popper>
        </div>
        <div style={{flex:2}}>
        </div>
      </div>
    )
  }
}

SearchButtons.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchButtons);
