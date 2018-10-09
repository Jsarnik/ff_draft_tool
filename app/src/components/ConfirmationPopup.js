import React, { Component } from 'react';
import * as dataActions from '../actions/dataActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ConfirmationPopup extends Component {

    handleClick = (value) =>{
        return this.props.dataActions.confirmDialogResults(value);
    }

    render() {
        return this.props.data.dialogOptions.dialogText ? (
            <div className="confirm-container">
                <div className="confirm-bg"></div>
                <div className="confirm-content">
                    <div className="confirm-dialog">
                        {this.props.data.dialogOptions.dialogText}
                    </div>
                    <div className="confirm-buttons flex-container">
                        <div className="flex-item">
                            <div className="button" onClick={()=>this.handleClick(false)}>Cancel</div>
                        </div>
                        <div className="flex-item">
                            <div className="button" onClick={()=>this.handleClick(true)}>Confirm</div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null
    }
 }

function mapStateToProps(state, ownProps){
    return {
        data: state.data
    };
}

function mapDispatchToProps(dispatch){
    return {
        dataActions: bindActionCreators(dataActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps) (ConfirmationPopup);
