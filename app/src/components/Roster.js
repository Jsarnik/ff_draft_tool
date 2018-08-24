import React, { Component } from 'react';
import * as _ from 'lodash';
import axios from 'axios';

class Roster extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
        teamName: props.match.params.teamName,
        teamRoster:{

        },
        rosterTemplate: {
          qb: null,
          rb1: null,
          rb2: null,
          wr1: null,
          wr2: null,
          te: null,
          flex: null,
          dst: null,
          k: null,
          bench1: null,
          bench2: null,
          bench3: null,
          bench4: null,
          bench5: null,
          bench6: null,
          bench7: null
        }
      }
    }

    componentDidMount = () =>{
      let rosterUrl = 'http://localhost:3001/api/getTeamRoster';
      let options = {
        teamName: this.state.teamName
      }

      axios.post(rosterUrl, options)
      .then(rosterRes => {
        let filledRoster = rosterRes.data.data;
        let template = this.state.rosterTemplate;

      _.each(filledRoster, (filled, k)=>{
        let f_pos = filled.pos.toLowerCase().replace(/[0-9]/g, '');  
        _.each(template, (temp, key)=>{
            let replacedKey = key.replace(/[0-9]/g, '');
            if(!filled.isFilled){
              if(replacedKey === f_pos && !temp && !filled.isFilled){
                filled.isFilled = true;
                template[key] = filled;
              }
              else if(replacedKey === 'flex' && !temp && (f_pos === 'wr' || f_pos === 'rb' || f_pos === 'te') && !filled.isFilled){
                filled.isFilled = true;
                template[key] = filled;
              }
              else if(replacedKey === 'bench' && !temp && !filled.isFilled){
                filled.isFilled = true;
                template[key] = filled;
              }
            }
          }); 
        });          

        this.setState({
          teamRoster: template
        });
      });
    }
   
    roster = () =>{
      return _.map(this.state.teamRoster, (spot, key)=>{
        if(spot){
          return (
            <div key={key} className="flex-container">
              <div className="flex-item">
                  {key}
              </div>
              <div className="flex-item">
                  <div>{spot.name}</div>
                  <div>{spot.pos}</div>
                  <div>{spot.overall} overall</div>
              </div>
            </div>
          )
        }else{
          return (
            <div key={key}  className="flex-container">
              <div className="flex-item">
                  {key}
              </div>
              <div className="flex-item">
                  NOT FILLED
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
              Position
            </div>
            <div className="flex-item">
            </div>
         </div>
         {this.roster()}
        </div>
     )
   }
 }

export default Roster;
