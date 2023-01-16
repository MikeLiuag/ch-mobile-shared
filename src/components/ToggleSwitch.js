import React, { Component } from "react";
import { StyleSheet } from "react-native";
import {addTestID} from "../utilities";
import {Colors, TextStyles } from "../styles";
import SwitchToggle from "react-native-switch-toggle";

export class ToggleSwitch extends Component<Props> {

    render() {
        return (
            <SwitchToggle
                {...addTestID(this.props.testId)}
                type={1}
                buttonStyle={styles.switchBtn}
                rightContainerStyle={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                leftContainerStyle={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}
                buttonTextStyle={{fontSize: 10}}
                textRightStyle={{
                    fontSize: 10,
                    color: 'black',
                    fontWeight: '500',
                    paddingLeft: 2
                }}
                textLeftStyle={{
                    fontSize: 10,
                    color: 'white',
                    paddingRight: 0
                }}
                containerStyle={styles.switchContainer}
                backgroundColorOn={this.props.backgroundColorOn}
                backgroundColorOff={this.props.backgroundColorOff}
                circleStyle={styles.switchCircle}
                switchOn={this.props.switchOn}
                onPress={this.props.onPress}
                circleColorOff={Colors.colors.white}
                circleColorOn={Colors.colors.white}
                duration={200}
            />
        );
    }
}
const styles = StyleSheet.create({
    switchBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute'
    },
    switchContainer: {
        marginTop: 0,
        width: 64,
        height: 34,
        borderRadius: 40,
        padding: 1
    },
    switchCircle: {
        width: 30,
        height: 30,
        borderRadius: 16,
        backgroundColor: Colors.colors.white,
        position: 'absolute'
    }
});
