import React, {Component} from "react";
import {StyleSheet} from "react-native";
import {Icon, View, Item, Label, Input, TextArea, Textarea, Form} from "native-base";
import {addTestID} from "../utilities";
import {Colors, TextStyles} from "../styles";
import {isIphoneX} from "ch-mobile-shared";

export class MultiLineTextInputField extends Component<Props> {
    render() {
        const {value, placeHolderTextColor, isMultiline, placeHolderText, numberOfLines} = this.props;
        return (
            <Form>
                <View style={styles.textareaWrapper}>
                    <Textarea
                        style={styles.textBox}
                        value={value}
                        placeholderTextColor={placeHolderTextColor}
                        onChangeText={this.props.onChange}
                        multiline={isMultiline}
                        placeholder={placeHolderText}
                        numberOfLines={numberOfLines}/>
                </View>
            </Form>
        );
    }
}

const styles = StyleSheet.create({
    textareaWrapper: {
        marginBottom: 20,
    },
    textBox: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.inputText,
        color: Colors.colors.inputValue,
        padding: 16,
        width: 327,
        height: 120,
        left: 0,
        top: 0,
        borderRadius: 8
    }
});
