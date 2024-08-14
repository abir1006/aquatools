import axios from "axios";
import TokenService from "../../Services/TokenServices";
import {hideContentSpinner, showContentSpinner} from "./spinnerActions";


export const saveBlockInputsData = blockInputData => async dispatch => {
    dispatch({type: 'ADD_BLOCK_INPUT_DATA', payload: blockInputData});
}
