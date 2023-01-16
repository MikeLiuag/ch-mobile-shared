import React, {Component} from "react";
import {StyleSheet, TouchableOpacity} from "react-native";
import {Button, Text, View, Icon} from "native-base";
import { Colors, TextStyles } from "../styles";
import LinearGradient from 'react-native-linear-gradient';


export class CommonChatBanner extends Component<Props> {

    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={styles.bannerWrapper}>
                <LinearGradient start={{x: 0, y: 1}} end={{x: 1, y: 0}}
                                colors={[this.props.gredientColor1, this.props.gredientColor2]}
                                style={styles.nineBG}>
                    <View style={styles.iconBox}>
                        <Icon type={this.props.iconType} name={this.props.iconName}
                              style={[styles.bannerIcon, { color: this.props.iconColor }]}/>
                    </View>
                    <View style={styles.textBox}>
                        <Text style={styles.textMain}>{this.props.mainText}</Text>
                        {
                            this.props.subText && (
                                <Text style={styles.textSub}>{this.props.subText}</Text>
                            )
                        }
                    </View>
                    {
                        this.props.nextIcon && (
                            <Button
                                onPress={this.props.onPress}
                                style={styles.nextBtn} transparent>
                                <Icon type={'AntDesign'} name="right" style={styles.nextIcon}/>
                            </Button>
                        )
                    }
                </LinearGradient>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    bannerWrapper: {
        marginTop: 10
    },
    nineBG: {
        paddingVertical: 24,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconBox: {
        backgroundColor: Colors.colors.white,
        width: 48,
        height: 48,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bannerIcon: {
        color: Colors.colors.primaryIcon,
        fontSize: 24
    },
    textBox: {
        paddingLeft: 16,
        flex: 1,
    },
    textMain: {
        ...TextStyles.mediaTexts.subTextM,
        ...TextStyles.mediaTexts.manropeBold,
        color: Colors.colors.white,
        marginBottom: 4
    },
    textSub: {
        ...TextStyles.mediaTexts.captionText,
        ...TextStyles.mediaTexts.manropeMedium,
        color: Colors.colors.white
    },
    nextBtn: {
        paddingLeft: 0,
        paddingRight: 0,
        justifyContent: 'flex-end'
    },
    nextIcon: {
        color: Colors.colors.white,
        fontSize: 26,
        marginRight: 0,
        opacity: 0.7
    }
});
