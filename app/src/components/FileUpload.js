import React, { Component } from 'react';
import axios from 'axios';

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
  
      axios.post('http://localhost:3001/upload', data)
        .then(function (response) {
            this.setState({ imageURL: `http://localhost:3001/`, uploadStatus: true });
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    downloadResults = () =>{
      axios.get('http://localhost:3001/api/downloadDraft')
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
      axios.get('http://localhost:3001/api/resetDB')
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
       <div class="container">
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
