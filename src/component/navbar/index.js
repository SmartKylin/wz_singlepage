import React,{Component} from 'react'
import {Link} from 'react-router-dom'

import IconTentacle from '../../images/trust-gray.svg'
import IconTentacleSelected from '../../images/trust-blue.svg'
import IconClue from '../../images/attachment-gray.svg'
import IconClueSelected from '../../images/attachment-blue.svg'
import IconMine from '../../images/personal-center-gray.svg'
import IconMineSelected from '../../images/personal-center-blue.svg'

import './index.scss'

export default class extends Component{
  constructor() {
    super();
    this.state = {
      tab: 0
    }
  }
  render () {
    return (
    <ul className="footer--nav">
      <li className="footer-item" onClick={e => this.setState({tab: 0})}>
        <Link to="/tentacle">
          <img src={this.state.tab === 0 ? IconTentacleSelected : IconTentacle} alt=""/>
          <span className={this.state.tab === 0 ? 'active' : ''}>触点</span>
        </Link>
      </li>
      <li className="footer-item" onClick={e => this.setState({tab: 1})}>
        <Link to="/clue">
          <img src={this.state.tab === 1 ? IconClueSelected : IconClue} alt=""/>
          <span className={this.state.tab === 1 ? 'active' : ''}>线索</span>
        </Link>
      </li>
      <li className="footer-item" onClick={e => this.setState({tab: 2})}>
        <Link to="/mine">
          <img src={this.state.tab === 2 ? IconMineSelected : IconMine} alt=""/>
          <span className={this.state.tab === 2 ? 'active' : ''}>我的</span>
        </Link>
      </li>
    </ul>
    )
  }
}