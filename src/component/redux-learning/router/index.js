import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import Counter from '../counter/couter'

const ReduxRouter = ({match}) => (
  <Router>
    <div>
      <ul><Link to={`${match.url}/counter`}>Counter</Link></ul>
      <Route path={`${match.url}/counter`} component={Counter}/>
    </div>
  </Router>

)


export default ReduxRouter