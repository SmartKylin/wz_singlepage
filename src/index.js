import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.scss';
// import App from './app/App';
import RouterMap from './router'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
// import {getStore} from "./component/redux-learning/counter/store";
import reducer from './component/redux-learning/counter/reducer'

ReactDOM.render(
  <Provider store={createStore(reducer)}>
    <RouterMap/>
  </Provider>,
document.getElementById('root'));
