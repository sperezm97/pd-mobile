import { Platform } from 'react-native';
import { preloadedDev, preloadedProd } from '../formulas/preload/importable';
import { DevConfig, ProdConfig } from './Network';

export class Config {
    private static network = __DEV__ ? DevConfig : ProdConfig;
    // private static network = ProdConfig;
    static gql_url = Config.network.gql_url;
    static web_url = Config.network.web_url;
    static web_app_url = Config.network.web_app_url;
    static forum_url = Config.network.forum_url;

    static terms_url = `${Config.web_url}/terms`;
    static privacy_url = `${Config.web_url}/privacy`;

    static isAndroid = Platform.OS === 'android';
    static isIos = Platform.OS === 'ios';
    static platformOS = Platform.OS;

    static revenueCatPublicKey = 'wciuClkgweIivYNTlQfmRfvRRoptoHGZ';

    static version = '1.7.2';
    static appStoreListing = Config.isIos
        ? 'https://itunes.apple.com/app/id1505607801'
        : 'https://play.google.com/store/apps/details?id=com.gazzini.pooldash';

    static preloadedFormulas = __DEV__ ? preloadedDev : preloadedProd;
    // static preloadedFormulas = preloadedProd;
    static poolDoctorFormulaKey = __DEV__ ? 'inconsequential_lawyer_485' : 'awful_picture_479';
    // static poolDoctorFormulaKey = 'awful_picture_479';
}
