import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import Tentacle from 'layout/tentacle'
import Clue from 'layout/clue'
import Mine from 'layout/mine'

export default class RouterMap extends Component {
  render() {
    return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Tentacle}/>
          <Route path="/tentacle" component={Tentacle}/>
          <Route path="/clue" component={Clue}/>
          <Route path="/mine" component={Mine}/>
        </Switch>
      </Router>
    </div>
    )
  }
}