import React, { Component } from 'react';
import * as _ from 'lodash';

class Roster extends Component {

    roster = () =>{
      return _.map(this.props.currentPick.roster, (spot, key)=>{
        let type = key.replace(/\d/g,'');
        if(spot){
          return (
            <div key={key} className="flex-container">
              <div className="flex-item">
                  {type.toUpperCase()}
              </div>
              <div className="flex-item">
                  {spot.name} 
              </div>
              <div className="flex-item half right">
                  {spot.bye}
              </div>
              <div className="flex-item right">
                  {spot.overall}
              </div>
            </div>
          )
        }else{
          return (
            <div key={key}  className="flex-container">
              <div className="flex-item">
                {type.toUpperCase()}
              </div>
              <div className="flex-item center">
                 -
              </div>
              <div className="flex-item half">

              </div>
              <div className="flex-item right">
                  
              </div>
            </div>
          )
        }
        
      });
    }

   render() {
     return(
       <div>
        <div className="flex-container">
          <div className="flex-item">
            {this.props.currentPick.team}
          </div>
        </div>
         <div className="flex-container header-row">
            <div className="flex-item">
              Position
            </div>
            <div className="flex-item">
              Name
            </div>
            <div className="flex-item half right">
              Bye
            </div>
            <div className="flex-item right">
              Overall
            </div>
         </div>
         {this.roster()}
        </div>
     )
   }
 }

export default Roster;
