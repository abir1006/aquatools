import React, { Component } from 'react';
import MainNavigation from "../../Components/MainNavigation/MainNavigation";
import PageTitle from "../../Components/PageTitle/PageTitle";
import { connect } from "react-redux";
import './ATMaterials.css';
import { fetchSingleMaterial, markasRead } from "../../Store/Actions/MaterialsActions";
import { showContentSpinner, hideContentSpinner } from "../../Store/Actions/spinnerActions";
import BackButton from '../../Components/Inputs/BackButton';
import Resources from '../../Components/Material/Resources'
import VimeoVideo from '../../Components/Material/VimeoVideo';
import ContentSpinner from '../../Components/Spinners/ContentSpinner';
import { withTranslation } from 'react-i18next';

class ATMaterialsDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: null
        }

    }

    componentDidMount() {

        this.addJsCss();
        const id = this.props.match.params.id;
        this.fetchMaterial(id);

        //mark notification as read
        const notification = this.props.materialNotifications.find(x => x.data.id == id);

        notification && this.props.markasRead(notification.id);
    }


    fetchMaterial(id) {

        this.props.fetchSingleMaterial(id).then(res => {
            this.setState({ item: res.data });
        }).catch(error => {
            console.log(error.status);
            if (error.status == 404)
                this.props.history.push('/admin/at_materials');
        })
    }
    addJsCss() {

        const script = document.createElement("script");
        script.src = "https://player.vimeo.com/api/player.js";
        script.async = true;
        document.body.appendChild(script);
    }

    cancelHandler() {
        this.props.history.push({
            pathname: '/admin/at_materials'
        });
    }



    render() {

        const { t } = this.props;

        const navColClass = this.props.navigation.navCollapse === true ? 'custom-nav-collapse' : 'col- col-xl-2 col-lg-3 col-md-3 col-sm-12';
        const contentClass = this.props.navigation.navCollapse === true ? 'custom-content-expand' : 'col- col-xl-10 col-lg-9 col-md-9 col-sm-12';

        const item = this.state.item;

        const videos = Boolean(item) && 'videos' in item.all_resources ? item.all_resources.videos : [];

        const firstVideo = videos.length > 0 ? videos[0] : '';


        return (
            <div className="row mt-3" id="users_page">
                <div className={navColClass} id="sidebar">
                    <MainNavigation />
                </div>
                <div className={contentClass}>
                    <div className="row">
                        <div className="col- col-xl-12 col-lg-12 col-md-12 col-sm-12 pl-xl-0 pl-lg-0 pl-md-0">
                            <div className="content-block title-block">
                                <PageTitle
                                    title={item?.title || ''}
                                    iconClass="materials-icon" />
                                <div className="add_button_block">
                                    <BackButton
                                        name={t('back_to_list')}
                                        onClickHandler={this.cancelHandler.bind(this)} />

                                </div>
                            </div>

                            <div className="content-block content-block-grey">

                                <ContentSpinner />

                                {item && <div className="row">
                                    <div className="col-md-4 ">
                                        <div className="bg-white py-2 px-3 h-100">
                                            <Resources item={item} />

                                            <br />
                                            <br />

                                            {Boolean(item.is_free) && <span className="badge badge-free py-2 px-3">{t('free')}</span>}
                                            {!Boolean(item.is_free) && <span className="badge badge-paid py-2 px-3">{t('paid')}</span>}

                                        </div>
                                    </div>
                                    <div className="col-md-8 ">
                                        <div className="bg-white py-2 px-3 ">
                                            <h2>{item.title}</h2>
                                            {
                                                // Boolean(item.excerpt) && item.excerpt != 'null' &&
                                                // <div className="my-3 text-justify mx-5">{item.excerpt}</div>
                                            }
                                            {
                                                firstVideo && <div className="my-3 text-left w-100" style={{ marginLeft: '-10px' }}>
                                                    <VimeoVideo videoId={firstVideo.image} />
                                                </div>
                                            }
                                            {

                                                Boolean(item.details) && item.details != 'null' && <div dangerouslySetInnerHTML={{ __html: item.details }} />
                                            }
                                            {
                                                <div>
                                                    {item.tags.map((tag, index) => (
                                                        <div className="badge badge-gray mr-1 my-1" key={index}>
                                                            {tag.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        );

    }
}


const mapStateToProps = state => ({
    navigation: state.navigation,
    materialNotifications: state.materials.notifications
});

export default connect(mapStateToProps, {
    fetchSingleMaterial,
    showContentSpinner,
    hideContentSpinner,
    markasRead
})(withTranslation()(ATMaterialsDetails));
