import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Textarea } from "native-base";
import {Colors, TextStyles } from "../styles";

export class CommonTextArea extends Component<Props> {
    render() {
        const {value, placeHolderTextColor, isMultiline, placeHolderText, numberOfLines} = this.props;
        return (
            <Textarea
                style={{...styles.textBox,borderColor: this.props.borderColor}}
                value={value}
                onChangeText={this.props.onChangeText}
                getRef={this.props?.getRef}
                autoFocus={this.props?.autoFocus}
                rowSpan={3}
                placeholderTextColor={placeHolderTextColor}
                multiline={isMultiline}
                placeholder={placeHolderText}
                numberOfLines={numberOfLines}
            />
        );
    }
}
const styles = StyleSheet.create({
    textBox: {
        ...TextStyles.mediaTexts.inputText,
        ...TextStyles.mediaTexts.manropeRegular,
        color: Colors.colors.highContrast,
        backgroundColor: Colors.colors.white,
        padding: 16,
        height: 'auto',
        maxHeight: 160,
        minHeight: 120,
        borderWidth:1,
        borderColor:Colors.colors.borderColor,
        borderRadius: 8
    }
});
