import React, {Component} from 'react';
import {FlatList, StatusBar, StyleSheet, TouchableOpacity, View, Platform, Image} from 'react-native';
import {Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title} from 'native-base';
import Loader from "../Loader";
import {getAvatar, addTestID, isIphoneX, getHeaderHeight } from "../../utilities";
import GradientButton from '../../components/GradientButton';
import LinearGradient from "react-native-linear-gradient";
import FAIcon from 'react-native-vector-icons/FontAwesome';
import {Rating} from 'react-native-elements';

const HEADER_SIZE = getHeaderHeight();
export class AppointmentSelectServiceComponent extends Component<Props> {


    constructor(props) {
        super(props);
        this.state = {
            selectedService: null,
        };
    }

    renderProvider = ()=>{
        const item = this.props.selectedProvider;
        if(!item){
            return null;
        }
        return (
            <View style={styles.personalInfoWrapper}>
                <View style={styles.imageWrapper}>

                    {item.profilePicture?
                        <Image
                            style={styles.proImage}
                            resizeMode="cover"
                            source={{uri: getAvatar(item, this.props.S3_BUCKET_LINK)}} />
                        :
                        <View style={{
                            ...styles.proBgMain,
                            backgroundColor: item.colorCode
                        }}><Text
                            style={styles.proLetterMain}>{item.name.charAt(0).toUpperCase()}</Text></View>
                    }
                </View>
                <View style={styles.itemDetail}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDes} numberOfLines={1}>
                        {item.designation}
                    </Text>

                </View>
                <View style={styles.ratingArea}>
                    <View style={{flexDirection: 'row'}}>
                        <Rating
                            readonly
                            type="star"
                            showRating={false}
                            ratingCount={5}
                            imageSize={19}
                            selectedColor="#ffca00"
                            startingValue={item.combinedRating}
                            fractions={2}
                        />
                    </View>
                    <Text style={styles.reviewBtnText}>
                        {item.totalReviews} review{item.totalReviews>1?'s':''}
                    </Text>
                </View>
            </View>
        );

    }

    render() {
        if (this.props.isLoading) {
            return (<Loader/>);
        }
        return (
            <Container>
                <LinearGradient
                    start={{x: 1, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={["#fff", "#fff", "#f7f9ff"]}
                    style={{flex: 1}}
                >
                    <Header transparent style={styles.header}>
                        <StatusBar
                            backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                            translucent
                            barStyle={'dark-content'}
                        />
                        <Left>
                            <Button
                                {...addTestID('back')}
                                onPress={this.props.backClicked}
                                transparent
                                style={styles.backButton}>
                                <FAIcon name="angle-left" size={32} color="#3fb2fe"/>
                            </Button>
                        </Left>
                        <Body style={styles.headerRow}>
                            <Title
                                {...addTestID('select-provider-header')}
                                style={styles.headerText}>Select Service</Title>
                        </Body>
                        <Right style={Platform.OS === 'ios'? null : { flex: 0.5}}>
                            {/*<Button*/}
                            {/*    transparent*/}
                            {/*    style={styles.questionIcon}*/}
                            {/*>*/}
                            {/*    <AntIcon name="questioncircle" size={23} color="#3FB2FE"/>*/}
                            {/*</Button>*/}
                        </Right>
                    </Header>
                    {this.renderProvider()}
                    <Content
                        scrollIndicatorInsets={{ right: 1 }}
                        showsVerticalScrollIndicator={false}
                        {...addTestID('Request-appointment-content')}
                    >


                        <Text style={styles.staticText}>All of our clinical services are supported by the community.</Text>


                        <View style={styles.list}>
                            <FlatList
                                scrollIndicatorInsets={{ right: 1 }}
                                showsVerticalScrollIndicator={false}
                                {...addTestID('Service-List')}
                                data={this.props.servicesList}
                                renderItem={({item, index}) => (
                                    <View
                                        {...addTestID('Select-service-' + (index+1))}
                                        activeOpacity={0.8}
                                        style={styles.serviceCard}
                                        // onPress={() => {
                                        //     this.setState({selectedService: item});
                                        // }}
                                    >
                                        <View style={styles.sessionRow}>
                                            <View style={{ flex: 1}}>
                                                <Text style={styles.itemName}>{item.name}</Text>
                                                <Text style={styles.duration} numberOfLines={2}>{item.durationText} session</Text>
                                            </View>
                                            <View style={styles.timeWrapper}>
                                                <Text style={styles.rate}>${item.recommendedCost}</Text>
                                            </View>
                                        </View>
                                        {!this.props.isProviderApp &&
                                        <Text
                                            style={styles.serviceDesc}>{item.description ? item.description : 'N/A'}</Text>
                                        }
                                        <GradientButton
                                            testId = "book-next"
                                            text="Select Service"
                                            onPress={()=>{this.props.nextStep(item)}}
                                        />
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </Content>
                </LinearGradient>
            </Container>


        )

    }
}



const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        paddingLeft: 0,
        paddingRight: 0,
        height: HEADER_SIZE,
    },
    headerRow: {
        flex: 3,
        alignItems: 'center'
    },
    headerText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0.3,
        color: '#25345C',
        textAlign: 'center',
    },
    questionIcon: {
        marginRight: 22,
        paddingLeft: 0,
        paddingRight: 0
    },
    backButton: {
        marginLeft: 18,
        width: 40,
    },
    backIcon: {
        color: '#3fb2fe',
        fontSize: 30,
    },
    apptHeading: {
        marginTop: 30,
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 24,
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 1,
        marginBottom: 16
    },
    proText: {
        color: '#515d7d',
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        letterSpacing: 0.8,
        lineHeight: 18,
        textAlign: 'center',
        marginBottom: 30
    },
    list: {
        padding: 16
    },
    serviceCard: {
        borderWidth: 1,
        borderColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: 'rgba(37, 52, 92, 0.09)',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowRadius: 10,
        shadowOpacity: 0.8,
        elevation: 1,
        backgroundColor: '#fff',
        flexDirection: 'column',
        padding: 20
    },
    timeWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        // width: 80
    },
    rate: {
        color: '#3fb2fe',
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        letterSpacing: 0.63,
        fontWeight: '700',
        textAlign: 'right'
    },
    duration: {
        color: '#515D7D',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0.3
    },
    checkWrapper: {
        paddingRight: 16
    },
    nextBtn: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX() ? 34 : 24
    },
    personalInfoWrapper: {
        borderColor: 'rgba(0,0,0,0.05)',
        backgroundColor: '#fff',
        padding: 24,
        // marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageWrapper: {},
    proImage: {
        width: 65,
        height: 65,
        borderRadius: 45,
        overflow: 'hidden'
    },
    staticText: {
        color: '#515d7d',
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        lineHeight: 25,
        letterSpacing: 0.8,
        textAlign: 'center',
        margin: 40
    },
    proBgMain:{
        width: 65,
        height: 65,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proLetterMain: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    itemDetail: {
        flex: 1,
        paddingLeft: 16
    },
    sessionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    itemName: {
        color: '#22242A',
        fontFamily: 'Roboto-Bold',
        fontWeight: '500',
        fontSize: 15,
        lineHeight: 16,
        letterSpacing: 0.3,
        marginBottom: 8,
        paddingRight: 10
    },
    itemDes: {
        color: '#515D7D',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0.3
    },
    reviewBtnText: {
        color: '#515d7d',
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        lineHeight: 22,
        letterSpacing: 0.43,
    },
    serviceDesc: {
        color: '#25345C',
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        lineHeight: 22.5,
        paddingTop:16,
        paddingBottom:24
    }
});


