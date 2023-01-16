import React, {Component} from "react";
import {StyleSheet} from "react-native";
import {Button, Text, View, Icon} from "native-base";
import {addTestID} from "../utilities";
import {Colors, TextStyles} from "../styles";

export class SecondaryButton extends Component<Props> {

    render() {
        return (
            <Button
                {...addTestID(this.props.testId)}
                onPress={this.props.onPress}
                transparent
                style={this.props.inactiveBtn ? buttonStyles.secondaryButtonInactive : [buttonStyles.secondaryButton,
                    {
                        backgroundColor: this.props.bgColor ? this.props.bgColor : Colors.colors.primaryColorBG,
                        borderColor: this.props.borderColor ? this.props.borderColor : Colors.colors.mainBlue40
                    }]}
            >
                {this.renderButtonChild()}
            </Button>
        );
    }

    renderButtonChild() {

        return (
            <View style={buttonStyles.contentWrap}>
                {this.props?.iconLeft ?
                    <Icon type={this.props.type} style={{...buttonStyles.btnIcon,color: this.props.color,left: 24}} name={this.props.iconLeft} size={this.props.size}/> : null}
                <Text
                    uppercase={false}
                    style={[{...buttonStyles.buttonText,textAlign: this.props.iconRight ?"left":"center"}, (this.props.inactiveBtn) ? {color: Colors.colors.highContrast} :
                        {color: this.props.textColor ? this.props.textColor : Colors.colors.primaryText}]}>
                    {this.props.text} </Text>
                {this.props.iconRight ?
                    <View
                        style={{
                            ...buttonStyles.btnIcon,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: this.props.iconBgColor || Colors.colors.whiteColor,
                            borderRadius: 8,
                            padding: 8,
                            right: 24
                        }}>
                        <Icon type={this.props.type} style={{color: this.props.color}} name={this.props.iconRight} size={this.props.size}/>
                    </View>:null}

            </View>
        );
    }
}

const buttonStyles = StyleSheet.create({
    secondaryButton: {
        borderRadius: 8,
        height: 64,
        borderWidth: 1,
        borderColor: Colors.colors.mainBlue40,
        marginBottom: 16,
        // padding:16
    },
    secondaryButtonInactive: {
        borderRadius: 8,
        height: 64,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: Colors.colors.borderColor,
        marginBottom: 16,
        padding:16
    },
    contentWrap: {
        flexDirection: 'row',
        // padding:12,
        position: 'relative',
        alignItems:'center'
    },
    btnIcon: {
        position: 'absolute'
    },
    spinner: {
        alignSelf: "center"
    },
    buttonText: {
        ...TextStyles.mediaTexts.bodyTextS,
        ...TextStyles.mediaTexts.manropeMedium,
        width: "100%"
    }
});
