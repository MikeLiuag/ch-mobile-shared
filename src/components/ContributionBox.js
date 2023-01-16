import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "native-base";
import {Colors, TextStyles, CommonStyles } from "../styles";

export class ContributionBox extends Component<Props> {

    render() {

        return (
            this.props.subAmount !== null && (
                <View style={[styles.donationAmountView, {...CommonStyles.styles.shadowBox}]}>
                    <Text style={styles.donationAmountHeading}>Your contribution</Text>
                    <View>
                        <Text style={styles.donationAmountNumber}>${this.props.subAmount}
                            <Text style={styles.donationMonthText}>/month</Text>
                        </Text>
                    </View>
                </View>
            )
        );
    }
}
const styles = StyleSheet.create({
    donationAmountView: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginTop: 24,
        marginBottom: 32,
        backgroundColor: Colors.colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.colors.borderColorLight,
        height: 64
    },
    donationAmountHeading: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.captionText,
        color: Colors.colors.highContrast
    },
    donationAmountNumber: {
        ...TextStyles.mediaTexts.bodyTextS,
        ...TextStyles.mediaTexts.manropeBold,
        color: Colors.colors.highContrast,
        textAlign: 'center'
    },
    donationMonthText: {
        ...TextStyles.mediaTexts.captionText,
        ...TextStyles.mediaTexts.manropeLight,
        color: Colors.colors.lowContrast
    }
});
