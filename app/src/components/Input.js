import React, { Component } from 'react';

class Input extends Component {
  constructor(props) {
    super(props);
   
  }

    handleChange = (event) =>{
       this.props.onChangeFn(this.props.params, event.target.value);
    }

   render() {
     return(
         <div>
            <input type={this.props.type} value={this.props.value} onChange={(e)=>this.handleChange(e)} />
         </div>
     )
   }
 }

export default Input;
