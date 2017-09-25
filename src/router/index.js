import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'



export default class RouterMap extends Component {
  render() {
    return (
    <div>
      <Router>
        <Switch>
          {/*<Route exact path="/" component={App}/>*/}
        </Switch>
      </Router>
    </div>
    )
  }
}