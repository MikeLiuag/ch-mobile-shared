import React, {Component} from "react";
import {StyleSheet} from "react-native";
import {Button, Text, Spinner, View, Icon} from "native-base";
import {addTestID} from "../utilities";
import {Colors, TextStyles} from "../styles";
import AntIcons from "react-native-vector-icons/AntDesign";
import { createStyles, maxWidth } from 'react-native-media-queries';

export class PrimaryButton extends Component<Props> {

    render() {
        return (
            <Button
                {...addTestID(this.props.testId)}
                disabled={this.props.disabled}
                onPress={() => {
                    this.props.onPress();
                }}
                transparent
                style={this.props.disabled ?
                    [buttonStyles.startButtonDisable,{backgroundColor: this.props.bgColor ? this.props.bgColor : Colors.colors.mainBlue20,
                        borderColor: this.props.bgColor ? this.props.bgColor : Colors.colors.mainBlue20}] :
                    [buttonStyles.startButton, {backgroundColor: this.props.bgColor ? this.props.bgColor : Colors.colors.mainBlue}]}
            >
                {this.renderButtonChild()}
            </Button>
        );
    }

    renderButtonChild() {
        if (this.props.isLoading) {
            return <Spinner color="white" style={buttonStyles.spinner}/>;
        } else {
            return <View style={buttonStyles.contentWrap}>
                {this.props.iconName ?
                    <Icon type={this.props.type}
                          style={{
                              ...buttonStyles.btnIcon,
                              left: 24,
                              color: this.props.color
                          }}

                          name={this.props.iconName} size={this.props.size}/> : null}
                <Text
                    uppercase={false}
                    style={[buttonStyles.buttonText, (this.props.disabled) ? {color: Colors.colors.white} :
                        {color: this.props.textColor ? this.props.textColor : Colors.colors.white}]}>
                    {this.props.text} </Text>
                {this.props.arrowIcon ?
                    <AntIcons style={{...buttonStyles.btnIcon,right: 24}} name='arrowright' size={24}
                              color={Colors.colors.white}/> : null}

            </View>;
        }
    }
}

const mainStyles = {
    startButton: {
        borderRadius: 8,
        height: 64
    },
    startButtonDisable: {
        borderRadius: 8,
        height: 64,
        backgroundColor: Colors.colors.mainBlue20,
        borderColor: Colors.colors.mainBlue20,
        borderWidth: 1
    },
    contentWrap: {
        flexDirection: 'row',
        position: 'relative',
        alignItems: 'center'
    },
    btnIcon: {
        position: 'absolute'
    },
    spinner: {
        alignSelf: "center"
    },
    buttonText: {
        ...TextStyles.mediaTexts.buttonTextL,
        ...TextStyles.mediaTexts.manropeBold,
        textAlign: "center",
        width: "100%"
    }
};

export const buttonStyles = createStyles(
    mainStyles,
    maxWidth(414, {
        buttonText: {
            ...TextStyles.mediaTexts.buttonTextM
        }
    }),
    maxWidth(375, {
        buttonText: {
            ...TextStyles.mediaTexts.buttonTextM
        },
        startButton: {
            height: 60
        },
    }),
    maxWidth(320, {
        buttonText: {
            ...TextStyles.mediaTexts.buttonTextS
        },
        startButton: {
            height: 54
        },
    }),
);

