import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { View } from "native-base";
import { Colors } from "../styles";

export class ProgressBars extends Component<Props> {

    render() {
        var bars = [];
        for(let i = 0; i < this.props.totalBars; i++){
            bars.push(
                <View
                    key = {i}
                    style={this.props.index === i? styles.singleSelectedProgress : styles.singleProgress }/>
            )
        }
        return (
            <View style={styles.progressBar}>
                {bars}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    progressBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 60,
        marginBottom: 10
    },
    singleProgress: {
        width: 16,
        height: 4,
        borderRadius: 8,
        backgroundColor: Colors.colors.mainBlue20,
        marginLeft: 4,
        marginRight: 4
    },
    singleSelectedProgress: {
        width: 24,
        height: 4,
        borderRadius: 8,
        backgroundColor: Colors.colors.mainBlue,
        marginLeft: 4,
        marginRight: 4
    }
});
