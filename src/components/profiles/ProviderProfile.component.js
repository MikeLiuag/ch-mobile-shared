import React, {Component} from "react";
import {Image, ScrollView, StatusBar, StyleSheet, Text, View} from "react-native";
import {Body, Button, Container, Header, Left, Right,} from "native-base";
import LinearGradient from "react-native-linear-gradient";
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import GradientButton from "../../components/GradientButton";
import moment from 'moment';
import { getAvatar, checkImageUrl, getHeaderHeight} from '../../utilities';
import {DEFAULT_AVATAR_COLOR, MARGIN_NORMAL, MARGIN_X} from '../../constants';
import AlfieLoader from '../../components/Loader';
import {Buttons, CommonStyles, Colors} from "../../styles";
import {Rating} from 'react-native-elements';
import Ionicon from "react-native-vector-icons/Ionicons";
import Overlay from "react-native-modal-overlay";
import {addTestID, isIphoneX, isIphone12 } from "../../utilities";
import {QRCodeComponent} from '../../components/QRCode.component.js';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GenericActionButton from "../GenericActionButton";
import Fontisto from "react-native-vector-icons/Fontisto";
const HEADER_SIZE = getHeaderHeight();

export class ProviderProfileComponent extends Component<Props> {

    constructor(props) {
        super(props);

        this.state = {
            providerPublicDetails: null,
            providerEmployment: null,
            providerEducation: null,
            providerAffiliation: null,
            isLoading: true,
            modalVisible: false,
            socialOptions: false,
            copiedLink: false,
            clipboardContent: null,
            providerDetails: this.props.provider
        };
    }

    componentDidMount = async () =>{
        this.getProviderProfile();
        let providerId = this.state.providerDetails.providerId;
        const qrcode = await this.props.branchLinksService.profileQRCodeLink(providerId);
        this.setState({
            qrcode: qrcode,
        });
    }

    getProviderProfile = () => {
        this.setState({
            isLoading: true,
        });
        const providerPublicDetails = this.state.providerDetails.providerProfile;

        // providerPublicEmployment
        const employmentDataLength = (providerPublicDetails && providerPublicDetails.employmentName != null ) ? providerPublicDetails.employmentName.length : 0;
        const providerPublicEmployment = [];
        if (employmentDataLength > 0) {
            //Populate employment details

            for (let i = 0; i < employmentDataLength; i++) {
                providerPublicEmployment.push({
                    name: providerPublicDetails.employmentName ? providerPublicDetails.employmentName[i] : '',
                    place: providerPublicDetails.employmentPlace ? providerPublicDetails.employmentPlace[i] : '',
                    image: providerPublicDetails.employmentImage ? providerPublicDetails.employmentImage : '',
                    startDate: providerPublicDetails.employmentStartDate ? providerPublicDetails.employmentStartDate : '',
                    endDate: providerPublicDetails.employmentEndDate ? providerPublicDetails.employmentEndDate : '',
                });
            }
        }

        const educationDataLength = ( providerPublicDetails && providerPublicDetails.educationName != null ) ? providerPublicDetails.educationName.length : 0;
        const providerPublicEducation = [];
        if (educationDataLength > 0) {

            //Populate education details
            for (let j = 0; j < educationDataLength; j++) {
                providerPublicEducation.push({
                    name: providerPublicDetails.educationName ? providerPublicDetails.educationName[j] : '',
                    place: providerPublicDetails.educationPlace ? providerPublicDetails.educationPlace[j] : '',
                    image: providerPublicDetails.educationImage ? providerPublicDetails.educationImage : '',
                    startDate: providerPublicDetails.educationStartDate ? providerPublicDetails.educationStartDate : '',
                    endDate: providerPublicDetails.educationEndDate ? providerPublicDetails.educationEndDate : '',
                    description: providerPublicDetails.educationDescription ? providerPublicDetails.educationDescription : '',

                });
            }
        }

        const affiliationDataLength = ( providerPublicDetails && providerPublicDetails.affiliationName != null ) ? providerPublicDetails.affiliationName.length : 0;
        const providerPublicAffiliation = [];
        if (affiliationDataLength > 0) {

            //Populate employment details
            for (let k = 0; k < affiliationDataLength; k++) {
                providerPublicAffiliation.push({
                    name: providerPublicDetails.affiliationName ? providerPublicDetails.affiliationName[k] : '',
                    place: providerPublicDetails.affiliationPlace ? providerPublicDetails.affiliationPlace[k] : '',
                    image: providerPublicDetails.affiliationImage ? providerPublicDetails.affiliationImage : '',
                });
            }
        }

        this.setState({
            isLoading: false,
            'providerAffiliation': providerPublicAffiliation,
            'providerEducation': providerPublicEducation,
            'providerEmployment': providerPublicEmployment,
        });
    }

    onClose = () => {
        this.setState({modalVisible: false});
    };

    showModal = () => {
        this.setState({
            modalVisible: true,
            socialOptions: false,
            copiedLink: false
        });
    };

    scrollToTop = () => {
        this.setState({
            modalVisible: true,
            socialOptions: true, copiedLink: false
        });
        this.scrollView.scrollTo(0);
    };

    recommendProviderProfile = async channel => {
        let providerId = this.state.providerDetails.providerId;
        await this.props.branchLinksService.recommendProviderProfileLink(
            channel,
            providerId
        );
    };

    disconnectProvider = async () => {
        this.onClose();
        this.props.disconnectProvider();
    };


    requestConnection = () => {
        this.onClose();
        this.props.loadConnectionScreen();
    }

    writeToClipboard = async () => {
        this.setState({copiedLink: true});
        await Clipboard.setString("Provider Link will write to clipboard");
        // console.log("copied");
    };


    requestAppointmentByMatchmaker = ()=>{
        this.onClose();
        this.props.requestAppointmentByMatchmaker();

    };

    render = () => {
        const { S3_BUCKET_LINK } = this.props;
        if (this.state.isLoading || this.props.isLoading) {
            return (
                <AlfieLoader/>);
        }
        const hasMoreReviews = this.props.feedbackSummary.totalReviews>1;
        return (
            <Container>
                <StatusBar backgroundColor='#f7f9ff'
                           barStyle='dark-content'
                           translucent animated showHideTransition="slide"/>

                <Header style={styles.chatHeader}>
                    <LinearGradient
                        start={{x: 0, y: 1}}
                        end={{x: 1, y: 0}}
                        colors={["#fff", "#fff", "#fff"]}
                        style={styles.headerBG}
                    >
                        <View style={styles.headerContent}>
                            <Left>
                                <Button transparent style={styles.backButton} onPress={this.props.goBack}
                                        text="GO BACK">
                                    <AwesomeIcon name="angle-left" size={32} color="#3fb2fe"/>
                                </Button>
                            </Left>
                            <Body/>
                            <Right>
                                {this.props.isConnected ?
                                    <Button transparent style={[styles.backButton, {marginRight: 6}]}
                                            onPress={() => {
                                                this.showModal();
                                            }}
                                    >
                                        <Ionicon name='ios-more' size={30}
                                                 color={this.state.modalVisible ? "#646c73" : "#4FACFE"}/>
                                    </Button> : null}
                            </Right>
                        </View>
                    </LinearGradient>
                </Header>

                <Overlay
                    containerStyle={styles.overlayBG}
                    childrenWrapperStyle={styles.fabWrapper}
                    visible={this.state.modalVisible} onClose={this.onClose} closeOnTouchOutside>

                    <View style={{ width: '100%'}}>
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
                            {
                                this.state.socialOptions ?
                                    <View style={styles.socialBox}>
                                        <Text style={styles.socialTitle}>Recommend {this.props.provider.fullName}</Text>
                                        {
                                            this.state.copiedLink ?
                                                <View style={styles.linkBox}>
                                                    <AwesomeIcon name="link" size={23} color="#77c70b"/>
                                                    <Text style={styles.linkText}>Link has been copied to clipboard</Text>
                                                </View> :
                                                <View style={styles.iconList}>
                                                    <Button transparent style={[styles.socialBtn, {marginTop: 5, height: 53}]}>
                                                        <AwesomeIcon name="facebook-square" size={60} color="#485a96"/>
                                                    </Button>
                                                    <Button transparent style={[styles.socialBtn, {marginTop: 5, height: 53}]}>
                                                        <AwesomeIcon name="twitter-square" size={60} color="#50abf1"/>
                                                    </Button>
                                                    <Button transparent style={styles.socialBtn}>
                                                        <LinearGradient
                                                            start={{x: 0, y: 0}}
                                                            end={{x: 1, y: 1}}
                                                            colors={["#61fd7d", "#2bb826", "#2bb826"]}
                                                            style={styles.greBtn}
                                                        >
                                                            <AwesomeIcon name="whatsapp" size={38} color="#FFF"/>
                                                        </LinearGradient>
                                                    </Button>
                                                    <Button transparent style={styles.socialBtn}
                                                            onPress={this.writeToClipboard}>
                                                        <LinearGradient
                                                            start={{x: 0, y: 0}}
                                                            end={{x: 1, y: 1}}
                                                            colors={["#1ed0de", "#6078ea", "#6078ea"]}
                                                            style={styles.greBtn}
                                                        >
                                                            <AwesomeIcon name="link" size={23} color="#FFF"/>
                                                        </LinearGradient>
                                                    </Button>
                                                </View>
                                        }
                                    </View> :
                                    <View style={{width: '100%'}}>
                                        {!this.props.providerApp && (
                                            <GenericActionButton
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
                                        {this.props.providerApp && this.props.isMatchmakerView && (
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
                                        {this.props.providerApp  && this.props.isMatchmakerView && (
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
                                        {this.props.providerApp &&(
                                            <GenericActionButton
                                                onPress={()=>this.recommendProviderProfile("facebook")}
                                                title={'Recommend This Provider'}
                                                iconBackground={'#FF9A00'}
                                                styles={styles.gButton}
                                                renderIcon={(size, color) =>
                                                    <Fontisto
                                                        reversed
                                                        name='share-a'
                                                        size={size}
                                                        color={color}
                                                    />
                                                }
                                            />
                                        )}
                                        <GenericActionButton
                                            onPress={this.disconnectProvider}
                                            title={'Disconnect'}
                                            iconBackground={'#E13C68'}
                                            styles={styles.gButton}
                                            renderIcon={(size) =>
                                                <Image
                                                    source={require('./../../assets/images/link-off.png')}
                                                    style={{width:size, height:size}}
                                                />
                                            }
                                        />
                                    </View>
                            }
                        </View>
                    </View>


                </Overlay>

                <ScrollView
                    ref={scrollView => (this.scrollView = scrollView)}
                >
                    {this.props.provider !== null ?
                        <View>
                            {this.props.provider.profileImage?
                                <Image style={styles.providerImg}
                                       resizeMode={"cover"}
                                       source={{uri: getAvatar({profilePicture: this.props.provider.profileImage})}}
                                       alt="Icon"
                                />
                                :
                                <View style={{
                                    ...styles.proBgMain,
                                    backgroundColor: this.props.provider.colorCode?this.props.provider.colorCode:DEFAULT_AVATAR_COLOR
                                }}><Text
                                    style={styles.proLetterMain}>{this.props.provider.fullName.charAt(0).toUpperCase()}</Text></View>
                            }

                            <View style={styles.proInfo}>
                                <Text style={styles.boldText}>{this.props.provider.fullName}</Text>
                                <Text style={styles.greyText}>
                                    {this.props.provider.designation ?
                                        this.props.provider.designation
                                        : "Therapist"}
                                </Text>
                            </View>
                        </View> : null
                    }

                    {this.props.isConnected && !this.props.providerApp ?
                        <View style={styles.providerContent}>
                            <View style={styles.borderItem}>
                                <Button transparent style={{height: 'auto'}}
                                        onPress={() => {
                                            if (this.props.navigateToAccessSelection) {
                                                this.props.navigateToAccessSelection()
                                            }
                                        }}>
                                    <View style={styles.radioText}>
                                        <Text style={styles.blackText}>
                                            {this.props.providerAccess ? "Full Access" : "No Access"}</Text>
                                        <Text style={styles.smallText}>
                                            {this.props.providerAccess ? "Provider can see all your information to help you to reach your personal goals." : "Provider will only have access to your general inforamtion."}</Text>
                                    </View>
                                    <AwesomeIcon name="angle-right" size={35} color="#4FACFE"/>
                                </Button>
                            </View>
                        </View>
                        : null
                    }
                    {this.props.providerApp && this.props.type ==='PRACTITIONER' && (
                        <View style={styles.ratingWrapper}>
                            <View style={{flexDirection: 'row'}}>
                                <Rating
                                    readonly
                                    type='star'
                                    showRating={false}
                                    ratingCount={5}
                                    imageSize={25}
                                    selectedColor='#ffca00'
                                    startingValue={this.props.feedbackSummary ? this.props.feedbackSummary.combinedRating : 0}
                                    fractions={2}
                                />
                                <Text
                                    style={styles.reviewScore}>{this.props.feedbackSummary ? this.props.feedbackSummary.combinedRating : 0}</Text>
                            </View>
                            <Text
                                style={styles.reviewBtnText}>{this.props.feedbackSummary ? this.props.feedbackSummary.totalReviews : "No"}
                                {' '}review{hasMoreReviews ? 's' : ''}
                            </Text>
                        </View>
                    )}

                    <View style={styles.personalInfo}>
                        <Text style={styles.headText}>{this.props.type ==='PRACTITIONER'?"ABOUT PROVIDER":"ABOUT MATCHMAKER"}</Text>
                        {this.props.provider ?
                            <Text
                                style={styles.parahText}>{this.props.provider.bio ? this.props.provider.bio : null}
                            </Text>
                            : null
                        }
                    </View>
                    {

                        this.props.providerApp && this.props.type ==='PRACTITIONER' &&  this.props.feedbackSummary && this.props.feedbackSummary.recentReviews.length > 0 ?
                            <View style={styles.recentReviews}>
                                <View style={styles.recentTop}>
                                    <Text style={styles.headText}>RECENT REVIEWS</Text>
                                    <Button transparent
                                            onPress={this.props.feedbackSummary ? this.props.reviewDetailClicked : null}>
                                        <Text style={styles.seeAllText}>See
                                            All{' '}({this.props.feedbackSummary.totalReviews})</Text>
                                    </Button>
                                </View>


                                {
                                    this.props.feedbackSummary.recentReviews.map((review, key) => {
                                        return (
                                            <View key={key} style={styles.reviewBox}>
                                                <View style={styles.singleReview}>
                                                    <View style={styles.reviewHead}>
                                                        <Rating
                                                            readonly
                                                            type='star'
                                                            showRating={false}
                                                            ratingCount={5}
                                                            imageSize={15}
                                                            selectedColor='#ffca00'
                                                            startingValue={review.rating}
                                                            fractions={2}
                                                        />
                                                        <Text
                                                            style={styles.reviewDate}>{review.createdAt ? moment(review.createdAt).format('MMMM D, Y') : ''}</Text>
                                                    </View>
                                                    {
                                                        review.publicComment ? <Text
                                                            style={styles.reviewDetail}>{review.publicComment}</Text> : null
                                                    }
                                                </View>
                                            </View>
                                        );

                                    })}
                            </View>
                            : null}
                    {this.state.providerDetails.providerProfile !== null && this.state.providerDetails.providerProfile.credentials ?
                        <View style={styles.credentialBox}>
                            <Text style={styles.headText}>Credentials</Text>
                            <View style={styles.credList}>
                                {this.state.providerDetails.providerProfile.credentials.map((credentials, key) => {
                                    return (

                                        <Text key={key} style={styles.singleCred}>{credentials}</Text>
                                    )
                                })}
                            </View>
                        </View>
                        : null}
                    {this.state.providerDetails.providerProfile !== null && this.state.providerDetails.providerProfile.certifications ?

                        <View style={styles.credentialBox}>
                            <Text style={styles.headText}>Certifications</Text>
                            <View style={styles.credList}>
                                {this.state.providerDetails.providerProfile.certifications.map((certifications, key) => {
                                    return (

                                        <Text key={key} style={styles.singleCred}>{certifications}</Text>
                                    )
                                })}

                            </View>
                        </View>
                        : null}
                    {this.state.providerDetails !== null && this.state.providerAffiliation ?

                        <View style={styles.clinicBox}>
                            <Text style={styles.headText}>Clinic Affiliation</Text>
                            {this.state.providerAffiliation.map((affiliation, key) => {
                                return (

                                    <View key={key} style={styles.singleClinic}>
                                        <Image style={styles.clinicImg}
                                               source={affiliation.image ?(checkImageUrl(affiliation.image)?{ uri: affiliation.image }: {uri: S3_BUCKET_LINK + affiliation.image}) : require("../../assets/images/clinic.png")}
                                        />
                                        <View key={key} style={styles.clinicInfo}>
                                            <Text style={styles.cliName}>{affiliation.name}</Text>
                                            <Text style={styles.cliLocation}>{affiliation.place}</Text>
                                        </View>
                                    </View>
                                )
                            })}

                        </View>
                        : null}

                    {this.state.providerDetails !== null && this.state.providerEmployment ?
                        <View style={styles.clinicBox}>
                            <Text style={styles.headText}>Past Employment</Text>
                            {this.state.providerEmployment.map((employment, key) => {
                                return (
                                    <View key={key} style={styles.singleClinic}>

                                        <Image style={styles.clinicImg}
                                               source={employment.image ?(checkImageUrl(employment.image)? {uri: employment.image }: {uri:  S3_BUCKET_LINK + employment.image}) : require("../../assets/images/company.png")}
                                        />
                                        <View key={key} style={styles.clinicInfo}>
                                            <Text style={styles.cliName}>{employment.name}</Text>
                                            <Text style={styles.institute}>{employment.place}</Text>
                                            <Text
                                                style={styles.cliDate}>{employment.startDate ? moment(employment.startDate, 'YYYY-MM-DD').format('MMMM D, Y') + ' - ' : ''} {employment.endDate ? moment(employment.endDate, 'YYYY-MM-DD').format('MMMM D, Y') : ''}</Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>

                        : null}

                    {this.state.providerDetails !== null && this.state.providerEducation ?

                        <View style={styles.eduBox}>
                            <Text style={styles.headText}>Education</Text>
                            {this.state.providerEducation.map((education, key) => {
                                return (

                                    <View key={key} style={styles.singleEdu}>
                                        <Image style={styles.clinicImg}
                                               source={education.image ? (checkImageUrl(education.image) ? {uri: education.image}: {uri: S3_BUCKET_LINK + education.image}) : require("../../assets/images/institute.png")}
                                        />
                                        <View key={key} style={styles.eduInfo}>
                                            <Text style={styles.eduName}>{education.name}</Text>
                                            <Text style={styles.institute}>{education.place}</Text>
                                            <Text
                                                style={styles.cliDate}>{education.startDate ? moment(education.startDate, 'YYYY-MM-DD').format('MMMM D, Y') + ' - ' : ''} {education.endDate ? moment(education.endDate, 'YYYY-MM-DD').format('MMMM D, Y') : ''}</Text>
                                            <Text style={styles.eduDes}>{education.description}</Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                        : null}

                    <View style={styles.eduBox}>
                        <View style={styles.qrcodeInner}>
                            <QRCodeComponent value={this.state.qrcode} />
                            <Text style={styles.QrCodeText}>Scan Me</Text>
                        </View>


                    </View>

                    {
                        this.props.isConnected ?
                            <View style={styles.connectivityBtns}>
                                {!this.props.providerApp && (
                                    <LinearGradient
                                        start={{x: 0, y: 1}}
                                        end={{x: 1, y: 0}}
                                        colors={["#4FACFE", "#34b6fe", "#00C8FE"]}
                                        style={styles.gButton}
                                    >
                                        <Button transparent
                                                style={styles.fabBtn}
                                        >
                                            <Text style={styles.fabBtnText}>Request Appointment</Text>
                                        </Button>
                                    </LinearGradient>
                                )}
                                {this.props.providerApp && (
                                    <Button
                                        {...addTestID('Scroll-to-Top')}
                                        style={{...styles.outlineBtn, borderColor: '#3fb2fe'}}
                                        onPress={() => {
                                            this.recommendProviderProfile('facebook');
                                        }}>
                                        <Text style={{...styles.outlineText, color: '#3fb2fe'}}>
                                            Recommend This {this.props.type ==='PRACTITIONER'?'Provider':'Matchmaker'}
                                        </Text>
                                    </Button>
                                )}
                                <Button style={[styles.disconnectBtn, {marginBottom: 0}]}
                                        onPress={this.disconnectProvider}
                                >
                                    <Text style={styles.disconnectText}>Disconnect</Text>
                                </Button>
                            </View> : null
                    }

                    <View style={styles.proInfoFooter}>
                        {!this.props.isSelf && (
                            <GradientButton
                                testId = "connection"
                                style={styles.infoBtn}
                                disabled={this.props.isRequested}
                                onPress={() => {
                                    if (this.props.isConnected) {
                                        this.props.startConversation();
                                    } else if (!this.props.isRequested) {
                                        this.props.connectWithProvider()
                                    }
                                }}
                                text={this.props.isConnected ? "GO TO CHAT" : this.props.isRequested ? "CONNECTION REQUESTED" : (this.props.type === 'PRACTITIONER'?"CONNECT WITH PROVIDER":"CONNECT WITH MATCHMAKER")}
                            />
                        )}
                    </View>
                </ScrollView>


            </Container>
        );
    };
}

const commonText = {
    fontFamily: "Roboto-Regular",
    color: '#30344D'
};
const styles = StyleSheet.create({
    actionHead: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: HEADER_SIZE + (isIphoneX() ? (isIphone12()? 0 : 24 ) : 0),
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
        zIndex: -1
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
        zIndex: 0
    },
    fabTitle: {
        color: '#25345c',
        fontSize: 15,
        lineHeight: 22,
        letterSpacing: 0.5,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        marginBottom: 23,
    },
    gButton: {
        width: '100%',
        borderRadius: 4,
        height: 48,
        marginBottom: 24
    },
    fabBtn: {
        justifyContent: 'center'
    },
    fabBtnText: {
        color: '#fff',
        fontSize: 13,
        lineHeight: 19.5,
        textAlign: 'center',
        letterSpacing: 0.7,
        fontFamily: 'Roboto-Bold',
        textTransform: 'uppercase'
    },
    outlineBtn: {
        borderColor: '#3fb2fe',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#fff',
        height: 48,
        marginBottom: 24,
        justifyContent: 'center',
        elevation: 0
    },
    outlineText: {
        color: '#3fb2fe',
        fontSize: 13,
        letterSpacing: 0.7,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    disconnectBtn: {
        borderColor: '#d0021b',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#fff',
        height: 48,
        marginBottom: 24,
        justifyContent: 'center',
        elevation: 0
    },
    disconnectText: {
        color: '#d0021b',
        fontSize: 13,
        letterSpacing: 0.7,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    socialBox: {},
    socialTitle: {
        color: '#646c73',
        fontSize: 13,
        letterSpacing: 1,
        textAlign: 'center',
        textTransform: 'uppercase',
        marginBottom: 16
    },
    iconList: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    greBtn: {
        width: 50,
        height: 50,
        borderRadius: 8,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    socialBtn: {
        width: 50,
        height: 50,
        borderRadius: 8,
        paddingTop: 0,
        paddingBottom: 0,
        overflow: 'hidden',
        margin: 8
    },
    connectivityBtns: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: 20
    },
    linkBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    linkText: {
        fontSize: 14,
        paddingLeft: 15,
        color: '#22242a',
        letterSpacing: 0.47,
        fontFamily: 'Roboto-Regular'
    },
    mainBG: {
        backgroundColor: "#F9F9F9"
    },
    chatHeader: {
        backgroundColor: 'white',
        height: HEADER_SIZE,
        paddingLeft: 0,
        paddingRight: 0,
        elevation: 0,
    },
    detailsFooter: {
        height: HEADER_SIZE,
        paddingLeft: 0,
        paddingRight: 0,
        elevation: 0,
        backgroundColor: 'transparent',
    },
    headerBG: {
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: 5,
        marginTop: isIphoneX() ? MARGIN_X : MARGIN_NORMAL,
    },
    headerContent: {
        flexDirection: "row"
    },
    backButton: {
        marginLeft: 15
    },
    headerText: {
        color: "#fff",
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        alignItems: 'center'
    },
    nextIcon: {
        marginLeft: 10
    },
    providerContent: {
        marginTop: 24,
        marginBottom: 24,
        paddingLeft: 24,
        paddingRight: 24,
        backgroundColor: '#ffffff'
    },
    providerImg: {
        width: 220,
        height: 220,
        borderRadius: 110,
        borderColor: '#3A86DA',
        borderWidth: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20
    },
    proInfo: {
        backgroundColor: '#fff',
        elevation: 0,
        borderWidth: 0,
        borderRadius: 4,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 30,
        paddingRight: 30,
        flex: 1,
        alignItems: 'center'
    },
    proInfoFooter: {
        // paddingTop: 10,
        backgroundColor: '#fff',
        paddingBottom: isIphoneX() ? 40 : 20,
        paddingLeft: 24,
        paddingRight: 24,
        // paddingTop: 15,
        borderColor: 'rgba(0,0,0, 0.05)',
        elevation: 0,
        shadowOffset: {
            width: 0,
            height: -10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        shadowColor: 'rgba(0,0,0, 0.05)'
    },
    ratingWrapper: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f5f5f5',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 24,
        paddingRight: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    reviewScore: {
        color: '#737373',
        fontSize: 14,
        fontFamily: 'Roboto-Regular',
        lineHeight: 22,
        letterSpacing: 0.47,
        marginLeft: 15
    },
    reviewBtn: {
        alignSelf: 'flex-end'
    },
    reviewBtnText: {
        color: '#515d7d',
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        lineHeight: 22,
        letterSpacing: 0.43
    },
    boldText: {
        ...commonText,
        fontSize: 24,
        lineHeight: 36,
        letterSpacing: 1,
        marginBottom: 5
    },
    greyText: {
        ...commonText,
        fontSize: 12,
        lineHeight: 21,
        letterSpacing: 1.09,
        color: '#515d7d',
        textTransform: 'uppercase'
    },
    infoBtn: {
        alignSelf: 'center'
    },
    requestBtn: {
        ...Buttons.mediaButtons.startButtonBG,
        textAlign: "center",
        alignSelf: "center",
        backgroundColor: "#fff",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#4FACFE'
    },
    requestText: {
        fontSize: 13,
        fontFamily: "Roboto-Regular",
        fontWeight: "600",
        textAlign: "center",
        width: "100%",
        color: "#4FACFE"
    },
    personalInfo: {
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
        backgroundColor: '#fff',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#f5f5f5'
    },
    radioWrapper: {
        borderRadius: 4,
        overflow: 'hidden',
        paddingLeft: 1,
        paddingRight: 23,
        paddingTop: 3,
        paddingBottom: 3
    },
    headText: {
        fontFamily: 'Roboto-Bold',
        color: '#515d7d',
        fontSize: 14,
        marginBottom: 10,
        lineHeight: 14,
        letterSpacing: 0.88,
        marginTop: 24,
        alignSelf: 'flex-start',
        textTransform: 'uppercase'
    },
    parahText: {
        ...commonText,
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 20,
        textAlign: 'left',
        alignSelf: 'flex-start',
        color: '#646c73'
    },
    loadersty: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    },
    borderItem: {
        borderColor: '#f5f5f5',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 24,
        paddingRight: 34,
        paddingTop: 16,
        paddingBottom: 16,
        shadowColor: "#f5f5f5",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        elevation: 0,
        backgroundColor: '#fff'
    },
    radioText: {
        paddingRight: 20
    },
    blackText: {
        fontSize: 14,
        fontFamily: "Roboto-Bold",
        textAlign: 'left',
        letterSpacing: 0.47,
        color: '#515d7d',
        marginBottom: 5
    },
    smallText: {
        fontFamily: "Roboto-Regular",
        lineHeight: 19,
        fontSize: 13,
        color: '#515d7d',
        textAlign: 'left'
    },
    recentReviews: {
        paddingLeft: 30,
        paddingRight: 30,
        // borderBottomWidth: 1,
        borderColor: '#f5f5f5',
        paddingTop: 5
    },
    recentTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    seeAllText: {
        color: '#3fb2fe',
        fontSize: 14,
        letterSpacing: 0.28,
        fontFamily: 'Roboto-Regular',
        fontWeight: '600'
    },
    reviewBox: {
        marginTop: 20,
        marginBottom: 10
    },
    singleReview: {
        borderWidth: 1,
        borderColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: "#f5f5f5",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        elevation: 0,
        backgroundColor: '#fff'
    },
    reviewHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f5f5f5'
    },
    reviewDate: {
        color: '#969fa8',
        fontSize: 13,
        fontFamily: 'Roboto-Regular'
    },
    reviewDetail: {
        color: '#646c73',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 21,
        padding: 16,
        borderTopWidth: 1,
        borderColor: '#f5f5f5'
    },
    credentialBox: {
        paddingLeft: 30,
        paddingRight: 30,
        borderTopWidth: 1,
        borderColor: '#f5f5f5',
        paddingBottom: 24
    },
    credList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10
    },
    singleCred: {
        backgroundColor: '#515d7d',
        borderRadius: 4,
        paddingTop: 9,
        paddingBottom: 9,
        paddingLeft: 18,
        paddingRight: 18,
        fontSize: 13,
        color: '#fff',
        letterSpacing: 0.5,
        lineHeight: 16,
        marginRight: 8,
        overflow: 'hidden',
        marginBottom: 8
    },
    clinicBox: {
        paddingLeft: 30,
        paddingRight: 30,
        borderTopWidth: 1,
        borderColor: '#f5f5f5',
        paddingBottom: 24
    },
    singleClinic: {
        flexDirection: 'row',
        marginTop: 10
    },
    clinicImg: {
        width: 65,
        height: 65,
        marginRight: 16,
        resizeMode: 'contain'
    },
    clinicInfo: {
        flex: 1
    },
    cliName: {
        color: '#25345c',
        fontSize: 14,
        letterSpacing: 0.47,
        fontFamily: 'Roboto-Bold',
        lineHeight: 22,
        fontWeight: '600',
        marginBottom: 2
    },
    institute: {
        color: '#22242a',
        fontSize: 13,
        lineHeight: 25,
        letterSpacing: 0.43,
        fontFamily: 'Roboto-Regular',
        marginBottom: 5
    },
    cliLocation: {
        color: '#969fa8',
        fontSize: 13,
        letterSpacing: 0.28,
        fontFamily: 'Roboto-Regular'
    },
    cliDate: {
        color: '#969fa8',
        fontSize: 13,
        letterSpacing: 0.28,
        fontFamily: 'Roboto-Regular'
    },
    qrcodeInner: {
        ...CommonStyles.styles.shadowBox,
        borderRadius: 24,
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 16
    },
    eduBox: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderColor: '#f5f5f5',
    },
    eduInfo: {
        flex: 1
    },
    singleEdu: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 15
    },
    eduName: {
        color: '#25345c',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0.47,
        fontFamily: 'Roboto-Bold',
        marginBottom: 5
    },
    eduDes: {
        color: '#646c73',
        fontSize: 13,
        lineHeight: 21,
        fontFamily: 'Roboto-Regular'
    },
    proBgMain:{
        width: 150,
        height: 150,
        borderRadius: 75,
        //borderColor: '#3A86DA',
        //borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 20
    },
    proLetterMain: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: 60,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    QrCodeText: {
        fontFamily: 'Roboto-Bold',
        color: '#515d7d',
        fontSize: 14,
        marginBottom: 10,
        lineHeight: 14,
        letterSpacing: 0.88,
        marginTop: 24,
        alignSelf: 'flex-start',
        textTransform: 'uppercase',
        left: 135,
        textAlign: 'center'
    },
});


