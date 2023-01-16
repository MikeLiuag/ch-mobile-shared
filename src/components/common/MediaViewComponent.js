import React, {Component} from 'react';
import {Image, Platform, StyleSheet, View} from 'react-native';
import {Button, Container, Header, Left} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {addTestID, isIphoneX, getHeaderHeight} from "../../utilities";
import {VideoPlayer} from "./VideoPlayer";
import Loader from "../Loader";


const HEADER_SIZE = getHeaderHeight();

export class MediaViewComponent extends Component<Props> {

    constructor(props) {
        super(props);
        const type = this.props.type;
        const thumb = this.props.uri;
        const uri = type === 'image' ? thumb.replace('_thumbnail', '') : thumb;
        this.state = {
            type,
            uri,
            thumb,
            imageLoading: type === 'image',
            // isLoading: true
        };
    }

    navigateBack=()=> {
        this.props.goBack();
    };

    pauseVideo = () => {
        if (this.contentPlayer) {
            this.contentPlayer.pause();
        }
    };

    render() {
        return (
            <Container style={{backgroundColor: 'black'}}>
                <LinearGradient
                    start={{x: 1, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={['#fff', '#fff', '#f7f9ff']}
                    style={{flex: 1}}
                >
                    <Header transparent style={styles.header}>
                        {/*<StatusBar*/}
                        {/*    backgroundColor="transparent"*/}
                        {/*    barStyle="dark-content"*/}
                        {/*    translucent*/}
                        {/*/>*/}
                        <Left>
                            <Button
                                {...addTestID('Navigate-Back')}
                                onPress={() => this.navigateBack()}
                                transparent
                                style={styles.backButton}>
                                <Icon name="angle-left" size={32} color="#3fb2fe"/>
                            </Button>
                        </Left>
                    </Header>
                    {
                        this.state.type === 'image' ?
                            <View style={styles.imgWrapper}>
                                {
                                    this.state.imageLoading &&
                                    <Image
                                        style={styles.thumbImg}
                                        resizeMode='contain'
                                        source={{uri: this.state.thumb}}/>

                                }
                                <Image
                                    style={styles.fullViewImg}
                                    resizeMode='contain'
                                    loadingIndicatorSource={[{
                                        uri: this.state.thumb
                                    }]}
                                    onLoadEnd={e => this.setState({imageLoading: false})}
                                    source={{uri: this.state.uri}}/>

                            </View>

                            :
                            <View style={styles.videowrapper}>
                                <VideoPlayer
                                    {...addTestID('video')}
                                    // thumbnail={require('../../assets/images/play.png')}
                                    // endThumbnail={require('../../assets/images/play.png')}
                                    // endWithThumbnail
                                    video={{uri: this.state.uri}}
                                    ref={(player) => {
                                        this.contentPlayer = player;
                                    }}
                                    disableControlsAutoHide
                                    pauseOnPress
                                    autoplay
                                    onPlayPress={this.pauseVideo}
                                    onStart={this.pauseVideo}
                                    resizeMode='contain'
                                    style={styles.backgroundAudio}
                                    customStyles={audioStyles}
                                />
                            </View>
                    }

                    {
                        this.state.imageLoading && <Loader/>
                    }

                </LinearGradient>

            </Container>
        );
    };
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        paddingLeft: 3,
        borderBottomColor: '#fff',
        elevation: 0,
        justifyContent: 'flex-start',
        height: HEADER_SIZE,
    },
    backButton: {
        marginLeft: 15,
        width: 35,
    },
    imgWrapper: {
        width: '100%',
        flex: 1,
    },
    fullViewImg: {
        alignSelf: 'center',
        flex: 1,
        width: '100%',
    },
    thumbImg: {
        alignSelf: 'center',
        justifyContent: 'center',
        height: 250,
        width: 250
    },
    backgroundAudio: {
        marginTop: 10,
        width: '100%',
        height: 340,
        backgroundColor: '#E0E0E0',
    },
    videowrapper: {
        paddingTop: 10,
        // height: 400,
        flex: 1,
        width: '100%',
        marginBottom: 30,
    },
});

const audioStyles = {
    preloadingPlaceholder: {
        backgroundColor: '#25345C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnail: {
        backgroundColor: '#25345C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 84,
        height: 84,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playArrow: {
        color: 'white',
    },
    video: Platform.Version >= 24 ? {} : {
        backgroundColor: '#25345C',
    },
    controls: {
        backgroundColor: '#25345C',
        height: 90,
        marginTop: -90,
        flexDirection: 'row',
        alignItems: 'center',
    },
    playControl: {
        color: 'white',
        padding: 8,
    },
    extraControl: {
        color: 'white',
        padding: 8,
    },
    seekBar: {
        alignItems: 'center',
        height: 30,
        flexGrow: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginLeft: -10,
        marginRight: -5,
    },
    seekBarFullWidth: {
        marginLeft: 0,
        marginRight: 0,
        paddingHorizontal: 0,
        marginTop: -8,
        height: 5,
    },
    seekBarProgress: {
        height: 5,
        backgroundColor: '#4FACFE',
        borderRadius: 5,
    },
    seekBarKnob: {
        backgroundColor: '#4FACFE',
    },
    seekBarBackground: {
        backgroundColor: '#22242A',
        height: 5,
        borderRadius: 5,
        marginRight: 10,
    },
    overlayButton: {
        flex: 1,
    },
};
