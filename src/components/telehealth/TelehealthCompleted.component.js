import React, {Component} from "react";
import {AppState, StatusBar, StyleSheet, Text, View, Dimensions} from "react-native";
import {Button, Container, Content, Picker, Icon, Item, Label, Header, Left, Right, Body, Title} from "native-base";
import {AirbnbRating} from 'react-native-elements';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import {addTestID, isIphoneX} from "../../utilities";
import Loader from "../Loader";
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { ProgressBars } from '../ProgressBars';
import { PrimaryButton } from '../PrimaryButton';
import { SecondaryButton } from '../SecondaryButton';
import {Colors, TextStyles } from "../../styles";

const width = Dimensions.get("window").width;
const EPISODES = [
    {
        key: 'episode1',
        text: 'Current Episode'
    }
];
const PROGRESS_VALUES = [
    {
        key: 'prog2',
        text: 'Average Progress'
    },
    {
        key: 'prog1',
        text: 'Below Average Progress'
    },

    {
        key: 'prog3',
        text: 'Above Average Progress'
    },
    {
        key: 'prog0',
        text: 'No Progress'
    }

];

export class TelehealthCompletedComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reviewText: 'Great',
            ratingScore: 5,
            isRatingClicked: true,
            appState: AppState.currentState,
            sessionConnected: true,
            sessionWorks: true,
            providerFeedback: {
                episodeKey: EPISODES[0].key,
                memberProgress: PROGRESS_VALUES[0].key,
                sessionNotes: '',
                questions: ''
            }
        };
    }

    ratingCompleted = (rating) => {

        switch (rating) {

            case 1: {
                this.setState({reviewText: "Terrible", ratingScore: rating, isRatingClicked: true});
                break;
            }
            case 2 : {
                this.setState({reviewText: "Bad", ratingScore: rating, isRatingClicked: true});
                break;
            }
            case 3 : {
                this.setState({reviewText: "Okay", ratingScore: rating, isRatingClicked: true});
                break;
            }
            case 4 : {
                this.setState({reviewText: "Good", ratingScore: rating, isRatingClicked: true});
                break;
            }
            case 5 : {
                this.setState({reviewText: "Great", ratingScore: rating, isRatingClicked: true});
                break;
            }
            default: {
                this.setState({reviewText: null, ratingScore: null, isRatingClicked: false});
            }
        }
    };


    componentDidMount(): void {
        AppState.addEventListener('change', this._handleAppState);
    }

    componentWillUnmount(): void {
        AppState.removeEventListener('change', this._handleAppState);
    }

    _handleAppState = () => {
        this.playAnimation();
    };

    playAnimation = () => {
        if (this.state.appState === 'active') {
            if (this.animation) {
                this.animation.play();
            }
        }
    }

    renderPickerHeader = backAction => {
        return (
            <Header transparent>
                <Left>
                    <Button
                        style={{ marginLeft: 10}}
                        transparent onPress={() => {
                        backAction();
                        this.playAnimation();
                    }}>
                        <FAIcon name="angle-left" size={32} color="#3fb2fe"/>
                    </Button>
                </Left>
                <Body style={{flex:2}}>
                    <Title style={styles.optionHead}>Member Progress</Title>
                </Body>
                <Right/>
            </Header>
        );

    }

    submitProviderFeedback = () => {
        let episode = null;
        EPISODES.forEach(ep => {
            if (ep.key === this.state.providerFeedback.episodeKey) {
                episode = ep.text;
            }
        });
        let memberProgress = null;
        PROGRESS_VALUES.forEach(prog => {
            if (prog.key === this.state.providerFeedback.memberProgress) {
                memberProgress = prog.text;
            }
        })
        this.props.submitProviderFeedback(episode, memberProgress);
    };


    render() {
        if (this.props.isLoading) {
            return (<Loader/>);
        }
        return (
            <Container style={{ backgroundColor: Colors.colors.screenBG }}>
                <StatusBar backgroundColor='transparent' translucent animated showHideTransition="slide"/>
                <Content style={styles.wrapper}>
                    <View style={{paddingLeft: 24, paddingRight: 24}}>

                        {!this.props.isProviderApp && (
                            <ProgressBars
                                index={0}
                                totalBars={4}
                            />
                        )}
                        {this.props.isProviderApp && (
                            <Button
                                onPress={() => {
                                    this.props.skipReview();
                                }}
                                transparent style={styles.skipBtn}>
                                <Text style={styles.skipText}>Skip</Text>
                            </Button>
                        )}

                        <Text style={styles.title}>Rate your session</Text>
                        <Text style={styles.subText}>
                            Your session has been completed. Please rate your session with {this.props.name}
                        </Text>

                        <View style={styles.questionWrapper}>
                            <Text style={styles.questionText}>Did you connect with {this.props.name}? </Text>
                            <View style={styles.optionList}>
                                <View style={styles.singleBtn}>
                                    <SecondaryButton
                                        bgColor={Colors.colors.primaryColorBG}
                                        textColor={Colors.colors.primaryText}
                                        text={'Yes'}
                                        inactiveBtn={!this.state.sessionConnected}
                                        onPress={()=>{
                                            this.setState({
                                                sessionConnected: true
                                            })
                                        }}
                                    />
                                </View>
                                <View style={styles.singleBtn}>
                                    <SecondaryButton
                                        inactiveBtn={this.state.sessionConnected}
                                        text={'No'}
                                        onPress={()=>{
                                            this.setState({
                                                sessionConnected: false
                                            })
                                        }}
                                    />
                                </View>
                            </View>
                            <Text style={styles.questionText}>Do you think this will work for you?</Text>
                            <View style={styles.optionList}>
                                <View style={styles.singleBtn}>
                                    <SecondaryButton
                                        bgColor={Colors.colors.primaryColorBG}
                                        textColor={Colors.colors.primaryText}
                                        text={'Yes'}
                                        inactiveBtn={!this.state.sessionWorks}
                                        onPress={()=>{
                                            this.setState({
                                                sessionWorks: true
                                            })
                                        }}
                                    />
                                </View>
                                <View style={styles.singleBtn}>
                                    <SecondaryButton
                                        inactiveBtn={this.state.sessionWorks}
                                        text={'No'}
                                        onPress={()=>{
                                            this.setState({
                                                sessionWorks: false
                                            })
                                        }}
                                    />
                                </View>
                            </View>
                        </View>

                        {this.props.shouldShowRating ?
                            <Text style={styles.questionText}>Please rate your Session
                                with {this.props.name}</Text>
                            : null}
                        {this.props.shouldShowRating && (
                            <View style={styles.ratingBox}>
                                <AirbnbRating
                                    type='star'
                                    showRating={false}
                                    ratingTextColor={Colors.colors.mainPink}
                                    ratingCount={5}
                                    imageSize={50}
                                    selectedColor={Colors.colors.mainPink}
                                    defaultRating={5}
                                    onFinishRating={this.ratingCompleted}
                                />
                                <Text style={styles.reviewText}>{this.state.reviewText}</Text>
                            </View>
                        )}
                    </View>

                    {this.props.isProviderApp && (
                        <View style={styles.completedForm}>
                            <View style={styles.timeWrapper}>
                                <ProgressBarAnimated
                                    width={width - 48}
                                    value={100}
                                    height={8}
                                    borderWidth={1}
                                    borderColor="#f5f5f5"
                                    backgroundColor="#77c70b"
                                    borderRadius={4}
                                />
                                <View style={styles.timeInfo}>
                                    <View>
                                        <Text style={styles.startText}>Start</Text>
                                        <Text style={styles.timeText}>{this.props.appointment.startText}</Text>
                                    </View>
                                    {/*<Text style={styles.sessionTime}>40 / 60Minutes</Text>*/}
                                    <View>
                                        <Text style={{...styles.startText, textAlign: 'right'}}>End</Text>
                                        <Text style={styles.timeText}>{this.props.appointment.endText}</Text>
                                    </View>
                                </View>
                            </View>
                            <Item style={styles.pickerItem}>
                                <Label style={styles.itemLabel}>Episode:</Label>
                                <Picker
                                    {...addTestID('episode')}
                                    mode="dropdown"
                                    iosHeader="Options"
                                    renderHeader={this.renderPickerHeader}
                                    placeholder="Episode:"
                                    placeholderStyle={{color: '#25345c'}}
                                    iosIcon={<Icon name="arrow-down" style={{color: '#3fb2fe', fontSize: 28}}/>}
                                    style={styles.completedPicker}
                                    selectedValue={this.state.providerFeedback.episodeKey}
                                    textStyle={styles.inputValue}
                                    onValueChange={(key) => {
                                        const {providerFeedback} = this.state;
                                        providerFeedback.episodeKey = key;
                                        this.setState({
                                            providerFeedback
                                        });
                                        this.playAnimation();
                                    }}
                                >
                                    {EPISODES.map(episode => {
                                        return (
                                            <Picker.Item key={episode.key} label={episode.text} value={episode.key}/>
                                        )
                                    })}
                                    {/*<Picker.Item label="Episode 2" value="key1" />*/}
                                </Picker>
                            </Item>
                            <Item style={styles.pickerItem}>
                                <Label style={styles.itemLabel}>Member Progress:</Label>
                                <Picker
                                    {...addTestID('member-progress')}
                                    mode="dropdown"
                                    iosHeader="Member Progress"
                                    renderHeader={this.renderPickerHeader}
                                    placeholder="Member Progress:"
                                    placeholderStyle={{color: '#25345c'}}
                                    iosIcon={<Icon name="arrow-down" style={{color: '#3fb2fe', fontSize: 28}}/>}
                                    style={styles.completedPicker}
                                    selectedValue={this.state.providerFeedback.memberProgress}
                                    textStyle={styles.inputValue}
                                    onValueChange={(key) => {
                                        const {providerFeedback} = this.state;
                                        providerFeedback.memberProgress = key;
                                        this.setState({
                                            providerFeedback
                                        });
                                        this.playAnimation();
                                    }}
                                >
                                    {
                                        PROGRESS_VALUES.map(progress => {
                                            return (
                                                <Picker.Item key={progress.key} label={progress.text}
                                                             value={progress.key}/>
                                            )
                                        })
                                    }
                                </Picker>
                            </Item>
                        </View>
                    )}
                </Content>
                {/*Member App Navigation to Feedback Screen*/}
                {this.props.shouldShowRating && (
                    <View style={styles.btnStyle}>
                        {this.state.isRatingClicked &&
                        // <Button
                        //     onPress={() => {
                        //         this.props.skipReview();
                        //     }}
                        //     transparent style={{ alignSelf: 'center'}}>
                        //     <Text style={styles.skipText}>Skip For Now</Text>
                        // </Button>
                        <PrimaryButton
                            testId = "continue"
                            onPress={() => {
                                const {reviewText,ratingScore,sessionConnected, sessionWorks} = this.state;
                                this.props.navigateToReview({
                                    reviewText, ratingScore,sessionConnected, sessionWorks
                                });
                            }}
                            text="Continue"
                            arrowIcon={true}
                        />
                        }
                    </View>
                )}
                {/*Provider App Navigation to Feedback Screen*/}
                {
                    this.props.isProviderApp && (
                        <View style={styles.btnStyle}>
                            <PrimaryButton
                                testId = "continue"
                                onPress={() => {
                                    this.submitProviderFeedback();
                                }}
                                text="Continue"
                                arrowIcon={true}
                            />
                        </View>
                    )
                }
            </Container>
        );
    };
}

const styles = StyleSheet.create({
    optionHead: {
        color: '#25345c',
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
        lineHeight: 24,
        letterSpacing: 0.3,
        textAlign: 'center'
    },
    completedForm: {
        marginBottom: 25
    },
    timeWrapper: {
        paddingLeft: 24,
        paddingRight: 24,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        paddingBottom: 40,
        marginBottom: 8
    },
    timeInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 16
    },
    startText: {
        color: '#515d7d',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 15,
        letterSpacing: 0.26,
        textTransform: 'uppercase',
        marginBottom: 4
    },
    timeText: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 14,
        letterSpacing: 0.28,
    },
    sessionTime: {
        color: '#25345c',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 15,
        letterSpacing: 0.5
    },
    pickerItem: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'flex-start',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        paddingLeft: 24,
        paddingRight: 16,
        marginBottom: 10
    },
    completedPicker: {
        width: '100%',
        paddingLeft: 0
    },
    itemLabel: {
        fontFamily: 'Roboto-Regular',
        fontWeight: '600',
        color: '#25345c',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0.47
    },
    inputItem: {
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        paddingLeft: 24,
        paddingRight: 16,
        marginBottom: 10
    },
    inputValue: {
        color: '#515d7d',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0.3,
        paddingLeft: 0
    },
    wrapper: {
    },
    skipBtn: {
        alignSelf: 'flex-end',
        // marginTop: 10,
        paddingTop: 0
    },
    skipText: {
        color: '#3FB2FE',
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        fontSize: 15,
        letterSpacing: 0.2,
        lineHeight: 22.5
    },
    title: {
        ...TextStyles.mediaTexts.serifProExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 8
    },
    subText: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.bodyTextM,
        color: Colors.colors.mediumContrast,
        textAlign: 'center',
    },
    questionWrapper: {
        marginTop: 40
    },
    questionText: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.highContrast,
        marginBottom: 16
    },
    optionList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30
    },
    singleBtn: {
        width: '48%'
    },
    alfieImage: {
        resizeMode: 'contain',
        width: '100%'
    },
    alfieAnim: {
        width: '100%',
        marginBottom: 30
    },
    pleaseText: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.highContrast,
        marginBottom: 20
    },
    ratingBox: {
        marginBottom: 16
    },
    reviewText: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText,
        color: Colors.colors.lowContrast,
        marginTop: 10,
        marginBottom: 15,
        textAlign: 'center'
    },
    btnStyle: {
        paddingLeft: 23,
        paddingRight: 23,
        marginBottom: 30,
        alignItems: 'center'
    },
    isEnabled: {
        borderColor: 'black'
    },
    isDisabled: {
        borderColor: 'red',
    },
    progressBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 60,
        marginBottom: 10
    },
    singleProgress: {
        width: 24,
        height: 5,
        borderRadius: 4,
        backgroundColor: '#ebebeb',
        marginLeft: 4,
        marginRight: 4
    },
    singleSelectedProgress: {
        width: 24,
        height: 5,
        borderRadius: 4,
        backgroundColor: '#3fb2fe',
        marginLeft: 4,
        marginRight: 4
    },
    singleHalfProgress: {
        width: 24,
        height: 5,
        borderRadius: 4,
        backgroundColor: '#ebebeb',
        marginLeft: 4,
        marginRight: 4,
        overflow: 'hidden'
    },
    halfInner: {
        backgroundColor: '#3fb2fe',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 12
    },
});
