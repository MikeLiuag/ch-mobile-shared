import React, { Component } from 'react';
import {StyleSheet, AppState} from 'react-native';
import {Text, View} from 'react-native';
import LottieView from 'lottie-react-native';
import teamAnim from '../../../assets/animations/Dog_with_Computer';


export default class NoRecord extends Component<Props> {

    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            tagsError: null,
            avatarsResponse: null,
            appState : AppState.currentState
        };
    }

    componentDidMount(): void {
        AppState.addEventListener('change', this._handleAppState);
    }

    componentWillUnmount(): void {
        AppState.removeEventListener('change', this._handleAppState);
    }

    _handleAppState = () => {
        if(this.state.appState === 'active') {
            if(this.animation) {
                this.animation.play();
            }
        }
    }

    render() {
        return (
            <View style={styles.emptyWrapper}>
                <LottieView
                    ref={animation => {
                        this.animation = animation;
                    }}
                    style={ styles.emptyImage }
                    resizeMode="cover"
                    source={teamAnim}
                    autoPlay={true}
                    loop />
                <Text style={styles.scrText}>
                    We think you’ve already made progress by taking the step to start working with Confidant, but if you want to see more detailed information on your progress, then just start chatting with the Confidant Chat Bot.
                </Text>
                <Text style={styles.scrText}>
                    All you have to do is chat and we’ll make sure you get the information you need when you need it.
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    emptyWrapper: {
        marginTop: 15,
        alignItems: 'center',
    },
    emptyImage: {
        width: 250,
        height: 250
    },
    scrText: {
        color: '#30344D',
        fontFamily: "Roboto-Regular",
        fontSize: 14,
        textAlign: 'center',
        padding: 15,
    }
});
