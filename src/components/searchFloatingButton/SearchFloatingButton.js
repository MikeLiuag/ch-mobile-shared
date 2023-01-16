/**
 * Created by Khushal Khan on 2/1/2019.
 */

import React, {Component} from "react";
import {StyleSheet, TouchableOpacity, Platform} from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import {Colors} from "../../styles";
import {addTestID, isIphoneX} from "../../utilities";


export class SearchFloatingButton extends Component<Props> {
    render() {
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={styles.touchableOpacityStyle}
                activeOpacity={0.8}
            >
                <Icon style={styles.plusIcon }
                      {...addTestID('sf-btn-' + this.props.icon)}
                      name={this.props.icon}
                      size={26}
                      color={Colors.colors.white}/>

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    touchableOpacityStyle: {
        position: "absolute",
        width: 64,
        height: 64,
        right: 16,
        bottom: isIphoneX()? 40 : 16,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.colors.secondaryIcon
    },
    plusIcon: {
        marginTop: Platform.OS === 'ios'? 5 : 0
    }
});
