import React, {Component} from "react";
import {Platform, StyleSheet} from "react-native";
import {Icon, View, Picker, Text} from "native-base";
import {Colors, TextStyles} from "../styles";
import {valueExists} from "../utilities";


export class DropDownInputField extends Component<Props> {
    render() {
        const {dropDownIconColor, options, value, type, hasFocus, editable, label, keyValuePair} = this.props;
        const hasLabel = valueExists(label);
        return (
            <>
            {hasLabel && <Text style={styles.outerLabel}>{label}</Text>}
            <View style={hasFocus ?
                [styles.inputWrapper, {borderColor: Colors.colors.mainBlue}] : styles.inputWrapper}>
                <Picker
                    icon={false}
                    mode="dropdown"
                    dropdownIconColor={dropDownIconColor}
                    selectedValue={value}
                    onValueChange={e => this.props.onChange(e, type)}
                    enabled={editable}
                    style={Platform.OS === 'ios' ? styles.pickerIos : styles.pickerStyle}
                    headerStyle={{marginTop: 20}}
                    placeholderStyle={{color: Colors.colors.highContrast}}
                    textStyle={styles.inputLabel}
                    iosIcon={<Icon name='arrow-down' style={styles.downIcon} size={35}
                                   color={Colors.colors.primaryIcon}/>}
                >
                    {
                        !hasLabel ? <Picker.Item label={type} value=""/> : <Picker.Item label={'None'} value=""/>
                    }
                    {options ? options.map((item, index) => {
                        if (keyValuePair) {
                            return (
                                <Picker.Item key={index} label={item.value} value={item.name}/>
                            );
                        } else {
                            return (
                                <Picker.Item key={index} label={item} value={item}/>
                            );
                        }

                    }) : null}
                </Picker>
            </View>
            </>

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
        borderColor: Colors.colors.white
    },
    inputLabel: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.inputText,
        ...TextStyles.mediaTexts.manropeRegular,
        width: Platform.OS === 'ios'? '90%' : '100%',
        paddingLeft: 10
    },
    outerLabel: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.inputLabel,
        ...TextStyles.mediaTexts.manropeMedium,
        marginBottom: 12
    },
    downIcon: {
        position: 'absolute',
        right: 18,
        bottom: 10,
        marginRight: 0,
        backgroundColor: Colors.colors.white
    },
    pickerStyle: {
        marginLeft: 10
    },
    pickerIos: {
        marginLeft: 2,
        height: 58
    }
});
