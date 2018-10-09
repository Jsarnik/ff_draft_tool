import React, { Component } from 'react';

class Input extends Component {

    handleChange = (event) =>{
       this.props.onChangeFn(this.props.params, event.target.value);
    }

   render() {
     return(
         <div>
            <input placeholder={this.props.placeholder} disabled={this.props.isDisabled} type={this.props.type} value={this.props.value || ''} onChange={(e)=>this.handleChange(e)} />
         </div>
     )
   }
 }

export default Input;
