import { combineReducers } from "redux";
import authReducer from './authReducer';
import navigationReducer from "./navigationReducer";
import pageReducer from "./pageReducer";
import userReducer from "./userReducer";
import roleReducer from "./roleReducer";
import popupReducer from "./popupReducer";
import permissionReducer from "./permissionReducer";
import permissionActionsReducer from "./permissionActionsReducer";
import invoiceSettingsReducer from "./invoiceSettingsReducer";
import companyReducer from "./companyReducer";
import spinnerReducer from "./spinnerReducer";
import modelSettingsReducer from "./modelSettingsReducer";
import modelBlockReducer from "./modelBlockReducer";
import moduleReducer from "./moduleReducer";
import modelScreenReducer from "./modelScreenReducer";
import templateReducer from "./templateReducer";
import priceModuleReducer from "./PriceModuleReducer";
import reportReducer from "./ReportReducer";
import temperatureModuleReducer from "./TemperatureModuleReducer";
import feedLibraryReducer from "./FeedLibraryReducer";
import activityReducer from "./UserActivityReducer";
import feedSettingsReducer from "./FeedSettingsReducer";
import feedModelScreenReducer from "./FeedModelScreenReducer";
import vaccineModelScreenReducer from "./VaccineModelScreenReducer";
import codModelScreenReducer from "./CodModelScreenReducer";
import userProfileReducer from "./userProfileReducer";
import forgotPasswordReducer from "./forgotPasswordReducer";
import materialsReducer from "./materialsReducer";
import translationsReducer from "./translationsReducer";
import SiteSettingsReducer from "./SiteSettingsReducer";

const appReducer = combineReducers({
    auth: authReducer,
    navigation: navigationReducer,
    page: pageReducer,
    user: userReducer,
    role: roleReducer,
    popup: popupReducer,
    permission: permissionReducer,
    permissionActions: permissionActionsReducer,
    invoiceSettings: invoiceSettingsReducer,
    modelSettings: modelSettingsReducer,
    modelBlock: modelBlockReducer,
    company: companyReducer,
    spinner: spinnerReducer,
    module: moduleReducer,
    modelScreen: modelScreenReducer,
    template: templateReducer,
    priceModule: priceModuleReducer,
    report: reportReducer,
    temperatureModule: temperatureModuleReducer,
    feedLibrary: feedLibraryReducer,
    activity: activityReducer,
    feedSettings: feedSettingsReducer,
    feedModelScreen: feedModelScreenReducer,
    vaccineModelScreen: vaccineModelScreenReducer,
    codModelScreen: codModelScreenReducer,
    userProfile: userProfileReducer,
    forgotPassword: forgotPasswordReducer,
    materials: materialsReducer,
    translations: translationsReducer,
    siteSettings: SiteSettingsReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'DO_LOGOUT') {
        state = undefined
    }

    return appReducer(state, action)
}

export default rootReducer;
