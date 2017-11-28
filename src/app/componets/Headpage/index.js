import React from 'react';
// import dahuiYihceng from '../../images/dahuiyicheng.png'
import './index.scss';
// import { Link } from 'react-router-dom';

export default class HeaderPage extends React.Component {
  render() {
    let { name, enName, addr, link } = this.props;
    // console.log(name,"12312");
    return (
      <div className="HeaderPageBoxBox">
        <div className="HeaderzPageBox">
          <div
            className={
              name == '大数据&人工智能专场 (23日)' ||
              name == '大数据&人工智能专场 (24日)'
                ? 'HeaderPageBox-bgA'
                : 'HeaderPageBox-bg'
            }
          >
            {name}
          </div>
          <div className="HeaderPageYXbox">{enName}</div>
          <div className="HeaderPageBoxDz">
            <i
              className="iconfont icon-positioning"
              style={{ color: '#30508e', marginRight: '3px', fontSize: '18px' }}
            />
            {addr}
          </div>
          <a className="header-down-btn" href={link}>
            <i className="iconfont icon-down"/>
            &nbsp;批量下载
          </a>
        </div>
      </div>
    );
  }
}
