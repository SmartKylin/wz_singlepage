import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Basic from '../basic'
import classNames from 'classnames'

const ReactRouterRouter = ({match}) => (
  <Router>
    <div>
      <ul className={classNames('nav', 'nav-pills')} >
        <MenuLink to={`${match.url}/basic`} label="Basic"/>
      </ul>
      <Route path={`${match.url}/basic`} component={Basic}/>
    </div>
  </Router>

)

const MenuLink = ({label, to, exact}) => (
  <Route path={to} exact={exact} children={({match}) => (
    <li className={classNames('col-md-2', {active: match})}>
      <Link to={to}>{label}</Link>
    </li>
  )}/>
)

export default ReactRouterRouter