import React, {Component} from 'react';
import {StatusBar, StyleSheet,TouchableOpacity} from 'react-native';
import {Container, Text, Header, Left, Right, Body, Button, Content, View} from 'native-base';
import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment/moment';
import Loader from '../Loader';
import {addTestID} from "../../utilities";

export class DCTReportViewComponent extends Component<Props> {

    constructor(props) {
        super(props);
    }
    render() {
        StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('dark-content', true);
        if (this.props.isLoading) {
            return <Loader/>;
        }
        return (
            <Container>
                <Header noShadow transparent style={{ backgroundColor: '#006eb6'}}>
                    <StatusBar
                        backgroundColor="transparent"
                        barStyle="light-content"
                        translucent
                    />
                    <Left>
                        <Button
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
                            colors={["#006eb6", "#0092f1", "#4facfe"]}
                            style={styles.greBG}
                        >
                            <Text style={styles.greTitle}>{this.props.dctTitle}</Text>
                            {/*<Text style={styles.greDes}>Outcome Measure Score by completions</Text>*/}
                        </LinearGradient>
                        {this.props.scorable ?
                        <View style={styles.scoreSection}>
                            <View style={styles.scoreBox}>
                                <Text style={styles.redText}>{this.props.initialScore}</Text>
                                <Text style={styles.scoreText}>Initial Score</Text>
                            </View>
                            <View style={styles.scoreBox}>
                                <Text style={styles.greenText}>{this.props.currentScore}</Text>
                                <Text style={styles.scoreText}>Current Score</Text>
                            </View>
                        </View>: null
                        }
                    </View>
                    <View style={styles.completions}>
                        <View style={styles.sectionHead}>
                            <Text
                                style={styles.headText}>Completions</Text>
                            <Button
                                {...addTestID('DCT-see-all')}
                                style={styles.seeAllBtn}
                                transparent
                                onPress={() => {
                                    this.props.dctSeeAll({
                                        section: 'DCT_ATTEMPTS',
                                        title: 'Completions',
                                        data: {"userId":this.props.userId, "dctId":this.props.dctId},
                                    });
                                }}>
                                {
                                    this.props.totalAttempt > 3 ?
                                        <Text uppercase={false} style={styles.seeAllText}>
                                            See All ({this.props.totalAttempt})
                                        </Text> : null
                                }
                            </Button>
                        </View>

                        {this.props.dctCompletionsList
                            ? this.props.dctCompletionsList.map(
                                (outcome, o) => {
                                    return (
                                        <TouchableOpacity
                                            {...addTestID('dct-completions-list')}
                                            key={o} onPress={() => {this.props.dctClicked(outcome.refId, outcome.score,this.props.dctTitle, outcome.dctCompletionDate,  outcome.colorCode, this.props.scorable)}}>
                                            <View key={o} style={styles.wholeList}>
                                                <View style={styles.singleEntry}>
                                                    <View style={[styles.colorSide, {backgroundColor: outcome.colorCode}]}>
                                                        <Text style={styles.largeText}>{outcome.score}</Text>
                                                    </View>
                                                    <View style={styles.textBox}>
                                                        <Text
                                                            style={styles.duskText}
                                                            numberOfLines={2}>
                                                            {moment(outcome.dctCompletionDate).format(
                                                                'MMMM D, Y',
                                                            )}
                                                        </Text>
                                                    </View>
                                                    <Button  transparent style={styles.nextButton} onPress={() => {this.props.dctClicked(outcome.refId, outcome.score,this.props.dctTitle, outcome.dctCompletionDate,  outcome.colorCode,this.props.scorable)}}>
                                                        <Icon name="angle-right" size={32} color="#3fb2fe"/>
                                                    </Button>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                },
                            )
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
    greWrapper: {
        // position: 'relative'
        // overflow: 'visible'
    },
    greBG: {},
    greTitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 24,
        lineHeight: 36,
        color: '#fff',
        textAlign: 'center',
        letterSpacing: 1,
        marginTop: 20,
        marginBottom: 70,
        paddingLeft: 20,
        paddingRight: 20
    },
    greDes: {
        textTransform: 'uppercase',
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        textAlign: 'center',
        letterSpacing: 1.09,
        fontWeight: '600',
        color: '#fff'
    },
    scoreSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // position: 'absolute',
        marginTop: -50,
    },
    scoreBox: {
        backgroundColor: '#f7f9ff',
        borderRadius: 8,
        padding: 24,
        overflow: 'hidden',
        margin: 7
    },
    redText: {
        color: '#e03c3c',
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 20
    },
    greenText: {
        color: '#77c70b',
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        textAlign: 'center',
        fontSize: 20
    },
    scoreText: {
        color: '#515d7d',
        fontSize: 11,
        letterSpacing: 1,
        lineHeight: 21,
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    completions: {
        paddingRight: 15,
        paddingLeft: 15
    },
    sectionHead: {
        marginTop: 10,
        marginBottom: 10,
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
    textBox: {
        flex: 1,
    },
    duskText: {
        color: '#515d7d',
        fontSize: 14,
        fontFamily: 'Roboto-Bold',
        lineHeight: 20,
        fontWeight: '600',
        paddingLeft: 16
    },
    nextButton: {
        paddingRight: 16,
        paddingLeft: 16,
    },
})
