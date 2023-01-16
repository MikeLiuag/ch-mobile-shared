/**
 * Created by Sana on 5/24/2021.
 */
import { createStyles } from 'react-native-media-queries';
import * as Colors from './colors';
import * as TextStyles from './textStyles';
import { isIphoneX } from '../utilities';

const baseStyles = {
    signInUpBG: {
        width: '100%',
        position: 'absolute',
        top: -100
    },
    letterWrapper: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.colors.shadowColor,
        borderRadius: 24,
        elevation: 0,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 25,
        shadowOpacity: 1.0,
        shadowColor: Colors.colors.shadowColor,
        marginBottom: 64,
        backgroundColor: '#fff',
        overflow: 'hidden'
    },
    blueProBG: {
        width: 120,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.colors.mainBlue
    },
    proLetterInBox: {
        ...TextStyles.mediaTexts.manropeExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.white,
        textAlign: 'center'
    },
    blueLinkText: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.linkTextM,
        color: Colors.colors.primaryText,
        textAlign: 'center',
        marginTop: 20
    },
    shadowBox: {
        borderColor: Colors.colors.shadowColor,
        elevation: 0,
        borderWidth: 1,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 25,
        shadowOpacity: 1.0,
        shadowColor: Colors.colors.shadowColor,
        backgroundColor: Colors.colors.white
    },
    stickyShadow: {
        borderColor: Colors.colors.shadowColor,
        // borderWidth: 1,
        elevation: 0,
        shadowOffset: {
            width: 10,
            height: -5
        },
        shadowRadius: 20,
        shadowOpacity: 1.0,
        shadowColor: Colors.colors.shadowColor2,
        backgroundColor: Colors.colors.white
    },
    headerShadow: {
        borderColor: Colors.colors.shadowColor,
        elevation: 0,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 20,
        shadowOpacity: 0.9,
        shadowColor: Colors.colors.shadowColor,
        backgroundColor: Colors.colors.screenBG
    },
    commonModalWrapper: {
        position:'relative',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 44,
        backgroundColor: Colors.colors.white
    },
    commonOverlayWrapper: {
        height: 'auto',
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX() ? 40 : 25,
        // paddingBottom: 25,
        paddingTop: 36,
        alignSelf: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        elevation: 3,
        shadowOffset: {width: 0, height: 10},
        shadowColor: '#f5f5f5',
        shadowOpacity: 0.5,
    },
    commonSwipeBar: {
        position: 'absolute',
        backgroundColor: Colors.colors.swipeBg,
        width: 48,
        height: 4,
        borderRadius: 2,
        top: 8,
        alignSelf: 'center'
    },
    commonAptHeader: {
        ...TextStyles.mediaTexts.serifProExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
        marginBottom: 20
    }
};

export const styles = createStyles(
    baseStyles,
    // override styles only if screen width is changed
);

