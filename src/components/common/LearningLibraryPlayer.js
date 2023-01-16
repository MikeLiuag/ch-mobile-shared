import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    ActivityIndicator,
    Image,
    ImageBackground,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewPropTypes,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {addTestID} from '../../utilities'; // eslint-disable-line
import Video from 'react-native-video'; // eslint-disable-line
import LinearGradient from 'react-native-linear-gradient';
import AntIcon from 'react-native-vector-icons/AntDesign';

const BackgroundImage = ImageBackground || Image; // fall back to Image if RN < 0.46

const styles = StyleSheet.create({
    preloadingPlaceholder: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timingText: {
        fontFamily: 'Roboto-Regular',
        color: 'white',
        fontSize: 18,
    },
    smallPlayerTimming: {
        fontFamily: 'Roboto-Regular',
        color: '#3fb2fe',
        fontSize: 18,
    },
    thumbnail: {
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greControl: {
        flex: 1,
        // width: 40,
        // height: 40,
        // borderRadius: 32,
        // justifyContent: 'center',
        // alignItems: 'center',
        // overflow: 'hidden',
    },
    playArrow: {
        color: 'white',
    },
    video: Platform.Version >= 24 ? {} : {
        backgroundColor: 'transparent',
    },
    controls: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        height: 48,
        marginTop: -48,
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
        marginTop: -3,
        height: 3,
    },
    seekBarProgress: {
        height: 3,
        backgroundColor: '#F00',
    },
    activityIndicator: {
        position: 'absolute',
        top: 105,
        alignSelf: 'center',
        height: 50,
        justifyContent: 'center',
    },
    seekBarKnob: {
        width: 20,
        height: 20,
        marginHorizontal: -8,
        marginVertical: -10,
        borderRadius: 10,
        backgroundColor: '#F00',
        transform: [{scale: 0.8}],
        zIndex: 1,
    },
    seekBarBackground: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        height: 3,
    },
    overlayButton: {
        flex: 1,
    },
    audioText: {
        color: '#515D7D',
        fontFamily: 'Roboto-Bold',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: 18,
        fontSize: 15,
        letterSpacing: 0.5,
        paddingRight: 5,
        // paddingTop:15,
        // paddingBottom:35,
        paddingLeft: 8,
        flex: 2,
    },
    audioTextNoPlay: {
        color: '#515D7D',
        fontFamily: 'Roboto-Bold',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: 18,
        fontSize: 15,
        letterSpacing: 0.5,
        flex: 2,
        paddingLeft: 24,
    },
    nextPreviousWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    audioTextDescriptive: {
        color: '#515D7D',
        fontFamily: 'Roboto-Bold',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: 18,
        fontSize: 15,
        letterSpacing: 0.5,
        paddingLeft: 16,
    },
});

export class LearningLibraryPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFullPlayer: this.props.isFullPlayer,
            isGradientP: this.props.isGradientP,
            isStarted: props.autoplay,
            isPlaying: props.autoplay,
            width: 200,
            progress: 0,
            isMuted: props.defaultMuted,
            isControlsVisible: !props.hideControlsOnStart,
            duration: 0,
            opacity: 0,
            isSeeking: false,
            currentTime: '00:00',
            onLoadShowMessage: true,

        };

        this.seekBarWidth = 200;
        this.wasPlayingBeforeSeek = props.autoplay;
        this.seekTouchStart = 0;
        this.seekProgressStart = 0;

        this.onLayout = this.onLayout.bind(this);
        this.onStartPress = this.onStartPress.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onEnd = this.onEnd.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onPlayPress = this.onPlayPress.bind(this);
        this.onMutePress = this.onMutePress.bind(this);
        this.showControls = this.showControls.bind(this);
        this.onToggleFullScreen = this.onToggleFullScreen.bind(this);
        this.onSeekBarLayout = this.onSeekBarLayout.bind(this);
        this.onSeekGrant = this.onSeekGrant.bind(this);
        this.onSeekRelease = this.onSeekRelease.bind(this);
        this.onSeek = this.onSeek.bind(this);
    }

    componentDidMount() {
        if (this.props.autoplay) {
            this.hideControls();
        }


    }

    componentWillUnmount() {
        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
            this.controlsTimeout = null;
        }
    }

    onLayout(event) {
        const {width} = event.nativeEvent.layout;
        this.setState({
            width,
        });
    }

    onStartPress() {
        if (this.props.onStart) {
            this.props.onStart();
            this.setState(state => ({
                isPlaying: true,
                isStarted: true,
                progress: state.progress === 1 ? 0 : state.progress,
            }));
        } else {
            this.setState(state => ({
                isPlaying: false,
                isStarted: false,
                progress: state.progress === 1 ? 0 : state.progress,
            }));
        }

        this.hideControls();
    }

    getFormattedTimeFromSeconds = (sec) => {
        sec = Math.trunc(sec);
        let min = Math.trunc(sec / 60);
        sec = Math.floor(Math.trunc(sec % 60));
        return (min >= 10 ? min : '0' + min) + ':' + (sec >= 10 ? sec : '0' + sec);
    };

    onProgress(event) {

        if (this.state.isSeeking) {
            return;
        }
        if (this.props.onProgress) {
            this.props.onProgress(event);
        }

        this.setState({
            currentTime: this.getFormattedTimeFromSeconds(event.currentTime),
            progress: event.currentTime / (this.props.duration || this.state.duration),
        });
    }

    onEnd(event) {
        if (this.props.onEnd) {
            this.props.onEnd(event);
        }

        if (this.props.endWithThumbnail) {
            this.setState({isStarted: false});
            this.player.dismissFullscreenPlayer();
        }

        this.setState({progress: 1});

        if (!this.props.loop) {
            this.setState(
                {isPlaying: false},
                () => this.player && this.player.seek(0),
            );
        } else {
            this.player.seek(0);
        }
    }

    onLoad(event) {
        console.log('OnLoad');
        if (this.props.onLoad) {
            this.props.onLoad(event);
        }

        const {duration} = event;
        this.setState({duration, opacity: 0  });
    }

    onLoadStart = (ev) => {
        console.log('LoadStart');
        console.log(ev);
        this.setState({
            opacity: 1,

        });
    };

    onBuffer = (ev) => {
        console.log('Fuasdf');
        console.log(ev);
        const {isBuffering} = ev;
        this.setState({opacity: isBuffering ? 1 : 0});
    };

    onPlayPress() {
        if (this.props.onPlayPress) {
            this.props.onPlayPress();
            this.setState({isPlaying: !this.state.isPlaying });
        } else {
            this.setState({isPlaying: false});
        }
        this.showControls();
    }

    onMutePress() {
        const isMuted = !this.state.isMuted;
        if (this.props.onMutePress) {
            this.props.onMutePress(isMuted);
        }
        this.setState({
            isMuted,
        });
        this.showControls();

    }

    onToggleFullScreen() {
        this.player.presentFullscreenPlayer();
    }

    onSeekBarLayout({nativeEvent}) {
        const customStyle = this.props.customStyles.seekBar;
        let padding = 0;
        if (customStyle && customStyle.paddingHorizontal) {
            padding = customStyle.paddingHorizontal * 2;
        } else if (customStyle) {
            padding = customStyle.paddingLeft || 0;
            padding += customStyle.paddingRight ? customStyle.paddingRight : 0;
        } else {
            padding = 20;
        }

        this.seekBarWidth = nativeEvent.layout.width - padding;
    }

    onSeekStartResponder() {
        return true;
    }

    onSeekMoveResponder() {
        return true;
    }

    onSeekGrant(e) {
        console.log('OnSeekGrant');
        this.seekTouchStart = e.nativeEvent.pageX;
        this.seekProgressStart = this.state.progress;
        this.wasPlayingBeforeSeek = this.state.isPlaying;
        // this.setState({
        //     isSeeking: true,
        //     isPlaying: false,
        // });
    }

    onSeekRelease() {
        console.log('OnSeekRelease');
        this.setState({
            isSeeking: false,
            isPlaying: this.wasPlayingBeforeSeek,
        });
        this.showControls();
    }

    onSeek(e) {
        console.log('OnSeek');
        const diff = e.nativeEvent.pageX - this.seekTouchStart;
        const ratio = 100 / this.seekBarWidth;
        const progress = this.seekProgressStart + ((ratio * diff) / 100);

        this.setState({
            progress,
        });

        this.player.seek(progress * this.state.duration);
    }

    getSizeStyles() {
        const {videoWidth, videoHeight} = this.props;
        const {width} = this.state;
        const ratio = videoHeight / videoWidth;
        return {
            height: width * ratio,
            width,
        };
    }

    hideControls() {
        this.setState({ onLoadShowMessage : false})
        console.log('hide Controls');
        if (this.props.onHideControls) {
            this.props.onHideControls();
        }

        if (this.props.disableControlsAutoHide) {
            return;
        }

        if (this.controlsTimeout) {
            clearTimeout(this.controlsTimeout);
            this.controlsTimeout = null;
        }
        this.controlsTimeout = setTimeout(() => {
            this.setState({isControlsVisible: false});
        }, this.props.controlsTimeout);
    }

    showControls() {
        console.log('show Controls');
        if (this.props.onShowControls) {
            this.props.onShowControls();
        }

        this.setState({
            isControlsVisible: true,


        });
        this.hideControls();
    }

    seek(t) {
        this.player.seek(t);
    }

    stop() {
        this.setState({
            isPlaying: false,
            progress: 0,
        });
        this.seek(0);
        this.showControls();
    }

    pause() {
        console.log('pause');
        this.setState({
            isPlaying: false,

        });
        this.showControls();
    }

    resume() {
        this.setState({
            isPlaying: true,
        });
        this.showControls();
    }

    renderStartButton() {
        const {customStyles} = this.props;
        return (
            this.props.isFullPlayer ? <TouchableOpacity
                    style={[styles.playButton, customStyles.playButton]}
                    onPress={this.onStartPress}
                >
                    <Icon style={[styles.playArrow, customStyles.playArrow, { marginTop: -40 }]} name="play-arrow"
                          size={this.props.playArrowSize ? this.props.playArrowSize : 82}/>
                </TouchableOpacity>
                :

                <TouchableOpacity
                    style={[styles.playButton, customStyles.playButton]}
                    onPress={this.onStartPress}
                >
                    {
                        this.props.isGradientP ?
                            <LinearGradient start={{x: 0, y: 1}} end={{x: 1, y: 0}}
                                            colors={['#1ed0de', '#34b6fe', '#6078ea']}
                                            style={customStyles.greControl}>
                                <Icon style={[styles.playArrow, customStyles.playArrow]} name="play-arrow"
                                      size={this.props.playArrowSize ? this.props.playArrowSize : 42}/>
                            </LinearGradient> :
                            <Icon style={[styles.playArrow, customStyles.playArrow]} name="play-arrow"
                                  size={this.props.playArrowSize ? this.props.playArrowSize : 42}/>
                    }
                </TouchableOpacity>


        );
    }

    renderThumbnail() {
        const {thumbnail, style, customStyles, ...props} = this.props;
        return (
            this.props.isFullPlayer ?
                <BackgroundImage
                    {...props}
                    style={[
                        styles.thumbnail,
                        this.getSizeStyles(),
                        style,
                        customStyles.thumbnail,
                    ]}
                    source={thumbnail}
                >
                    {this.renderStartButton()}
                </BackgroundImage>
                :
                <BackgroundImage
                    {...props}
                    style={[
                        styles.thumbnail,
                        this.getSizeStyles(),
                        style,
                        customStyles.thumbnail,
                    ]}
                    source={thumbnail}
                >
                    {this.renderStartButton()}
                </BackgroundImage>
        );
    }

    renderSeekBar(fullWidth) {
        const {customStyles, disableSeek} = this.props;
        return (
            <View
                {...addTestID('On-seek-bar-layout')}
                style={[
                    styles.seekBar,
                    fullWidth ? styles.seekBarFullWidth : {},
                    customStyles.seekBar,
                    fullWidth ? customStyles.seekBarFullWidth : {},
                ]}
                onLayout={this.onSeekBarLayout}
            >
                <View
                    style={[
                        {flexGrow: this.state.progress},
                        styles.seekBarProgress,
                        customStyles.seekBarProgress,
                    ]}
                />
                {!fullWidth && !disableSeek && this.state.duration > 0 ? (
                    <View
                        style={[
                            styles.seekBarKnob,
                            customStyles.seekBarKnob,
                            this.state.isSeeking ? {transform: [{scale: 1}]} : {},
                            this.state.isSeeking ? customStyles.seekBarKnobSeeking : {},
                        ]}
                        hitSlop={{top: 20, bottom: 20, left: 10, right: 20}}
                        onStartShouldSetResponder={this.onSeekStartResponder}
                        onMoveShouldSetPanResponder={this.onSeekMoveResponder}
                        onResponderGrant={this.onSeekGrant}
                        onResponderMove={this.onSeek}
                        onResponderRelease={this.onSeekRelease}
                        onResponderTerminate={this.onSeekRelease}
                    />
                ) : null}
                <View style={[
                    styles.seekBarBackground,
                    {flexGrow: 1 - this.state.progress},
                    customStyles.seekBarBackground,
                ]}/>
            </View>
        );
    }

    renderControls() {
        const {customStyles} = this.props;
        return (
            this.props.isFullPlayer ?
                <View style={[styles.controls, customStyles.controls]}>
                    {this.props.isFullPlayer ?
                        <View style={styles.nextPreviousWrapper}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.props.getArticle(false);
                                }}
                                style={[customStyles.controlButton, customStyles.playControl]}
                            >
                                <AntIcon
                                    style={[styles.playControl, customStyles.controlIcon, customStyles.playIcon, { marginRight: 30 }]}
                                    name="stepbackward" size={33} color="#3fb2fe"/>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.onPlayPress}
                                style={[customStyles.controlButton, customStyles.playControl]}
                            >
                                <Icon
                                    style={[styles.playControl, customStyles.controlIcon, customStyles.playIcon]}
                                    name={this.state.isPlaying ? 'pause' : 'play-arrow'}
                                    size={65}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.props.getArticle(true);
                                }}
                                style={[customStyles.controlButton, customStyles.playControl]}
                            >
                                <AntIcon
                                    style={[styles.playControl, customStyles.controlIcon, customStyles.playIcon, { marginLeft: 30 }]}
                                    name="stepforward" size={33} color="#3fb2fe"/>
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity
                            onPress={this.onPlayPress}
                            style={[customStyles.controlButton, customStyles.playControl]}
                        >
                            <Icon
                                style={[styles.playControl, customStyles.controlIcon, customStyles.playIcon]}
                                name={this.state.isPlaying ? 'pause' : 'play-arrow'}
                                size={55}
                            />
                        </TouchableOpacity>
                    }
                    <View style={{width: '100%'}}>
                        {this.renderSeekBar()}
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={styles.timingText}>{this.state.currentTime}</Text>
                            <Text
                                style={styles.timingText}>{this.getFormattedTimeFromSeconds(this.state.duration)}</Text>
                        </View>
                    </View>
                    {this.props.muted ? null : (
                        <TouchableOpacity onPress={this.onMutePress} style={customStyles.controlButton}>
                            <Icon
                                style={[styles.extraControl, customStyles.controlIcon]}
                                name={this.state.isMuted ? 'volume-off' : 'volume-up'}
                                size={34}
                            />
                        </TouchableOpacity>
                    )}
                    {(Platform.OS === 'android' || this.props.disableFullscreen) ? null : (
                        <TouchableOpacity onPress={this.onToggleFullScreen} style={customStyles.controlButton}>
                            <Icon
                                style={[styles.extraControl, customStyles.controlIcon]}
                                name="fullscreen"
                                size={32}
                            />
                        </TouchableOpacity>
                    )}

                </View>
                :
                <View style={[styles.controls, customStyles.controls]}>
                    <TouchableOpacity
                        onPress={this.onPlayPress}
                        style={[customStyles.controlButton, customStyles.playControl]}
                    >
                        <LinearGradient start={{x: 0, y: 1}} end={{x: 1, y: 0}}
                                        colors={['#1ed0de', '#34b6fe', '#6078ea']}
                                        style={customStyles.greControl}>
                            <Icon
                                style={[styles.playControl, customStyles.controlIcon, customStyles.playIcon, {padding: 5}]}
                                name={this.state.isPlaying ? 'pause' : 'play-arrow'}
                                size={30}
                            />
                        </LinearGradient>
                    </TouchableOpacity>


                    {this.state.isPlaying ?
                        this.renderSeekBar() :
                        (this.props.timeRequired ?
                            <Text style={styles.audioText}>{this.props.timeRequired} minutes listen time</Text> : null)
                    }
                    {this.props.isGradientP ? (
                        <Text
                            style={styles.smallPlayerTimming}>{this.state.currentTime}/{this.getFormattedTimeFromSeconds(this.state.duration)}</Text>
                    ) : null
                        // <Text style={styles.timingText}>{this.state.currentTime}/{this.getFormattedTimeFromSeconds(this.state.duration)}</Text>


                    }

                    {/*{*/}
                    {/*    this.props.onLoad ? (<Text>Listen to Article</Text>)*/}
                    {/*}*/}
                    {!this.props.isGradientP && (
                        this.props.muted ? null : (
                            <TouchableOpacity onPress={this.onMutePress} style={customStyles.controlButton}>
                                <Icon
                                    style={[styles.extraControl, customStyles.controlIcon]}
                                    name={this.state.isMuted ? 'volume-off' : 'volume-up'}
                                    size={24}
                                />
                            </TouchableOpacity>
                        ))}
                    {(Platform.OS === 'android' || this.props.disableFullscreen) ? null : (
                        <TouchableOpacity onPress={this.onToggleFullScreen} style={customStyles.controlButton}>
                            <Icon
                                style={[styles.extraControl, customStyles.controlIcon]}
                                name="fullscreen"
                                size={32}
                            />
                        </TouchableOpacity>
                    )}


                </View>
        );
    }

    renderVideo() {
        const {
            video,
            style,
            resizeMode,
            pauseOnPress,
            fullScreenOnLongPress,
            customStyles,
            ...props
        } = this.props;
        return (
            <View style={customStyles.videoWrapper}>
                <Video
                    {...props}
                    style={[
                        styles.video,
                        this.getSizeStyles(),
                        style,
                        customStyles.video,
                        this.props.isFullPlayer ? {backgroundColor: 'transparent'} : null,
                    ]}
                    ref={p => {
                        this.player = p;
                    }}
                    muted={this.props.muted || this.state.isMuted}
                    paused={this.props.paused
                        ? this.props.paused || !this.state.isPlaying
                        : !this.state.isPlaying}
                    onProgress={this.onProgress}
                    onEnd={this.onEnd}
                    onLoad={this.onLoad}
                    onBuffer={this.onBuffer}
                    onLoadStart={this.onLoadStart}
                    source={video}
                    resizeMode={resizeMode}
                    ignoreSilentSwitch={'ignore'}
                />
                <ActivityIndicator
                    animating
                    size="large"
                    color="#25345C"
                    style={[styles.activityIndicator, {opacity: this.state.opacity}]}
                />
                <View
                    style={[
                        this.getSizeStyles(),
                        {marginTop: -this.getSizeStyles().height},
                    ]}
                >
                    <TouchableOpacity
                        {...addTestID('Overlay-btn')}
                        style={styles.overlayButton}
                        onPress={() => {
                            this.showControls();
                            if (pauseOnPress) {
                                this.onPlayPress();
                            }
                        }}
                        onLongPress={() => {
                            if (fullScreenOnLongPress && Platform.OS !== 'android') {
                                this.onToggleFullScreen();
                            }
                        }}
                    />
                </View>
                {((!this.state.isPlaying) || this.state.isControlsVisible)
                    ? this.renderControls() : this.renderSeekBar(true)}
            </View>
        );
    }

    renderContent() {
        const {thumbnail, style} = this.props;
        const {isStarted} = this.state;

        if (!isStarted && thumbnail) {
            return this.renderThumbnail();
        } else if (!isStarted) {
            return (
                this.props.isFullPlayer ?
                    <View
                        style={[styles.preloadingPlaceholder, this.getSizeStyles(), style, {backgroundColor: 'transparent'}]}>


                        {this.renderStartButton()}
                    </View>
                    :
                    <View
                        style={this.props.isGradientP ? [styles.preloadingPlaceholder, {justifyContent: 'flex-start'}, this.getSizeStyles(), style] : [styles.preloadingPlaceholder, this.getSizeStyles(), style]}>
                        {this.renderStartButton()}
                        {(this.props.timeRequired ?
                            <Text style={styles.audioTextNoPlay}>{this.props.timeRequired} minutes listen
                                time</Text> : null)}
                                {
                    this.state.onLoadShowMessage ?
                        (<Text style={styles.audioTextDescriptive}>Listen to Article</Text>) : null
                }
                    </View>
            );
        }
        return this.renderVideo();
    }

    render() {
        return (
            <View onLayout={this.onLayout} style={this.props.customStyles.wrapper}>

                {this.renderContent()}

            </View>
        );
    }
}

LearningLibraryPlayer.propTypes = {
    video: Video.propTypes.source,
    thumbnail: Image.propTypes.source,
    videoWidth: PropTypes.number,
    videoHeight: PropTypes.number,
    duration: PropTypes.number,
    autoplay: PropTypes.bool,
    paused: PropTypes.bool,
    defaultMuted: PropTypes.bool,
    muted: PropTypes.bool,
    style: ViewPropTypes.style,
    controlsTimeout: PropTypes.number,
    disableControlsAutoHide: PropTypes.bool,
    disableFullscreen: PropTypes.bool,
    loop: PropTypes.bool,
    resizeMode: Video.propTypes.resizeMode,
    hideControlsOnStart: PropTypes.bool,
    endWithThumbnail: PropTypes.bool,
    disableSeek: PropTypes.bool,
    pauseOnPress: PropTypes.bool,
    fullScreenOnLongPress: PropTypes.bool,
    customStyles: PropTypes.shape({
        wrapper: ViewPropTypes.style,
        video: Video.propTypes.style,
        videoWrapper: ViewPropTypes.style,
        controls: ViewPropTypes.style,
        //playControl: TouchableOpacity.propTypes.style,
        //controlButton: TouchableOpacity.propTypes.style,
        controlIcon: Icon.propTypes.style,
        playIcon: Icon.propTypes.style,
        seekBar: ViewPropTypes.style,
        seekBarFullWidth: ViewPropTypes.style,
        seekBarProgress: ViewPropTypes.style,
        seekBarKnob: ViewPropTypes.style,
        seekBarKnobSeeking: ViewPropTypes.style,
        seekBarBackground: ViewPropTypes.style,
        thumbnail: Image.propTypes.style,
        //playButton: TouchableOpacity.propTypes.style,
        playArrow: Icon.propTypes.style,
    }),
    onEnd: PropTypes.func,
    onProgress: PropTypes.func,
    onLoad: PropTypes.func,
    onStart: PropTypes.func,
    onPlayPress: PropTypes.func,
    onHideControls: PropTypes.func,
    onShowControls: PropTypes.func,
    onMutePress: PropTypes.func,

};

LearningLibraryPlayer.defaultProps = {
    videoWidth: 1280,
    videoHeight: 720,
    autoplay: false,
    controlsTimeout: 2000,
    loop: false,
    resizeMode: 'contain',
    disableSeek: false,
    pauseOnPress: false,
    fullScreenOnLongPress: false,
    customStyles: {},
};
