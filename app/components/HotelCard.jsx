import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

export default class HotelCard extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      expanded: false
    }
  }

  render() {
    const classes = this.props.classes
    const hotel = this.props.hotel
    return (
      <div className={classes.cardContainer}>
        <Card className={classes.card}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography className={classes.hotelName} variant="headline">{hotel.name}</Typography>
              <Typography variant="subheading">
                {hotel.rating}/10
              </Typography>
              <Typography variant="subheading">
                Great location in the center of the financial district.
              </Typography>
            </CardContent>
              {
                this.state.expanded ? (
                  <div>
                    <ul>
                    {hotel.listings.map((listing) => (
                      <li>
                        <Button style={{color:'#008081'}}>
                          Price: ${listing.price} From: {listing.from} To: {listing.to}
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <Button style={{backgroundColor: '#008081', color: '#fff'}} onClick={() => this.setState({expanded: false})}>
                    Collapse
                  </Button>
                </div>
              ) : (
                <div className={classes.controls}>
                  <Button size="small" color="primary">
                    from {hotel.rating}
                  </Button>
                  <Button style={{backgroundColor: '#008081', color: '#fff'}} onClick={() => this.setState({expanded: true})}>
                    Expand
                  </Button>
                </div>
              )
              }
          </div>
          <div className={classes.cover}>
            <img className={classes.carousel} src = {hotel.images[0]}/>
          </div>
        </Card>
      </div>
    )
  }
}
