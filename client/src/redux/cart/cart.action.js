import CART_TYPES from "./cart.types";

export const addPlanet = (planet) => ({
  type: CART_TYPES.ADD_PLANET,
  payload: planet,
});

export const addStarship = (starship) => ({
  type: CART_TYPES.ADD_STARSHIP,
  payload: starship,
});

export const removePlanet = () => ({
  type: CART_TYPES.REMOVE_PLANET,
});

export const removeStarship = () => ({
  type: CART_TYPES.REMOVE_STARSHIP,
});

export const updateDepartureDate = (date) => ({
  type: CART_TYPES.UPDATE_DEPARTURE_DATE,
  payload: date,
});

export const updatePerson = (numOfPerson) => ({
  type: CART_TYPES.UPDATE_PERSON,
  payload: numOfPerson,
});

export const toggleCartPopup = () => ({
  type: CART_TYPES.TOGGLE_CARTPOPUP,
});

export const refreshCartPopupPlanet = () => ({
  type: CART_TYPES.REFRESH_CARTPOPUP_PLANET,
});
export const refreshCartPopupStarship = () => ({
  type: CART_TYPES.REFRESH_CARTPOPUP_STARSHIP,
});

export const checkoutSessionStart = (checkoutInfo) => ({
  type: CART_TYPES.CHECKOUT_SESSION_START,
  payload: checkoutInfo,
});

export const checkoutSessionSuccess = () => ({
  type: CART_TYPES.CHECKOUT_SESSION_SUCCESS,
});

export const checkoutSessionFail = (err) => ({
  type: CART_TYPES.CHECKOUT_SESSION_FAIL,
  payload: err,
});
