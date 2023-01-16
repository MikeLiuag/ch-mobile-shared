import React, { Component } from "react";
import { StyleSheet, Image, Platform } from "react-native";
import { Button, View, Text, Input, Item } from "native-base";
import { Colors, CommonStyles, TextStyles } from "../styles";
import {addTestID} from "../utilities";

export class AddFundsBox extends Component<Props> {


    render() {
        return (
            <View style={styles.addFundsWrap}>
                <Text style={styles.addFundsTitle}>{this.props.fundTitle}</Text>
                <View style={styles.addFundsBoxOuter}>
                    <View style={styles.addFundsBox}>
                        <View style={styles.dollarBox}>
                            {/*<Text numberOfLines={1} style={styles.dollarText}>${this.props.fundAmount}</Text>*/}
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Text numberOfLines={1} style={styles.dollarText}>$</Text>
                                <Input
                                    style={styles.inputBox}
                                    keyboardType={'number-pad'}
                                    value={this.props.fundAmount+""}
                                    onBlur={()=>{
                                        if(this.props.fundAmount==="") {
                                            this.props.setCustomAmount(1)
                                        }
                                    }}
                                    onChangeText={(text)=>{
                                        if(text==="") {
                                            this.props.setCustomAmount("")
                                        } else {
                                            this.props.setCustomAmount(Number(text))
                                        }
                                    }}
                                />
                            </Item>
                        </View>
                    </View>
                    <View style={styles.minusBox}>
                        <Button
                            style={{ width: 64, height: 64 }}
                            transparent onPress={()=>{
                            if((Number(this.props.fundAmount)-1)>0) {
                                this.props.decrementAmount();
                            }
                        }}>
                            <Image
                                style={styles.minusImg}
                                source={require('../assets/images/Minus-Button.png')} />
                        </Button>
                    </View>
                    <View style={styles.plusBox}>
                        <Button
                            style={{ width: 64, height: 64 }}
                            transparent onPress={this.props.incrementAmount}>
                            <Image
                                style={styles.plusImg}
                                source={require('../assets/images/Plus-Button.png')} />
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    addFundsWrap: {
        alignItems: 'center'
    },
    addFundsTitle: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.mediumContrast,
        marginBottom: 16,
        textAlign: 'center'
    },
    addFundsBoxOuter: {
        height: 150,
        position: 'relative'
    },
    addFundsBox: {
        ...CommonStyles.styles.shadowBox,
        borderRadius: 12,
        width: 250,
        height: 150,
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    dollarBox: {
        backgroundColor: Colors.colors.white,
        borderRadius: 8,
        borderColor: Colors.colors.highContrastBG,
        borderWidth: 1,
        padding: 24,
        alignSelf: 'center'
    },
    inputBox: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
        height: Platform.OS === 'ios' ? 34 : 60,
        textAlign: 'center',
        flex: 0,
        maxWidth: 130,
        marginTop: Platform.OS === 'ios' ? -4 : 6
    },
    dollarText: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
        textAlign: 'center'
    },
    minusBox: {
        position: 'absolute',
        left: -40,
        top: 48
    },
    minusImg: {
        width: 64,
        height: 64
    },
    plusBox: {
        position: 'absolute',
        right: -40,
        top: 48
    },
    plusImg: {
        width: 64,
        height: 64
    }
});
