import React, {Component} from "react";
import {AppState, StyleSheet, TouchableOpacity, View} from "react-native";
import LottieView from "lottie-react-native";
import {Text} from "native-base";
import trophy from './../assets/animations/trophy';
import {addTestID} from "../utilities";

export class AnimatedProgressReportEntry extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState
        }
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppState);
    }

    componentWillUnmount(): void {
        AppState.removeEventListener('change', this._handleAppState);
    }

    _handleAppState = () => {
        if (this.state.appState === 'active') {
            if (this.animation) {
                this.animation.play();
            }
        }
    };

    render() {
        return (
            <TouchableOpacity
                {...addTestID('progress-report')}
                style={styles.libImage}
                              onPress={this.props.onPress}>
                <View style={styles.animWrapper}>
                    <LottieView
                        ref={animation => {
                            this.animation = animation;
                        }}
                        style={styles.mainImages}
                        source={trophy} autoPlay loop/>
                    <Text style={styles.animText}>Progress Report</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    libImage: {
        width: "45%",
        // flex: 0.5,
        justifyContent: "flex-start"
    },
    animWrapper: {
        borderRadius: 4,
        backgroundColor: '#fff',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    mainImages: {
        height: 130,
        width: 190,
        alignSelf: "center"
    },
    animText: {
        color: '#25345C',
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        fontWeight: '500',
        paddingTop: 16,
        paddingBottom: 16
    }
});
