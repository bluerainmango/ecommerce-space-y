import React from "react";
import { connect } from "react-redux";

import Button from "../button/button.component";

import "./checkoutPrice.styles.scss";

// import { loadStripe } from "@stripe/stripe-js";
// const stripePromise = loadStripe(`${process.env.STRIPE_PUBLICK_KEY}`);

const CheckoutPrice = ({ cart, numOfPerson }) => {
  const handleClick = (e) => {
    e.preventDefault();

    // console.log("🙈 clicked");
  };

  return (
    <div className="checkout__price">
      <div className="price__detail">
        <h2>Cost per person</h2>
        <div className="price__detail--planet">
          <h3>Planet Entrance Fee</h3>
          <span>{cart.planet?.price ? `$${cart.planet.price}` : "-"}</span>
        </div>
        <div className="price__detail--starship">
          <h3>Starship Rental</h3>
          <span>{cart.starship?.price ? `$${cart.starship.price}` : "-"}</span>
        </div>
      </div>
      <div className="price__travelers">
        <h2>Number of travelers</h2>
        {/* {console.log("🐥", numOfPerson, cart)} */}
        <span>x{numOfPerson}</span>
      </div>
      <div className="price__date">
        <h2>Depareture Date</h2>
        <span>{cart.departureDate?.replaceAll("--", "/")}</span>
      </div>
      <div className="price__total">
        <h2>Total</h2>
        <span>${cart.totalPrice}</span>
      </div>
      <Button
        onClick={handleClick}
        content={[
          {
            text: "Proceed to purchase",
            type: "checkout",
          },
        ]}
        style={{
          width: "100%",
          // "--bg-color": "rgb(255, 72, 0)",
        }}
        // style={{ width: "100%", backgroundColor: "rgb(0, 81, 255)" }}
      />

      <div className="cardInfo">
        For your test of payment, please input the following card info on the
        next page.
        <ul>
          <li>Number:4242 4242 4242 4242</li>
          <li>CVC: any 3 digits</li>
          <li>Date: Any future date</li>
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  numOfPerson: state.cart.numOfPerson,
});

export default connect(mapStateToProps)(CheckoutPrice);
