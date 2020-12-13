import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class ScrollDialog extends React.Component {
  state = {
    open: false,
    scroll: 'paper',
  };

  handleClickOpen = scroll => () => {
    this.setState({ open: true, scroll });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const classes = this.props.classes
    const hotel = this.props.hotel

    return (
      <div>
        <Button onClick={this.handleClickOpen('paper')}>scroll=paper</Button>
        <Button onClick={this.handleClickOpen('body')}>scroll=body</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
          <DialogContent>
            <Typography className={classes.hotelName} variant="headline">{hotel.name}</Typography>
            <Typography variant="subheading">
              {hotel.rating}/10
            </Typography>
            <Typography variant="subheading">
              Great location in the center of the financial district.
            </Typography>
            <div>
              <ul>
                <li>
                  <Button style={{color:'#008081'}}>
                    Price: ${listing.price} From: {listing.from} To: {listing.to}
                  </Button>
                </li>
              </ul>
            </div>
            <div className={classes.controls}>
              <Button size="small" color="primary">
                from {hotel.rating}
              </Button>
          </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Go Back
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default ScrollDialog;
