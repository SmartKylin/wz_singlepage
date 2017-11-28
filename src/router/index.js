import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import classNames from 'classnames'
import App from '../app/App'


const RouterMap = () => (
  <Router>
    <div className='playground'>
      <Route exact path="/" component={App}/>
    </div>
  </Router>
)

/*const MenuLink = ({label, to, exact}) => (
  <Route  path={to} exact={exact} children={({match}) => (
    <li className={classNames('col-md-3', {active: match})}>
      <Link to={to} style={{textAlign: 'center'}}>{label}</Link>
    </li>
  )}/>
)*/

export default RouterMap