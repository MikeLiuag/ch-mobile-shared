import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { ListItem, Text } from "native-base";
import {addTestID} from "../utilities";
import {Colors, TextStyles } from "../styles";
import { CheckBox, Icon } from 'react-native-elements';

export class SingleCheckListItem extends Component<Props> {
    render() {
        return (
            <ListItem
                {...addTestID(this.props.listTestId)}
                key={this.props.keyId}
                onPress={this.props.listPress}
                style={
                    this.props.itemSelected
                        ? [styles.multiList, styles.multiListSelected]
                        : styles.multiList
                }
            >
                <Text
                    style={
                        this.props.itemSelected
                            ? [
                                styles.multiListText,
                                {
                                    color: Colors.colors.primaryText
                                },
                            ]
                            : styles.multiListText
                    }>
                    {this.props.itemTitle}
                </Text>
                {/*<CheckBox*/}
                {/*    {...addTestID(this.props.checkTestId)}*/}
                {/*    style={*/}
                {/*        this.props.itemSelected ? [styles.multiCheck, styles.multiCheckSelected] : styles.multiCheck*/}
                {/*    }*/}
                {/*    color={Colors.colors.mainBlue}*/}
                {/*    checked={this.props.itemSelected}*/}
                {/*    onPress={this.props.listPress}*/}
                {/*/>*/}
                <CheckBox
                    {...addTestID(this.props.checkTestId)}
                    checkedIcon="check"
                    iconType='Feather'
                    size={24}
                    checkedColor={Colors.colors.mainBlue}
                    uncheckedIcon=""
                    containerStyle={
                        this.props.itemSelected ? [styles.multiCheck, styles.multiCheckSelected] : styles.multiCheck
                    }
                    checked={this.props.itemSelected}
                    onPress={this.props.listPress}

                />
            </ListItem>
        );
    }
}
const styles = StyleSheet.create({
    multiList: {
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.colors.borderColor,
        backgroundColor: Colors.colors.white,
        marginLeft: 0,
        paddingLeft: 16,
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 16,
        marginBottom: 8,
        borderRadius: 8,
    },
    multiListSelected: {
        borderColor: Colors.colors.mainBlue40,
        backgroundColor: Colors.colors.primaryColorBG
    },
    multiListText: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.highContrast,
        paddingRight: 10,
        flex: 1,
    },
    multiCheck: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderColor: Colors.colors.borderColor,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        color :Colors.colors.mainBlue,
        padding: 0,
    },
    multiCheckSelected: {
        borderWidth: 1,
        borderColor: Colors.colors.mainBlue,
        color: Colors.colors.mainBlue,
        backgroundColor: Colors.colors.whiteColor
    }
});
