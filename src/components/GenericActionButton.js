import React, {Component} from "react";
import {StyleSheet, View, TouchableOpacity} from "react-native";
import {Button, Text,} from "native-base";
import {Buttons} from "../styles";
import Icon from 'react-native-vector-icons/FontAwesome';


export default class MenuButton extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    render() {
        const color = 'white';
        const size = 15;
        const paramStyle = {}

        return (
            <View style={styles.viewStyle}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={this.props.onPress}
                >
                    <View style={[styles.iconBackground,
                        this.props.iconBackground
                        && {backgroundColor: this.props.iconBackground}]}>
                        {
                            this.props.renderIcon
                                ? this.props.renderIcon(size, color, paramStyle)
                                : (this.props.iconName
                                && <Icon
                                    name={this.props.iconName}
                                    size={size}
                                    color={color}
                                    style={paramStyle}
                                />)
                        }
                    </View>
                    <Text style={styles.buttonText}>{this.props.title}</Text>
                </TouchableOpacity>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    iconBackground: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        paddingLeft: 16,
        paddingBottom: 16
    },
    viewStyle: {
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5'
    },
    buttonText: {
        fontSize: 15,
        fontFamily: "Roboto-Regular",
        letterSpacing: 0.7,
        textAlign: "left",
        paddingLeft: 24,
        width: "100%",
        color: "#25345C",
        textTransform: 'capitalize',
        fontWeight: '400',
        lineHeight: 27
    }
});
