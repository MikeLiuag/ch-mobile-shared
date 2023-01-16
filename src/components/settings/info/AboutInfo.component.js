import React, {Component} from 'react';
import { Container, Content, Text, View,} from 'native-base';
import {StatusBar, StyleSheet, Platform, Image} from "react-native";
import {addTestID, isIphoneX} from '../../../utilities';
import {BackButton} from "../../BackButton";
import {Colors, TextStyles} from "../../../styles";

export class AboutInfoComponent extends Component<Props> {

    constructor(props) {
        super(props);
    }

    backClicked = () => {
        this.props.goBack();
    };

    render() {
        return (
            <Container>
                <StatusBar
                    backgroundColor={Platform.OS === 'ios'? null : "transparent"}
                    translucent
                    barStyle={'dark-content'}
                />
                <View style={styles.backButtonWrapper}>
                    <BackButton
                        {...addTestID('back-btn')}
                        onPress={() => {this.backClicked()}}
                    />
                </View>
                <Content showsVerticalScrollIndicator={false}>
                    <View style={styles.mainContent}>
                        <Text {...addTestID('about-confidant')}
                              style={styles.mainTitle}>About Confidant</Text>
                        <Text style={styles.subTitle}>
                            The Confidant Health app is your tool for a healthier, happier, and more productive life.
                        </Text>

                        <Text style={styles.subTitle}>
                            Regardless of your starting point, we’re here to connect you with resources and support so you can develop the habits, mindsets, and skills to thrive.
                        </Text>

                        <Text style={styles.subTitle}>
                            Whether you’re here for yourself or to help a loved one, we offer custom plans to suit your needs. This may include virtual clinical care, therapy, coaching, support groups, or exercises.
                        </Text>

                    </View>


                    <View style={styles.alfieImgWrapper}>
                        <Image
                            style={styles.bottomBackgroundBlue}
                            resizeMode={'cover'}
                            source={require('../../../assets/images/about-rectangle-blue.png')}
                        />
                        <Image
                            style={styles.bottomBackgroundWhite}
                            resizeMode={'cover'}
                            source={require('../../../assets/images/about-rectangle-white.png')}/>

                        <Image
                            style={styles.bottomAlfie}
                            resizeMode={'contain'}
                            source={require('../../../assets/images/alfie-about.png')}
                        />

                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    mainContent: {
        paddingTop: 36,
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 21
    },
    backButtonWrapper: {
        position: 'relative',
        zIndex: 2,
        paddingTop: isIphoneX() ? 50 : 44,
        paddingLeft: 22
    },
    mainTitle: {
        ...TextStyles.mediaTexts.serifProExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
        marginBottom: 16
    },
    subTitle: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextM,
        color: Colors.colors.mediumContrast,
        marginBottom: 40
    },
    alfieImgWrapper: {
        alignItems: 'center',
    },
    bottomBackgroundBlue: {
        position: 'relative',
        width: '100%',
        bottom: 0
    },
    bottomBackgroundWhite: {
        position: 'absolute',
        width: '100%',
        bottom: 0
    },
    bottomAlfie: {
        position: 'absolute',
        width: '100%',
        bottom: 35
    }
});
