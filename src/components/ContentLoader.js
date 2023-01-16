import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient';
import Svg, {Rect, Circle} from 'react-native-svg';
import {Colors,CommonStyles } from "../styles";

export class ContentLoader extends Component {
    constructor(props) {
        super(props);
    }

    renderContentLoader = () => {
        let loaderViews = [];
        const numItems = this.props.numItems || 1;
        const type = this.props.type || 'chat';
        for (let i = 0; i < numItems; i++) {
            loaderViews.push(this.renderLoaderItem(type, i));
        }
        return loaderViews;
    };

    renderLoaderItem = (type, index) => {
        switch (type) {
            case 'chat-card': {
                return (
                    <View style={styles.contentLoaderCard}>
                        <SvgAnimatedLinearGradient key={'content-loader-' + index} style={styles.contentLoaderCardInner}
                                                   width={500}
                                                   height={70}>
                            <Circle cx="44" cy={35} r="25"/>
                            <Rect x="80" y={19} rx="3" ry="3" width="150" height="13"/>
                            <Rect x="80" y={45} rx="3" ry="3" width="60" height="10"/>

                        </SvgAnimatedLinearGradient>
                        <SvgAnimatedLinearGradient key={'content-loader-' + index} style={styles.contentLoaderCardInner}
                                                   width={500}
                                                   height={90}>
                            <Rect x="25" y={20} rx="3" ry="3" width="160" height="10"/>
                            <Rect x="25" y={45} rx="3" ry="3" width="90" height="10"/>

                        </SvgAnimatedLinearGradient>
                    </View>
                );
            }
            case 'appt-v2': {
                return (
                    <View style={{...styles.contentLoaderCard, marginBottom: 40}}>
                        <SvgAnimatedLinearGradient key={'content-loader-' + index} style={styles.contentLoaderCardInner}
                                                   width={500}
                                                   height={170}>
                            <Rect x="20" y={19} rx="3" ry="3" width="110" height="13"/>
                            <Rect x="250" y={19} rx="3" ry="3" width="100" height="13"/>
                            <Rect x="20" y={55} rx="3" ry="3" width="310" height="18"/>
                            <Circle cx="44" cy={115} r="25"/>
                            <Rect x="80" y={100} rx="3" ry="3" width="190" height="13"/>
                            <Rect x="80" y={125} rx="3" ry="3" width="60" height="10"/>

                        </SvgAnimatedLinearGradient>
                    </View>
                );
            }
            case 'slots': {
                return (

                    <SvgAnimatedLinearGradient key={'content-loader-' + index}
                                               style={{
                                                   ...styles.contentLoaderCardInner,
                                                   marginBottom: 8,
                                                   borderRadius: 50
                                               }}
                                               width={340}
                                               height={70}>
                        <Rect x="70" y={25} rx="3" ry="3" width="70" height="18"/>
                        <Rect x="155" y={25} rx="3" ry="3" width="30" height="18"/>
                        <Rect x="200" y={25} rx="3" ry="3" width="70" height="18"/>

                    </SvgAnimatedLinearGradient>

                );
            }
            case 'chat':
                return (
                    <SvgAnimatedLinearGradient key={'content-loader-' + index} style={styles.contentLoaderItem}
                        // primaryColor="#e8f7ff"
                        // secondaryColor="#4dadf7"
                                               width={500}
                                               height={70}>
                        <Circle cx="44" cy={35} r="25"/>
                        <Rect x="80" y={19} rx="3" ry="3" width="150" height="13"/>
                        <Rect x="80" y={45} rx="3" ry="3" width="250" height="10"/>

                    </SvgAnimatedLinearGradient>
                );
            case 'checklist':
                return (
                    <SvgAnimatedLinearGradient key={'content-loader-' + index} style={styles.contentLoaderCheckItem}
                        // primaryColor="#e8f7ff"
                        // secondaryColor="#4dadf7"
                                               width={500}
                                               height={70}>
                        <Rect x="40" y={30} rx="3" ry="3" width="230" height="15"/>
                        <Rect x="350" y={25} rx="3" ry="3" width="33" height="25"/>

                    </SvgAnimatedLinearGradient>
                );
            case 'provider-search-card':
                return (
                    <SvgAnimatedLinearGradient key={'content-loader-' + index}
                                               width={500}
                                               height={270}>
                        <Circle cx="70" cy={65} r="38"/>
                        <Rect x="135" y={42} rx="3" ry="3" width="150" height="14"/>
                        <Rect x="135" y={70} rx="3" ry="3" width="100" height="11"/>
                        <Rect x="33" y={130} rx="3" ry="3" width="340" height="55"/>
                        <Rect x="33" y={202} rx="3" ry="3" width="340" height="55"/>

                    </SvgAnimatedLinearGradient>
                );

            case 'next-appointment':
                return (
                    <SvgAnimatedLinearGradient key={'content-loader-' + index} style={styles.appointmentCard}
                                               width={340}
                                               height={145}>
                        <Rect x="20" y={19} rx="3" ry="3" width="30" height="20"/>
                        <Rect x="60" y={19} rx="3" ry="3" width="110" height="20"/>
                        <Rect x="275" y={19} rx="3" ry="3" width="50" height="20"/>
                        <Rect x="20" y={55} rx="3" ry="3" width="310" height="1"/>
                        <Circle cx="44" cy={100} r="25"/>
                        <Rect x="80" y={85} rx="3" ry="3" width="160" height="13"/>
                        <Rect x="80" y={105} rx="3" ry="3" width="60" height="10"/>
                        <Rect x="290" y={85} rx="3" ry="3" width="30" height="20"/>

                    </SvgAnimatedLinearGradient>
                );

            case 'chatBot-loader':
                return (
                    <SvgAnimatedLinearGradient key={'content-loader-' + index}
                                               width={500} height={660}>
                        <Rect x="30" y={40} rx="3" ry="3" width="40" height="30"/>
                        <Rect x="345" y={40} rx="3" ry="3" width="40" height="30"/>

                        <Rect x="30" y={120} rx="3" ry="3" width="350" height="20"/>
                        <Rect x="30" y={150} rx="3" ry="3" width="300" height="20"/>

                        <Rect x="30" y={190} rx="3" ry="3" width="350" height="10"/>
                        <Rect x="30" y={210} rx="3" ry="3" width="350" height="10"/>
                        <Rect x="30" y={230} rx="3" ry="3" width="300" height="10"/>

                        <Rect x="30" y={300} rx="3" ry="3" width="350" height="55"/>
                        <Rect x="30" y={370} rx="3" ry="3" width="350" height="55"/>
                        <Rect x="30" y={440} rx="3" ry="3" width="350" height="55"/>

                        <Rect x="30" y={580} rx="3" ry="3" width="350" height="55"/>
                    </SvgAnimatedLinearGradient>
                );
        }

    };

    render() {
        return (
            <View style={{flex: 1}}>
                {this.renderContentLoader()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contentLoaderItem: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        borderColor: '#B7D2E5',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        marginBottom: -1,
        backgroundColor: '#fff',
    },
    contentLoaderCheckItem: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        borderColor: '#B7D2E5',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        marginBottom: 5,
    },
    contentLoaderCardInner: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        borderColor: '#B7D2E5',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        marginBottom: -1,
        backgroundColor: '#fff',
    },
    contentLoaderCard: {
        marginBottom: 30,
        height: 150,
        borderRadius: 50
    },
    appointmentCard: {
        borderRadius: 12,
        backgroundColor: Colors.colors.whiteColor,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', ...CommonStyles.styles.shadowBox,
        marginBottom: 32,
    },
});
