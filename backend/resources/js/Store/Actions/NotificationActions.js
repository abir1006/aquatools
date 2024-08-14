import axios from "axios";
import TokenService from "../../Services/TokenServices";

export const latestNotifications = () => async dispatch => {
    try {
        const latestNotificationResponse = await axios.post(
            'api/user/notifications/latest', {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                }
            });
        // response
        dispatch({type: 'SET_LATEST_NOTIFICATION_DATA', payload: latestNotificationResponse.data})
    } catch (error) {
        console.log(error.response.data);
    }
}

export const deleteNotification = notificationID => async dispatch => {
    console.log(notificationID);
    try {
        const deleteResponse = await axios.delete(
            'api/user/notification/delete', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${TokenService.getToken()}`
                },
                data: {
                    id: notificationID
                }
            });
        // response
        dispatch(latestNotifications())
    } catch (error) {
        console.log(error.response.data);
    }
}
