import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="checkout">
        <p>Would you like to complete the booking?</p>
        <CardElement />
        <button onClick={() => this.props.book()}>Book</button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
