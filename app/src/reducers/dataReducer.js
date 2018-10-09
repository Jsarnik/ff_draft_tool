import * as types from '../actions/actionTypes';

const initialState =  {
    dialogOptions: {
        dialogText: '',
        showDialog: false,
        result: null,
        execFn: null
    }
}

export default function dataReducer(state = initialState, action){
    switch(action.type){
        case types.RESET_DB_SUCCESS:
        return Object.assign({}, state, {
            status: action.success
        });

        case types.RESET_DB_FAILURE:
            return Object.assign({}, state, {
                status: action.error.message
            });

        case types.SET_CONFIRM_DIALOG_SUCCESS:
            return Object.assign({}, state, {
                dialogOptions: Object.assign({}, state.dialogOptions, {
                    dialogText: action.title, execFn: action.execFn
                })
            });

        case types.CONFIRM_DIALOG_RESULT_SUCCESS:
            return Object.assign({}, state, {
                dialogOptions: Object.assign({}, state.dialogOptions, {
                    result: action.value
                })
            });

        case types.RESET_ONFIRM_DIALOG_SUCCESS:
            return Object.assign({}, state, {
                dialogOptions: initialState.dialogOptions
            });
        
        default:
            return state;
    }
}