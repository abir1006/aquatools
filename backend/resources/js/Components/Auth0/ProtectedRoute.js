import { withAuthenticationRequired } from '@auth0/auth0-react';
import {
    Route
} from 'react-router-dom';
import ButtonSpinner from '../Spinners/ButtonSpinner';

const ProtectedRoute = ({ component, ...args }) => {

    return (
        <Route
            component={withAuthenticationRequired(component, {
                onRedirecting: () => (<div className="d-flex justify-content-center mt-2">
                    <ButtonSpinner showSpinner={true} />
                </div>),
            })}
            {...args}
        />
    )
}

export default ProtectedRoute;