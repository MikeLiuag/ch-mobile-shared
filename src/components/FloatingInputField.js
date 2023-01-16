import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Icon, View, Item, Label, Input } from "native-base";
import {addTestID} from "../utilities";
import {Colors, TextStyles, CommonStyles } from "../styles";

export class FloatingInputField extends Component<Props> {
    render() {
        return (
            <View style={this.props.hasFocus ?
                [styles.inputWrapper, {borderColor: Colors.colors.mainBlue}] :
                this.props.addShadow? {...styles.inputWrapper, ...CommonStyles.styles.shadowBox} : styles.inputWrapper}>
                <Item
                    floatingLabel
                    style={styles.inputFields}
                    error={this.props.hasError}
                    success={this.props.hasError === false}>
                    <Label
                        style={this.props.hasFocus? styles.inputLabelFocus : this.props.value ?
                            styles.inputLabelValue
                            : (this.props.hasError) ?
                                [styles.inputLabel, {color: Colors.colors.errorText}] : styles.inputLabel}>
                        {this.props.hasError ? this.props.labelErrorText : this.props.labelText}
                    </Label>
                    <Input
                        {...addTestID(this.props.testId)}
                        style={styles.inputBox}
                        keyboardType={this.props.keyboardType}
                        onBlur={this.props.blur}
                        onFocus={this.props.focus}
                        returnKeyType={this.props.returnKeyType}
                        onSubmitEditing={this.props.submitEditing}
                        value={this.props.value}
                        onChangeText={this.props.changeText}
                        editable={this.props.editable}
                        maxLength={this.props.maxLength}
                    />
                    {
                        this.props.noIcon? null :
                            this.props.hasFocus ?
                                <Icon style={styles.inputIcon} type="AntDesign" name='closecircleo' onPress={() => {
                                    this.props.clearText();
                                }} />
                                :
                                <Icon style={styles.inputIcon} type={this.props.inputIconType} name={this.props.inputIconName} />
                    }
                </Item>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    inputWrapper: {
        width: '100%',
        backgroundColor: Colors.colors.white,
        height: 64,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.colors.white,
        paddingTop: 16
    },
    inputFields: {
        elevation: 0,
        borderBottomWidth: 0
    },
    inputLabel: {
        color: Colors.colors.lowContrast,
        ...TextStyles.mediaTexts.inputLabel,
        ...TextStyles.mediaTexts.manropeRegular,
        paddingLeft: 16,
        top: -16
    },
    inputLabelFocus: {
        ...TextStyles.mediaTexts.manropeBold,
        color: Colors.colors.primaryText,
        ...TextStyles.mediaTexts.inputLabel,
        paddingLeft: 16
    },
    inputLabelValue: {
        ...TextStyles.mediaTexts.manropeBold,
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.inputLabel,
        paddingLeft: 16
    },
    inputBox: {
        ...TextStyles.mediaTexts.inputText,
        ...TextStyles.mediaTexts.manropeRegular,
        color: Colors.colors.highContrast,
        height: 30,
        paddingLeft: 16
    },
    inputIcon: {
        color: Colors.colors.neutral50Icon,
        fontSize: 22,
        paddingTop: 0,
        paddingRight: 16,
        marginTop: -10
    }
});
