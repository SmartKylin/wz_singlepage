import React, {Component} from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import classNames from 'classnames'
import App from '../app/App'
import MyRedux from '../component/redux-learning/router/index'
import MyReactRouter from '../component/react-router-example/router'

const RouterMap = () => (
  <Router>
    <div className='playground'>
      <ul className={classNames('nav', 'nav-tabs')}>
        <MenuLink label={"home"} to={"/"} exact={true}/>
        <MenuLink label={"redux"} to={"/redux"}/>
        <MenuLink label={"react-router"} to={"/react-router"}/>
      </ul>
      <Route exact path="/" component={App}/>
      <Route path="/redux" component={MyRedux}/>
      <Route path="/react-router" component={MyReactRouter}/>
    </div>
  </Router>
)

const MenuLink = ({label, to, exact}) => (
  <Route  path={to} exact={exact} children={({match}) => (
    <li className={classNames('col-md-3', {active: match})}>
      <Link to={to} style={{textAlign: 'center'}}>{label}</Link>
    </li>
  )}/>
)

export default RouterMap