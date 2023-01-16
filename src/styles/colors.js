/**
 * Created by Sana on 5/10/2019.
 */

import { isDarkMode } from '../utilities';

export const colors  = {
    white: '#fff',
    whiteColor: '#fff',
    black: '#000',
    blue1: '#00C8FE',
    blue2: '#4FACFE',
    blue3: '#3fb2fe',
    lightestText: '#CBCCDC',
    lightText: '#757682',
    darkText: '#222222',
    unSelect: '#EDEDF7',
    grey: '#EDEDF7',
    darkBlue: '#25345C',
    inputBorder: '#ebebeb',
    inputPlaceholder: '#b3bec9',
    inputValue: '#515d7d',
    lightRed: '#f78795',
    darkRed: '#d0021b',
    blueGrey: '#515d7d',
    lightText1:'#646C73',
    lightText2:'#969FA8',
    starRatingColor:'#ffca00',




    // Updated colors - New UI/UX
    mainBlue: '#0374DD',
    mainBlue80: 'rgba(3, 116, 221, 0.8)',
    mainBlue60: 'rgba(3, 116, 221, 0.6)',
    mainBlue40: 'rgba(3, 116, 221, 0.4)',
    mainBlue20: 'rgba(3, 116, 221, 0.2)',
    mainBlue10: 'rgba(3, 116, 221, 0.1)',
    mainBlue05: 'rgba(3, 116, 221, 0.05)',

    lightBlue: '#7CBFFD',
    mediumBlue:  isDarkMode()? '#0381F6' : '#036AC9',
    darkerBlue: isDarkMode()? '#1795FF' : '#0052A6',

    // dark Mode blue colors
    mediumBlueDM: '#0381F6',
    darkerBlueDM: '#1795FF',

    mainPink: '#DD0374',
    mainPink80: 'rgba(221, 3, 116, 0.8)',
    mainPink60: 'rgba(221, 3, 116, 0.6)',
    mainPink40: 'rgba(221, 3, 116, 0.4)',
    mainPink20: 'rgba(221, 3, 116, 0.2)',
    mainPink10: 'rgba(221, 3, 116, 0.1)',
    mainPink05: 'rgba(221, 3, 116, 0.05)',
    mediumPink: isDarkMode()? '#F60381' : '#D3006A',
    darkerPink: isDarkMode()? '#FF0D8B' : '#BF0056',
    // dark Mode pink colors
    mediumPinkDM: '#F60381',
    darkerPinkDM: '#FF0D8B',

    borderColor: '#E7E8E9',
    borderColorLight: 'rgba(0, 0, 0, 0.09)',
    // Text colors
    highContrast: isDarkMode()? '#E0E1E2' : '#111C24',
    mediumContrast: isDarkMode()? '#A2A6A9' : '#414E58',
    lowContrast: isDarkMode()? '#7E8388' : '#637888',
    primaryText: isDarkMode()? '#1795FF' : '#005EBE',
    secondaryText: isDarkMode()? '#FF0D8B' : '#DD0374',
    successText: isDarkMode()? '#8CE480' : '#16782E',
    informationText: isDarkMode()? '#88A2FF' : '#0A36FF',
    warningText: isDarkMode()? '#FFCE67' : '#AD5400',
    errorText: isDarkMode()? '#FB9D81' : '#AE1824',
    disableText: isDarkMode()? '#646A6F' : '#8BA0B0',
    // Text colors for dark mode
    highContrastDM: '#E0E1E2',
    mediumContrastDM: '#A2A6A9',
    lowContrastDM: '#7E8388',
    primaryTextDM: '#1795FF',
    secondaryTextDM: '#FF0D8B',
    successTextDM: '#8CE480',
    informationTextDM: '#88A2FF',
    warningTextDM: '#FFCE67',
    errorTextDM: '#FB9D81',
    disableTextDM: '#646A6F',

    // Background colors
    screenBG: isDarkMode()? '#111A22' : '#F8FAFC',
    lowContrastBG: isDarkMode()? '#1D252D' : '#FFF',
    mediumContrastBG: isDarkMode()? '#262F36' : '#F1F5F8',
    highContrastBG: isDarkMode()? '#2E353D' : '#EAF1F5',
    successBG: isDarkMode()? '#163225' : '#EBFCE4',
    informationBG: isDarkMode()? '#1D2943' : '#EBEFFF',
    warningBG: isDarkMode()? '#352F21' : '#FFF8E5',
    errorBG: isDarkMode()? '#352429' : '#FFF5F0',
    primaryColorBG: isDarkMode()? '#102335' : '#EBF4FC',
    secondaryColorBG: isDarkMode()? '#26192B' : '#FCEBF4',
    // Background colors fo dark Mode
    screenBGDM: '#111A22',
    lowContrastBGDM: '#1D252D',
    mediumContrastBGDM: '#262F36',
    highContrastBGDM: '#2E353D',
    successBGDM: '#163225',
    informationBGDM: '#1D2943',
    warningBGDM: '#352F21',
    errorBGDM: '#352429',
    primaryColorBGDM: '#102335',
    secondaryColorBGDM: '#26192B',

    // Icon colors
    primaryIcon: isDarkMode()? '#0381F6' : '#0374DD',
    secondaryIcon: isDarkMode()? '#F31B8C' : '#DD0374',
    neutral50Icon: isDarkMode()? '#FCFDFE' : '#9BAAB6',
    neutral100Icon: isDarkMode()? '#FCFDFE' : '#637888',
    neutral300Icon: isDarkMode()? '#FCFDFE' : '#414E58',
    neutral500Icon: isDarkMode()? '#FCFDFE' : '#111C24',
    successIcon: isDarkMode()? '#32BC39' : '#2DA834',
    informationIcon: isDarkMode()? '#5F7EFF' : '#3B5EFF',
    warningIcon: isDarkMode()? '#FFA319' : '#FE9900',
    errorIcon: isDarkMode()? '#FF5C50' : '#F53B2E',

    // Icon colors dark mode
    primaryIconDM: '#0381F6',
    secondaryIconDM: '#F31B8C',
    whiteIconDM: '#FCFDFE',
    neutral100IconDM: '#FCFDFE',
    neutral300IconDM: '#FCFDFE',
    neutral500IconDM: '#FCFDFE',
    successIconDM: '#32BC39',
    informationIconDM: '#5F7EFF',
    warningIconDM: '#FFA319',
    errorIconDM: '#FF5C50',
    white04: 'rgba(255, 255, 255, 0.4)',
    shadowColor: 'rgba(0,0,0, 0.02)',
    overlayBg: 'rgba(17, 28, 36, 0.4)',
    swipeBg: 'rgba(17, 28, 36, 0.2)',
    homeProviderImageBG: '#F6F9FC',
    homeServiceImageBG: '#FFFCEE',
    homeInviteImageBG: '#F3FBFF',
    homeChatImageBG: '#FFF2F3',
    homeGroupsImageBG: '#F1F8FA',
    shadowColor2:'rgba(0,0,0, 0.09)'
};
