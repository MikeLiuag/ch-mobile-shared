import React, {Component} from 'react';
import {AppState, Image, Linking, Platform, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title} from 'native-base';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcons from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import NoRecord from './../progressReport/no-record/NoRecord';
import moment from 'moment/moment';
import LottieView from 'lottie-react-native';
import teamAnim from '../../assets/animations/Dog_with_Computer';
import {addTestID, getHeaderHeight, isIphone12, isIphoneX} from '../../utilities';
import Overlay from 'react-native-modal-overlay';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {TransactionSingleActionItem} from "../TransactionSingleActionItem";
import MaterialComIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import {Colors, CommonStyles} from "../../styles";
import {DEFAULT_AVATAR_COLOR, DEFAULT_IMAGE, MARGIN_NORMAL, MARGIN_X} from '../../constants';
import GradientButton from "../GradientButton";
import Modal from 'react-native-modalbox';


const HEADER_SIZE = getHeaderHeight();

export class MemberProfileComponent extends Component<props> {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            contentTitles: {},
            appState: AppState.currentState,
            selectedItem: null,
            modalHeightProps: {
                height: 0
            }
        };
    }

    onClose = () => {
        this.setState({ modalVisible: false });
    };

    showModal = () => {
        this.setState({
            modalVisible: true,

        });
    };

    isIsoDate = str => {
        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) {
            return false;
        }
        var d = new Date(str);
        return d.toISOString() === str;
    };

    getFormattedActivity = (desc, ref) => {
        if (this.isIsoDate(ref)) {
            ref = moment(ref).format('MMMM D, Y');
        }

        const activityText = desc.replace('%s', ref);
        return activityText;
    };

    componentDidMount(): void {
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

    renderEmptyMessage = (message) => {
        return (
            <View style={styles.emptyView}>
                <Text style={styles.emptyText}>{message}</Text>
            </View>
        );
    };

    bookAppointment = () => {
        this.onClose();
        this.props.bookAppointment();
    };

    showConfirm = () => {
        this.setState({
            modalVisible: false,
            confirmModal: true,
        });
    };

    goToChat = () => {
        this.onClose();
        this.props.goToChat();
    };

    closeConfirm = () => {
        this.setState({
            confirmModal: false,
        });
    };


    requestConnection = () => {
        this.onClose();
        this.props.loadConnectionScreen();
    };

    requestAppointmentByMatchmaker = () => {
        this.onClose();
        this.props.requestAppointmentByMatchmaker();

    }


    render() {
        const { selectedItem } = this.state;
        const { S3_BUCKET_LINK } = this.props;
        if (this.props.isLoading) {
            return <View style={styles.loadersty}>
                <LottieView
                    style={styles.emptyImage}
                    resizeMode="cover"
                    source={teamAnim}
                    autoPlay={true}
                    loop
                />
            </View>;
        }
        const hasAssignedContent = this.props.assignedContent && this.props.assignedContent.totalCount > 0;
        const profilePicture = this.props.profileData ? (this.props.profileData.profilePicture || this.props.profileData.profileImage) : null;
        const hasOutcomes = this.props.outcomeData.outcomeCompletedList &&
            this.props.outcomeData.outcomeCompletedList.length > 0;
        const hasRiskTags = this.props.riskTagsData.riskTagList &&
            this.props.riskTagsData.riskTagList.length > 0;
        return (
            <Container>
                <Header transparent style={styles.reportHeader}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                        translucent
                        barStyle={'light-content'}
                    />
                    <LinearGradient
                        start={{ x: 0, y: 1 }}
                        end={{ x: 1, y: 0 }}
                        colors={['#4FACFE', '#34b6fe', '#00C8FE']}
                        style={styles.headerBG}>
                        <View style={styles.headerContent}>
                            <Left>
                                {this.props.isProviderApp ?
                                    <Button
                                        {...addTestID('back')}
                                        onPress={this.props.backClicked}
                                        transparent
                                        style={styles.backButton}>
                                        <FAIcon name="angle-left" size={32} color="#fff" />
                                    </Button> :
                                    <Button
                                        {...addTestID('navigate-to-setting')}
                                        transparent
                                        style={{ paddingLeft: 22, width: 60 }}
                                        onPress={() => {
                                            this.props.navigateToSettings();
                                        }}>
                                        <Icon {...addTestID('setting-icon')}
                                            type={'Feather'} name="settings" style={{ fontSize: 26, color: '#fff' }} />
                                    </Button>
                                }
                            </Left>
                            <Body style={styles.headerRow}>
                                <Title
                                    {...addTestID('progress-report')}
                                    style={styles.headerText}>Progress Report</Title>
                            </Body>
                            <Right>
                                {
                                    this.props.isProviderApp && this.props.isConnected ?
                                        this.state.modalVisible ? (
                                            <Button
                                                {...addTestID('close')}
                                                transparent
                                                style={{ marginRight: 15, paddingLeft: 0, paddingRight: 7 }}
                                                onPress={() => {
                                                    this.onClose();
                                                }}>
                                                <Ionicon name="ios-more" size={30} color="#FFF" />
                                            </Button>
                                        ) : (
                                            <Button
                                                transparent
                                                style={{ marginRight: 15, paddingRight: 7, paddingLeft: 0 }}
                                                onPress={() => {
                                                    this.showModal();
                                                }}>
                                                <Ionicon name="ios-more" size={30} color="#FFF" />
                                            </Button>
                                        ) : null
                                }
                            </Right>
                        </View>
                    </LinearGradient>
                </Header>
                {/* <Overlay
                    containerStyle={styles.overlayBG}
                    childrenWrapperStyle={styles.fabWrapper}
                    visible={this.state.modalVisible}
                    onClose={() => {
                        this.onClose();
                    }}
                    animationDuration={100}
                    closeOnTouchOutside>
                    <View style={{width: '100%'}}>
                        <View style={styles.actionHead}>
                            <Text style={styles.actionTitle}>Actions</Text>
                            <Button transparent
                                    onPress={() => {
                                        this.onClose();
                                    }}
                            >
                                <Ionicon name='md-close' size={30}
                                         color="#4FACFE"/>
                            </Button>
                        </View>
                        <View>
                            <GenericActionButton
                                onPress={this.bookAppointment}
                                title={'Book Appointment'}
                                iconBackground={'#E13C68'}
                                viewStyle={styles.genericActionButton}
                                renderIcon={(size) =>
                                    <FeatherIcons size={22} color={Colors.colors.white} name="calendar"/>
                                }
                            />

                            <GenericActionButton
                                onPress={this.showConfirm}
                                title={'Disconnect Profile'}
                                iconBackground={'#E13C68'}
                                viewStyle={styles.genericActionButton}
                                renderIcon={(size) =>
                                    <Image
                                        source={require('./../../assets/images/link-off.png')}
                                        style={{width: size, height: size}}
                                    />
                                }
                            />

                            <GenericActionButton
                                onPress={this.goToChat}
                                title={'Go To Chat'}
                                iconBackground={'#E13C68'}
                                viewStyle={styles.genericActionButton}
                                renderIcon={(size) =>
                                    <FeatherIcons size={22} color={Colors.colors.white}
                                                  name="message-circle"/>
                                }
                            />

                            {this.props.isProviderApp && this.props.isMatchmakerView && (
                                <GenericActionButton
                                    onPress={this.requestConnection}
                                    title={'Request Connection'}
                                    iconBackground={'#77C70B'}
                                    styles={styles.gButton}
                                    renderIcon={(size, color) =>
                                        <MaterialCommunityIcons
                                            name='calendar-blank'
                                            size={25}
                                            color={color}
                                        />
                                    }
                                />
                            )}


                            {this.props.isProviderApp && this.props.isMatchmakerView && (
                                <GenericActionButton
                                    onPress={this.requestAppointmentByMatchmaker}
                                    title={'Request Appointment'}
                                    iconBackground={'#77C70B'}
                                    styles={styles.gButton}
                                    renderIcon={(size, color) =>
                                        <MaterialCommunityIcons
                                            name='calendar-blank'
                                            size={25}
                                            color={color}
                                        />
                                    }
                                />
                            )}

                        </View>
                    </View>
                </Overlay> */}
                {this.props.profileData && (
                    <Overlay
                        containerStyle={styles.confirmOverlay}
                        childrenWrapperStyle={styles.confirmWrapper}
                        visible={this.state.confirmModal}>
                        <View style={{ width: '100%' }}>
                            <Text style={styles.confirmHeader}>
                                Are you sure you want to disconnect? This will also cancel all your appointments with
                                {' ' + (this.props.isProviderApp ?
                                    this.props.profileData.name
                                        ? this.props.profileData.name
                                        : '' :
                                    this.props.profileData.fullName
                                        ? this.props.profileData.fullName
                                        : '')}.
                            </Text>
                            <View style={styles.confirmBtns}>
                                <Button
                                    {...addTestID('Confirmation-btn')}
                                    style={{ ...styles.outlineBtn, flex: 1, marginTop: 10 }}
                                    onPress={() => {
                                        this.props.disconnectProfile();
                                    }}
                                >
                                    <Text style={styles.outlineText}>Yes, Disconnect</Text>
                                </Button>
                                <View style={styles.noBtn}>
                                    <GradientButton
                                        onPress={this.closeConfirm}
                                        text="No"
                                    />
                                </View>
                            </View>
                        </View>

                    </Overlay>
                )}

                {this.props.profileData ? (
                    <Content
                        showsVerticalScrollIndicator={false}
                        style={styles.contentWrapper}>
                        {/*Patient Section Starts*/}
                        <View style={styles.memberBox}>
                            <View
                                {...addTestID('user-profile')}
                                style={styles.imgBox}>
                                {profilePicture ?
                                    <Image
                                        {...addTestID('user-profile-pic')}
                                        style={styles.memberImg}
                                        resizeMode={'cover'}
                                        source={{
                                            uri: profilePicture
                                                ? S3_BUCKET_LINK +
                                                profilePicture.replace(
                                                    '_thumbnail',
                                                    '',
                                                )
                                                : S3_BUCKET_LINK + DEFAULT_IMAGE,
                                        }}
                                        alt="FAIcon"
                                    />

                                    :
                                    <View
                                        {...addTestID('user-profile-info')}
                                        style={{
                                            ...styles.proBg,
                                            backgroundColor: this.props.profileData.colorCode ? this.props.profileData.colorCode : DEFAULT_AVATAR_COLOR
                                        }}><Text
                                            style={styles.proLetter}>{this.props.profileData.fullName.charAt(0).toUpperCase()}</Text></View>
                                }
                            </View>
                            <View style={styles.textBox}>
                                <Text style={styles.memberName} numberOfLines={1}>
                                    {
                                        this.props.isProviderApp ?
                                            this.props.profileData.name
                                                ? this.props.profileData.name
                                                : '' :
                                            this.props.profileData.fullName
                                                ? this.props.profileData.fullName
                                                : ''}
                                </Text>
                                <Text style={styles.greyText}>
                                    {this.props.isProviderApp ? (this.props.isConnected ? 'Connected' : 'Disconnected') : 'Member'} Since:{' '}
                                    {moment(this.props.profileData.lastModified).format(
                                        'MMMM D, Y',
                                    )}
                                </Text>
                                {this.props.isProviderApp && this.props.profileData.phone && (
                                    <Text style={styles.greyText}>Phone# : <Text
                                        onPress={() => Linking.openURL(`tel:${this.props.profileData.phone}`)}
                                        style={styles.detailTextLink}>{this.props.profileData.phone}</Text></Text>
                                )}
                                {this.props.isProviderApp && this.props.profileData.email && (
                                    <Text style={styles.greyText}>Email : <Text
                                        onPress={() => Linking.openURL(`mailto:${this.props.profileData.email}`)}
                                        style={styles.detailTextLink}>{this.props.profileData.email}</Text></Text>
                                )}
                                {this.props.isProviderApp && this.props.profileData.firstName!==undefined &&
                                this.props.profileData.firstName!==null && (
                                    <Text style={styles.greyText}>First Name: {this.props.profileData.firstName}</Text>
                                )}
                                {this.props.isProviderApp && this.props.profileData.lastName!==undefined &&
                                this.props.profileData.lastName!==null && (
                                    <Text style={styles.greyText}>Last Name: {this.props.profileData.lastName}</Text>
                                )}
                                {this.props.isProviderApp && this.props.profileData.dob!==undefined &&
                                this.props.profileData.dob!==null && (
                                    <Text style={styles.greyText}>Date of Birth: {this.props.profileData.dob}</Text>
                                )}
                                {this.props.isProviderApp && this.props.profileData.matchMakerName!==undefined &&
                                this.props.profileData.matchMakerName!==null && (
                                    <Text style={styles.greyText}>Matchmaker: {this.props.profileData.matchMakerName}</Text>
                                )}
                            </View>
                        </View>
                        {/*Patient Section Ends*/}
                        {this.props.hasAccess && (
                            <View style={styles.allSections}>
                                {/* Recent Activity Section Starts */}
                                <View style={styles.activityBox}>
                                    <View style={styles.sectionHead}>
                                        <Text style={styles.headText}>Recent Activity</Text>
                                        {this.props.activityData && this.props.activityData.length > 0 && (
                                            <Button
                                                {...addTestID('see-all-btn')}
                                                style={styles.seeAllBtn}
                                                transparent
                                                onPress={() => {
                                                    this.props.seeAll({
                                                        section: 'RECENT_ACTIVITY',
                                                        title: 'Recent Activities',
                                                        data: [],
                                                    });
                                                }}>
                                                {
                                                    this.props.totalActivitiesCount > 3 ?
                                                        <Text uppercase={false} style={styles.seeAllText}>
                                                            See All({this.props.totalActivitiesCount})
                                                        </Text> : null
                                                }
                                            </Button>
                                        )}
                                    </View>
                                    {this.props.activityData && this.props.activityData.length > 0
                                        ? this.props.activityData.map((activity, i) => {
                                            let iconType = 'activity';
                                            if (activity.activityType === 'LOGIN') {
                                                iconType = 'log-in';
                                            } else if (activity.activityType === 'CONTENT') {
                                                iconType = 'book-open';
                                            } else if (activity.activityType === 'CONVERSATION') {
                                                iconType = 'message-circle';
                                            } else if (activity.activityType === 'DCT') {
                                                iconType = 'pie-chart';
                                            }

                                            return (
                                                <View key={i} style={styles.wholeList}>
                                                    <View style={styles.singleEntry}>
                                                        <View style={styles.iconSide}>
                                                            <FeatherIcons name={iconType} size={24} color="#3fb2fe" />
                                                        </View>
                                                        <View style={styles.textBox}>
                                                            <Text
                                                                style={styles.activityText}
                                                                numberOfLines={2}>
                                                                <Text style={styles.duskText}>
                                                                    {this.getFormattedActivity(
                                                                        activity.activityDescription,
                                                                        activity.referenceText,
                                                                    )}
                                                                </Text>
                                                            </Text>
                                                        </View>
                                                        <Text style={styles.timeText}>
                                                            {activity.activityTimeDifference}
                                                        </Text>
                                                    </View>
                                                </View>
                                            );
                                        })
                                        : null}
                                </View>
                                {/* Recent Activity Section Ends */}
                                {/* Outcome Section Starts */}

                                <View style={styles.outcomeBox}>
                                    <View style={styles.sectionHead}>
                                        <Text style={styles.headText}>Outcomes Completed</Text>
                                        {hasOutcomes && (
                                            <Button
                                                style={styles.seeAllBtn}
                                                transparent
                                                onPress={() => {
                                                    this.props.seeAll({
                                                        section: 'OUTCOMES',
                                                        title: 'Completed Outcomes',
                                                        data: this.props.outcomeData.outcomeCompletedList,
                                                    });
                                                }}>
                                                {
                                                    this.props.outcomeData.totalOutcomeCompleted > 3 ?

                                                        <Text uppercase={false} style={styles.seeAllText}>
                                                            See All (
                                                            {this.props.outcomeData.totalOutcomeCompleted})
                                                        </Text> : null
                                                }
                                            </Button>)}
                                    </View>
                                    {hasOutcomes
                                        ? this.props.outcomeData.outcomeCompletedList.map(
                                            (outcome, o) => {
                                                return (
                                                    <TouchableOpacity
                                                        {...addTestID('dct-details')}
                                                        activeOpacity={0.8}
                                                        // style={styles.singleItem}
                                                        /*    onPress={() => this.dctClicked(outcome.refId)} */
                                                        key={'Touchable-' + o}
                                                        onPress={() => {
                                                            this.props.dctDetails(outcome.refId, outcome.scorable);
                                                        }}
                                                    >
                                                        <View key={o} style={styles.wholeList}>
                                                            <View style={styles.singleEntry}>
                                                                <View
                                                                    style={[styles.colorSide, { backgroundColor: outcome.colorCode }]}>
                                                                    <Text style={styles.largeText}>
                                                                        {outcome.latestDCTScore}
                                                                    </Text>
                                                                    <Text style={styles.smallText}>
                                                                        {outcome.differenceDCTScore}
                                                                    </Text>
                                                                </View>
                                                                <View style={styles.textBox}>
                                                                    <Text
                                                                        style={[
                                                                            styles.duskText,
                                                                            { paddingLeft: 16 },
                                                                        ]}
                                                                        numberOfLines={2}>
                                                                        {outcome.title}
                                                                    </Text>
                                                                </View>
                                                                <Button
                                                                    {...addTestID('dct-details-btn')}
                                                                    transparent style={styles.nextButton}
                                                                    onPress={() => {
                                                                        this.props.dctDetails(outcome.refId);
                                                                    }}>
                                                                    <FAIcon
                                                                        name="angle-right"
                                                                        size={32}
                                                                        color="#3fb2fe"
                                                                    />
                                                                </Button>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            },
                                        )
                                        : this.renderEmptyMessage(this.props.isProviderApp ? 'No outcomes completed by member.' : 'You have no outcomes completed.')}
                                </View>

                                {/* Outcome Section Ends */}

                                {/* Tags Section Starts */}

                                <View style={styles.riskBox}>
                                    <View style={styles.sectionHead}>
                                        <Text style={styles.headText}>Risk Tags</Text>
                                        {hasRiskTags && (
                                            <Button
                                                style={styles.seeAllBtn}
                                                transparent
                                                onPress={() => {
                                                    this.props.seeAll({
                                                        section: 'RISK_TAGS',
                                                        title: 'Risk Tags',
                                                        data: this.props.riskTagsData.riskTagList,
                                                    });
                                                }}>
                                                {
                                                    this.props.riskTagsData.totalRiskTags > 3 ?

                                                        <Text uppercase={false} style={styles.seeAllText}>
                                                            See All ({this.props.riskTagsData.totalRiskTags})
                                                        </Text> : null
                                                }
                                            </Button>
                                        )}
                                    </View>
                                    {hasRiskTags
                                        ? this.props.riskTagsData.riskTagList.map((tag, t) => {
                                            return (
                                                <View key={t} style={styles.wholeList}>
                                                    <View style={styles.singleEntry}>
                                                        <View style={styles.riskBorderBox}>
                                                            <Text
                                                                style={styles.riskText}
                                                                numberOfLines={2}>
                                                                {tag.title}
                                                            </Text>
                                                        </View>
                                                        {/*<Button transparent style={styles.nextButton}>*/}
                                                        {/*<FAIcon*/}
                                                        {/*name="angle-right"*/}
                                                        {/*size={32}*/}
                                                        {/*color="#3fb2fe"*/}
                                                        {/*/>*/}
                                                        {/*</Button>*/}
                                                    </View>
                                                </View>
                                            );
                                        })
                                        : this.renderEmptyMessage(this.props.isProviderApp ? 'No risk tags associated to member.' : 'No risk tags associated to you.')}
                                </View>

                                {/* Tags Section Ends */}
                            </View>
                        )}
                        {/*{this.props.isProviderApp && !this.props.hasAccess && this.renderEmptyMessage("You don't have access to view progress report of the member.")}*/}
                        {this.props.isProviderApp && !this.props.hasAccess ? <View>
                            <LottieView
                                ref={animation => {
                                    this.animation = animation;
                                }}
                                style={styles.noAccessAnim}
                                resizeMode="cover"
                                source={teamAnim}
                                autoPlay={true}
                                loop />
                            <Text style={styles.noAccessText}>You don't have access to view progress report of the
                                member.</Text>
                        </View> : null}
                        {this.props.activityError && !this.props.isProviderApp ? <NoRecord /> : null}
                        {/* Assign Content Section Starts */}

                        {/*{(this.props.isConnected || !this.props.isProviderApp) && (*/}
                        {/*    <View style={styles.allSections}>*/}
                        {/*        /!* Recent Activity Section Starts *!/*/}
                        {/*        <View style={styles.activityBox}>*/}
                        {/*            <View style={styles.sectionHead}>*/}
                        {/*                <Text*/}
                        {/*                    style={styles.headText}>{this.props.isProviderApp ? 'Content Assigned by Me' : 'Assigned Content'}</Text>*/}

                        {/*                {hasAssignedContent && (*/}
                        {/*                    <Button*/}
                        {/*                        style={styles.seeAllBtn}*/}
                        {/*                        transparent*/}
                        {/*                        onPress={() => {*/}
                        {/*                            this.props.seeAll({*/}
                        {/*                                section: 'ASSIGNED_CONTENT',*/}
                        {/*                                title: this.props.isProviderApp ? 'Content Assigned by Me' : 'Assigned Content',*/}
                        {/*                                data: [],*/}
                        {/*                            });*/}
                        {/*                        }}>*/}
                        {/*                        {*/}
                        {/*                            this.props.assignedContent.totalCount > 3 ?*/}
                        {/*                                <Text uppercase={false} style={styles.seeAllText}>*/}
                        {/*                                    See All ({this.props.assignedContent.totalCount})*/}
                        {/*                                </Text> : null*/}
                        {/*                        }*/}
                        {/*                    </Button>*/}
                        {/*                )*/}
                        {/*                }*/}

                        {/*            </View>*/}
                        {/*            {hasAssignedContent*/}
                        {/*                ? this.props.assignedContent.assignedContent.slice(0,3).map((content, ind) => {*/}
                        {/*                    const title = content.title;*/}
                        {/*                    return (*/}
                        {/*                        <View key={ind}>*/}
                        {/*                            <View style={styles.singleEntry}>*/}
                        {/*                                <View style={styles.iconSide}>*/}
                        {/*                                    <FAIcon name='book' size={24} color="#3fb2fe"/>*/}
                        {/*                                </View>*/}
                        {/*                                <View style={styles.textBox}>*/}
                        {/*                                    <View*/}
                        {/*                                        style={styles.activityText}>*/}
                        {/*                                        <Text style={styles.duskBold}*/}
                        {/*                                              numberOfLines={1}>{title}</Text>*/}
                        {/*                                        {this.props.isProviderApp ? null :*/}
                        {/*                                            (*/}
                        {/*                                                <Text style={styles.slateText}>assigned by*/}
                        {/*                                                    {' '}<Text*/}
                        {/*                                                        style={styles.duskBold}>{content.assigneeName}</Text>*/}
                        {/*                                                </Text>*/}
                        {/*                                            )}*/}
                        {/*                                    </View>*/}
                        {/*                                </View>*/}
                        {/*                                <Text style={styles.timeText}>*/}
                        {/*                                    {content.timeDifference}*/}
                        {/*                                </Text>*/}
                        {/*                            </View>*/}
                        {/*                        </View>*/}
                        {/*                    );*/}
                        {/*                })*/}
                        {/*                : this.props.isProviderApp || !this.props.activityError ? this.renderEmptyMessage(this.props.isProviderApp ? 'You haven\'t assigned any content to this member.' : 'No content has been assigned to you.') : null}*/}

                        {/*            <View style={styles.assignBtn}>*/}
                        {/*                <GradientButton*/}
                        {/*                    text="Assign Content"*/}
                        {/*                    onPress={() => {*/}
                        {/*                        this.props.assignContent();*/}
                        {/*                    }}*/}
                        {/*                />*/}
                        {/*            </View>*/}

                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*)}*/}

                        {/* Assign Content Section Ends */}

                        {!this.props.isConnected && this.props.isProviderApp && (
                            <View style={[styles.assignBtn, {
                                paddingLeft: 16,
                                paddingRight: 16,
                            }]}>
                                <GradientButton
                                    disabled={this.props.isRequested}
                                    text={this.props.isRequested ? 'Connection Requested' : 'Reconnect'}
                                    onPress={() => {
                                        this.props.connect();
                                    }}
                                />
                            </View>
                        )}


                    </Content>
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 16 }}>Failed to load Progress Report.</Text>
                        <Text onPress={() => {
                            if (this.props.retry) {
                                this.props.retry();
                            }
                        }} style={{
                            marginTop: 20, fontFamily: 'Roboto-Regular',
                            fontSize: 16,
                            color: '#3fb2fe',
                        }}>Retry</Text>
                    </View>
                )}

                {this.props.isLoading ? (
                    <View style={styles.loadersty}>
                        <LottieView
                            style={styles.emptyImage}
                            resizeMode="cover"
                            source={teamAnim}
                            autoPlay={true}
                            loop
                        />
                    </View>
                ) : null}

                <Modal
                    backdropPressToClose={true}
                    backdropColor={Colors.colors.overlayBg}
                    backdropOpacity={1}
                    onClosed={()=>{
                        this.setState({
                            modalVisible: false
                        })
                    }}
                    style={{
                        ...CommonStyles.styles.commonModalWrapper,
                        maxHeight: '50%',
                        // bottom: this.state.modalHeightProps.height,
                    }}
                    entry={"bottom"}
                    isOpen={this.state.modalVisible}
                    position={"bottom"} swipeArea={100}>
                    <View style={{ ...CommonStyles.styles.commonSwipeBar }}
                        {...addTestID('swipeBar')}
                    />
                    <Content
                        showsVerticalScrollIndicator={false}>
                        <View
                            onLayout={(event) => this.onLayout(event)}
                            style={styles.actionList}>
                            <View style={styles.btnOptions}>
                                <TransactionSingleActionItem
                                    title={'Schedule an appointment'}
                                    // iconBackground={Colors.colors.successBG}
                                    styles={styles.gButton}
                                    renderIcon={(size, color) =>
                                        <FeatherIcon size={24} color={Colors.colors.mainBlue} name="calendar" />
                                    }
                                  onPress={this.bookAppointment}

                                />
                            </View>
                            <View style={styles.btnOptions}>
                                <TransactionSingleActionItem
                                    title={'Go to chat'}
                                    styles={styles.gButton}
                                    renderIcon={(size, color) =>
                                        <FeatherIcon size={24} color={Colors.colors.warningIcon}
                                            name="message-circle" />
                                    }
                                    onPress={this.goToChat}
                                />
                            </View>

                            <View style={styles.btnOptions}>
                                <TransactionSingleActionItem
                                    title={'Disconnect'}
                                    iconBackground={Colors.colors.whiteColor}
                                    styles={styles.gButton}
                                    renderIcon={(size, color) =>
                                        <MaterialComIcons size={24} color={Colors.colors.secondaryIcon}
                                        name="link-variant-off"/>
                                    }
                                    onPress={this.showConfirm}
                                />
                            </View>
                            {this.props.isProviderApp && this.props.isMatchmakerView && (
                                <View style={styles.btnOptions}>
                                    <TransactionSingleActionItem
                                        title={'Request Appointment'}
                                        iconBackground={Colors.colors.whiteColor}
                                        styles={styles.gButton}
                                        renderIcon={(size, color) =>
                                            <FeatherIcon size={24} color={Colors.colors.successIcon} name="calendar"/>
                                        }
                                        onPress={this.requestAppointmentByMatchmaker}
                                    />
                                </View>


                            )}

                            {this.props.isProviderApp && this.props.isMatchmakerView && (
                                <View style={styles.btnOptions}>
                                    <TransactionSingleActionItem
                                        title={'Request Connection'}
                                        iconBackground={Colors.colors.whiteColor}
                                        styles={styles.gButton}
                                        renderIcon={(size, color) =>
                                            <FeatherIcon size={24} color={Colors.colors.secondaryIcon} name="link-2" />
                                        }
                                        onPress={this.requestConnection}
                                    />
                                </View>



                            )}

                        </View>

                    </Content>
                </Modal>


            </Container>
        );
    }
}

const styles = StyleSheet.create({
    actionHead: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: HEADER_SIZE + (isIphoneX() ? (isIphone12() ? 0 : 24) : 0),
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        paddingLeft: 20,
        paddingRight: 24,
        paddingBottom: 5,
    },
    actionTitle: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        letterSpacing: 0.3,
        flex: 2,
        paddingBottom: 10,
        textAlign: 'center',
    },
    overlayBG: {
        backgroundColor: 'rgba(37,52,92,0.35)',
        zIndex: -1,
    },
    fabWrapper: {
        height: 'auto',
        padding: 0,
        alignSelf: 'center',
        position: 'absolute',
        // top: Platform.OS === 'ios'? isIphoneX()? 112 : 80 : 55,
        top: 0,
        left: 0,
        right: 0,
        borderColor: 'rgba(37,52,92,0.1)',
        borderTopWidth: 0.5,
        elevation: 1,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 0.5,
        shadowColor: 'rgba(37,52,92,0.1)',
        zIndex: 0,
    },
    contentStyle: {
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop: 20,
    },
    emptyView: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    emptyText: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        paddingLeft: 8,
        letterSpacing: 0.32,
        lineHeight: 16,
    },
    gButton: {
        width: '100%',
        borderRadius: 4,
        height: 48,
        marginBottom: 24,
    },
    fabBtn: {
        justifyContent: 'center',
    },
    fabBtnText: {
        color: '#fff',
        fontSize: 13,
        lineHeight: 19.5,
        textAlign: 'center',
        letterSpacing: 0.7,
        fontFamily: 'Roboto-Bold',
        textTransform: 'uppercase',
    },
    reportHeader: {
        height: HEADER_SIZE,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        elevation: 0,
    },
    headerBG: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 5,
        marginTop: isIphoneX() ? MARGIN_X : MARGIN_NORMAL,
    },
    backButton: {
        marginLeft: 18,
        width: 30,
    },
    headerContent: {
        flexDirection: 'row',
    },
    headerRow: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        letterSpacing: 0.3,
        fontWeight: '400',
        color: '#FFF',
    },
    contentWrapper: {
        backgroundColor: '#f7f9ff',
    },
    memberBox: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: '#fff',
    },
    imgBox: {},
    memberImg: {
        width: 64,
        height: 64,
        borderRadius: 50,
        overflow: 'hidden',
        marginRight: 16,
    },
    textBox: {
        flex: 1,
    },
    memberName: {
        fontFamily: 'Roboto-Bold',
        fontSize: 21,
        lineHeight: 36,
        fontWeight: '600',
        letterSpacing: 0.58,
        color: '#25345c',
    },
    greyText: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        letterSpacing: 0.3,
    },
    allSections: {
        paddingLeft: 16,
        paddingRight: 16,
        //paddingBottom: 30,
    },
    assignBtn: {
        paddingBottom: 30,
    },
    activityBox: {},
    outcomeBox: {},
    riskBox: {},
    sectionHead: {
        marginTop: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 8,
        paddingRight: 8,
    },
    headText: {
        color: '#515d7d',
        fontFamily: 'Roboto-Regular',
        fontWeight: '600',
        fontSize: 13,
        letterSpacing: 0.75,
        textTransform: 'uppercase',
    },
    seeAllBtn: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    seeAllText: {
        paddingLeft: 0,
        paddingRight: 0,
        color: '#3fb2fe',
        fontSize: 14,
        letterSpacing: 0.28,
        fontWeight: '600',
        fontFamily: 'Roboto-Regular',
    },
    wholeList: {
        // marginBottom: 16,
    },
    singleEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 72,
        borderWidth: 1,
        borderColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: '#f5f5f5',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        elevation: 0,
    },
    iconSide: {
        width: 71,
        alignItems: 'center',
        justifyContent: 'center',
        borderRightColor: '#ebebeb',
        borderRightWidth: 0.5,
        height: '100%',
    },
    activityText: {
        color: '#646c73',
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        lineHeight: 20,
        paddingLeft: 16,
    },
    duskText: {
        color: '#515d7d',
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        lineHeight: 20,
    },
    slateText: {
        color: '#646c73',
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        lineHeight: 20,
    },
    duskBold: {
        fontFamily: 'Roboto-Bold',
        color: '#515d7d',
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '600',
    },
    timeText: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 16,
        paddingRight: 16,
        paddingLeft: 16,
    },
    colorSide: {
        backgroundColor: '#77c70b',
        width: 72,
        height: '100%',
        overflow: 'hidden',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    largeText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        color: '#fff',
    },
    smallText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        color: '#fff',
        position: 'absolute',
        top: 6,
        right: 6,
    },
    nextButton: {
        paddingRight: 16,
        paddingLeft: 16,
    },
    riskBorderBox: {
        borderLeftWidth: 4,
        borderLeftColor: '#77c70b',
        height: '100%',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        justifyContent: 'center',
        flex: 1,
    },
    riskText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        letterSpacing: 0.3,
        color: '#515d7d',
        paddingLeft: 24,
    },
    loadersty: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    emptyImage: {
        width: 250,
        height: 250,
    },
    noAccessAnim: {
        width: 250,
        height: 250,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    noAccessText: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        letterSpacing: 0.32,
        lineHeight: 16,
        textAlign: 'center',
        padding: 20,
    },
    confirmOverlay: {
        backgroundColor: 'rgba(37,52,92,0.5)',
    },
    confirmHeader: {
        color: '#25345c',
        fontSize: 20,
        lineHeight: 30,
        letterSpacing: 0.4,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        marginBottom: 30,
        paddingLeft: 15,
        paddingRight: 15,
    },
    confirmBtns: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    noBtn: {
        flex: 1,
        marginLeft: 17,
        justifyContent: 'center',
    },
    outlineBtn: {
        borderColor: '#f78795',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#fff',
        height: 48,
        justifyContent: 'center',
        elevation: 0,
    },
    outlineText: {
        color: '#f78795',
        fontSize: 13,
        letterSpacing: 0.7,
        lineHeight: 19.5,
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    confirmWrapper: {
        height: 'auto',
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX() ? 40 : 25,
        paddingTop: 35,
        alignSelf: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        elevation: 3,
        shadowOffset: { width: 0, height: 10 },
        shadowColor: '#f5f5f5',
        shadowOpacity: 0.5,
    },
    detailTextLink: {
        color: '#00C8FE',
        fontFamily: "Roboto-Regular",
        fontWeight: "300",
        fontSize: 14,
        textAlign: 'justify',
        // letterSpacing:0.5,
        marginBottom: 5,
        lineHeight: 20,
    },
    proBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    proLetter: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    btnOptions: {
        marginBottom: 8
    }
});
