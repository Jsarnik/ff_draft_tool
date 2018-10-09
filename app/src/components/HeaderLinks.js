import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import * as _ from 'lodash';

class HeaderLinks extends Component {

   render() {
    if(_.isEmpty(this.props.leagueName)){
      return null;
    }

    return(
      <div className="header-bar">
        <div className="header-links flex-container">
          <div className="flex-item">
              <a href={`/${this.props.leagueName}/draft`}>Draft Board</a>
          </div>
          <div className="flex-item">
            <a href={`/${this.props.leagueName}/teams`}>Manage Teams</a>
          </div>
          <div className="flex-item">
          <a href={`/${this.props.leagueName}/data`}>Manage Data</a>
          </div>
        </div>
      </div>
    )
  }
 }

export default withRouter(HeaderLinks);
