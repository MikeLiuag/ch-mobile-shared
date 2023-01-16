import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Button } from "native-base";
import { Colors } from "../styles";
import EntypoIcons from 'react-native-vector-icons/Entypo';

export class BackButton extends Component<Props> {

    render() {
        return (
            <Button
                onPress={this.props.onPress}
                transparent
                style={styles.backButton}>
                <EntypoIcons size={30} color={Colors.colors.mainBlue} name="chevron-thin-left"/>
            </Button>
        );
    }
}
const styles = StyleSheet.create({
    backButton: {
        width: 35,
        paddingLeft: 0,
        paddingRight: 0
    }
});
