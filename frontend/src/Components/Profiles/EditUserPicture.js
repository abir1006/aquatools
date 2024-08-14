import React, {Component} from 'react';
import './Settings.css';
import {connect} from 'react-redux';
import TabHeading from "./TabHeading";
import FileUpload from "../Inputs/FileUpload/FileUpload";
import SaveButton from "../Inputs/SaveButton";
import {showSuccessMessage} from "../../Store/Actions/popupActions";
import axios from "axios";
import TokenServices from "../../Services/TokenServices";
import {getAuthUser} from "../../Store/Actions/authActions";


import {
    setUserProfileInfo,
    setUserProfileFieldsEmptyErrors,
    setUserProfilePicInputs
} from '../../Store/Actions/userProfileActions';
import {withTranslation} from 'react-i18next';

class EditUserPicture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUpload: false,
            buttonDisabled: false,
            hasFieldError: false,
            errorMessage: null,
        }
    }

    async logoUploadHandler(file) {


        const id = this.props.auth.data.user.id;
        const {t} = this.props;

        await this.setState({
            ...this.state,
            imageUpload: true
        });
        //this.props.setCompanyInputs({company_logo: file});
        const formData = new FormData();
        formData.append('profile_pic', file, file.name);
        formData.append('id', id);

        try {
            const logoUploadResponse = await axios.post('api/user/profile-picture/update',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${TokenServices.getToken()}`
                    }
                });

            await this.setState({
                ...this.state,
                imageUpload: false,
                hasFieldError: false,
                errorMessage: null
            });

            this.props.setUserProfilePicInputs(logoUploadResponse.data.data.profile_pic_url);
            this.props.getAuthUser();

        } catch (error) {
            await this.setState({
                ...this.state,
                hasFieldError: true,
                errorMessage: t("upload_failed"),
                imageUpload: false
            });

        }
    }


    render() {


        const {t} = this.props;

        const userPic = this.props?.profilePicInputs && this.props?.profilePicInputs || '';

        const userPicCaption = this.props.profilePicInputs === null ? t('select_and_upload') : t('change_your_avatar');

        const showUploadSpinner = this.state.imageUpload;

        const errorMessage = this.state.hasFieldError === true ?
            <p className="at2_error_text">{this.state.errorMessage + ' (types must be :jpeg, png, jpg, gif, svg and max size: 2048 kb )'}</p> : '';

        return (
            <div className="content-block edit-block no-radius mb-lg-4">
                <div className="row">
                    <div className="col-4 col-xl-7 col-lg-6 col-md-6 col-sm-5">
                        <TabHeading
                            tabHeading={t('change_your_avatar')}
                            tabSubHeading=""/>
                    </div>
                    <div className="col-8 col-xl-5 col-lg-6 col-md-6 col-sm-7 pb-lg-2 text-right">
                    </div>
                    <div className="col-lg-12">
                        <div className="card block-card">
                            <form>
                                <div className="form-row">
                                    <div className="col-4 col-lg-2">
                                        <label className="col-form-label" htmlFor="first_name">
                                            {t('upload_avatar')}
                                        </label>
                                    </div>
                                    <div className="col-8 col-lg-10">
                                        <FileUpload
                                            maxSize={2097152} // kb
                                            types={['jpg','png', 'gif', 'jpeg', 'svg']}
                                            fieldValue={userPic}
                                            btnText={userPicCaption}
                                            size=""
                                            imgHeight="240"
                                            showSpinner={showUploadSpinner}
                                            fileOnChangeHandler={e => this.logoUploadHandler(e)}
                                        />
                                    </div>
                                </div>
                                {errorMessage}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => ({
    data: state.userProfile.data,
    emptyProfileInfoFields: state.userProfile.emptyProfileInfoFields,
    profilePicInputs: state.userProfile.userProfilePicInputs,
    showSaveSpinner: state.company.companySaveSpinner,
    auth: state.auth,
});


export default connect(mapStateToProps,
    {
        showSuccessMessage,
        setUserProfileFieldsEmptyErrors,
        setUserProfileInfo,
        setUserProfilePicInputs,
        getAuthUser
    })(withTranslation()(EditUserPicture));

