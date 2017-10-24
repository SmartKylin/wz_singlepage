import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'


import App from '../app/App'
import Counter from '../component/redux-learning/counter/couter'
export default class RouterMap extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path="/" component={App}/>
            <Route path="/counter" component={Counter}/>
          </Switch>
        </Router>
      </div>
    )
  }
}