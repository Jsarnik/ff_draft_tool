import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as dataActions from '../actions/dataActions';
import axios from 'axios';
import config from '../globals';
import * as _ from 'lodash';

class ManageData extends Component {

    constructor(props) {
      super(props);
        if(!props.match.params.leagueName){
          props.history.push('/');
        }

        this.leagueName = props.match.params.leagueName;
        props.onEnterRoute(props.match);

        this.state = {
          uploadStatus: false,
          db_status: null,
          download_status: null
        }
      this.handleUploadImage = this.handleUploadImage.bind(this);
    }

    componentDidUpdate = (prevProps) => {
      if(!this.props.routes.leagueName){
        this.props.history.push('/');
      }

      if(this.props.data.dialogOptions.result !== null){
        if(this.props.data.dialogOptions.result === true && this.props.data.dialogOptions.execFn){
          this.props.data.dialogOptions.execFn();
        }
        this.props.dataActions.resetConfirmDialog();
      }
    }

    handleConfirmResult = () =>{
      this.props.dataActions.resetDB(this.props.routes.leagueName);
    }
  
    handleUploadImage(ev) {
      ev.preventDefault();
  
      const data = new FormData();
      data.append('file', this.uploadInput.files[0]);
      data.append('filename', this.fileName.value);
  
      
      axios.post(`${config.baseApiUri}/api/upload`, data)
        .then(function (response) {
            this.setState({ imageURL: `${config.baseApiUri}`, uploadStatus: true });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
   
    downloadResults = () =>{
      window.location.href = this.props.league.removedDate === null ? `${config.baseApiUri}/api/downloadDraft?leagueName=${this.props.leagueName}` : `${config.baseApiUri}/api/downloadDraft?leagueName=${this.props.leagueName}&isDownloadOnly=true`;
    }

    resetDB = () => {
      this.props.dataActions.setConfirmDialogOptions('Are you sure you want to reset all data? All picks will be removed and drafted players reset.', ()=>{this.handleConfirmResult()});
    }

    reactivationComp = () =>{
      return (
        this.props.league.removedDate ? 
        <div>
          <div className="flex-container">
            <div className="flex-item">
              {`Your league (${this.props.league.displayName}) was deactivated on ${this.props.league.removedDate} due to inactivity. League teams and draft data have been reset. An excel document has been created of the last active state and can be downloaded via the button below. To reactive this league please click the 'Reactivate' button below.`}
            </div>
          </div>
          <div className="flex-container">
            <div className="flex-item">
              <div className="button draft" onClick={()=>{this.reactivateLeague()}}>Reactivate</div>
            </div>
          </div>
        </div> 
        : null
      )
    }

   render() {
     return(
       <div className="container">
        <div>{this.props.data.status}</div>
        {this.reactivationComp()}
        <div className="flex-container">
          <div className="flex-item">
            <div className="button remove" onClick={()=>{this.resetDB()}}>RESET BOARD</div>
          </div>
          <div className="flex-item">
            <div className="button draft" onClick={()=>{this.downloadResults()}}>DOWNLOAD DRAFT RESULTS</div>
          </div>
        </div>
       </div>
     )
   }
 }

 function mapStateToProps(state, ownProps){
  return {
    routes: state.routes,
    data: state.data,
    league: state.league
  };
}

function mapDispatchToProps(dispatch){
 return {
   dataActions: bindActionCreators(dataActions, dispatch)
 };
}

export default connect(mapStateToProps, mapDispatchToProps) (withRouter(ManageData));
