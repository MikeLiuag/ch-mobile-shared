import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Button, Text, Icon } from "native-base";
import { Colors, TextStyles } from "../styles";

export class AddCardButton extends Component<Props> {

    render() {
        return (
            <Button
                transparent
                onPress={()=>this.props.onPress()}
                style={styles.addCardBtn}>
                <Icon name={'plus'} type={'Feather'} style={styles.addCardIcon} />
                <Text uppercase={false} style={styles.addCardText}>
                    Add Card
                </Text>
            </Button>
        );
    }
}
const styles = StyleSheet.create({
    addCardBtn: {
        backgroundColor: Colors.colors.primaryText,
        width: 210,
        height: 210,
        borderRadius: 12,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    addCardIcon: {
        color: Colors.colors.white,
        fontSize: 40,
        marginBottom: 10
    },
    addCardText: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.subTextL,
        color: Colors.colors.white,
    }
});
