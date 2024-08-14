import React from 'react';
import './SubMenus.css';
import { connect } from "react-redux";
import NavService from "../../../Services/NavServices";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SubMenus = props => {

    const { t } = useTranslation();

    const { materialNotificationsrenderer } = props;

    const currentSubMenu = NavService.getCurrentRoute();

    if (props.items === undefined || Object.keys(props.items).length === 0) {
        return null;
    }

    let sideBarWidth = props.page.sideBarWidth;

    if (props.navigation.navCollapse === true) {
        sideBarWidth = 250;
    }

    const items = props.items;
    let subMenuWidth = props.navigation.subMenuShow && props.parentMenuName.toLowerCase() === props.navigation.currentSubMenuName ? (sideBarWidth - 7.5) : 0;


    const spanClass = 'sub-menu-name';
    const spanIconClass = 'sub-menu-icon ' + props.subMenuIconClass;

    let count = 0;

    const currentUserRole = props.data.length === 0 || props.data.user.roles === undefined ? '' : props.data.user.roles[0].slug;
    const permittedModels = props.permittedModels;


    const Links = Object.keys(items).map(index => {

        let subMenuClassName = currentSubMenu === index ? 'current-sub-menu' : '';
        const hasPermission = Boolean(permittedModels) && permittedModels.indexOf(index) !== -1;
        // // do not show submenu of model if models has no permission
        if (props.parentMenuName.toLowerCase() === 'models') {
            return (
                <>
                    { hasPermission && <li className={subMenuClassName} key={count++}>
                        <Link to={items[index].link}>
                            {t(items[index].name)} <i className="fa fa-arrow-right" aria-hidden="true"></i>
                        </Link>
                    </li>
                    }

                    { !hasPermission && <li className="inactive" key={count++}>

                        <div>{t(items[index].name)}</div>

                    </li>
                    }
                </>
            )

        }

        //show at materials categories+tags only for super_admin
        if (currentUserRole !== 'super_admin' && ['All-Materials-Categories', 'All-Materials-Tags'].includes(index)) {
            return null;
        }

        return (
            <li className={subMenuClassName} key={count++}>
                <Link to={items[index].link}>
                    {items[index].name === 'all_materials' ? props.materialNotificationsrenderer(t(items[index].name)) : t(items[index].name)}
                    <i className="fa fa-arrow-right" aria-hidden="true"></i>
                </Link>
            </li>
        )
    }
    );

    const subMenuClass = props.navigation.subMenuShow && props.parentMenuName.toLowerCase() === props.navigation.currentSubMenuName ? 'sub-menu sub-menu-show' : 'sub-menu';

    return (
        <ul className={subMenuClass}
            style={{ maxWidth: subMenuWidth }}>
            <span className="sub-menu-close-panel">
                <i
                    className="fa fa-times"
                    onClick={props.handleSubMenuClose}
                    aria-hidden="true"></i>
            </span>
            <span className={spanIconClass}></span>
            <span className={spanClass}>{t(props.parentMenuName)}</span>
            {Links}
        </ul>
    )
}

const mapStateToProps = state => ({
    navigation: state.navigation,
    page: state.page,
    permittedModels: state.auth.permittedModels,
    data: state.auth.data,
});

// Component Action Dispatches
const mapDispatchToProp = dispatch => {
    return {
        handleSubMenuClose: () => {
            dispatch(
                {
                    type: 'SUBMENU_CLOSE'
                }
            )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProp)(SubMenus);
