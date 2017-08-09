import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import IconTentacle from 'images/trust-gray.svg'
import IconTentacleSelected from 'images/trust-blue.svg'
import IconClue from 'images/attachment-gray.svg'
import IconClueSelected from 'images/attachment-blue.svg'
import IconMine from 'images/personal-center-gray.svg'
import IconMineSelected from 'images/personal-center-blue.svg'

import './index.scss'

let tab = 0
export default class extends Component {
  changeTabInd = ind => {
    tab = ind;
  }
  render() {
    return (
    <ul className="footer--nav" style={{display: this.props.display}}>
      <li className="footer-item" onClick={() => this.changeTabInd(0)}>
        <Link to="/tentacle">
          <img src={tab === 0 ? IconTentacleSelected : IconTentacle} alt=""/>
          <span className={tab === 0 ? 'active' : ''}>触点</span>
        </Link>
      </li>
      <li className="footer-item" onClick={() => this.changeTabInd(1)}>
        <Link to="/clue">
          <img src={tab === 1 ? IconClueSelected : IconClue} alt=""/>
          <span className={tab === 1 ? 'active' : ''}>线索</span>
        </Link>
      </li>
      <li className="footer-item" onClick={() => this.changeTabInd(2)}>
        <Link to="/mine">
          <img src={tab === 2 ? IconMineSelected : IconMine} alt=""/>
          <span className={tab === 2 ? 'active' : ''}>我的</span>
        </Link>
      </li>
    </ul>
    )
  }
}