import React, { Component } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, Text, View, Icon } from "native-base";
import {addTestID} from "../utilities";
import {Colors, TextStyles } from "../styles";
import EntypoIcons from 'react-native-vector-icons/Entypo';
import {ToggleSwitch} from './ToggleSwitch';

export class SingleSettingItem extends Component<Props> {

    render() {
        const nickname = this.props.settingItem.title;
        return (
            <TouchableOpacity
                {...addTestID(this.props.testId)}
                activeOpacity={0.8}
                style={styles.singleItem}
                onPress={this.props.onPress}
            >
                <View>
                    {
                        this.props.settingItem.profileItem?
                            <View style={styles.blueCircleBG}>
                                <Text style={styles.nameLetterInCircle}>{nickname.charAt(0).toUpperCase()}</Text>
                            </View>
                            :
                            <Button
                                transparent
                                onPress={this.props.onPress}
                                style={{...styles.settingIconWrap, backgroundColor: this.props.settingItem.iconBGColor? this.props.settingItem.iconBGColor : Colors.colors.neutral300Icon}}>
                                {
                                    this.props.settingItem.renderIcon && this.props.settingItem.renderIcon(
                                        {...styles.settingIcon, color: this.props.settingItem.iconColor? this.props.settingItem.iconColor : '#fff' })
                                }
                                {/*<Icon name={this.props.iconName} type={this.props.iconType} style={styles.settingIcon} />*/}
                            </Button>
                    }

                </View>
                <View style={styles.itemDetail}>
                    <Text
                        {...addTestID(this.props.titleId)}
                        style={styles.itemName}>{this.props.settingItem.title}</Text>
                    <Text {...addTestID(this.props.desId)}
                          style={styles.itemDes} numberOfLines={2}>
                        {this.props.settingItem.des} {this.props.settingItem.toggleable && (this.props.settingItem.checked?'enabled':'disabled')}
                    </Text>
                </View>
                <View style={styles.nextWrapper}>
                    {
                        this.props.settingItem.toggleable ? (
                            <View style={styles.nextWrapper}>
                                <ToggleSwitch
                                    testId={'setting-toggle'}
                                    switchOn={this.props.settingItem.checked}
                                    onPress={this.props.settingItem.onToggle}
                                    backgroundColorOn={Colors.colors.mainPink}
                                    backgroundColorOff={Colors.colors.neutral50Icon}
                                />
                            </View>
                        ): (
                            <Button transparent style={styles.nextButton} onPress={this.props.onPress}>
                                <EntypoIcons size={30} color={Colors.colors.neutral50Icon} name="chevron-thin-right"/>
                            </Button>
                        )
                    }

                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    singleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12
    },
    settingIconWrap: {
        width:48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.colors.highContrastBG,
        paddingTop: 0,
        paddingBottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    blueCircleBG: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.colors.mainBlue
    },
    nameLetterInCircle: {
        ...TextStyles.mediaTexts.manropeExtraBold,
        ...TextStyles.mediaTexts.overlineTextM,
        color: Colors.colors.white,
        textAlign: 'center'
    },
    settingIcon: {
        fontSize: 24,
        color: Colors.colors.neutral50Icon,
        marginLeft: 0,
        marginRight: 0
    },
    itemDetail: {
        flex: 2,
        paddingLeft: 12
    },
    itemName: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.highContrast
    },
    itemDes: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText,
        color: Colors.colors.lowContrast
    }
});
