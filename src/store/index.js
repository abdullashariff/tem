import { createStore } from 'redux'
import combineReducers from './../reducers'
export const store = createStore(combineReducers)