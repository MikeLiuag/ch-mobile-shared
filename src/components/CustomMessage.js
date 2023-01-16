import { Button} from 'native-base';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import CustomChatView from './CustomChatView';
import PropTypes from 'prop-types';
import React from 'react';
import {View, Text, ViewPropTypes, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Message, Avatar, SystemMessage, Day} from 'react-native-gifted-chat';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import Hyperlink from 'react-native-hyperlink';
import {isImage, isVideo,AlertUtil} from '../utilities';
import ProgressCircle from 'react-native-progress-circle'
import { createThumbnail } from "react-native-create-thumbnail";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors, TextStyles, CommonStyles } from "../styles";


var __rest =
    (this && this.__rest) ||
    function (s, e) {
      var t = {};
      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) {
          t[p] = s[p];
        }
      }
      if (s != null && typeof Object.getOwnPropertySymbols === 'function') {
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0) {
            t[p[i]] = s[p[i]];
          }
        }
      }
      return t;
    };


export function isSameDay(currentMessage, diffMessage) {
  if (!diffMessage.createdAt) {
    return false;
  }
  const currentCreatedAt = moment(currentMessage.createdAt);
  const diffCreatedAt = moment(diffMessage.createdAt);
  if (!currentCreatedAt.isValid() || !diffCreatedAt.isValid()) {
    return false;
  }
  return currentCreatedAt.isSame(diffCreatedAt, 'day');
}

export function isSameUser(currentMessage, user) {
  return currentMessage.user._id === user._id;
}

export default class CustomMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRating: null,
    };
    this.hlinkRef = null;
  }

  componentDidMount(): void {
    if( this.props.currentMessage.type === 'file' && isVideo(this.props.currentMessage.fileMeta.type)) {
      this.createVideoThumbnail(this.props.currentMessage.fileMeta.url);
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   const next = nextProps.currentMessage;
  //   const current = this.props.currentMessage;
  //   const {nextMessage} = this.props;
  //   const nextPropsMessage = nextProps.nextMessage;
  //   return (
  //       next.sent !== current.sent ||
  //       next.received !== current.received ||
  //       next.pending !== current.pending ||
  //       next.createdAt !== current.createdAt ||
  //       next.text !== current.text ||
  //       next.image !== current.image ||
  //       next.video !== current.video ||
  //       next.audio !== current.audio ||
  //       nextMessage !== nextPropsMessage
  //   );
  // }

  renderDay() {
    if (this.props.currentMessage && this.props.currentMessage.createdAt) {
      const _a = this.props,
          {containerStyle} = _a,
          props = __rest(_a, ['containerStyle']);
      if (this.props.renderDay) {
        return this.props.renderDay(props);
      }
      return <Day {...props} />;
    }
    return null;
  }

  showProvidersList = () => {
    this.props.navigation.navigate(this.props.providerListScreen, {
      userId: this.props.userId,
      nickName: this.props.nickName,
    });
  };

  openMedia = () => {
    if (this.props.currentMessage.type === 'file') {
      if (isImage(this.props.currentMessage.fileMeta.type)) {
        // Open Image
        this.props.openImage(this.props.currentMessage.fileMeta.url);
      } else if (isVideo(this.props.currentMessage.fileMeta.type)) {
        this.props.openVideo(this.props.currentMessage.fileMeta.url);
      } else {
        // Download Document
      }
    }
  };

  createVideoThumbnail = async (url)=>{
    console.log('Creating Video Thumb of url ' + url);
    try {
      const response = await createThumbnail({
        url: url
      });
      this.setState({
        videoThumb: response.path
      });
    } catch (e) {
      console.log(e);
    }
  };

  renderUploadProgress = (progress)=> {
    return (
        <ProgressCircle
            percent={progress}
            radius={30}
            borderWidth={3}
            color="#3399FF"
            shadowColor="#999"
            bgColor="#fff"
        >
          <Text style={{ fontSize: 18 }}>{progress.toFixed() + '%'}</Text>
        </ProgressCircle>
    )
  };


  renderBubble(sameUser) {
    const _a = this.props,
        {containerStyle} = _a,
        props = __rest(_a, ['containerStyle']);
    if (this.props.renderBubble) {
      return this.props.renderBubble(props);
    }


    if (sameUser) {
      return (
          <View style={chatStyles.userContainer}>
            <LinearGradient
                start={{x: 1, y: 1}}
                end={{x: 1, y: 0}}
                colors={[Colors.colors.mainBlue20, Colors.colors.mainBlue20]}
                style={chatStyles.bubbleBG}>
              {
                this.props.currentMessage.type === 'file' ? (
                    <TouchableOpacity
                        // style={{padding: 16}}
                        onPress={() => {
                      if (!this.props.currentMessage.fileMeta.loading) {
                        this.openMedia();
                      }

                    }}>
                      {
                        isImage(this.props.currentMessage.fileMeta.type) ?
                            (<><Image
                                resizeMode="cover"
                                style={chatStyles.attachImg}
                                source={{uri: this.props.currentMessage.fileMeta.url}}
                                alt="Attachment"
                            />{this.props.currentMessage.fileMeta.loading &&
                            <View style={chatStyles.loaderAttachment}>
                              {/*<ActivityIndicator size={'large'} color={'white'}/>*/}
                              {this.renderUploadProgress(this.props.currentMessage.fileMeta.progress)}
                            </View>}</>) :
                            isVideo(this.props.currentMessage.fileMeta.type) ?
                                (
                                    <View style={chatStyles.attachVid}>
                                      {
                                        this.state.videoThumb ? (
                                            <><Image
                                                resizeMode="cover"
                                                style={chatStyles.attachImg}
                                                source={{uri: this.state.videoThumb}}
                                                alt="Attachment"
                                            />
                                              <View style={chatStyles.videoPlayButton}>
                                                <Icon style={{color:'white'}} size={60} name="play-arrow"/>
                                              </View>

                                            </>
                                        ): (<AwesomeIcon name="file-video-o" size={90} color="#25345C"/>)
                                      }

                                      {
                                        this.props.currentMessage.fileMeta.loading && (
                                            <View style={chatStyles.loaderAttachment}>
                                              {this.renderUploadProgress(this.props.currentMessage.fileMeta.progress)}
                                            </View>

                                        )
                                      }

                                    </View>
                                ) :
                                (
                                    <Text>Here is a file</Text>
                                )
                      }

                    </TouchableOpacity>
                ) : (
                    <Hyperlink
                        style={{padding: 16}}
                        ref={(hlink) => {
                          this.hlinkRef = hlink;
                        }}
                        onPress={(url) => {
                          try {
                            this.hlinkRef.handleLink(url);
                          } catch (e) {
                            AlertUtil.showErrorMessage('Unable to open this link');
                          }
                        }}
                        linkStyle={{textDecorationLine: 'underline'}}
                    >
                      <Text style={chatStyles.userText}>
                        {this.props.currentMessage.text}{' '}
                      </Text>
                    </Hyperlink>
                )
              }
            </LinearGradient>
            <Text style={chatStyles.userTime}>
              {moment(this.props.currentMessage.createdAt).format('LT')}
            </Text>
          </View>
      );
    } else {
      return (
          <View style={chatStyles.botContainer}>
            {
              this.props.isGroupChat && (
                  <Text style={{
                    color: 'grey',
                    textTransform: 'capitalize',
                    fontSize: 12,
                    marginBottom: 5,
                  }}>{this.props.nickName}</Text>
              )
            }
            <View style={chatStyles.botBubbleBG}>
              {
                this.props.currentMessage.type === 'file' ? (
                    <TouchableOpacity
                        // style={{padding: 16}}
                        onPress={() => {
                      this.openMedia();
                    }}>
                      {
                        isImage(this.props.currentMessage.fileMeta.type) ?
                            (<Image
                                resizeMode="contain"
                                style={chatStyles.attachImg}
                                source={{uri: this.props.currentMessage.fileMeta.url}}
                                alt="Attachment"
                            />) :
                            isVideo(this.props.currentMessage.fileMeta.type) ?
                                (
                                    <View style={chatStyles.attachVid}>
                                      {
                                        this.state.videoThumb ? (
                                            <><Image
                                                resizeMode="cover"
                                                style={chatStyles.attachImg}
                                                source={{uri: this.state.videoThumb}}
                                                alt="Attachment"
                                            />
                                              <View style={chatStyles.videoPlayButton}>
                                                <Icon style={{color:'white'}} size={60} name="play-arrow"/>
                                              </View>

                                            </>
                                        ): (<AwesomeIcon name="file-video-o" size={90} color="#25345C"/>)
                                      }

                                    </View>
                                ) :
                                (
                                    <Text>Here is a file</Text>
                                )
                      }

                    </TouchableOpacity>
                ) : (
                    <Hyperlink
                        style={{padding: 16}}
                        ref={(hlink) => {
                      this.hlinkRef = hlink;
                    }} onPress={(url) => {
                      try {
                        this.hlinkRef.handleLink(url);
                      } catch (e) {
                        AlertUtil.showErrorMessage('Unable to open this link');
                      }
                    }} linkStyle={{textDecorationLine: 'underline'}}>
                      <Text style={chatStyles.botText}>
                        {this.props.currentMessage.text}
                      </Text>
                    </Hyperlink>
                )}

            </View>
            <Text style={chatStyles.botTime}>
              {moment(this.props.currentMessage.createdAt).format('LT')}
            </Text>
          </View>
      );
    }
  }

  renderSystemMessage() {
    const _a = this.props,
        {containerStyle} = _a,
        props = __rest(_a, ['containerStyle']);
    if (this.props.renderSystemMessage) {
      return this.props.renderSystemMessage(props);
    }
    return <SystemMessage {...props} />;
  }

  renderAvatar() {
    const {user, currentMessage, showUserAvatar} = this.props;
    if (
        user &&
        user._id &&
        currentMessage &&
        user._id === currentMessage.user._id &&
        !showUserAvatar
    ) {
      return null;
    }
    if (currentMessage && currentMessage.user.avatar === null) {
      return null;
    }
    const _a = this.props,
        {containerStyle} = _a,
        props = __rest(_a, ['containerStyle']);
    return <Avatar {...props} />;
  }

  launchEducationalContent(contentSlug) {
    this.props.navigation.navigate(this.props.educationContentScreen, {
      contentSlug: contentSlug,
    });
  }

  getEducationalContent(currentMessage) {
    return (
        <View style={chatStyles.educationWrapper}>
          <Text style={chatStyles.typeText}>
            {currentMessage.attachments[0].content.contentfulData.title
                ? 'EDUCATIONAL CONTENT'
                : 'CONTENT UNAVAILABLE'}
          </Text>
          <Text style={chatStyles.educationTitle}>
            {currentMessage.attachments[0].content.contentfulData.title}
          </Text>
          <Text style={chatStyles.read}>
            {
              currentMessage.attachments[0].content.contentfulData
                  .contentLengthduration
            }
          </Text>
          {currentMessage.attachments[0].content.contentfulData.title ? (
              <Button
                  transparent
                  style={chatStyles.nextBtn}
                  onPress={() => {
                    this.launchEducationalContent(
                        currentMessage.attachments[0].content.educationContentSlug,
                    );
                  }}>
                <AwesomeIcon name="arrow-right-circle" size={30} color="#25345C"/>
              </Button>
          ) : null}
        </View>
    );
  }

  getProviderPrompt(currentMessage) {
    return (
        <View style={chatStyles.providerWrapper}>
          <View style={chatStyles.providerBox}>
            <View style={chatStyles.proInfo}>
              <View style={chatStyles.imgWrapper}>
                <AwesomeIcon style={chatStyles.plusIco} name="plus" size={42} color="#3fb2fe"/>
                <Image
                    resizeMode="cover"
                    style={chatStyles.proImg}
                    source={require('../assets/images/p4.png')}
                    alt="Logo"
                />
                <Image
                    resizeMode="cover"
                    style={chatStyles.proImg}
                    source={require('../assets/images/p3.png')}
                    alt="Logo"
                />
                <Image
                    resizeMode="cover"
                    style={chatStyles.proImg}
                    source={require('../assets/images/p2.png')}
                    alt="Logo"
                />
                <Image
                    resizeMode="cover"
                    style={chatStyles.proImg}
                    source={require('../assets/images/p1.png')}
                    alt="Logo"
                />

              </View>
              <Text style={chatStyles.proDes}>
                We help connect you with the best providers for your specific needs.
              </Text>
            </View>
            <View style={chatStyles.viewContainer}>
              <Button
                  transparent
                  style={chatStyles.viewBtn}
                  onPress={this.showProvidersList}>
                <Text style={chatStyles.viewText}>VIEW PROVIDERS</Text>
              </Button>
            </View>
          </View>
        </View>
    );
  }

  renderRatingButton = value => {
    return (
        <Button
            key={'rating-value-' + value}
            transparent
            style={
              this.state.selectedRating === value
                  ? chatStyles.ratingBtnActive
                  : chatStyles.ratingBtn
            }
            onPress={() => {
              if (!this.state.selectedRating) {
                this.setState({selectedRating: value});
                this.props.onSend([{text: '' + value, type: 'message'}]);
              }
            }}>
          <Text
              style={
                this.state.selectedRating === value
                    ? chatStyles.ratingBtnTextActive
                    : chatStyles.ratingBtnText
              }>
            {value}
          </Text>
        </Button>
    );
  };

  getRatingScaleView(currentMessage) {
    if (!currentMessage.ratingScale) {
      return null;
    }
    const evenIndexedValues = currentMessage.ratingScale.values.filter(
        (value, index) => index % 2 === 0,
    );
    const oddIndexedValues = currentMessage.ratingScale.values.filter(
        (value, index) => index % 2 !== 0,
    );
    return (
        <View style={chatStyles.ratingWrapper}>
          <View style={chatStyles.ratingRow}>
            {oddIndexedValues.map(this.renderRatingButton)}
          </View>
          <View style={chatStyles.ratingRow}>
            {evenIndexedValues.map(this.renderRatingButton)}
          </View>
          <View style={[chatStyles.ratingRow, {justifyContent: 'space-between'}]}>
            <Text style={chatStyles.likelyText}>
              {currentMessage.ratingScale.lowLabel}
            </Text>
            <Text style={chatStyles.likelyText}>
              {currentMessage.ratingScale.highLabel}
            </Text>
          </View>
        </View>
    );
  }

  renderQuickReplies = quickReplies => {
    return (
        <View style={styles.optionContainer}>
          <View>
            {quickReplies.values.map((choice, key) => (
                <Button
                    transparent
                    onPress={() => {
                      this.props.answerQuickReply({value: choice.value, msgToRender: choice.title});
                    }}
                    key={key}
                    style={styles.singleSelectBtn}>
                  <LinearGradient
                      start={{x: 0, y: 1}}
                      end={{x: 1, y: 0}}
                      colors={['#4FACFE', '#34b6fe', '#00C8FE']}
                      style={styles.buttonBG}>
                    <Text style={styles.buttonText}>{choice.title}</Text>
                  </LinearGradient>
                </Button>
            ))}
          </View>
        </View>
    );
  };

  render() {
    const {
      currentMessage,
      nextMessage,
      user,
      containerStyle,
    } = this.props;
    if (currentMessage && currentMessage.type !== 'typing') {
      const quickReplies = currentMessage.dataSharePromptChoices;
      const sameUser = isSameUser(currentMessage, user);
      const contentType =
          currentMessage.type &&
          currentMessage.attachments &&
          currentMessage.attachments.length &&
          currentMessage.attachments[0].contentType;
      const educationalContent =
          contentType === 'education'
              ? this.getEducationalContent(currentMessage)
              : null;
      const providerPrompt =
          contentType === 'provider-prompt'
              ? this.getProviderPrompt(currentMessage)
              : null;
      const ratingScale =
          contentType === 'rating-scale'
              ? this.getRatingScaleView(currentMessage)
              : null;

      let sendingMode = currentMessage.type === 'file' && currentMessage.sending;
      let position = sendingMode ? 'right' : this.props.position;
      return (
          <View>
            {this.renderDay()}
            {currentMessage.system ? (
                this.renderSystemMessage()
            ) : (
                <View>
                  <View
                      style={[
                        styles[position].container,
                        {marginBottom: sameUser ? 2 : 3},
                        !this.props.inverted && {marginBottom: 2},
                        containerStyle && containerStyle[position],
                      ]}>
                    {this.props.position === 'left' ? this.renderAvatar() : null}
                    {providerPrompt === null ? this.renderBubble(sameUser) : null}
                    {this.props.position === 'right' ? this.renderAvatar() : null}
                  </View>
                  <View>
                    {educationalContent ? educationalContent : providerPrompt}
                    {ratingScale}
                    {nextMessage.text ? null : <CustomChatView
                        message={currentMessage}
                        onSend={this.props.onSend}
                    />}
                  </View>
                  {quickReplies &&
                  quickReplies.values.length > 0 &&
                  this.renderQuickReplies(quickReplies)}
                </View>
            )}
          </View>
      );
    }
    return null;
  }
}

const styles = {
  left: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      marginLeft: 8,
      marginRight: 0,
    },
  }),
  right: StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      marginLeft: 0,
      marginRight: 8,
    },
  }),
  optionContainer: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    padding: 10,
  },
  singleSelectBtn: {
    paddingTop: 0,
    paddingBottom: 0,
    height: 50,
    marginBottom: 8,
    alignSelf: 'flex-end',
  },
  buttonBG: {
    borderRadius: 2,
    flex: 1,
    height: 50,
    justifyContent: 'center',
    minWidth: 130,
    maxWidth: '65%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    paddingLeft: 20,
  },
};

const chatStyles = StyleSheet.create({
  ratingWrapper: {
    display: 'flex',
    flexDirection: 'column',
    padding: 15,
  },
  loaderAttachment: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoPlayButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingTitle: {
    fontSize: 14,
    color: '#30344D',
    marginBottom: 20,
    textAlign: 'center',
    // paddingLeft: 44,
    // paddingRight: 10
  },
  ratingRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ratingBtn: {
    borderRadius: 4,
    backgroundColor: '#FFF',
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 2,
    borderColor: '#b3bec9',
    marginBottom: 10,
    justifyContent: 'center',
  },
  ratingBtnActive: {
    borderRadius: 4,
    backgroundColor: '#3fb2fe',
    width: 40,
    height: 40,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 10,
    justifyContent: 'center',
  },
  ratingBtnText: {
    alignSelf: 'center',
    color: '#757682',
    fontSize: 14,
  },
  ratingBtnTextActive: {
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 18,
  },
  likelyText: {
    textTransform: 'uppercase',
    fontSize: 11,
    color: '#757682',
  },
  userContainer: {
    maxWidth: '70%',
    marginBottom: 15,
    justifyContent: 'center',
    // alignItems: 'center',
  },
  bubbleBG: {
    flex: 1,
    // padding: 16,
    borderRadius: 12,
    marginBottom: 8
  },
  userText: {
    ...TextStyles.mediaTexts.bodyTextS,
    ...TextStyles.mediaTexts.manropeRegular,
    color: Colors.colors.highContrast
  },
  userTime: {
    ...TextStyles.mediaTexts.captionText,
    ...TextStyles.mediaTexts.manropeRegular,
    color: Colors.colors.lowContrast,
    fontSize: 11,
    opacity: 1,
    textAlign: 'right'
  },
  botContainer: {
    maxWidth: '70%',
    marginBottom: 15,
  },
  botBubbleBG: {
    borderRadius: 12,
    // padding: 16,
    backgroundColor: Colors.colors.highContrastBG,
    marginBottom: 8
  },
  botText: {
    ...TextStyles.mediaTexts.bodyTextS,
    ...TextStyles.mediaTexts.manropeRegular,
    color: Colors.colors.highContrast
  },
  botTime: {
    ...TextStyles.mediaTexts.captionText,
    ...TextStyles.mediaTexts.manropeRegular,
    color: Colors.colors.lowContrast,
    fontSize: 11,
    opacity: 1
  },
  educationWrapper: {
    borderRadius: 8,
    borderColor: 'rgba(63, 177, 254, 0.2)',
    borderWidth: 1,
    flex: 1,
    padding: 13,
    backgroundColor: '#fff',
    marginLeft: 50,
    maxWidth: '80%',
    marginBottom: 20,
  },
  typeText: {
    color: '#3cb1fd',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    fontWeight: '500',
    marginBottom: 10,
  },
  educationTitle: {
    color: '#25345c',
    fontSize: 20,
    fontFamily: 'Roboto-Regular',
    fontWeight: '500',
    marginBottom: 15,
  },
  read: {
    color: '#000',
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    fontWeight: '400',
    opacity: 0.6,
  },
  nextBtn: {
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 5,
  },
  providerWrapper: {
    borderRadius: 9,
    borderColor: 'rgba(63, 177, 254, 0.2)',
    borderWidth: 1,
    flex: 1,
    backgroundColor: '#fff',
    marginLeft: 50,
    maxWidth: '80%',
    marginBottom: 20,
  },
  providerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  proInfo: {
    alignSelf: 'center',
    padding: 13,
  },
  imgWrapper: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  proImg: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderColor: '#4FACFE',
    borderRadius: 22,
    alignSelf: 'center',
    marginRight: -10
  },
  attachImg: {
    width: 240,
    height: 200,
    borderRadius: 12,
    // marginBottom: 5
  },
  attachVid: {
    width: 240,
    height: 160,
    borderRadius: 12,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  plusIco: {
    width: 44,
    height: 44
  },
  proDes: {
    color: '#8D92A3',
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'center',
    maxWidth: '80%',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30
  },
  viewContainer: {
    padding: 7,
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    width: '100%',
  },
  viewBtn: {
    alignSelf: 'center',
  },
  viewText: {
    color: '#39B4FE',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    fontWeight: '700',
  },
});

Message.defaultProps = {
  renderAvatar: undefined,
  renderBubble: null,
  renderDay: null,
  renderSystemMessage: null,
  position: 'left',
  currentMessage: {},
  nextMessage: {},
  previousMessage: {},
  user: {},
  containerStyle: {},
  showUserAvatar: false,
  inverted: true,
};
Message.propTypes = {
  renderAvatar: PropTypes.func,
  showUserAvatar: PropTypes.bool,
  renderBubble: PropTypes.func,
  renderDay: PropTypes.func,
  renderSystemMessage: PropTypes.func,
  position: PropTypes.oneOf(['left', 'right']),
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  user: PropTypes.object,
  inverted: PropTypes.bool,
  containerStyle: PropTypes.shape({
    left: ViewPropTypes.style,
    right: ViewPropTypes.style,
  }),
};
