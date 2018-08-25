import React, { Component } from 'react';
import axios from 'axios';
import config from '../globals';

class FileUpload extends Component {

    constructor(props) {
      super(props);
        this.state = {
          uploadStatus: false,
          db_status: null,
          download_status: null
        }
      this.handleUploadImage = this.handleUploadImage.bind(this);
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
      axios.get(`${config.baseApiUri}/api/downloadDraft`)
      .then(res => {
        this.setState({
          download_status: res.data.data.success
        })
      }).catch((error)=>{
        this.setState({
          download_status: error.message
        })
      }); 
    }

    resetDB=()=>{
      let baseAPIURI = config.baseApiUri;

      axios.get(`${config.baseApiUri}/api/resetDB`)
      .then(res => {
        this.setState({
          db_status: res.data.data.success
        })
      }).catch((error)=>{
        this.setState({
          db_status: error.message
        })
      }); 
    }

   render() {
     return(
       <div className="container">
         <form onSubmit={this.handleUpload}>
           <div className="form-group">
             <input className="form-control"  ref={(ref) => { this.uploadInput = ref; }} type="file" />
           </div>
 
           <div className="form-group">
             <input className="form-control" ref={(ref) => { this.fileName = ref; }} type="text" placeholder="Optional name for the file" />
           </div>
 
           <button className="btn btn-success" type>Upload</button>
 
         </form>

         <div className="button download" onClick={()=>{this.downloadResults()}}>DOWNLOAD DRAFT RESULTS</div>
         <div>{this.state.download_status}</div>

         <div className="button reset" onClick={()=>{this.resetDB()}}>RESET BOARD</div>
         <div>{this.state.db_status}</div>


       </div>

       
     )
   }
 }

export default FileUpload;
