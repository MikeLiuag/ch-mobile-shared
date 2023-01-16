import React, { Component } from "react";
import { StyleSheet, Image , TouchableOpacity} from "react-native";
import { Button, Text, View} from "native-base";
import {Colors, TextStyles, CommonStyles } from '../../styles';
import {Rating} from 'react-native-elements';
import LineIcons from "react-native-vector-icons/SimpleLineIcons";

export class CommonApptDetailBox extends Component<Props> {

    constructor(props) {
        super(props);
        this.isProviderApp=this.props?.isProviderApp
        this.isPatientProhibitive=this.props?.isPatientProhibitive
    }

    render() {
        return (
            <TouchableOpacity style={styles.singleInfoWrap}  onPress={this.props.onPress} >
                {
                    this.props.providerInfo?
                        <View style={styles.contentWrapper}>
                            <View style={this?.isProviderApp?this?.isPatientProhibitive?styles.colorImgBGRed:styles.colorImgBG:styles.colorImgBG}>
                                {
                                    this.props.avatar ? (
                                        <>
                                            <Image
                                                style={styles.personImg}
                                                resizeMode={'cover'}
                                                source={{uri: this.props.avatar}}  />
                                            <View style={styles.statusDot}></View>
                                        </>
                                    ) : (
                                        <View
                                            style={{
                                                ...styles.proBgMain,
                                                backgroundColor: '#d97eff',
                                            }}>
                                            <Text style={styles.proLetterMain}>
                                                {this.props.mainText.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                    )
                                }

                            </View>
                            <View style={styles.personDetails}>
                                <Text style={styles.infoTitle} numberOfLines={2}>{this.props.mainText}</Text>
                                <Text style={styles.infoContent} numberOfLines={3}>{this.props.subText}</Text>
                            </View>
                        </View>
                        :
                        <View style={styles.contentDetails}>
                            <Text style={styles.darkText}>{this.props.mainText}</Text>
                            {
                                this.props.paymentInfo && (
                                    <View style={styles.visaWrap}>
                                        {
                                            this.props.cardBrand && <Image
                                                style={styles.visaImg}
                                                source={this.props.cardBrand === 'visa' ? require('../../assets/images/visa.png') : require('../../assets/images/master.png')}/>
                                        }

                                        <Text style={styles.greyText}>{this.props.paymentDetailText}</Text>
                                    </View>
                                )
                            }

                            <View>
                                {
                                    this.props.rating && (
                                        <View style={styles.ratingBox}>
                                            <Rating
                                                readonly
                                                type="custom"
                                                showRating={false}
                                                ratingCount={5}
                                                imageSize={24}
                                                ratingColor={Colors.colors.secondaryIcon}
                                                selectedColor={Colors.colors.secondaryIcon}
                                                startingValue={this.props.rating}
                                                fractions={2}
                                                tintColor={'#fff'}
                                                ratingBackgroundColor={Colors.colors.secondaryColorBG}
                                            />
                                            <Text style={styles.ratingText}>{this.props.rating}.0</Text>
                                        </View>
                                    )
                                }
                                {
                                    this.props.subText && (
                                        <Text style={styles.greyText}>{this.props.subText}</Text>
                                    )
                                }
                            </View>
                        </View>
                }

                {
                    this.props.nextArrow && (
                        <Button transparent
                                onPress={this.props.onPress}
                        >
                            <LineIcons size={24} color={Colors.colors.primaryIcon} name="arrow-right"/>
                        </Button>
                    )
                }
                {
                    this.props.textBtn && (
                        <Button transparent
                                onPress={this.props.onPress}
                                style={styles.editBtn}>
                            <Text uppercase={false} style={styles.editText}>{this.props.textBtnContent}</Text>
                        </Button>
                    )
                }

            </TouchableOpacity>

        );
    }
}
const styles = StyleSheet.create({
    singleInfoWrap: {
        ...CommonStyles.styles.shadowBox,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'space-evenly'
    },
    colorImgBG: {
        width: 48,
        height: 48,
        position: 'relative',
        marginRight: 12
    },
    colorImgBGRed: {
        width: 54,
        height: 54,
        borderRadius: 28,
        position: 'relative',
        borderColor: Colors.colors.darkRed,
        borderWidth: 2,
        marginRight: 12,
        padding: 1
    },
    personImg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        padding:8,
        borderColor: Colors.colors.highContrastBG,
        borderWidth: 1
    },

    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.colors.neutral50Icon,
        borderColor: Colors.colors.white,
        borderWidth: 2,
        position: 'absolute',
        bottom: 3,
        right: 2
    },
    personDetails:{
        maxWidth:240
    },
    infoTitle: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS
    },
    infoContent: {
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText
    },
    contentDetails: {
        // paddingLeft: 12
    },
    darkText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS
    },
    greyText: {
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText
    },
    visaWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    visaImg: {
        marginRight: 8,
        width: 25,
        height: 20
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8
    },
    ratingText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.captionText,
        paddingLeft: 8
    },
    editBtn: {
        paddingRight: 0
    },
    editText: {
        color: Colors.colors.primaryText,
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.linkTextS,
        paddingRight: 0
    },
    proBgMain: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proLetterMain: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.TextH3,
        color: Colors.colors.whiteColor,
    },
});
