import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import planetReducer from "./planet/planet.reducer";
import slideReducer from "./slide/slide.reducer";
import starshipReducer from "./starship/starship.reducer";
import pageReducer from "./page/page.reducer";
import userReducer from "./user/user.reducer";
import cartReducer from "./cart/cart.reducer";
import bookingReducer from "./booking/booking.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["users"],
  // blacklist: ["cart"],
};

//! Nested persists(persisting cart except "toggleCartPopup" inside)
const cartPersistConfig = {
  key: "cart",
  storage,
  blacklist: ["toggleCartPopup", "refreshCartPopup"],
};

const rootReducer = combineReducers({
  planets: planetReducer,
  slides: slideReducer,
  starships: starshipReducer,
  pages: pageReducer,
  users: userReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  bookings: bookingReducer,
});

export default persistReducer(persistConfig, rootReducer);
