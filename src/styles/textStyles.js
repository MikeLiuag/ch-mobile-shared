/**
 * Created by Sana on 5/10/2019.
 */
import { createStyles, maxWidth } from 'react-native-media-queries';

export const commonText = {
    fontFamily: 'Roboto-Regular',
};

const baseTexts = {
    mainTitle: {
        ...commonText,
        maxWidth: '75%',
        marginTop: 10,
        fontSize: 24,
    },
    subTitle: {
        maxWidth: '70%',
        textAlign: 'left',
        fontSize: 14,
        fontFamily: 'OpenSans-Regular',
    },
    largeTitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 36,
        textAlign: 'center',
        fontWeight: '500',
    },

    // New UI/UX updates
    manropeExtraBold: {
        fontFamily: 'Manrope-ExtraBold'
    },
    manropeBold: {
        fontFamily: 'Manrope-Bold'
    },
    manropeMedium: {
        fontFamily: 'Manrope-Medium'
    },
    manropeRegular: {
        fontFamily: 'Manrope-Regular'
    },
    manropeLight: {
        fontFamily: 'Manrope-Light'
    },
    serifProExtraBold: {
        fontFamily: 'SourceSerifPro-Black'
    },
    serifProBold: {
        fontFamily: 'SourceSerifPro-Bold'
    },
    serifProMedium: {
        fontFamily: 'SourceSerifPro-SemiBold'
    },
    serifProRegular: {
        fontFamily: 'SourceSerifPro-Regular'
    },
    TextH1: {
        lineHeight: 48,
        fontSize: 34,
        letterSpacing: 1
    },
    TextH2: {
        lineHeight: 39,
        fontSize: 28,
        letterSpacing: 0.7
    },
    TextH3: {
        lineHeight: 28.8,
        fontSize: 24,
        letterSpacing: 0.5
    },
    TextH4: {
        lineHeight: 28,
        fontSize: 20,
        letterSpacing: 0.5
    },
    TextH5: {
        lineHeight: 25.5,
        fontSize: 17,
        letterSpacing: 0.5
    },
    TextH6: {
        lineHeight: 21,
        fontSize: 14,
        letterSpacing: 1.5
    },
    TextH7: {
        lineHeight: 24,
        fontSize: 15,
        letterSpacing: 0.25
    },
    subTextL: {
        lineHeight: 27,
        fontSize: 17,
        letterSpacing: 0.75
    },
    subTextM: {
        lineHeight: 21,
        fontSize: 15,
        letterSpacing: 0.5
    },
    subTextS: {
        lineHeight: 22,
        fontSize: 13,
        letterSpacing: 0.75
    },
    bodyTextL: {
        lineHeight: 30,
        fontSize: 20,
        letterSpacing: 0.75
    },
    bodyTextM: {
        lineHeight: 27,
        fontSize: 17,
        letterSpacing: 0.25
    },
    bodyTextS: {
        lineHeight: 25,
        fontSize: 15,
        letterSpacing: 0.25
    },
    bodyTextExtraS: {
        lineHeight: 22,
        fontSize: 13,
        letterSpacing: 0.25
    },
    captionText: {
        lineHeight: 22,
        fontSize: 13,
        letterSpacing: 0.25
    },
    overlineTextM: {
        lineHeight: 22,
        fontSize: 13,
        letterSpacing: 1
    },
    overlineTextS: {
        lineHeight: 20,
        fontSize: 12,
        letterSpacing: 1.25
    },
    buttonTextL: {
        lineHeight: 24,
        fontSize: 17,
        letterSpacing: 0.25
    },
    buttonTextM: {
        lineHeight: 21,
        fontSize: 15,
        letterSpacing: 0.5
    },
    buttonTextS: {
        lineHeight: 18,
        fontSize: 13,
        letterSpacing: 0.5
    },
    linkTextL: {
        lineHeight: 24,
        fontSize: 17,
        letterSpacing: 0.25
    },
    linkTextM: {
        lineHeight: 21,
        fontSize: 15,
        letterSpacing: 0.5
    },
    linkTextS: {
        lineHeight: 18,
        fontSize: 13,
        letterSpacing: 0.5
    },
    inputPlaceholder: {
        lineHeight: 24,
        fontSize: 17,
        letterSpacing: 0.5
    },
    inputText: {
        lineHeight: 21,
        fontSize: 15,
        letterSpacing: 0.5
    },
    inputLabel: {
        lineHeight: 18,
        fontSize: 13,
        letterSpacing: 0.25
    },
};

export const mediaTexts = createStyles(
    baseTexts,
    // override styles only if screen width is less than 500
    maxWidth(400, {
        mainTitle: {
            maxWidth: '85%',
            marginTop: 10,
            marginBottom: 10,
            fontSize: 18,
        },
        subTitle: {
            maxWidth: '80%',
            fontSize: 12,
            lineHeight: 16,
            marginBottom: 15,
        }
    })
);

