import UserTypes from "./user.types";

const INITIAL_STATE = {
  currentUser: null,
  error: null,
  response: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserTypes.SIGN_IN_SUCCESS:
    case UserTypes.SIGN_UP_SUCCESS:
      return {
        ...state,
        currentUser: action.payload,
        error: null,
      };

    case UserTypes.FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        response: action.payload,
      };

    case UserTypes.SIGN_IN_FAIL:
    case UserTypes.SIGN_UP_FAIL:
    case UserTypes.FORGOT_PASSWORD_FAIL:
      return {
        ...state,
        error: action.payload.response.data,
      };

    case UserTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default userReducer;
