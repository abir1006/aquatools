import {createStore, compose, applyMiddleware} from "redux";
import rootReducer from "./Reducers/rootReducer";
import thunk from "redux-thunk";
import {loadState} from "./localStorage";

const persistedState = loadState();

const middleware = [thunk];

const store = createStore(rootReducer, persistedState, compose(
    applyMiddleware(...middleware),

));

export default store;
