import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { Menu, Layout, Icon } from 'antd';

const { Header } = Layout;

class Navigation extends Component {
    constructor(props){
      super(props);
      let _split = props.location.pathname.split('/');
      this.state = {
        selectedMenuItem: _split[1] || 'login'
      }
    }

    handleNavItemClick = (location) =>{
      this.props.history.push(`/${location}`);
    }

    componentDidUpdate = (prevProps) => {
      if(this.props.location.pathname && this.props.location.pathname !== prevProps.location.pathname){
        let _split = this.props.location.pathname.split('/');
        document.title = `ESPN Fantasy Tools - ${_split[1] || 'login'}`;
      }
    }

    render() {
      const selectedKeys = this.props.location.pathname.split('/')[1];
      return(
        <Header style={{ position: 'fixed', zIndex: 100, width: '100%', height: '30px' }}>
          <div className="logo" style={{height: '30px', fontSize: '120%', margin: 0, background: 'none', width: '300px', float: 'left', 'lineHeight': '30px', color: '#64da55'}}>ESPN Fantasy Tool</div>
          <Menu
              selectedKeys={[selectedKeys]}
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[this.state.selectedMenuItem]}
              style={{ lineHeight: '30px' }}
            >
            <Menu.Item style={{ float: 'right'}}  key="login" onClick={()=>{this.handleNavItemClick('login')}}><span><Icon type="user" theme="twoTone" twoToneColor="orange" />Private League Settings</span></Menu.Item>
            <Menu.Item style={{ float: 'right'}}  key="report" onClick={()=>{this.handleNavItemClick('report')}}><span><Icon type="ordered-list" theme="twoTone" twoToneColor="orange" />Report Cards</span></Menu.Item>
            {/*<Menu.Item style={{ float: 'right'}}  key="members" onClick={()=>{this.handleNavItemClick('draft')}}><span><Icon type="fund" theme="twoTone" twoToneColor="orange" />Draft Tool</span></Menu.Item>*/}
          </Menu>
        </Header>
      )
    }
 }
 
 export default withRouter(Navigation);
 