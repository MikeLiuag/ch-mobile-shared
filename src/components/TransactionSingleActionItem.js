import React, {Component} from "react";
import {StyleSheet, View, TouchableOpacity} from "react-native";
import {Button, Text,} from "native-base";
import {Colors, TextStyles, CommonStyles } from "../styles";
import Icon from 'react-native-vector-icons/FontAwesome';


export class TransactionSingleActionItem extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    render() {
        const color = 'white';
        const size = 15;
        const paramStyle = {}

        return (
            <View style={styles.itemWrap}>
                <TouchableOpacity
                    style={styles.buttonRow}
                    onPress={this.props.onPress}
                >
                    <Text style={styles.buttonText}>{this.props.title}</Text>
                    <View style={[styles.iconBackground,
                        this.props.iconBackground
                        && {backgroundColor: this.props.iconBackground}]}>
                        {
                            this.props.renderIcon
                                ? this.props.renderIcon(size, color, paramStyle)
                                : (this.props.iconName
                                && <Icon
                                    name={this.props.iconName}
                                    size={size}
                                    color={color}
                                    style={paramStyle}
                                />)
                        }
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    iconBackground: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16
    },
    itemWrap: {
        borderWidth: 1,
        borderColor: Colors.colors.mediumContrastBG,
        backgroundColor: Colors.colors.white,
        borderRadius: 12
    },
    buttonText: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.highContrast
    }
});
