import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';
import { Drawer, List, NavBar } from 'antd-mobile';
import { Icon } from 'antd';

class MobileMenu extends Component {
    constructor(props){
      super(props);
      let _split = props.location.pathname.split('/');
      document.title = `ESPN Fantasy Tools - ${_split[1] || 'login'}`;
      this.state = {
        selectedMenuItem: _split[_split.length-1] || 'login',
        open: false
      }
    }

    handleNavItemClick = (val) =>{
      this.setState({
        open: !this.state.open
      });
      this.props.history.push(`/${val.toLowerCase()}`)
    }

    onOpenChange = (...args) => {
      this.setState({ 
        open: !this.state.open 
      });
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.location.pathname && this.props.location.pathname !== prevProps.location.pathname){
            let _split = this.props.location.pathname.split('/');
            document.title = `ESPN Fantasy Tools - ${_split[1] || 'login'}`;
        }
    }

    render() {
      const _data = [
        {
          name: 'Private League Settings',
          route: 'login',
          icon: <Icon type="user-delete" />
        },
        {
          name: 'Report Card',
          route: 'report',
          icon: <Icon type="dashboard" />
        }
      ];

      const sidebar = (
        <List>
          {_data.map((val, index) => {
            return (
              <List.Item key={index} onClick={(e)=>{this.handleNavItemClick(val.route)}}
                thumb={val.icon}
              >
                {val.name}
              </List.Item>)
          })}
      </List>);

      return (
        <div>
          <NavBar style={{height: '50px', backgroundColor: '#001529', color: '#64da55'}} icon={<Icon type="menu" />} onLeftClick={this.onOpenChange}>ESPN Fantasy Tools</NavBar>
          <Drawer
            className="mobile-menu-drawer"
            style={{ minHeight: document.documentElement.clientHeight, top: '50px' }}
            enableDragHandle
            contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
            sidebar={sidebar}
            open={this.state.open}
            onOpenChange={this.onOpenChange}
          >
            <span></span>
          </Drawer>
        </div>
      );
    }
 }
 
 export default withRouter(MobileMenu);
 