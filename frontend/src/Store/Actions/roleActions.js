import axios from "axios";
import TokenService from "../../Services/TokenServices";

export const roleListAll = () => async dispatch => {
    try {
        const roleListAllResponse = await axios.post(
            'api/role/list_all', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });

        // response
        dispatch({type: 'SET_ROLES_DATA', payload: roleListAllResponse.data})
    } catch (error) {
        console.log(error.response.data);
    }
}
