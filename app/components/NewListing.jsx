import React from 'react';
import axios from 'axios';
import green from '@material-ui/core/colors/green';
import { TextField, Button, Radio, RadioGroup, FormControl, FormControlLabel, Select, MenuItem, InputLabel, InputAdornment, Snackbar, SnackbarContent, IconButton } from '@material-ui/core/';
import { DateRange, Group, AttachMoney, VpnKey, CheckCircle, Close, Error } from '@material-ui/icons/';

const classes = theme => ({
  bootstrapRoot: {
    padding: 0,
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },
});

export default class NewListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '',
      hotel: '',
      room: '',
      guests: '',
      from: '',
      to: '',
      price: 0,
      info: '',
      hotelDoc: {},
      cityHotels: [],
      openSuccessModal: false,
      openFailModal: false,
    }
  }
  componentDidMount() {
    this.props.updateAppBarStyle({height: 60, background: "#009090"});
  }

  getCityHotels(e) {
    this.setState({city: e.target.value});
    axios.get(`/api/hotels/${e.target.value.replace(' ', '+')}`)
    .then(res => this.setState({cityHotels: res.data.hotels}));
  }

  submitListing() {
    axios.post('/api/list', this.state)
    .then(res => {
      if(res.data.success){
        this.setState({openSuccessModal: true})
      } else {
        this.setState({openFailModal: true})
      }
    })
  }

  snackSuccessClose() {
    this.setState({openSuccessModal: false})
  }
  snackFailClose() {
    this.setState({openFailModal: false})
  }

  render() {
    return (
      <div className="new-listing-container">
        <div className="new-listing-box">
          <FormControl style={{width: "100%", minWidth: 200}}>
            <InputLabel>Where are you going?</InputLabel>
            <Select value={this.state.city} onChange={(e) => this.getCityHotels(e)}>
              <MenuItem value="San Francisco">San Francisco</MenuItem>
              <MenuItem value="Chicago">Chicago</MenuItem>
              <MenuItem value="Seattle">Seattle</MenuItem>
            </Select>
          </FormControl>
          {this.state.cityHotels.length ?
            (<div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <FormControl  style={{width: "100%"}}>
              <InputLabel>Hotel</InputLabel>
              <Select value={this.state.hotelDoc} onChange={(e) => this.setState({hotelDoc: e.target.value, hotel: e.target.value._id})}>
                {this.state.cityHotels.map(hotelDoc => <MenuItem value={hotelDoc}>{hotelDoc.name}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="Guests"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Group />
                  </InputAdornment>
                ),
              }}
              type="number"
              style={{width: "100%"}}
              onChange={(e) => this.setState({guests: e.target.value})}
            />
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
              style={{width: "100%"}}
              onChange={(e) => this.setState({from: e.target.value})}
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
              style={{width: "100%"}}
              onChange={(e) => this.setState({to: e.target.value})}
            />
            <TextField
              label="Price for 1 night"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney />
                  </InputAdornment>
                ),
              }}
              type="number"
              style={{width: "100%"}}
              onChange={(e) => this.setState({price: e.target.value})}
            />
            <TextField
              label="Room Type"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey />
                  </InputAdornment>
                ),
              }}
              type="text"
              style={{width: "100%"}}
              onChange={(e) => this.setState({room: e.target.value})}
            />
            <TextField
              style={{width:'100%'}}
              label="Additional information..."
              id="bootstrap-input"
              multiline='true'
              fullWidth='true'
              onChange={(e) => this.setState({info: e.target.value})}
              InputProps={{
                // disableUnderline: true,
                classes: {
                  root: classes.bootstrapRoot,
                  input: classes.bootstrapInput,
                },
              }}
              InputLabelProps={{
                shrink: true,
                className: classes.bootstrapFormLabel,
              }}
            />
            <Button variant="contained"
              onClick={() => this.submitListing()}
              style={{backgroundColor: "#009090", color: "white", marginTop: 20}}>Submit Listing</Button></div>)
            : null}
            <Snackbar
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              open={this.state.openSuccessModal}
              autoHideDuration={6000}
              onClose={() => this.snackSuccessClose()}
            >
              <SnackbarContent
                aria-describedby="client-snackbar"
                style={{backgroundColor: "#009090"}}
                message={
                  <span id="client-snackbar" style={{display: "flex", alignItems: "center"}}>
                    <CheckCircle style={{backgroundColor: "#009090", marginRight: 20}} />
                    Posted your {this.state.city} listing
                  </span>
                }
                action={[
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={() => this.snackSuccessClose()}
                  >
                    <Close />
                  </IconButton>,
                ]}
              />
            </Snackbar>
              <Snackbar
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                open={this.state.openFailModal}
                autoHideDuration={6000}
                onClose={() => this.snackFailClose()}
              >
              <SnackbarContent
                aria-describedby="client-snackbar"
                style={{backgroundColor: "#b03030"}}
                message={
                  <span id="client-snackbar" style={{display: "flex", alignItems: "center"}}>
                    <Error style={{backgroundColor: "b03030", marginRight: 20}} />
                    Could not post your {this.state.city} listing, please fill in all fields...
                  </span>
                }
                action={[
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    onClick={() => this.snackFailClose()}
                  >
                    <Close />
                  </IconButton>,
                ]}
              />
            </Snackbar>
        </div>
      </div>
    );
  }
}
