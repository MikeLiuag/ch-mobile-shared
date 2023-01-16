import React, {Component} from "react";
import {AppState, SectionList, StatusBar, StyleSheet, Text, View} from "react-native";
import {Button, Container, Content, Header} from "native-base";
import LottieView from "lottie-react-native";
import alfie from "../../../assets/animations/Dog_with_phone_and_provider";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialComIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {Divider} from 'react-native-elements';
import {Colors, CommonStyles, TextStyles} from "../../../styles";
import {TransactionSingleActionItem} from "../../TransactionSingleActionItem";
import {addTestID, getHeaderHeight,isIphoneX} from "../../../utilities";
import {CommonSegmentHeader} from "../../CommonSegmentHeader";
import {CustomModal} from "../../CustomModal";
import moment from "moment";
import {SliderSearch} from "../../slider-search";
import {ConnectionCardV2Component} from "./ConnectionCardV2.component";
import Loader from "../../../components/Loader";
import {
    CONNECTION_TYPES,
    TAB_SEGMENTS_OPTIONS,
    PENDING_CONNECTION_STATUS
} from "../../../constants";
import Overlay from "react-native-modal-overlay";
import GradientButton from '../../GradientButton';

const HEADER_SIZE = getHeaderHeight();

export class ConnectionsV2Component extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState,
            selectedItem: null,
            modalVisible: false,
            modalHeightProps: {
                height: 0
            },
            activeSegmentId: this.props?.connections?.pendingConnections?.length > 0 ? TAB_SEGMENTS_OPTIONS.PENDING : TAB_SEGMENTS_OPTIONS.ACTIVE,
            activeConnections: this.props?.connections?.activeConnections,
            pastConnections: this.props?.connections?.pastConnections,
            pendingConnections : this.props?.connections?.pendingConnections,
            confirmModal : false
        }
        this.modalRef = null;
    }


    /**
     * @function getConnectionSubText
     * @description This method is used to get connection sub Text..
     * @param connection
     */
    getConnectionSubText = connection => {
        if (this.state.activeSegmentId === TAB_SEGMENTS_OPTIONS.ACTIVE) {
            if (connection.type === CONNECTION_TYPES.PRACTITIONER) {
                return connection.type;
            } else if (connection.type === CONNECTION_TYPES.PATIENT || connection.type === CONNECTION_TYPES.MATCH_MAKER) {
                if (connection.lastModified) {
                    return (
                        'Connected Since ' +
                        moment(connection.lastModified).format('MMM YYYY')
                    );
                } else {
                    return '';
                }
            } else if (connection.type === CONNECTION_TYPES.CHAT_GROUP) {
                return 'Group Chat';
            } else {
                return 'Chatbot';
            }
        } else {
            if (connection.lastModified) {
                return (
                    'Disconnected Since ' +
                    moment(connection.lastModified).format('MMM YYYY')
                );
            } else {
                return '';
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
        if (this.state.appState === TAB_SEGMENTS_OPTIONS.ACTIVE) {
            if (this.animation) {
                this.animation.play();
            }
        }
    }


    /**
     * @function emptyState
     * @description This method is used to render empty states for screen
     */

    emptyState = () => {
        const {activeSegmentId} = this.state;
        const activeSection = activeSegmentId === TAB_SEGMENTS_OPTIONS.ACTIVE;
        let emptyStateMsg = '' , emptyStateHead = '';
        switch (activeSegmentId) {
            case TAB_SEGMENTS_OPTIONS.ACTIVE : {
                emptyStateHead = 'You Have No Active connections';
                emptyStateMsg = 'You do not have any active connections right now. If you don’t think this is right, you can let us know by emailing help@confidanthealth.com and we’ll check it out for you.';
                break;
            }
            case TAB_SEGMENTS_OPTIONS.PAST : {
                emptyStateHead = 'You Have No past connections';
                emptyStateMsg = `You don’t have any past connections. Past connections are people ${this.props.isProviderApp ? 'or groups' : ', groups or chatbots'} that you were previously connected to, but have disconnected from. If you don’t think this is right, you can let us know by emailing help@confidanthealth.com and we’ll check it out for you.`;
                break;
            }
        }

        return (
            <View style={styles.emptyView}>
                <LottieView
                    ref={animation => {
                        this.animation = animation;
                    }}
                    style={styles.emptyAnim}
                    resizeMode="cover"
                    source={alfie}
                    autoPlay={true}
                    loop/>
                <Text style={styles.emptyTextMain}>{emptyStateHead}</Text>
                <Text style={styles.emptyTextDes}>{emptyStateMsg}</Text>
            </View>
        );
    }

    /**
     * @function closeButtonMenu
     * @description This method is used to close modal .
     */
    closeButtonMenu = () => {
        this.setState({
            modalVisible: false
        });
    };

    /**
     * @function checkConnectionStatus
     * @description This method is used to check connection status.
     * @param selectedConnection
     */
    checkConnectionStatus = (selectedConnection) => {
        const {connections} = this.props;
        if (this.state.activeSegmentId === TAB_SEGMENTS_OPTIONS.ACTIVE) {
            return true;
        }
        const isConnected = connections.activeConnections.filter(contact => {
            return contact.connectionId === selectedConnection?.connectionId;
        }).length > 0;
        const isRequested = connections.requestedConnections.filter((connection) => {
            return connection.connectionId === selectedConnection.connectionId;
        }).length > 0;
        return isRequested || isConnected;
    }


    onLayout(event) {
        const {height} = event.nativeEvent.layout;
        const newLayout = {
            height: height
        };
        setTimeout(() => {
            this.setState({modalHeightProps: newLayout});
        }, 10)

    }

    detailDrawerClose = () => {
        this.setState({
            modalVisible: false,
            modalHeightProps: {
                height: 0,

            }
        });
    };

    propagate = result => {
        this.setState({
            activeConnections: result.active,
            pastConnections: result.past,
        });
    };


    /**
     * @function alphabeticSections
     * @description This method is used populate alphabetical list.
     * @param connections
     */
    alphabeticSections = (connections) => {
        const map = connections.reduce((prev, current) => {
            const alphabet = current.name.charAt(0).toUpperCase();
            if (prev[alphabet]) {
                prev[alphabet].push(current);
            } else {
                prev[alphabet] = [current]
            }
            return prev;
        }, {});
        const sections = Object.keys(map).map(alphabet => {
            return {
                title: alphabet,
                data: map[alphabet]
            }
        })
            .sort((o1, o2) => {
                if (o1.title > o2.title) {
                    return 1
                } else if (o1.title < o2.title) {
                    return -1
                } else return 0
            });
        return sections;
    };


    /**
     * @function getConnectionsBySegmentId
     * @description This method is used to get list based on active segmentId
     */
    getConnectionsBySegmentId = ()=>{
        const {activeSegmentId,activeConnections,pastConnections,pendingConnections} = this.state;
        switch (activeSegmentId) {
            case TAB_SEGMENTS_OPTIONS.ACTIVE : return activeConnections
            case TAB_SEGMENTS_OPTIONS.PAST : return pastConnections
            case TAB_SEGMENTS_OPTIONS.PENDING : return pendingConnections
            default : return []
        }
    }

    /**
     * @function getDrawerHeight
     * @description Method used to get height for modal
     */
    getDrawerHeight = () => {
        const {selectedItem,activeSegmentId} = this.state;
        const activeSection = activeSegmentId === TAB_SEGMENTS_OPTIONS.ACTIVE;
        const shouldConnect = selectedItem && this.checkConnectionStatus(selectedItem);
        let height = '20%';
        if(activeSection){
            height = '45%'
        }
        if((this.props.isProviderApp && selectedItem?.type === CONNECTION_TYPES.PATIENT && activeSegmentId !== TAB_SEGMENTS_OPTIONS.PENDING)
            || (!this.props.isProviderApp && (selectedItem?.type === CONNECTION_TYPES.PRACTITIONER ||
                selectedItem?.type === CONNECTION_TYPES.MATCH_MAKER)) && activeSection){
            height = '60%'
        }
        if(!activeSection && !shouldConnect && activeSegmentId !== TAB_SEGMENTS_OPTIONS.PENDING){
            height = '35%'
        }
        return height;
    }

    /**
     * @function onCloseConfirmModal
     * @description This method is used to close confirm modal
     */
    onCloseConfirmModal = ()=>{
        this.setState({ confirmModal: false})
    }

    render() {
        const {selectedItem,activeSegmentId} = this.state;
        const activeSection = activeSegmentId === TAB_SEGMENTS_OPTIONS.ACTIVE;
        const connections =  this.getConnectionsBySegmentId();
        const shouldConnect = selectedItem && this.checkConnectionStatus(selectedItem);
        let sections = this.alphabeticSections(connections);
        let tabs = [
            {title: 'Active', segmentId: TAB_SEGMENTS_OPTIONS.ACTIVE},
            {title: 'Past', segmentId: TAB_SEGMENTS_OPTIONS.PAST},
        ];

        if (this.props?.connections?.pendingConnections?.length > 0) {
            tabs = [{title: 'Pending', segmentId: TAB_SEGMENTS_OPTIONS.PENDING}, ...tabs];
        }

        if(this.props.isLoading){
            return <Loader/>
        }
        return (
            <Container style={styles.wrapper}>
                <StatusBar
                    backgroundColor="transparent"
                    translucent
                    animated
                    showHideTransition="slide"
                />
                <Header
                    // hasSegment
                    noShadow
                    transparent
                    style={{
                        height: HEADER_SIZE,
                        paddingTop: 15,
                        paddingLeft: 18,
                        paddingRight: 18
                    }}>
                    <SliderSearch
                        options={{
                            screenTitle: 'Connections',
                            searchFieldPlaceholder: 'Search Connections',
                            listItems: {
                                active: this.props.connections.activeConnections,
                                past: this.props.connections.pastConnections,
                            },
                            filter: (connections, query) => {
                                const active = connections.active.filter(connection =>
                                    connection.name
                                        .toLowerCase()
                                        .includes(query.toLowerCase().trim()),
                                );
                                const past = connections.past.filter(connection =>
                                    connection.name
                                        .toLowerCase()
                                        .includes(query.toLowerCase().trim()),
                                );

                                return {active: active, past: past};
                            },
                            showBack: true,
                            backClicked: this.props.backClicked,
                        }}
                        propagate={this.propagate}/>

                </Header>
                <View style={styles.segmentItems}>
                    <View style={{paddingLeft: 24, paddingRight: 24}}>
                        <CommonSegmentHeader
                            segments={tabs}
                            segmentChanged={(segmentId) => {
                                this.setState({activeSegmentId: segmentId});
                            }}
                        />
                    </View>

                    {sections && sections.length > 0 ?
                        <SectionList
                            sections={sections}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => item.connectionId + index}
                            renderItem={({item}) => {
                                return <ConnectionCardV2Component
                                    subText={this.getConnectionSubText(item)}
                                    navigateToProfile={this.props.navigateToProfile}
                                    openOptions={(connection) => {
                                        if(activeSegmentId === TAB_SEGMENTS_OPTIONS.PENDING) {
                                            this.setState({
                                                selectedItem: connection,
                                                confirmModal: true
                                            });
                                        }else{
                                            this.setState({
                                                selectedItem: connection,
                                                modalVisible: true
                                            });
                                        }
                                    }}
                                    activeSegment = {activeSegmentId}
                                    connection={item}

                                />
                            }}
                            renderSectionHeader={({section: {title}}) => (
                                <View style={styles.headRow}>
                                    <Text style={styles.listTitle}>{title}</Text>
                                    <Divider style={styles.dividerStyle} width={'90%'}
                                             color={Colors.colors.highContrast}/>
                                </View>
                            )}
                        />
                        : this.emptyState()}


                </View>
                <Overlay
                    containerStyle={styles.confirmOverlay}
                    childrenWrapperStyle={styles.confirmWrapper}
                    visible={this.state.confirmModal}
                    onClose={()=>{
                        this.setState({confirmModal:false})
                    }}
                    closeOnTouchOutside={true} >
                    <View style={{width: '100%'}}>
                        <Text style={styles.confirmHeader}>
                            Are you sure you want to connect?
                        </Text>
                        <View style={styles.confirmBtns}>
                            <Button style={{...styles.outlineBtn, flex: 1, marginTop: 10}}
                                    onPress={() => {
                                        this.onCloseConfirmModal();
                                        if(activeSegmentId === TAB_SEGMENTS_OPTIONS.PENDING) {
                                            this.props.updatePendingConnections(selectedItem,PENDING_CONNECTION_STATUS.ACCEPTED)
                                        }else{
                                            this.props.connect(selectedItem)
                                        }
                                    }}
                            >
                                <Text style={styles.outlineText}>{activeSegmentId === TAB_SEGMENTS_OPTIONS.PENDING ?'Yes, Accept' : 'Yes'}</Text>
                            </Button>
                            <View style={styles.noBtn}>
                                <GradientButton
                                    onPress={() => {
                                        this.onCloseConfirmModal();
                                        if(activeSegmentId === TAB_SEGMENTS_OPTIONS.PENDING) {
                                            this.props.updatePendingConnections(selectedItem,PENDING_CONNECTION_STATUS.REJECTED)
                                        }
                                    }}
                                    text={activeSegmentId === TAB_SEGMENTS_OPTIONS.PENDING ? "Reject" :"Cancel"}
                                />
                            </View>
                        </View>
                    </View>

                </Overlay>
                <CustomModal
                    backdropPressToClose={true}
                    backdropColor={Colors.colors.overlayBg}
                    backdropOpacity={1}
                    onClosed={this.detailDrawerClose}
                    style={{
                        ...CommonStyles.styles.commonModalWrapper,
                        maxHeight: this.getDrawerHeight()
                    }}
                    entry={"bottom"}
                    isOpen={this.state.modalVisible}
                    position={"bottom"} swipeArea={100}>
                    <View style={{...CommonStyles.styles.commonSwipeBar}}
                          {...addTestID('swipeBar')}
                    />
                    <Content
                        showsVerticalScrollIndicator={false}>
                        <View
                            onLayout={(event) => this.onLayout(event)}
                            style={styles.actionList}>

                            {activeSection && (
                                <View style={styles.btnOptions}>
                                    <TransactionSingleActionItem
                                        title={'Go to chat'}
                                        iconBackground={Colors.colors.whiteColor}
                                        styles={styles.gButton}
                                        renderIcon={(size, color) =>
                                            <FeatherIcon size={24} color={Colors.colors.primaryIcon}
                                                         name="message-circle"/>
                                        }
                                        onPress={() => {
                                            this.closeButtonMenu();
                                            this.props.navigateToChat(selectedItem)
                                        }}
                                    />
                                </View>
                            )}


                            {
                                ((this.props.isProviderApp && selectedItem?.type === CONNECTION_TYPES.PATIENT)
                                    || (!this.props.isProviderApp && (selectedItem?.type === CONNECTION_TYPES.PRACTITIONER ||
                                        selectedItem?.type === CONNECTION_TYPES.MATCH_MAKER)))
                                && activeSection && (
                                    <View style={styles.btnOptions}>
                                        <TransactionSingleActionItem
                                            title={'Request Appointment'}
                                            iconBackground={Colors.colors.successBG}
                                            styles={styles.gButton}
                                            renderIcon={(size, color) =>
                                                <FeatherIcon size={24} color={Colors.colors.successIcon}
                                                             name="calendar"/>
                                            }
                                            onPress={() => {
                                                this.closeButtonMenu();
                                                this.props.navigateToRequestAppointment(selectedItem)
                                            }}
                                        />
                                    </View>
                                )}

                            {this.state.activeSegmentId !== TAB_SEGMENTS_OPTIONS.PENDING && (
                                <View style={styles.btnOptions}>
                                    <TransactionSingleActionItem
                                        title={`View ${selectedItem?.type === CONNECTION_TYPES.CHAT_GROUP ?'Group': 'Profile'}`}
                                        iconBackground={Colors.colors.errorBG}
                                        styles={styles.gButton}
                                        renderIcon={(size, color) =>
                                            <FeatherIcon size={24} color={Colors.colors.warningIcon} name="user"/>
                                        }
                                        onPress={() => {
                                            this.closeButtonMenu();
                                            this.props.navigateToProfile(selectedItem)
                                        }}
                                    />
                                </View>
                            )}

                            {!activeSection && !shouldConnect && (
                                <View style={styles.btnOptions}>
                                    <TransactionSingleActionItem
                                        title={'Connect'}
                                        iconBackground={Colors.colors.whiteColor}
                                        styles={styles.gButton}
                                        renderIcon={(size, color) =>
                                            <FeatherIcon size={24} color={Colors.colors.secondaryIcon} name="link-2"/>
                                        }
                                        onPress={() => {
                                            this.closeButtonMenu();
                                            this.setState({
                                                confirmModal :true
                                            })
                                        }}
                                    />
                                </View>
                            )}

                            {activeSection && (selectedItem?.type === CONNECTION_TYPES.PATIENT || selectedItem?.type === CONNECTION_TYPES.PRACTITIONER
                                || selectedItem?.type === CONNECTION_TYPES.MATCH_MAKER) && (
                                <View style={styles.btnOptions}>
                                    <TransactionSingleActionItem
                                        title={'Remove from connections'}
                                        iconBackground={Colors.colors.secondaryColorBG}
                                        styles={styles.gButton}
                                        renderIcon={(size, color) =>
                                            <MaterialComIcons size={24} color={Colors.colors.secondaryIcon}
                                                              name="link-variant-off"/>
                                        }
                                        onPress={() => {
                                            this.closeButtonMenu();
                                            this.props.disconnect(selectedItem)
                                        }}
                                    />
                                </View>
                            )}
                            {activeSection && this.props.isProviderApp && selectedItem?.type === CONNECTION_TYPES.PATIENT && (
                                <View style={styles.btnOptions}>
                                    <TransactionSingleActionItem
                                        title={'Connect with provider'}
                                        iconBackground={Colors.colors.whiteColor}
                                        styles={styles.gButton}
                                        renderIcon={(size, color) =>
                                            <FeatherIcon size={24} color={Colors.colors.primaryIcon} name="user-plus"/>
                                        }
                                        onPress={() => {
                                            this.closeButtonMenu();
                                            this.props.goToSuggestProviders(selectedItem)
                                        }}
                                    />
                                </View>
                            )}
                            {activeSection && this.props.isProviderApp && (selectedItem?.type === CONNECTION_TYPES.PRACTITIONER ||
                                selectedItem?.type === CONNECTION_TYPES.MATCH_MAKER) && (
                                <View style={styles.btnOptions}>
                                    <TransactionSingleActionItem
                                        title={'Connect with member'}
                                        iconBackground={Colors.colors.whiteColor}
                                        styles={styles.gButton}
                                        renderIcon={(size, color) =>
                                            <FeatherIcon size={24} color={Colors.colors.primaryIcon} name="user-plus"/>
                                        }
                                        onPress={() => {
                                            this.closeButtonMenu();
                                            this.props.goToSuggestMembers(selectedItem)
                                        }}
                                    />
                                </View>
                            )}
                        </View>

                    </Content>
                </CustomModal>
            </Container>
        );
    }

}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.colors.whiteColor,
    },
    emptyView: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    emptyAnim: {
        width: '90%',
        alignSelf: 'center',
        marginBottom: 30,
        paddingLeft: 20
    },
    emptyTextMain: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.TextH7,
        color: Colors.colors.highContrast,
        marginBottom: 20
    },
    emptyTextDes: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextExtraS,
        color: Colors.colors.lightText,
        paddingLeft: 30,
        paddingRight: 30,
        textAlign: 'center'
    },
    segmentItems: {
        backgroundColor: Colors.colors.whiteColor,
        display: 'flex',
        flex: 1
    },
    headRow: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        paddingRight: 24,
        paddingLeft: 24,
        backgroundColor: Colors.colors.whiteColor,
        marginBottom: 16
    },
    listTitle: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.inputPlaceholder,
        color: Colors.colors.lowContrast,
    },
    dividerStyle: {
        marginLeft: 24
    },
    actionList: {},
    gButton: {},
    btnOptions: {
        marginBottom: 8
    },
    confirmOverlay: {
        backgroundColor: 'rgba(37,52,92,0.5)',
    },
    confirmHeader: {
        color: Colors.colors.darkBlue,
        ...TextStyles.mediaTexts.bodyTextL,
        ...TextStyles.mediaTexts.manropeRegular,
        textAlign: 'center',
        marginBottom: 30,
        paddingLeft: 18,
        paddingRight: 18,
    },
    confirmBtns: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    confirmWrapper: {
        height: 'auto',
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX() ? 40 : 25,
        paddingTop: 36,
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
    outlineBtn: {
        borderColor: Colors.colors.lightRed,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: Colors.colors.whiteColor,
        height: 48,
        justifyContent: 'center',
        elevation: 0,
    },
    outlineText: {
        color: Colors.colors.lightRed,
        ...TextStyles.mediaTexts.overlineTextM,
        ...TextStyles.mediaTexts.manropeBold,
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    noBtn: {
        flex: 1,
        marginLeft: 17,
        justifyContent: 'center',
    },
});

