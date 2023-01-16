import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { Icon, View, Item, Label, Input, Text } from "native-base";
import { addTestID } from "../utilities";
import { Colors, TextStyles } from "../styles";

export class StackedInputField extends Component<Props> {
    render() {
        return (
            <View style={this.props.hasFocus ?
                [styles.inputWrapper, { borderColor: Colors.colors.mainBlue }] : styles.inputWrapper}>
                <Item
                    stackedLabel
                    style={styles.inputFields}
                    error={this.props.hasError}
                    success={this.props.hasError === false}>
                    <Label
                        style={this.props.hasFocus? styles.inputLabelFocus : this.props.value ?
                            styles.inputLabelValue
                            : (this.props.hasError) ?
                                [styles.inputLabel, { color: Colors.colors.errorText }] : styles.inputLabel}>
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
                        multiline={this.props.multiline}
                    />
                    {this.props.hasFocus ?
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
        minHeight: 64,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.colors.white,
        // paddingTop: 16
    },
    inputFields: {
        elevation: 0,
        borderBottomWidth: 0,
        paddingLeft: 50
    },
    inputLabel: {
        ...TextStyles.mediaTexts.manropeBold,
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.inputLabel,
        paddingLeft: 5,
        marginTop: 3,
        marginBottom: -10
    },
    inputLabelFocus: {
        ...TextStyles.mediaTexts.manropeBold,
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.inputLabel,
        paddingLeft: 5,
        marginTop: 3,
        marginBottom: -10
    },
    inputLabelValue: {
        ...TextStyles.mediaTexts.manropeBold,
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.inputLabel,
        paddingLeft: 5,
        marginTop: 3,
        marginBottom: -10
    },
    inputBox: {
        ...TextStyles.mediaTexts.inputText,
        ...TextStyles.mediaTexts.manropeRegular,
        color: Colors.colors.highContrast,
        height: 30,
        width:'90%'
        // paddingLeft: 16s
    },
    inputIcon: {
        color: Colors.colors.neutral50Icon,
        fontSize: 22,
        paddingTop: 0,
        paddingRight: 16,
        // marginTop: -5,
        position: 'absolute',
        right: 45,
        bottom: 22,
        zIndex: 9

    }
});
