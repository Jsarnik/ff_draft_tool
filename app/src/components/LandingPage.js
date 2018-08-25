import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Input from '../components/Input';
import axios from 'axios';
import config from '../globals';


class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: null,
      league: null,
      owner: null
    }
  }

    handleChange = (params, val) =>{
      this.setState({
        [params]: val
      });
    }

    findLeague = () =>{
      if(!this.state.league){
        return;
      }
      let url = `${config.baseApiUri}/api/getLeague`;
      let options = {
        leagueObject: this.state
      }
  
      axios.post(url, options)
        .then(res => {
          let data = res.data.data;
          if(data){
            this.onLeagueSet(data.league);
            let location = `${data.league}/teams`;
            this.props.history.push(location);
          }
        }).catch(e =>{
          console.log(e);
        });
    }

    createLeague = () =>{
      if(!this.state.displayName || !this.state.owner){
        return;
      }
      let url = `${config.baseApiUri}/api/addLeague`;
      let options = {
        leagueObject: this.state
      }
  
      axios.post(url, options)
        .then(res => {
          let data = res.data.data;
          if(data){
            this.onLeagueSet(data.league);
            let location = `${data.league}/draft`;
            this.props.history.push(location);
          }
        }).catch(e =>{
          console.log(e);
        });
    }

    onLeagueSet = (leagueName) =>{
      this.props.onLeagueSetFn(leagueName);
    }

   render() {
     return(
         <div>
           <div>
            <label>Existing Team (No spaces or special characters)</label>
            <Input type='text' value={this.state.league} onChangeFn={this.handleChange} params='league'/>
            <div className="button" onClick={()=>this.findLeague()}>Find</div>
           </div>
           <div>
           <label>New Team Name (No spaces or special characters)</label>
            <Input type='text' value={this.state.displayName} onChangeFn={this.handleChange} params='displayName'/>
            <label>Owner</label>
            <Input type='text' value={this.state.owner} onChangeFn={this.handleChange} params='owner'/>
            <div className="button" onClick={()=>this.createLeague()}>Create</div>
           </div>
         </div>
     )
   }
 }

export default withRouter(LandingPage);
