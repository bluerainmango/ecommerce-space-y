import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import {
  updateDepartureDate,
  updatePerson,
} from "../../redux/cart/cart.action";

import { formattedDate } from "../../util/util";

import "./checkoutDatePerson.styles.scss";

const CheckoutDatePerson = (props) => {
  const {
    departureDate,
    numOfPerson,
    updateDepartureDate,
    updatePerson,
  } = props;

  const [reservationInfo, setReservationInfo] = useState({
    departureDate: departureDate,
    numOfPerson: numOfPerson,
  });

  useEffect(() => {
    if (!reservationInfo.departureDate) return;

    updateDepartureDate(reservationInfo.departureDate);
  }, [reservationInfo.departureDate, updatePerson, updateDepartureDate]);

  useEffect(() => {
    if (!reservationInfo.numOfPerson) return;
    updatePerson(reservationInfo.numOfPerson * 1);
  }, [reservationInfo.numOfPerson, updatePerson, updateDepartureDate]);

  const handleChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    // console.log(
    //   "🐱 2",
    //   name,
    //   value,
    //   valueAsNumber,
    //   new Date(valueAsNumber),
    //   formattedDate(new Date(valueAsNumber))
    // );

    // date: yyyy-mm-dd
    setReservationInfo({
      ...reservationInfo,
      [name]: value,
    });
  };

  return (
    <div className="checkout__date-person">
      <form className="checkout__form">
        <div className="input-group">
          <label htmlFor="date">Departure Date</label>

          <input
            id="date"
            name="departureDate"
            type="date"
            value={reservationInfo.departureDate}
            // min={formattedDate()}
            min={formattedDate(new Date(Date.now() + 3600 * 1000 * 24))}
            max={formattedDate(new Date(Date.now() + 3600 * 1000 * 24 * 60))}
            onChange={handleChange}
            className="checkout__date"
            placeholder="mm/dd/yyyy"
          />
          <span
            className="checkout__date-validity"
            style={{
              color: reservationInfo.departureDate === "" ? "black" : "white",
            }}
          />
        </div>

        <div className="input-group">
          <label htmlFor="numOfPerson">Number of Travelers</label>
          <input
            id="numOfPerson"
            name="numOfPerson"
            type="number"
            min="1"
            max="10"
            value={reservationInfo.numOfPerson}
            onChange={handleChange}
            className="checkout__person"
          ></input>
        </div>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  departureDate: state.cart.departureDate,
  numOfPerson: state.cart.numOfPerson,
});

const mapDispatchToProps = (dispatch) => ({
  updateDepartureDate: (date) => dispatch(updateDepartureDate(date)),
  updatePerson: (numOfPerson) => dispatch(updatePerson(numOfPerson)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutDatePerson);
