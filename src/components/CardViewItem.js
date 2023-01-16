import React, { Component } from "react";
import {StyleSheet, Image, TouchableOpacity} from 'react-native';
import { View, Text } from "native-base";
import { Colors, TextStyles } from "../styles";

export class CardViewItem extends Component<Props> {

    render() {
        let MainView = View;
        if(this.props.touchable) {
            MainView = TouchableOpacity;
        }
        return (
            <MainView style={styles.cardItem} onPress={this.props.showCardDetails}>
                <Image style={styles.cardBg}
                       source={this.props.brand === 'Visa' ? require('../assets/images/card-view.png') : require('../assets/images/card-view-master.png')}
                />
                <View style={styles.cardNumber}>
                    <Text style={styles.numberSection}>****</Text>
                    <Text style={styles.numberSection}>****</Text>
                    <Text style={styles.numberSection}>****</Text>
                    <Text style={styles.numberSection}>{this.props.lastDigits}</Text>
                </View>
                <View style={styles.cardInfo}>
                    <View style={styles.info1}>
                        <Text style={styles.infoLight}>cardholder</Text>
                        <Text numberOfLines={1} style={styles.infoDark}>{this.props.holderName}</Text>
                    </View>
                    <View style={styles.info1}>
                        <Text style={styles.infoLight}>Expiration</Text>
                        <Text style={styles.infoDark}>{this.props.expiryDate}</Text>
                    </View>
                </View>
            </MainView>
        );
    }
}
const styles = StyleSheet.create({
    cardItem: {
        position: 'relative',
        width: 327,
        paddingLeft: 24,
        height: 210,
    },
    cardBg: {
        position: 'absolute'
    },
    cardNumber: {
        flexDirection: 'row',
        marginTop: 90,
        marginBottom: 24
    },
    numberSection: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.TextH4,
        color: Colors.colors.white,
        marginRight: 16
    },
    cardInfo: {
        flexDirection: 'row'
    },
    info1: {
        marginRight: 24,
        maxWidth: 130
    },
    infoLight: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.overlineTextS,
        color: Colors.colors.white,
        opacity: 0.6,
        textTransform: 'uppercase'
    },
    infoDark: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.white,
        // flex: 1
    }
});
