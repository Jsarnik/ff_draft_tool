import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as _ from 'lodash';
import * as espnActions from '../actions/espnActions';
import { Alert } from 'antd';

class CookiesAlertBar extends Component {
    render() {
      const _isCookiesSet = this.props.user && !_.isEmpty(this.props.user.cookies),
      league =  this.props.user.espnUser ? _.find(this.props.user.espnUser.leaguesModel, {'value': parseInt(this.props.user.cookies.leagueId)}) || {} : {};

      return (
        <div style={{marginTop:10, marginBottom: 10}}>
          {
            _isCookiesSet ? 
              <Alert message={`You are successfully logged in as "${league.label || 'no league found'}"`} type='success' showIcon />
            :
              <Alert message={`You must enter some info to connect your private league, please follow the steps on the Private League Settings page.`} type='warning' showIcon />
          }
        </div>
      )
    }
 }
 
 function mapStateToProps(state, ownProps){
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch){
 return {
   espnActions: bindActionCreators(espnActions, dispatch)
 };
}

export default connect(mapStateToProps, mapDispatchToProps)(CookiesAlertBar);
 