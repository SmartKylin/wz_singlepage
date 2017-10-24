import {createStore} from 'redux'

export const getStore = reducer => {
  return createStore(reducer)
}