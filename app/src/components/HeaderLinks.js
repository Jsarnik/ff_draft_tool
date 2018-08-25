import React, { Component } from 'react';

class HeaderLinks extends Component {
  constructor(props) {
    super(props);
  }

   render() {
      if(!this.props.league){
        return null;
      }

     return(
        <div className="header-bar">
          <div className="header-links flex-container">
            <div className="flex-item">
                <a href={`/${this.props.league}/draft`}>Draft Board</a>
            </div>
            <div className="flex-item">
              <a href={`/${this.props.league}/teams`}>Manage Teams</a>
            </div>
            <div className="flex-item">
              <a href={`/${this.props.league}/upload`}>Manage Data</a>
            </div>
          </div>
        </div>
     )
   }
 }

export default HeaderLinks;
