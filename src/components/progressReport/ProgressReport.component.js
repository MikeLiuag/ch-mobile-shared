import React, {Component} from 'react';
import {AppState, Image, Platform, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Body, Button, Container, Content, Header, Icon, Left, Right, Text} from 'native-base';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import NoRecord from './no-record/NoRecord';
import moment from 'moment/moment';
import LottieView from 'lottie-react-native';
import teamAnim from '../../assets/animations/Dog_with_Computer';
import {addTestID, getHeaderHeight, isIphone12, isIphoneX} from '../../utilities';
import Overlay from 'react-native-modal-overlay';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {DEFAULT_AVATAR_COLOR, DEFAULT_IMAGE, MARGIN_NORMAL, MARGIN_X, S3_BUCKET_LINK, RECURRING_SUBSCRIPTION_STATUS} from '../../constants';
import GradientButton from '../GradientButton';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GenericActionButton from "../GenericActionButton";
import Fontisto from "react-native-vector-icons/Fontisto";
import {Colors, TextStyles} from '../../styles';
import EntypoIcons from 'react-native-vector-icons/Entypo';

const HEADER_SIZE = getHeaderHeight();

export class ProgressReportComponent extends Component<props> {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            contentTitles: {},
            appState: AppState.currentState,
            treatCount: this.props.totalEducationRead,
            ballCount: this.props.totalCompletedConversations,
            subscriptions: true
        };
    }

    onClose = () => {
        this.setState({modalVisible: false});
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


    treatAnimation = () => {
        switch (this.props.totalEducationRead) {
            case 1:
                return require("../../assets/animations/treatsAndBalls/treat-1");
            case 2:
                return require('../../assets/animations/treatsAndBalls/treat-2');
            case 3:
                return require('../../assets/animations/treatsAndBalls/treat-3');
            case 4:
                return require('../../assets/animations/treatsAndBalls/treat-4');
            case 5:
                return require('../../assets/animations/treatsAndBalls/treat-5');
            case 6:
                return require('../../assets/animations/treatsAndBalls/treat-6');
            case 7:
                return require('../../assets/animations/treatsAndBalls/treat-7');
            case 8:
                return require('../../assets/animations/treatsAndBalls/treat-8');
            case 9:
                return require('../../assets/animations/treatsAndBalls/treat-9');
            case 10:
                return require('../../assets/animations/treatsAndBalls/treat-10');
            default:
                return require('../../assets/animations/treatsAndBalls/treat-11');
        }
    };

    ballAnimation = () => {
        switch (this.props.totalCompletedConversations) {
            case 1:
                return require('../../assets/animations/treatsAndBalls/ball-1');
            case 2:
                return require('../../assets/animations/treatsAndBalls/ball-2');
            case 3:
                return require('../../assets/animations/treatsAndBalls/ball-3');
            case 4:
                return require('../../assets/animations/treatsAndBalls/ball-4');
            case 5:
                return require('../../assets/animations/treatsAndBalls/ball-5');
            case 6:
                return require('../../assets/animations/treatsAndBalls/ball-6');
            case 7:
                return require('../../assets/animations/treatsAndBalls/ball-7');
            case 8:
                return require('../../assets/animations/treatsAndBalls/ball-8');
            case 9:
                return require('../../assets/animations/treatsAndBalls/ball-9');
            case 10:
                return require('../../assets/animations/treatsAndBalls/ball-10');
            default:
                return require('../../assets/animations/treatsAndBalls/ball-11');
        }
    }

    componentWillUnmount(): void {
        AppState.removeEventListener('change', this._handleAppState);
    }

    _handleAppState = () => {
        if (this.state.appState === 'active') {
            if (this.animation) {
                this.animation.play();
            }
            if (this.animation1) {
                this.animation1.play();
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

    showConfirm = () => {
        this.setState({
            modalVisible: false,
            confirmModal: true,
        });
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
        StatusBar.setBarStyle('dark-content', true);
        const hasAssignedContent = this.props.assignedContent && this.props.assignedContent.totalCount > 0;
        const profilePicture = this.props.profileData ? (this.props.profileData.profilePicture || this.props.profileData.profileImage) : null;
        const hasOutcomes = this.props.outcomeData.outcomeCompletedList &&
            this.props.outcomeData.outcomeCompletedList.length > 0;
        const hasRiskTags = this.props.riskTagsData.riskTagList &&
            this.props.riskTagsData.riskTagList.length > 0;
        return (
            <Container style={{backgroundColor: Colors.colors.screenBG}}>

                {
                    this.props.isProviderApp ?
                        <Header transparent style={styles.reportHeader}>
                            <StatusBar
                                backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                                translucent
                                barStyle={'dark-content'}
                            />
                            <Left>
                                {this.props.isProviderApp ?
                                    <Button
                                        {...addTestID('back')}
                                        onPress={this.props.backClicked}
                                        transparent
                                        style={styles.backButton}>
                                        <FAIcon name="angle-left" size={32} color="#3fb2fe"/>
                                    </Button> :
                                    <Button
                                        {...addTestID('setting-icon')}
                                        {...addTestID('navigate-to-setting')}
                                        transparent
                                        style={{paddingLeft: 22, width: 60}}
                                        onPress={() => {
                                            this.props.navigateToSettings();
                                        }}>
                                        {/* <Icon type={'Ionicons'} name="ios-settings" style={{fontSize: 30, color: '#3fb2fe'}}/>
                                     */}
                                        <Image style={{height: 24, width: 23}}
                                               source={require('../../assets/images/setting-ico.png')}/>
                                    </Button>
                                }
                            </Left>
                            <Body style={styles.headerRow}>

                            </Body>
                            <Right style={Platform.OS === 'ios' ? null : {flex: 0.5}}>
                                {
                                    this.props.isProviderApp && this.props.isConnected ?
                                        this.state.modalVisible ? (
                                            <Button
                                                {...addTestID('close')}
                                                transparent
                                                style={{marginRight: 15, paddingLeft: 0, paddingRight: 7}}
                                                onPress={() => {
                                                    this.onClose();
                                                }}>
                                                <Ionicon name="md-close" size={30} color="#FFF"/>
                                            </Button>
                                        ) : (
                                            <Button
                                                transparent
                                                style={{marginRight: 15, paddingRight: 7, paddingLeft: 0}}
                                                onPress={() => {
                                                    this.showModal();
                                                }}>
                                                <Ionicon name="ios-more" size={30} color="#3fb2fe"/>
                                            </Button>
                                        ) :
                                        null
                                }
                            </Right>
                        </Header>
                        :
                        <Header transparent>
                            <StatusBar
                                backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                                translucent
                                barStyle={'dark-content'}
                            />
                        </Header>
                }


                <Overlay
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
                            {this.props.isProviderApp && this.props.isMatchmakerView && (
                                <GenericActionButton
                                    onPress={this.requestConnection}
                                    title={'Request Connection'}
                                    iconBackground={'#77C70B'}
                                    styles={styles.gButton}
                                    renderIcon={(size, color) =>
                                        <Fontisto
                                            name='link'
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
                        </View>
                    </View>
                </Overlay>
                {this.props.profileData && (
                    <Overlay
                        containerStyle={styles.confirmOverlay}
                        childrenWrapperStyle={styles.confirmWrapper}
                        visible={this.state.confirmModal}>
                        <View style={{width: '100%'}}>
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
                                    style={{...styles.outlineBtn, flex: 1, marginTop: 10}}
                                    onPress={() => {
                                        this.props.disconnectProfile();
                                    }}
                                >
                                    <Text style={styles.outlineText}>Yes, Disconnect</Text>
                                </Button>
                                <View style={styles.noBtn}>
                                    <GradientButton
                                        testId="no"
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
                        scrollIndicatorInsets={{right: 1}}
                        showsVerticalScrollIndicator={false}
                        style={styles.contentWrapper}>
                        {/*New Member Progress UI Starts*/}
                        <View style={styles.newMemberBox}>
                            <View style={styles.newMemberCard}>
                                {profilePicture ?
                                    <Image
                                        {...addTestID('user-profile-pic')}
                                        style={styles.newMemberImg}
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
                                        {...addTestID('user-profile-image')}
                                        style={{
                                            ...styles.newProBg,
                                            backgroundColor: this.props.profileData.colorCode ? this.props.profileData.colorCode : DEFAULT_AVATAR_COLOR
                                        }}><Text
                                        style={styles.newProLetter}>{this.props.profileData.fullName.charAt(0).toUpperCase()}</Text></View>
                                }
                                <Text {...addTestID('member-name')}
                                      style={styles.newMemberName}>{
                                    this.props.isProviderApp ?
                                        this.props.profileData.name
                                            ? this.props.profileData.name
                                            : '' :
                                        this.props.profileData.fullName
                                            ? this.props.profileData.fullName
                                            : ''}</Text>
                                <Text style={styles.pointText}>
                                    { `${this.props.profileData?.pointsEarned || 0} point${this.props.profileData?.pointsEarned >1? 's' :''} earned`}
                                </Text>
                                {/*<Text style={styles.pointText}>*/}
                                {/*    {this.props.profileData.pointsEarned || 0} points earned*/}
                                {/*</Text>*/}
                            </View>
                        </View>

                        <View style={styles.sectionList}>
                            <Text style={styles.sectionTitle}>Settings</Text>
                            <View style={styles.sectionSubList}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.singleItem}
                                    onPress={this.props.navigateToSettings}
                                >
                                    <Button
                                        transparent
                                        onPress={this.props.navigateToSettings}
                                        style={styles.settingIconWrap}>
                                        <Icon name={'settings'} type={'Feather'} style={styles.settingIcon}/>
                                    </Button>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Settings</Text>
                                        <Text
                                            style={styles.itemDes} numberOfLines={2}>
                                            Edit settings
                                        </Text>
                                    </View>
                                    <View style={styles.nextWrapper}>
                                        <Button
                                            onPress={() => {
                                                this.props.navigateToSettings();
                                            }} transparent style={styles.itemNextButton}>
                                            <EntypoIcons size={30} color={Colors.colors.neutral50Icon}
                                                         name="chevron-thin-right"/>
                                        </Button>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.sectionSubList}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.singleItem}
                                    onPress={() => {
                                        this.props.navigateToSupportScreen();
                                    }}
                                >
                                    <Button
                                        transparent
                                        onPress={() => {
                                            this.props.navigateToSupportScreen();
                                        }}
                                        style={[styles.settingIconWrap,
                                            {backgroundColor: Colors.colors.errorBG}
                                        ]}>
                                        <Icon name={'support'} type={'SimpleLineIcons'} style={[styles.settingIcon,
                                            {color: Colors.colors.errorIcon}
                                        ]}/>
                                    </Button>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Support</Text>
                                        <Text
                                            style={styles.itemDes} numberOfLines={2}>
                                            Contact us to get support
                                        </Text>
                                    </View>
                                    <View style={styles.nextWrapper}>
                                        <Button
                                            onPress={() => {
                                                this.props.navigateToSupportScreen();
                                            }} transparent style={styles.itemNextButton}>
                                            <EntypoIcons size={30} color={Colors.colors.neutral50Icon}
                                                         name="chevron-thin-right"/>
                                        </Button>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.sectionTitle}>Community & payments</Text>
                            <View style={styles.sectionSubList}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.singleItem}
                                    onPress={() => {
                                        this.props.navigateToContribution();
                                    }}

                                >
                                    <Button
                                        transparent
                                        onPress={() => {
                                            this.props.navigateToContribution();
                                        }}
                                        style={[styles.settingIconWrap,
                                            {backgroundColor: Colors.colors.successBG}
                                        ]}>
                                        <Icon name={'dollar-sign'} type={'Feather'} style={[styles.settingIcon,
                                            {color: Colors.colors.successIcon}
                                        ]}/>
                                    </Button>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Contributions</Text>
                                        <Text
                                            style={styles.itemDes} numberOfLines={2}>
                                            {
                                                this.props.subscriptionPaused? 'Contributions paused': (this.props.subscriptionAmount ? '$' + this.props.subscriptionAmount + ' per month' : 'No Monthly Contributions')
                                            }
                                        </Text>
                                    </View>

                                    <View style={styles.nextWrapper}>
                                        <Button onPress={() => {
                                            this.props.navigateToContribution();
                                        }} transparent style={styles.itemNextButton}>
                                            <EntypoIcons size={30} color={Colors.colors.neutral50Icon}
                                                         name="chevron-thin-right"/>
                                        </Button>
                                    </View>

                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.singleItem}
                                    onPress={() => {
                                        this.props.navigateToSubscriptionPackageScreen();
                                    }}>
                                    <Button
                                        transparent
                                        onPress={() => {
                                            this.props.navigateToSubscriptionPackageScreen();
                                        }}
                                        style={[styles.settingIconWrap,
                                            {backgroundColor: Colors.colors.secondaryColorBG}
                                        ]}>
                                        <Icon name={'dollar-sign'} type={'Feather'} style={[styles.settingIcon,
                                            {color: Colors.colors.mainPink80}
                                        ]}/>
                                    </Button>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Subscriptions</Text>
                                        <Text
                                            style={styles.itemDes} numberOfLines={2}>
                                            {
                                                this.props.recurringSubscription?.status === RECURRING_SUBSCRIPTION_STATUS.ACTIVE
                                                    ? '$' + this.props.recurringSubscription?.subscriptionAmount + ' ' +this.props.recurringSubscription?.subscribedPackage?.name   : 'No Monthly Subscription'
                                            }
                                        </Text>
                                    </View>

                                    <View style={styles.nextWrapper}>
                                        <Button onPress={() => {
                                            this.props.navigateToSubscriptionPackageScreen();
                                        }} transparent style={styles.itemNextButton}>
                                            <EntypoIcons size={30} color={Colors.colors.neutral50Icon}
                                                         name="chevron-thin-right"/>
                                        </Button>
                                    </View>

                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.singleItem}
                                    onPress={this.props.navigateToWallet}
                                >
                                    <Button
                                        transparent
                                        onPress={this.props.navigateToWallet}
                                        style={[styles.settingIconWrap,
                                            {backgroundColor: Colors.colors.primaryColorBG}
                                        ]}>
                                        <Icon name={'wallet'} type={'FontAwesome5'} style={[styles.settingIcon,
                                            {color: Colors.colors.primaryIcon}
                                        ]}/>
                                    </Button>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Wallet</Text>
                                        <Text
                                            style={styles.itemDes} numberOfLines={2}>
                                            ${this.props.walletBalance} account balance
                                        </Text>
                                    </View>
                                    <View style={styles.nextWrapper}>
                                        <Button onPress={this.props.navigateToWallet}
                                                transparent style={styles.itemNextButton}>
                                            <EntypoIcons size={30} color={Colors.colors.neutral50Icon}
                                                         name="chevron-thin-right"/>
                                        </Button>
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.sectionTitle}>Care plan</Text>
                            <View style={styles.sectionSubList}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.singleItem}
                                    onPress={this.props.navigateToCareTeam}
                                >
                                    <Button
                                        transparent
                                        onPress={this.props.navigateToCareTeam}
                                        style={[styles.settingIconWrap,
                                            {backgroundColor: Colors.colors.secondaryColorBG}
                                        ]}>
                                        <Icon name={'heart'} type={'Feather'} style={[styles.settingIcon,
                                            {color: Colors.colors.secondaryIcon}
                                        ]}/>
                                    </Button>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Care team</Text>
                                        {this.props.careTeamMembers === 1?
                                            <Text
                                                style={styles.itemDes} numberOfLines={2}>
                                                {this.props.careTeamMembers} member
                                            </Text>
                                            :
                                            <Text
                                                style={styles.itemDes} numberOfLines={2}>
                                                {this.props.careTeamMembers} members
                                            </Text>
                                        }
                                    </View>
                                    <View style={styles.nextWrapper}>
                                        <Button onPress={this.props.navigateToCareTeam}
                                                transparent style={styles.itemNextButton}>
                                            <EntypoIcons size={30} color={Colors.colors.neutral50Icon}
                                                         name="chevron-thin-right"/>
                                        </Button>
                                    </View>

                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.singleItem}
                                    onPress={this.props.navigateToAppointments}
                                >
                                    <Button
                                        transparent
                                        onPress={this.props.navigateToAppointments}
                                        style={[styles.settingIconWrap,
                                            {backgroundColor: Colors.colors.primaryColorBG}
                                        ]}>
                                        <Icon name={'calendar'} type={'Feather'} style={[styles.settingIcon,
                                            {color: Colors.colors.primaryIcon}
                                        ]}/>
                                    </Button>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Appointments</Text>
                                        <Text
                                            style={styles.itemDes} numberOfLines={2}>
                                            {this.props.totalBookedAppointments} Current, {this.props.totalPastAppointments} Past
                                        </Text>
                                    </View>
                                    <View style={styles.nextWrapper}>
                                        <Button onPress={this.props.navigateToAppointments}
                                                transparent style={styles.itemNextButton}>
                                            <EntypoIcons size={30} color={Colors.colors.neutral50Icon}
                                                         name="chevron-thin-right"/>
                                        </Button>
                                    </View>

                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.singleItem}
                                    onPress={() => {
                                        this.props.navigateToGroups();
                                    }}
                                >
                                    <Button
                                        transparent
                                        onPress={() => {
                                            this.props.navigateToGroups();
                                        }}
                                        style={[styles.settingIconWrap,
                                            {backgroundColor: Colors.colors.successBG}
                                        ]}>
                                        <Icon name={'group'} type={'MaterialIcons'} style={[styles.settingIcon,
                                            {color: Colors.colors.successIcon}
                                        ]}/>
                                    </Button>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Groups</Text>
                                        <Text
                                            style={styles.itemDes} numberOfLines={2}>
                                            {this.props.groupsJoined} groups joined
                                        </Text>
                                    </View>
                                    <View style={styles.nextWrapper}>
                                        <Button onPress={() => {
                                            this.props.navigateToGroups();
                                        }} transparent style={styles.itemNextButton}>
                                            <EntypoIcons size={30} color={Colors.colors.neutral50Icon}
                                                         name="chevron-thin-right"/>
                                        </Button>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.singleItem}
                                    onPress={() => {
                                        this.props.navigateToChatbots();
                                    }}
                                >
                                    <Button
                                        onPress={() => {
                                            this.props.navigateToChatbots();
                                        }}
                                        transparent
                                        style={[styles.settingIconWrap,
                                            {backgroundColor: Colors.colors.warningBG}
                                        ]}>
                                        <Icon name={'message-circle'} type={'Feather'} style={[styles.settingIcon,
                                            {color: Colors.colors.warningIcon}
                                        ]}/>
                                    </Button>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Chatbots</Text>
                                        <Text
                                            style={styles.itemDes} numberOfLines={2}>
                                            {this.props.completedChatBots} completed
                                        </Text>

                                    </View>
                                    <View style={styles.nextWrapper}>
                                        <Button onPress={() => {
                                            this.props.navigateToChatbots();
                                        }} transparent style={styles.itemNextButton}>
                                            <EntypoIcons size={30} color={Colors.colors.neutral50Icon}
                                                         name="chevron-thin-right"/>
                                        </Button>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.singleItem}
                                    onPress={() => {
                                        this.props.navigateToEducation();
                                    }}
                                >
                                    <Button
                                        transparent
                                        onPress={() => {
                                            this.props.navigateToEducation();
                                        }}
                                        style={[styles.settingIconWrap,
                                            {backgroundColor: Colors.colors.errorBG}
                                        ]}>
                                        <Icon name={'book-open'} type={'Feather'} style={[styles.settingIcon,
                                            {color: Colors.colors.errorIcon}
                                        ]}/>
                                    </Button>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Education</Text>
                                        <Text
                                            style={styles.itemDes} numberOfLines={2}>
                                            {this.props.totalEducationRead} completed
                                        </Text>
                                    </View>
                                    <View style={styles.nextWrapper}>
                                        <Button onPress={() => {
                                            this.props.navigateToEducation();
                                        }} transparent style={styles.itemNextButton}>
                                            <EntypoIcons size={30} color={Colors.colors.neutral50Icon}
                                                         name="chevron-thin-right"/>
                                        </Button>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={styles.singleItem}
                                    onPress={() => {
                                        this.props.seeAll({
                                            section: 'RECENT_ACTIVITY',
                                            title: 'Recent Activities',
                                            data: [],
                                        });
                                    }}
                                >
                                    <Button
                                        transparent
                                        onPress={() => {
                                            this.props.seeAll({
                                                section: 'RECENT_ACTIVITY',
                                                title: 'Recent Activities',
                                                data: [],
                                            });
                                        }}
                                        style={[styles.settingIconWrap,
                                            {backgroundColor: Colors.colors.warningBG}
                                        ]}>
                                        <Icon name={'activity'} type={'Feather'} style={[styles.settingIcon,
                                            {color: Colors.colors.warningIcon}
                                        ]}/>
                                    </Button>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Activity</Text>
                                        {this.props.totalActivitiesCount === 1?
                                            <Text
                                                style={styles.itemDes} numberOfLines={2}>
                                                {this.props.totalActivitiesCount} activity total
                                            </Text>
                                            :
                                            <Text
                                                style={styles.itemDes} numberOfLines={2}>
                                                {this.props.totalActivitiesCount} activities total
                                            </Text>
                                        }

                                    </View>
                                    <View style={styles.nextWrapper}>
                                        <Button onPress={() => {
                                            this.props.seeAll({
                                                section: 'RECENT_ACTIVITY',
                                                title: 'Recent Activities',
                                                data: [],
                                            });
                                        }} transparent style={styles.itemNextButton}>
                                            <EntypoIcons size={30} color={Colors.colors.neutral50Icon}
                                                         name="chevron-thin-right"/>
                                        </Button>
                                    </View>
                                </TouchableOpacity>
                            </View>


                        </View>


                        {/*<View style={styles.newActivityList}>*/}
                        {/*    <Text style={styles.activityHead}>your activity</Text>*/}
                        {/*    <View style={styles.newActivityBox}>*/}
                        {/*        <View style={styles.newAnimBox}>*/}
                        {/*            {*/}
                        {/*                this.props.totalEducationRead === 0?*/}
                        {/*                    <View style={styles.nothingBox}>*/}
                        {/*                        <Text style={styles.noAccessText}>Nothing Yet</Text>*/}
                        {/*                    </View>*/}
                        {/*                    :*/}
                        {/*                    <LottieView*/}
                        {/*                        ref={animation1 => {*/}
                        {/*                            this.animation1 = animation1;*/}
                        {/*                        }}*/}
                        {/*                        style={styles.noAccessAnim}*/}
                        {/*                        resizeMode="cover"*/}
                        {/*                        source={this.treatAnimation()}*/}
                        {/*                        autoPlay={true}*/}
                        {/*                        loop/>*/}
                        {/*            }*/}

                        {/*        </View>*/}
                        {/*        <View style={styles.NewConRow}>*/}
                        {/*            <Text style={styles.newActivityText}>Education read</Text>*/}
                        {/*            <Text style={styles.newActivityCount}>{this.props.totalEducationRead}</Text>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*    <View style={styles.newActivityBox}>*/}
                        {/*        <View style={styles.newAnimBox}>*/}
                        {/*            {*/}
                        {/*                this.props.totalCompletedConversations === 0?*/}
                        {/*                    <View style={styles.nothingBox}>*/}
                        {/*                        <Text style={styles.noAccessText}>Nothing Yet</Text>*/}
                        {/*                    </View>*/}
                        {/*                    :*/}
                        {/*                    <LottieView*/}
                        {/*                        ref={animation1 => {*/}
                        {/*                            this.animation1 = animation1;*/}
                        {/*                        }}*/}
                        {/*                        style={styles.noAccessAnim}*/}
                        {/*                        resizeMode="cover"*/}
                        {/*                        source={this.ballAnimation()}*/}
                        {/*                        autoPlay={true}*/}
                        {/*                        loop/>*/}
                        {/*            }*/}

                        {/*        </View>*/}
                        {/*        <View style={styles.NewConRow}>*/}
                        {/*            <Text style={styles.newActivityText}>Conversations Completed</Text>*/}
                        {/*            <Text style={styles.newActivityCount}>{this.props.totalCompletedConversations}</Text>*/}
                        {/*        </View>*/}
                        {/*    </View>*/}
                        {/*</View>*/}


                        {/*<View style={styles.newApptBox}>*/}
                        {/*    <Text style={styles.apptHead}>your appointments</Text>*/}
                        {/*    <Text style={styles.newSessionCount}>{this.props.totalCompletedAppointments}</Text>*/}
                        {/*    <Text style={styles.newSessionText}>Sessions Attended</Text>*/}
                        {/*    <View style={styles.newApptBtn}>*/}
                        {/*        <GradientButton onPress={() => {*/}
                        {/*            this.props.navigateToAppointments();*/}
                        {/*        }}*/}
                        {/*                        text="Book an appointment"*/}
                        {/*        />*/}
                        {/*    </View>*/}
                        {/*</View>*/}


                        {/*<View style={styles.newFundBox}>*/}
                        {/*    <Text style={styles.fundHead}>Available Funds For Sessions</Text>*/}
                        {/*    <Text style={styles.newFundAmount}>${this.props.walletBalance}</Text>*/}
                        {/*    <Button transparent onPress={() => {*/}
                        {/*        this.props.navigateToAddFunds();*/}
                        {/*    }}>*/}
                        {/*        <LinearGradient*/}
                        {/*            start={{x: 0, y: 1}}*/}
                        {/*            end={{x: 1, y: 0}}*/}
                        {/*            colors={['#1edeae', '#12B884', '#068e56']}*/}
                        {/*            style={styles.newFundBtn}*/}
                        {/*        >*/}
                        {/*            <Text style={styles.addFundText}>Add Funds</Text>*/}
                        {/*        </LinearGradient>*/}
                        {/*    </Button>*/}
                        {/*</View>*/}


                        {/*<View style={styles.newDoneActivity}>*/}
                        {/*    <Text style={styles.activityHead}>Look what you’ve done</Text>*/}

                        {/*    <View style={styles.activityBox}>*/}
                        {/*        {this.props.activityData && this.props.activityData.length > 0*/}
                        {/*            ? this.props.activityData.map((activity, i) => {*/}
                        {/*                let iconType = '';*/}
                        {/*                if (activity.activityType === 'LOGIN') {*/}
                        {/*                    iconType = 'sign-in';*/}
                        {/*                } else if (activity.activityType === 'CONTENT') {*/}
                        {/*                    iconType = 'book';*/}
                        {/*                } else if (activity.activityType === 'CONVERSATION') {*/}
                        {/*                    iconType = 'comments';*/}
                        {/*                } else if (activity.activityType === 'DCT') {*/}
                        {/*                    iconType = 'bar-chart';*/}
                        {/*                }*/}

                        {/*                return (*/}

                        {/*                    <View style={styles.wholeList}>*/}
                        {/*                        <View style={styles.singleEntry}>*/}
                        {/*                            <View style={styles.iconSide}>*/}
                        {/*                                <FAIcon name={iconType} size={24} color="#3fb2fe"/>*/}
                        {/*                            </View>*/}
                        {/*                            <View style={styles.textBox}>*/}
                        {/*                                <Text*/}
                        {/*                                    style={styles.activityText}*/}
                        {/*                                    numberOfLines={2}>*/}
                        {/*                                    <Text style={styles.duskText}>*/}
                        {/*                                        {this.getFormattedActivity(*/}
                        {/*                                            activity.activityDescription,*/}
                        {/*                                            activity.referenceText,*/}
                        {/*                                        )}*/}
                        {/*                                    </Text>*/}
                        {/*                                </Text>*/}
                        {/*                            </View>*/}
                        {/*                            <Text style={styles.timeText}>*/}
                        {/*                                {activity.activityTimeDifference}*/}
                        {/*                            </Text>*/}
                        {/*                        </View>*/}
                        {/*                    </View>*/}
                        {/*                );*/}
                        {/*            })*/}
                        {/*            : null}*/}

                        {/*        {this.props.activityData && this.props.activityData.length > 0 && (*/}
                        {/*            <Button*/}
                        {/*                {...addTestID('see-all-btn')}*/}
                        {/*                style={styles.newSeeAllBtn}*/}
                        {/*                transparent*/}
                        {/*                onPress={() => {*/}
                        {/*                    this.props.seeAll({*/}
                        {/*                        section: 'RECENT_ACTIVITY',*/}
                        {/*                        title: 'Recent Activities',*/}
                        {/*                        data: [],*/}
                        {/*                    });*/}
                        {/*                }}>*/}
                        {/*                {*/}
                        {/*                    this.props.totalActivitiesCount > 3 ?*/}
                        {/*                        <Text uppercase={false} style={styles.newSeeAllText}>*/}
                        {/*                            See All({this.props.totalActivitiesCount})*/}
                        {/*                        </Text> : null*/}
                        {/*                }*/}
                        {/*            </Button>*/}
                        {/*        )}*/}
                        {/*    </View>*/}
                        {/*</View>*/}


                        {/*<View style={styles.loveWrapper}>*/}
                        {/*    <View style={{ flexDirection: 'row', alignItems: 'center'}}>*/}
                        {/*        <Text style={styles.loveText}>Made with</Text>*/}
                        {/*        <FAIcon style={{ marginLeft: 5, marginRight: 5}} name="heart" size={15} color="#d0021b"/>*/}
                        {/*        <Text style={styles.loveText}>by people</Text>*/}
                        {/*    </View>*/}
                        {/*    <Text style={styles.loveText}>like you</Text>*/}
                        {/*</View>*/}


                        {/*New Member Progress UI Ends*/}


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
                                loop/>
                            <Text style={styles.noAccessText}>You don't have access to view progress report of the
                                member.</Text>
                        </View> : null}
                        {this.props.activityError && !this.props.isProviderApp ? <NoRecord/> : null}


                        {!this.props.isConnected && this.props.isProviderApp && (
                            <View style={[styles.assignBtn, {
                                paddingLeft: 16,
                                paddingRight: 16,
                            }]}>
                                <GradientButton
                                    testId="connection-requested"
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
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 16}}>Failed to load Progress Report.</Text>
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
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    newMemberBox: {
        paddingTop: 40,
        paddingHorizontal: 24
    },
    newMemberCard: {
        alignItems: 'center',
        paddingTop: 50
    },
    newMemberImg: {
        width: 112,
        height: 112,
        borderRadius: 60,
        overflow: 'hidden'
    },
    newProBg: {
        width: 112,
        height: 112,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    newProLetter: {
        ...TextStyles.mediaTexts.manropeExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.white,
        textTransform: 'uppercase'
    },
    newMemberName: {
        ...TextStyles.mediaTexts.serifProExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
        marginTop: 8,
        marginBottom: 4,
        textAlign: 'center',
        paddingHorizontal: 24
    },
    pointText: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.subTextS,
        color: Colors.colors.lowContrast,
    },

    sectionList: {
        paddingHorizontal: 24,
        paddingBottom: 40
    },
    sectionTitle: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.overlineTextS,
        textTransform: 'uppercase',
        color: Colors.colors.lowContrast,
        marginTop: 20,
        marginBottom: 12,
    },
    sectionSubList: {},
    singleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12
    },
    settingIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.colors.highContrastBG,
        paddingTop: 0,
        paddingBottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    settingIcon: {
        fontSize: 24,
        color: Colors.colors.neutral100Icon,
        marginLeft: 0,
        marginRight: 0
    },
    itemDetail: {
        flex: 2,
        paddingLeft: 12
    },
    itemName: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.highContrast
    },
    itemDes: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText,
        color: Colors.colors.lowContrast
    },
    itemNextButton: {
        marginRight: 0,
        paddingRight: 0
    },
    addItemBtn: {
        marginRight: 0,
        paddingRight: 0,
        paddingLeft: 0,
        backgroundColor: Colors.colors.primaryIcon,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center'
    },
    addItemIcon: {
        color: Colors.colors.white,
        fontSize: 25,
        marginLeft: 0,
        marginRight: 0
    },


    newEditText: {
        color: '#3fb2fe',
        fontFamily: 'Roboto-Bold',
        fontWeight: '500',
        fontSize: 15,
        letterSpacing: 0,
        marginTop: 16
    },
    newActivityList: {
        paddingTop: 40,
        paddingRight: 24,
        paddingLeft: 24,
        alignItems: 'center'
    },
    activityHead: {
        color: '#515d7d',
        fontFamily: 'Roboto-Bold',
        fontWeight: '500',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        textAlign: 'center',
        marginBottom: 40
    },
    newActivityBox: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'rgba(0,0,0, 0.15)',
        borderRadius: 8,
        elevation: 0,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        shadowColor: 'rgba(0,0,0, 0.09)',
        marginBottom: 24,
        backgroundColor: '#fff',
        width: '100%'
    },
    newAnimBox: {},
    NewConRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5'
    },
    newActivityText: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 21,
        letterSpacing: 0.5,
        paddingLeft: 8
    },
    newActivityCount: {
        color: '#ec0d4e',
        fontFamily: 'Roboto-Regular',
        fontSize: 20,
        letterSpacing: 0.63,
    },
    newApptBox: {
        paddingTop: 80,
        paddingLeft: 24,
        paddingRight: 24,
        alignItems: 'center'
    },
    apptHead: {
        color: '#515d7d',
        fontFamily: 'Roboto-Bold',
        fontWeight: '500',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        textAlign: 'center',
        marginBottom: 40
    },
    newSessionCount: {
        color: '#3fb2fe',
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: 48,
        marginBottom: 8
    },
    newSessionText: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 21,
        letterSpacing: 0.5,
        textAlign: 'center',
        marginBottom: 40
    },
    newApptBtn: {
        maxWidth: 240
    },
    newFundBox: {
        paddingTop: 80,
        paddingLeft: 24,
        paddingRight: 24,
        alignItems: 'center'
    },
    fundHead: {
        color: '#515d7d',
        fontFamily: 'Roboto-Bold',
        fontWeight: '500',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        textAlign: 'center',
        marginBottom: 40
    },
    newFundAmount: {
        color: '#12B884',
        fontFamily: 'Roboto-Regular',
        fontWeight: '400',
        fontSize: 48,
        marginBottom: 16
    },
    newFundBtn: {
        maxWidth: 240,
        height: 48,
        flex: 1,
        borderRadius: 4,
        justifyContent: 'center'
    },
    addFundText: {
        fontSize: 13,
        fontFamily: "Roboto-Bold",
        letterSpacing: 0.7,
        textAlign: "center",
        width: "100%",
        color: "#ffffff",
        textTransform: 'uppercase'
    },
    newDoneActivity: {
        paddingTop: 80,
        paddingLeft: 24,
        paddingRight: 24,
        alignItems: 'center'
    },
    newSeeAllBtn: {
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    newSeeAllText: {
        color: '#3fb2fe',
        fontSize: 14,
        letterSpacing: 0.5,
        fontWeight: '600',
        fontFamily: 'Roboto-Bold'
    },
    loveWrapper: {
        alignItems: 'center',
        marginTop: isIphoneX() ? 40 : 30,
        marginBottom: isIphoneX() ? 80 : 60
    },
    loveText: {
        color: '#969fa8',
        fontSize: 13,
        lineHeight: 21,
        fontWeight: '500',
        fontFamily: 'Roboto-Regular'
    },


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
        paddingTop: 15,
        paddingLeft: 3,
        paddingRight: 0,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        justifyContent: 'flex-start',
        height: HEADER_SIZE,
        backgroundColor: '#fff'
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
        flex: 3,
        // flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    headerText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0.3,
        fontWeight: '400',
        color: '#25345c',
        alignSelf: 'center'
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
    activityBox: {
        width: '100%'
    },
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
    nothingBox: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center'
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
        shadowOffset: {width: 0, height: 10},
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
});
