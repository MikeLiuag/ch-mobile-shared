import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet, Image, ScrollView} from 'react-native';
import {Container, Text, View, Left, Body, Button, Right, Header, Content, Icon} from 'native-base';
import {Colors, TextStyles, CommonStyles} from '../../styles';
import {addTestID, isIphoneX, getHeaderHeight, getTimeFromMilitaryStamp, valueExists} from '../../utilities';
import {TransactionSingleActionItem} from "../TransactionSingleActionItem";
import {PrimaryButton} from "../PrimaryButton";
import {DEFAULT_GROUP_IMAGE} from '../../constants'
import Modal from 'react-native-modalbox';
import EntypoIcons from "react-native-vector-icons/Entypo";
import {CommonMemberCard} from '../CommonMemberCard';
import AntIcons from "react-native-vector-icons/AntDesign";
import FeatherIcons from "react-native-vector-icons/Feather";
import Loader from "../../components/Loader";
import DeviceInfo from 'react-native-device-info';

let deviceId = DeviceInfo.getDeviceId();
const HEADER_SIZE = getHeaderHeight();

export class GroupDetailComponent extends Component<Props> {

    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
    }

    /**
     * @function renderGroupTags
     * @description This method is used to render group tags list.
     */
    renderGroupTags = () => {
        const {groupDetails} = this.props;
        return (
            groupDetails?.tags?.length > 0 && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                    <View style={styles.groupTags}>
                        {groupDetails?.tags?.map(groupTag => {
                            return (
                                <View style={styles.singleTag}>
                                    <Text style={styles.tagText}>{groupTag}</Text>
                                </View>
                            )
                        })}
                    </View>
                </ScrollView>
            )
        )
    }

    /**
     * @function renderListByType
     * @description This method is used to render List ( Rules , Benefits) .
     */
    renderListByType = (listTitle, listValues) => {
        return (
            <View>
                <Text style={styles.groupDesTitle}>{listTitle}</Text>
                <View style={styles.benefitList}>
                    {listValues.map((value, index) => {
                        return (
                            <View key={index} style={styles.singleBenefit}>
                                {
                                    listTitle === "Rules of this group" ?
                                        <Icon style={styles.arrowIcon} type={'Feather'} name="check-square"/>
                                        :
                                        <Icon style={styles.arrowIcon} type={'FontAwesome'} name="long-arrow-right"/>
                                }
                                <Text style={styles.benefitText}>{value}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>
        )
    }

    /**
     * @function renderGroupMembersList
     * @description This method is used to render members List.
     */
    renderGroupMembersList = () => {
        const {groupDetails} = this.props;
        const members = groupDetails?.members;
        return (
            <View>
                <Text style={styles.groupDesTitle}>Group members</Text>
                <View style={styles.memberList}>
                    {members.map((member, index) => {
                        return (
                            <CommonMemberCard
                                key={index}
                                member={member}
                                onPress={() => this.props.navigateToConnectionProfile(member)}
                                S3_BUCKET_LINK={this.props.S3_BUCKET_LINK}
                            />
                        )
                    })}
                </View>
            </View>
        )
    }


    /**
     * @function getMethodByType
     * @description This method is used to get Method by type.
     */
    getMethodByType = (buttonType) => {
        let method;
        if (buttonType === 'LEAVE_GROUP') {
            method = () => this.props.leaveGroup();
        }
        if (buttonType === 'JOIN_GROUP') {
            method = () => this.props.joinGroup();
        }
        if (buttonType === 'GO_TO_GROUP_CHAT') {
            method = () => this.props.goToGroupChat();
        }
        if (buttonType === 'SHARE_GROUP') {
            method = () => this.props.navigateToShareGroupDetails();
        }
        if (buttonType === 'INVITE_GROUP') {
            method = () => this.props.navigateToInviteGroupDetails();
        }
        if (buttonType === 'CONTRIBUTE_GROUP') {
            method = () => this.props.navigateToContribution();
        }
        if (buttonType === 'EDIT_GROUP') {
            method = () => this.props.navigateToEditGroupDetails();
        }
        if (buttonType === 'ADD_MEMBERS_GROUP') {
            method = () => this.props.navigateToManageMembers()
        }

        return method;
    }

    /**
     * @function renderSingleButton
     * @description Generic method for rendering single button.
     */
    renderSingleButton = (button) => {
        const method = this.getMethodByType(button.type);
        return (
            <View style={styles.singleOption}>
                <TransactionSingleActionItem
                    title={button.title}
                    onPress={()=>{
                        this.hideMoreOptions();
                        method();
                    }}
                    iconBackground={button.iconBackground}
                    styles={styles.gButton}
                    renderIcon={(size, color) =>{
                        if(button.type === 'LEAVE_GROUP'){
                            return <AntIcons size={22} color={Colors.colors.errorIcon} name="closecircleo"/>
                        }else {
                            return <FeatherIcons size={22} color={button.iconColor} name={button.iconName}/>
                        }
                    }}
                />
            </View>
        )
    }


    /**
     * @function getButtonList
     * @description Generic method used to get button options ( Member OR Provider app ).
     */
    getButtonList = (renderModalDetails)=> {
        const {groupDetails} = this.props;
        let updatedButtonsList;
        if(this.props.isProviderApp){
            const isAdmin = groupDetails?.isAdmin;
            if(!isAdmin){
                updatedButtonsList = this.props.buttonOptions.filter(item => item.type === 'SHARE_GROUP')
            }else {
                updatedButtonsList = this.props.buttonOptions.filter(item => item.isListOption);
                if (renderModalDetails) {
                    updatedButtonsList = this.props.buttonOptions.filter(item => item.isModalOption)
                }
            }
        }else{
            updatedButtonsList = this.props.buttonOptions.filter(button => button.type === 'JOIN_GROUP');
            if(groupDetails?.joinedGroup){
                updatedButtonsList = this.props.buttonOptions.filter(button => button.type !== 'JOIN_GROUP');
            }
        }

        return updatedButtonsList
    }

    /**
     * @function renderGroupManagementOptionsList
     * @description This method is used to render Group Management buttons ( Modal + simple List )
     */
    renderGroupManagementOptionsList = (renderModalDetails) => {
        let renderList = this.getButtonList(renderModalDetails);
        return (
            <View style={renderModalDetails?styles.groupManagementList:styles.groupActionList}>
                {renderList && renderList.map(button => {
                    return this.renderSingleButton(button)
                })}
            </View>
        )
    }

    showMoreOptions = () => {
        this.refs.modalMoreOptions.open();
    };

    hideMoreOptions = () => {
        this.refs.modalMoreOptions.close();
    };

    getDrawerHeight = () => {
        const buttonCount = this.getButtonList(true)?.length;
        // console.log(buttonCount);
        let height = '20%';
        if(buttonCount >= 2 && buttonCount < 4) {
            height = '40%'
        }
        if(buttonCount >= 4) {
            height = '60%'
        }
        return height;
    }


    /**
     * @function getDrawerHeight
     * @description Method used to get height for modal ( depends on buttons count )
     */
    getDrawerHeight = () => {
        const buttonCount = this.getButtonList(true)?.length;
        let height = '20%';
        if(buttonCount >= 2 && buttonCount < 4) {
            height = '40%'
        }
        if(buttonCount >= 4) {
            height = '60%'
        }
        return height;
    }


    /**
     * @function renderGroupMeetings
     * @description Method is used to render group Meetings
     * @params selectedMeetingDay , meetingSlot
     */

    renderGroupMeetings = () => {
        const meetings = this.props?.groupDetails?.meetings;
        return (
            <View style={styles.scheduleList}>
                {meetings.map((groupMeeting, index) => {
                    const startMilitaryTime = getTimeFromMilitaryStamp(groupMeeting.meetingStartTime);
                    const endMilitaryTime = getTimeFromMilitaryStamp(groupMeeting.meetingEndTime);
                    return (
                        <View style={styles.singleSchedule}>
                            <Text style={styles.scheduleDay}>Every {groupMeeting.day}</Text>
                            <Text style={styles.scheduleTime}>{startMilitaryTime.desc}-{endMilitaryTime.desc}</Text>
                        </View>
                    )
                })}
            </View>
        )
    }

    shouldRenderMembers = ()=>{
        const {groupDetails,isProviderApp} = this.props;
        if(groupDetails?.isAdmin || groupDetails?.joinedGroup){
            return true;
        }else if(isProviderApp){
            return true;
        }
        return false;
    }

    render = () => {
        const { S3_BUCKET_LINK } = this.props;
        if(this.props.isLoading){
            return <Loader/>
        }
        const {groupDetails} = this.props;
        return (
            <Container style={{backgroundColor: Colors.colors.screenBG}}>
                {
                    // isIphoneX()?
                    deviceId.includes('iPhone10') || deviceId.includes('iPhone11') || deviceId.includes('iPhone12')?
                        <View style={{
                            paddingTop: 35,
                            paddingLeft: 22,
                            paddingRight: 8,
                            elevation: 0,
                            height: 102,
                            // backgroundColor: 'red',
                            flexDirection: 'row',
                            // marginTop: 50,
                            zIndex: 100
                        }}>
                            <StatusBar
                                backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                                translucent
                                barStyle={'dark-content'}
                            />
                            <Left>
                                <Button
                                    onPress={this.props.navigateBack}
                                    transparent
                                    style={styles.backButton}>
                                    <EntypoIcons size={30} color={Colors.colors.white} name="chevron-thin-left"/>
                                </Button>
                            </Left>
                            <Body/>
                            <Right>
                                <Button
                                    onPress={this.showMoreOptions}
                                    transparent
                                    style={styles.moreBtn}>
                                    <Icon style={styles.moreIcon} type={'Feather'} name="more-horizontal"/>
                                </Button>
                            </Right>
                        </View>
                        :
                        <Header transparent style={styles.header}>
                            <StatusBar
                                backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                                translucent
                                barStyle={'dark-content'}
                            />
                            <Left>
                                <Button
                                    onPress={this.props.navigateBack}
                                    transparent
                                    style={styles.backButton}>
                                    <EntypoIcons size={30} color={Colors.colors.white} name="chevron-thin-left"/>
                                </Button>
                            </Left>
                            <Body/>
                            <Right>
                                <Button
                                    onPress={this.showMoreOptions}
                                    transparent
                                    style={styles.moreBtn}>
                                    <Icon style={styles.moreIcon} type={'Feather'} name="more-horizontal"/>
                                </Button>
                            </Right>
                        </Header>
                }

                <Content showsVerticalScrollIndicator={false}
                         style={styles.contentWrapper}>
                    <View style={styles.bgImgWrapper}>
                        <Image
                            style={styles.groupBgImg}
                            resizeMode={'cover'}
                            source={{uri: groupDetails?.profilePicture ? S3_BUCKET_LINK + groupDetails?.profilePicture : S3_BUCKET_LINK + DEFAULT_GROUP_IMAGE}}/>
                    </View>
                    <View style={styles.groupContent}>
                        <Text style={styles.groupMainTitle}>{groupDetails?.name}</Text>
                        <View>
                            {!this.props.isProviderApp && (
                                <View style={styles.timeTypeWrap}>
                                    {groupDetails?.meetings && groupDetails?.meetings.length > 0 && (
                                        <Text
                                            style={styles.timeText}>{groupDetails?.meetings[0].day} {getTimeFromMilitaryStamp(groupDetails?.meetings[0].meetingStartTime).desc}
                                            {'-'}{getTimeFromMilitaryStamp(groupDetails?.meetings[0].meetingEndTime).desc}</Text>

                                    )}
                                    {groupDetails?.meetings && groupDetails?.meetings.length > 0 && groupDetails?.groupAnonymous && (
                                        <View style={styles.greyDot}/>
                                    )}
                                    {groupDetails?.groupAnonymous && (
                                        <Text style={styles.anonymousText}>Anonymous group</Text>
                                    )}
                                </View>
                            )}
                            {this.props.isProviderApp && (
                                <View style={styles.timeTypeWrap}>
                                    {groupDetails?.groupTypePublic && (
                                        <Text style={styles.anonymousText}>Discoverable</Text>
                                    )}
                                    {groupDetails?.groupTypePublic && groupDetails?.groupAnonymous && (
                                        <View style={styles.greyDot}/>
                                    )}
                                    {groupDetails?.groupAnonymous && (
                                        <Text style={styles.anonymousText}>Anonymous</Text>
                                    )}
                                </View>
                            )}
                        </View>

                        {groupDetails?.tags?.length > 0 && this.renderGroupTags()}
                        {this.props.isProviderApp && this.renderGroupManagementOptionsList(false)}
                        <View style={styles.groupDes}>
                            {this.props.isProviderApp && groupDetails?.meetings?.length > 0 && this.renderGroupMeetings()}
                            {valueExists(groupDetails?.groupDescription) && (
                                <View>
                                    <Text style={styles.groupDesTitle}>About this group</Text>
                                    <Text style={styles.groupPara}>{groupDetails?.groupDescription}</Text>
                                </View>
                            )}

                            {groupDetails?.whoCanBenefits?.length > 0 && this.renderListByType('Who can benefit', groupDetails?.whoCanBenefits)}
                            {groupDetails?.groupRuleSettings?.rules?.length > 0 && this.renderListByType('Rules of this group', groupDetails?.groupRuleSettings?.rules.map(rule => rule.description))}
                            {groupDetails?.groupOrganizer && (
                                <View>
                                    <Text style={styles.groupDesTitle}>Group organizer</Text>
                                    <View style={styles.organizerWrap}>
                                        <CommonMemberCard
                                            onPress={() => this.props.navigateToConnectionProfile(groupDetails?.groupOrganizer)}
                                            member={groupDetails?.groupOrganizer}
                                            S3_BUCKET_LINK={this.props.S3_BUCKET_LINK}
                                        />
                                    </View>
                                </View>
                            )}
                            {this.props.isProviderApp && groupDetails?.members?.length > 0 && this.shouldRenderMembers() && this.renderGroupMembersList()}

                            {!this.props.isProviderApp && groupDetails?.groupTypePublic && !groupDetails?.joinedGroup && (
                                <View style={styles.totalMembers}>
                                    <Image
                                        style={styles.anonymousIcon}
                                        source={require('../../assets/images/anonymous-icon.png')}/>
                                    <Text style={styles.memberText}>{groupDetails?.members?.length} group
                                        members</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Content>
                {groupDetails?.joinedGroup && (
                    <View
                        {...addTestID('view')}
                        style={styles.greBtn}>
                        <PrimaryButton
                            testId="go-to-chat"
                            iconName='user'
                            type={'Feather'}
                            color={Colors.colors.whiteColor}
                            onPress={() => {
                                this.props.goToGroupChat();
                            }}
                            text="Go to chat"
                            size={24}
                        />
                    </View>
                )}
                {!this.props.isProviderApp && !groupDetails?.joinedGroup && (
                    <View style={styles.greBtn}>
                        <PrimaryButton
                            testId="join-group"
                            text="Join group"
                            iconName={'users'}
                            type={'Feather'}
                            color={Colors.colors.white}
                            size={'24'}
                            onPress = {this.props.joinGroup}
                        />
                    </View>
                )}

                <Modal
                    backdropPressToClose={true}
                    backdropColor={Colors.colors.overlayBg}
                    backdropOpacity={1}
                    onClosed={this.hideMoreOptions}
                    style={{
                        ...CommonStyles.styles.commonModalWrapper,
                        maxHeight: this.getDrawerHeight()
                    }}
                    entry={"bottom"}
                    position={"bottom"} ref={"modalMoreOptions"} swipeArea={100}>
                    <View style={{...CommonStyles.styles.commonSwipeBar}}
                          {...addTestID('swipeBar')}
                    />
                    <Content showsVerticalScrollIndicator={false}>
                        {this.renderGroupManagementOptionsList(true)}
                    </Content>
                </Modal>
            </Container>
        );
    };
}


const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        paddingLeft: 20,
        paddingRight: 24,
        elevation: 0,
        height: HEADER_SIZE
    },
    backButton: {
        marginLeft: 0,
        paddingLeft: 0
    },
    moreBtn: {
        marginRight: 0,
        paddingRight: 0
    },
    moreIcon: {
        color: Colors.colors.white,
        fontSize: 30
    },
    contentWrapper: {
        marginTop: -130,
        zIndex: -1
    },
    bgImgWrapper: {
        height: 320,
        zIndex: -1
    },
    groupBgImg: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%'
    },
    groupContent: {
        paddingVertical: 24
    },
    groupMainTitle: {
        ...TextStyles.mediaTexts.serifProExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
        paddingHorizontal: 24
    },
    timeTypeWrap: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24
    },
    timeText: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.subTextS,
        color: Colors.colors.lowContrast
    },
    greyDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        borderWidth: 1,
        backgroundColor: Colors.colors.neutral50Icon,
        borderColor: Colors.colors.neutral50Icon,
        marginHorizontal: 8,
        marginVertical: 8
    },
    anonymousText: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.subTextS,
        color: Colors.colors.lowContrast
    },
    groupTags: {
        marginVertical: 24,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center'
    },
    singleTag: {
        backgroundColor: Colors.colors.highContrastBG,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginRight: 4
    },
    tagText: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText,
        color: Colors.colors.mediumContrast
    },
    groupDes: {
        paddingHorizontal: 24
    },
    groupDesTitle: {
        ...TextStyles.mediaTexts.serifProBold,
        ...TextStyles.mediaTexts.TextH4,
        color: Colors.colors.highContrast,
        marginBottom: 16
    },
    groupPara: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextM,
        color: Colors.colors.mediumContrast,
        marginBottom: 16
    },
    benefitList: {
        marginVertical: 16
    },
    singleBenefit: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    arrowIcon: {
        fontSize: 24,
        color: Colors.colors.secondaryIcon,
        marginRight: 12
    },
    benefitText: {
        width: '90%',
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.mediumContrast
    },
    organizerWrap: {
        paddingVertical: 16
    },
    memberList: {
        paddingVertical: 16
    },
    groupManagementList:{},
    groupActionList: {
        paddingHorizontal: 24,
        marginTop: 16
    },
    totalMembers: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginTop: 16
    },
    anonymousIcon: {
        marginRight: 12,
        width: 48,
        height: 48
    },
    memberText: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText,
        color: Colors.colors.secondaryText
    },
    greBtn: {
        ...CommonStyles.styles.stickyShadow,
        padding: 24,
        paddingBottom: isIphoneX() ? 36 : 24,
        borderRadius: 12
    },
    singleOption: {
        marginBottom: 16
    },
    scheduleList: {
        paddingHorizontal: 24,
        marginTop: 40,
        marginBottom: 16
    },
    singleSchedule: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 24,
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: Colors.colors.borderColor
    },
    scheduleDay: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.highContrast,
    },
    scheduleTime: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.secondaryText
    }
});

