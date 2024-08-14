import React from 'react';
import {connect} from 'react-redux';
import {Prompt, withRouter} from 'react-router-dom';
import {
    showNavigationPromptConfirmPopup,
} from "../../Store/Actions/FeedModelActions";

import {
    setIsDirty,
    unsetIsDirty,
    setConfirmYes,
    setConfirmNo,
    setConfirmNavigationSwitch,
} from "../../Store/Actions/popupActions";

import {logLogout} from "../../Store/Actions/authActions";

class NavigationPrompt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidUpdate(prevProps, prevState) {

        const {popup} = this.props;

        if (popup.isDirty == true) {
            window.onbeforeunload = () => true;
        } else {
            popup.isDirty && this.props.unsetIsDirty()
            window.onbeforeunload = null
        }

        if (popup.isDirty && Boolean(popup.confirmUrl)) {
            this.props.setConfirmNavigationSwitch(false);
            this.confirmYesRedirect();
        }
    }

    async confirmYesRedirect() {

        const props = this.props;
        const {confirmUrl} = props.popup;

        await props.unsetIsDirty();
        await props.setConfirmNo();
        window.onbeforeunload = null;
        this.props.history.push(confirmUrl);
    }

    handleBlockedNavigation(location) {
        this.props.showNavigationPromptConfirmPopup(location, this.props.message);
        return false;
    }

    render() {
        const {popup} = this.props;
        return (
            <div>
                <Prompt
                    when={popup.isDirty}
                    message={(e) => this.handleBlockedNavigation(e)}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    popup: state.popup,
    page: state.page,
    modelID: state.modelScreen.tool_id,
});

export default connect(mapStateToProps, {
    setIsDirty,
    unsetIsDirty,
    showNavigationPromptConfirmPopup,
    logLogout,
    setConfirmNo,
    setConfirmNavigationSwitch,
})(withRouter(NavigationPrompt));
