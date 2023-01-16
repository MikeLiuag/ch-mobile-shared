import React, {Component} from 'react';
import {StatusBar, StyleSheet,Platform} from 'react-native';
import {Container, Text, Header, Left, Right, Body, Button, Content, View} from 'native-base';
import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Loader from "../Loader";
import moment from 'moment/moment';
import {addTestID} from "../../utilities";

export class OutcomeDetailComponent extends Component<props> {

    constructor(props) {
        super(props);
        this.state = {
            colorCode: this.props.colorCode
        };
        this.colorArray = [];
    }

    componentDidMount(): void {
        switch (this.state.colorCode) {
            case '#77c70b':{
                this.colorArray = ['#006122', '#008A31', '#38A300', '#3BAE3A','#308629','#6CFF48', '#359226', '#197A11'];
                break;
            }
            case '#e03c3c': {
                this.colorArray = ['#a00f0f', '#C02525', '#E03C3C', '#FC7373','#BB3838','#D34747', '#CA3E3E', '#BB2424'];
                break;
            }
            case '#0092f1': {
                this.colorArray = ['#006eb6', '#0081D5', '#0092f1', '#33FEFE','#1A85CC','#23AFDD', '#1A8FDB', '#007CCD'];
                break;
            }
            case '#f18f14': {
                this.colorArray = ['#dd5b00', '#E57209', '#f18f14', '#FDF542','#DF7A20','#EBAA2C', '#EA8623', '#DD6E08'];
                break;
            }
            default: {
                this.colorArray = ['#006122', '#008A31', '#38A300', '#3BAE3A','#308629','#6CFF48', '#359226', '#197A11'];
            }
        }
    }

    getAnimatedProgress = ()=>{
        return Platform.OS === 'android'?
            (<AnimatedCircularProgress
                style={styles.circleBar}
                size={240}
                width={10}
                fill={100}
                rotation={180}
                lineCap="round"
                tintColor={this.colorArray[5]}
                tintColorSecondary={this.colorArray[3]}
                dashedBackground={{width:2,gap:1}}
                backgroundColor={this.colorArray[4]}
            >
                {
                    (fill) => (
                        <View style={{...styles.circleInside, backgroundColor: this.colorArray[6], borderColor: this.colorArray[7]}}>
                            <Text style={styles.circleText}>
                                {this.props.score}
                            </Text>
                            {/*<Text style={styles.textInside}>{this.props.score}</Text>*/}
                        </View>
                    )
                }
            </AnimatedCircularProgress>)
            : (
                <AnimatedCircularProgress
                    style={styles.circleBar}
                    size={240}
                    width={10}
                    fill={100}
                    rotation={180}
                    lineCap="round"
                    tintColor={this.colorArray[5]}
                    tintColorSecondary={this.colorArray[3]}
                    backgroundColor={this.colorArray[4]}
                >
                    {
                        (fill) => (
                            <View style={{...styles.circleInside, backgroundColor: this.colorArray[6], borderColor: this.colorArray[7]}}>
                                <Text style={styles.circleText}>
                                    {this.props.score}
                                </Text>
                                {/*<Text style={styles.textInside}>{this.props.score}</Text>*/}
                            </View>
                        )
                    }
                </AnimatedCircularProgress>
            );

    }

    render() {

        if (this.props.isLoading) {
            return <Loader/>;
        }
        return (
            <Container>
                <Header noShadow transparent
                        style={this.props.scorable ? { backgroundColor: this.colorArray[0]}:
                            { backgroundColor: this.colorArray[2]}}
                >
                    <StatusBar
                        backgroundColor="transparent"
                        barStyle="light-content"
                        translucent
                    />
                    <Left>
                        <Button
                            {...addTestID('back')}
                            onPress={this.props.backClicked}
                            transparent
                            style={styles.backButton}>
                            <AwesomeIcon name="angle-left" size={32} color="#fff"/>
                        </Button>
                    </Left>
                    <Body />
                    <Right />
                </Header>
                <Content style={{ backgroundColor: '#fff'}}>
                    <View style={styles.greWrapper}>
                        <LinearGradient
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0, y: 1 }}
                            colors={this.props.scorable ?
                                [this.colorArray[0], this.colorArray[1], this.colorArray[2]]
                                :
                                [this.colorArray[2], this.colorArray[2], this.colorArray[2]]
                            }
                            style={styles.greBG}
                        >
                            <Text style={styles.greTitle}>{this.props.dctTitle}</Text>
                            <View style={this.props.scorable ? styles.scoreWrapper : { paddingTop: 5, paddingBottom: 0 }}>
                                {
                                    this.props.scorable && this.getAnimatedProgress()
                                }

                            </View>
                            <Text style={styles.greTime}>{this.props.completionDate ? 'Completed on '+ moment(this.props.completionDate).format(
                                'MMMM D, Y',
                            ) : ''}</Text>
                        </LinearGradient>
                    </View>


                    <View style={styles.QASection}>
                        {!this.props.outcomeData && (
                            (<View style={{marginTop: 40, justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={{fontSize: 16}}>Failed to load outcome detail.</Text>
                            </View>)
                        )}
                        {this.props.outcomeData && this.props.outcomeData.outcomeDetailsList
                            ? this.props.outcomeData.outcomeDetailsList.map((outcome, o) => {
                                return (
                                    <View  key ={o} style={styles.singleQA}>
                                        <View style={styles.QSection}>
                                            <Text style={styles.QAIcon}>Q</Text>
                                            <Text style={styles.QText}>{outcome.question}</Text>
                                        </View>
                                        <View style={styles.ASection}>
                                            <Text style={styles.QAIcon}>A</Text>
                                            <Text style={styles.AText}>{outcome.answer}</Text>
                                        </View>
                                    </View>
                                );
                            })
                            : null}


                    </View>

                </Content>

            </Container>
        );
    }
}
const styles = StyleSheet.create({
    backButton: {
        marginLeft: 16,
        paddingLeft: 0,
        width: 35
    },
    greWrapper: {},
    greBG: {},
    greTitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 24,
        lineHeight: 36,
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 1,
        paddingLeft: 20,
        paddingRight: 20
    },
    greTime: {
        textTransform: 'uppercase',
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        textAlign: 'center',
        letterSpacing: 1.09,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 30
    },
    scoreWrapper: {
        paddingTop: 40,
        paddingBottom: 40
    },
    circleBar: {
        alignSelf: 'center'
    },
    circleInside: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        flex: 1,
        borderRadius: 140,
        overflow: 'hidden',
        borderWidth: 30
    },
    circleText: {
        fontSize: 40,
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontWeight: '700',
        textAlign: 'center'
    },
    textInside: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        letterSpacing: 1.27,
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#fff'
    },
    QASection: {},
    singleQA: {
        padding: 24,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 0.5
    },
    QSection: {
        flexDirection: 'row',
        marginBottom: 16
    },
    QAIcon: {
        borderWidth: 1,
        borderColor: '#ebebeb',
        width: 40,
        height: 40,
        textAlign: 'center',
        lineHeight: 40,
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
        color: '#3fb2fe',
        fontSize: 20,
        marginRight: 16
    },
    QText: {
        flex: 1,
        fontFamily: 'Roboto-Bold',
        color: '#25345c',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0.47
    },
    ASection: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    AText: {
        flex: 1,
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 22,
        color: '#646c73'
    }
});
