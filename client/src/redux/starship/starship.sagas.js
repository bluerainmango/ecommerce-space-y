import axios from "axios";
import { takeLatest, call, all, put } from "redux-saga/effects";

import StarshipTypes from "./starship.types";
import {
  fetchStarshipsSuccess,
  fetchStarshipsFail,
  loadDefaultActiveStarship,
} from "./starship.actions";

function* fetchStarshipsAsync() {
  try {
    const res = yield axios(`/api/v1/starships`);

    const starships = res.data.data;
    // console.log("👻 starships:", starships);

    yield put(fetchStarshipsSuccess(starships));
    yield put(loadDefaultActiveStarship(starships[0]));
  } catch (err) {
    yield put(fetchStarshipsFail(err));
  }
}

function* onFetchStarshipsStart() {
  yield takeLatest(StarshipTypes.FETCH_STARSHIPS_START, fetchStarshipsAsync);
}

export default function* starshipSaga() {
  yield all([call(onFetchStarshipsStart)]);
}
