import React from 'react';
import { SvgProps } from 'react-native-svg';
import { PDColor } from '~/components/PDTheme';

import IconPlay from './images/icon_play.svg';
import IconSearch from './images/icon_search.svg';
import IconSettings from './images/icon_settings.svg';
// General Icons
import IconCheckmark from './images/icons/icon_checkmark.svg';
import IconChevronCircleDown from './images/icons/icon_chevron_circle_down.svg';
import IconChevronCircleUp from './images/icons/icon_chevron_circle_up.svg';
import IconChevronForward from './images/icons/icon_chevron_forward.svg';
import IconEmptyCircle from './images/icons/icon_circle.svg';
import IconCircleAdd from './images/icons/icon_circle_add.svg';
import IconCircleAddSolid from './images/icons/icon_circle_add_solid.svg';
import IconBack from './images/icons/icon_circle_back.svg';
import IconCircleCheckmark from './images/icons/icon_circle_checkmark.svg';
import IconCircleEdit from './images/icons/icon_circle_edit.svg';
import IconCircleForward from './images/icons/icon_circle_forward.svg';
import IconClipboard from './images/icons/icon_clipboard.svg';
import IconCloseButton from './images/icons/icon_close.svg';
import IconDelete from './images/icons/icon_delete.svg';
import IconDeleteOutline from './images/icons/icon_delete_outline.svg';
import IconExportData from './images/icons/icon_export_data.svg';
import IconForward from './images/icons/icon_forward.svg';
import IconImportData from './images/icons/icon_import_data.svg';
import IconInformation from './images/icons/icon_information.svg';
import IconLevels from './images/icons/icon_levels.svg';
import IconMail from './images/icons/icon_mail.svg';
import IconPlayWhite from './images/icons/icon_play_white.svg';
import IconWater from './images/icons/icon_water.svg';
import IconBadge from './images/icons/icon_badge.svg';
import IconBeaker from './images/beaker_plain.svg';
import IconFeedback from './images/icons/icon_feedback.svg';
import RightArrow from './images/right_arrow.svg';
// Pool
import IconCustomTargets from './images/pool/icon_custom_targets.svg';
import IconPoolEmail from './images/pool/icon_email.svg';
import IconPoolFormula from './images/pool/icon_formula.svg';
import IconPoolName from './images/pool/icon_name.svg';
import IconPoolVolume from './images/pool/icon_volume.svg';
import IconPoolWallType from './images/pool/icon_wall_type.svg';
import IconPoolWaterType from './images/pool/icon_water_type.svg';
import IconPooldashPlus from './images/settings/icon_pooldash_plus.svg';
import IconScoop from './images/settings/icon_scoop.svg';
import IconUnits from './images/settings/icon_units.svg';
import IconTheme from './images/settings/icon_theme.svg';
// Volume Estimator
import Circle from './images/shapes/big_circle.svg';
import CircleDark from './images/shapes/big_circle_dark.svg';
import Other from './images/shapes/big_other.svg';
import OtherDark from './images/shapes/big_other_dark.svg';
import Oval from './images/shapes/big_oval.svg';
import OvalDark from './images/shapes/big_oval_dark.svg';
import Rectangle from './images/shapes/big_rectangle.svg';
import RectangleDark from './images/shapes/big_rectangle_dark.svg';
import IconCircle from './images/shapes/icon_circle.svg';
import IconEstimator from './images/shapes/icon_estimator.svg';
import IconOther from './images/shapes/icon_other.svg';
import IconOval from './images/shapes/icon_oval.svg';
import IconRectangle from './images/shapes/icon_rectangle.svg';
import IconVolume from './images/shapes/icon_volume.svg';
// Subscription
import IconCharts from './images/subscription/icon_charts.svg';
import IconHeart from './images/subscription/icon_heart.svg';
import IconInfinitive from './images/subscription/icon_infinitive.svg';
// Home
import HomeDescriptionText from './images/home/home_pce.svg';
import HomeWaves from './images/home/waves_home.svg';
// Settings/Theme
import SmallSunDark from './images/theme/theme_sun_small_light.svg';
import SmallMoonDark from './images/theme/theme_moon_small_dark.svg';
import AutomaticLight from './images/theme/theme_automatic_light.svg';
import AutomaticDark from './images/theme/theme_automatic_dark.svg';

export const images = {
    back: require('./images/back.png'),
    backBlue: require('./images/back_blue.png'),
    closeBlue: require('./images/close_blue.png'),
    backReadingsBlue: require('./images/back_readings_blue.png'),
    backTreatmentsPurple: require('./images/back_treatments_purple.png'),
    backRecipesGreen: require('./images/back_recipes_green.png'),
    backTrans: require('./images/back_trans.png'),
    closeDark: require('./images/close_dark.png'),
    history: require('./images/history.png'),
    star: require('./images/star.png'),
    waterType: require('./images/water_type.png'),
    greenAuthenticationBackground: require('./images/green_authentication_background.png'),
    blueAuthenticationBackground: require('./images/blue_authentication_background.png'),
    backWhite: require('./images/back_white.png'),
    closeIcon: require('./images/close_icon.png'),
    plusButton: require('./images/plus.png'),
    gearButton: require('./images/gear.png'),
    gearLightButton: require('./images/gear_light.png'),
    logoGreenPlus: require('./images/logo/logo_plus_green.png'),
    logoWhitePlus: require('./images/logo/logo_plus_white.png'),
    rightArrow: require('./images/right_arrow.png'),
    sliderThumb: require('./images/thumb.png'),
    sliderThumbDark: require('./images/thumb_dark.png'),
    sliderThumbLight: require('./images/thumb_light.png'),
    greenCheck: require('./images/green_check.png'),
    incomplete: require('./images/incomplete.png'),
    trends: require('./images/trends.png'),
    pools3: require('./images/pools_3.png'),
    titleIcon: require('~/assets/images/icon-name.png'),
    waterTypeIcon: require('~/assets/images/icon-water-type.png'),
    volumeIcon: require('~/assets/images/icon-volume.png'),
    wallTypeIcon: require('~/assets/images/icon-wall-type.png'),
    recipeIcon: require('~/assets/images/icon-recipe.png'),
    targetsIcon: require('~/assets/images/icon-targets.png'),
    exportIcon: require('~/assets/images/icon-export.png'),
    importIcon: require('~/assets/images/icon-import.png'),
    deleteIcon: require('~/assets/images/icon-delete.png'),
    menuChevronIcon: require('~/assets/images/icon-menu-chevron.png'),
    homeWelcomeTextDark: require('~/assets/images/home/welcome_text_dark.png'),
    homeWelcomeTextWhite: require('~/assets/images/home/welcome_white.png'),
    sunBig: require('./images/theme/theme_sun.png'),
    moonBig: require('./images/theme/theme_moon.png'),
};

export interface OverrideSvgProps extends SvgProps {
    fill?: string | PDColor;
}

export const SVG: Record<string, (props: OverrideSvgProps) => JSX.Element> = {
    // Volume Estimator
    IconCircle: (props) => <IconCircle { ...props } />,
    IconRectangle: (props) => <IconRectangle { ...props } />,
    IconOval: (props) => <IconOval { ...props } />,
    IconOther: (props) => <IconOther { ...props } />,
    IconCircleBack: (props) => <IconBack { ...props } />,
    IconCircleEdit: (props) => <IconCircleEdit { ...props } />,
    IconForward: (props) => <IconForward { ...props } />,
    Rectangle: (props) => <Rectangle { ...props } />,
    RectangleDark: (props) => <RectangleDark { ...props } />,
    Oval: (props) => <Oval { ...props } />,
    OvalDark: (props) => <OvalDark { ...props } />,
    Circle: (props) => <Circle { ...props } />,
    CircleDark: (props) => <CircleDark { ...props } />,
    Other: (props) => <Other { ...props } />,
    OtherDark: (props) => <OtherDark { ...props } />,

    // General Icons
    IconEstimator: (props) => <IconEstimator { ...props } />,
    IconCheckmark: (props) => <IconCheckmark { ...props } />,
    IconDelete: (props) => <IconDelete { ...props } />,
    IconCircleAdd: (props) => <IconCircleAdd { ...props } />,
    IconCircleForward: (props) => <IconCircleForward { ...props } />,
    IconInformation: (props) => <IconInformation { ...props } />,
    IconCloseButton: (props)=> <IconCloseButton { ...props } />,
    IconEmptyCircle: (props)=> <IconEmptyCircle { ...props } />,
    IconChevronForward: (props) => <IconChevronForward { ...props } />,
    IconExportData: (props) => <IconExportData { ...props } />,
    IconImportData: (props) => <IconImportData { ...props } />,
    IconChevronCircleDown: (props) => <IconChevronCircleDown { ...props } />,
    IconChevronCircleUp: (props) => <IconChevronCircleUp { ...props } />,
    IconCircleAddSolid: (props) => <IconCircleAddSolid { ...props } />,
    IconPlay: (props) => <IconPlay { ...props } />,
    IconDeleteOutline: (props) => <IconDeleteOutline { ...props } />,
    IconMail: (props) => <IconMail { ...props } />,
    IconCircleCheckmark: (props) => <IconCircleCheckmark { ...props } />,
    IconWater: (props) => <IconWater { ...props } />,
    IconClipboard: (props) => <IconClipboard { ...props } />,
    IconLevels: (props) => <IconLevels { ...props } />,
    IconPlayWhite: (props) => <IconPlayWhite { ...props } />,
    IconBadge: (props) => <IconBadge { ...props } />,
    IconBeaker: (props) => <IconBeaker { ...props }/>,
    IconFeedback: (props) => <IconFeedback { ...props }/>,
    IconRightArrow: (props) => <RightArrow { ...props }/>,

    // Pool Icons
    IconCustomTargets: (props) => <IconCustomTargets { ...props } />,
    IconPoolName: (props) => <IconPoolName { ...props } />,
    IconPoolEmail: (props) => <IconPoolEmail { ...props } />,
    IconPoolFormula: (props) => <IconPoolFormula { ...props } />,
    IconPoolVolume: (props) => <IconPoolVolume { ...props } />,
    IconPoolWallType: (props) => <IconPoolWallType { ...props } />,
    IconPoolWaterType: (props) => <IconPoolWaterType { ...props } />,
    IconWaterType: (props)=> <IconPoolWaterType { ...props } />,
    IconVolume: (props)=> <IconVolume { ...props } />,
    IconWallType: (props)=> <IconPoolWallType { ...props } />,
    IconInfinitive: (props)=> <IconInfinitive { ...props } />,
    IconHeart: (props)=> <IconHeart { ...props } />,
    IconCharts: (props)=> <IconCharts { ...props } />,

    // Settings
    IconPooldashPlus: (props) => <IconPooldashPlus { ...props } />,
    IconScoop: (props) => <IconScoop { ...props } />,
    IconUnits: (props) => <IconUnits { ...props } />,
    IconSettings: (props) => <IconSettings { ...props } />,
    IconSearch: (props) => <IconSearch { ...props } />,
    IconTheme: (props) => <IconTheme { ...props } />,
    // Setting.Theme
    SmallSunDark: (props) => <SmallSunDark { ...props } />,
    SmallMoonDark: (props) => <SmallMoonDark { ...props } />,
    AutomaticLight: (props) => <AutomaticLight { ...props } />,
    AutomaticDark: (props) => <AutomaticDark { ...props } />,

    // Home
    HomeDescriptionText: (props) => <HomeDescriptionText { ...props } />,
    HomeWaves: (props) => <HomeWaves { ...props } />,
};
