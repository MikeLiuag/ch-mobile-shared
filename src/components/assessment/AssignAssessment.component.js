import React, {Component} from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {Container, Content, Header, Text} from 'native-base';
import {SliderSearch} from '../slider-search';
import AlfieLoader from './../Loader';
import {AlertUtil, isIphoneX,addTestID, getHeaderHeight} from '../../utilities'
import { CommonStyles } from '../../styles';
import { PrimaryButton } from '../PrimaryButton';
import {ASSIGNED_CHATBOT} from "../../constants";
import moment from "moment";
import Analytics from '@segment/analytics-react-native';

const HEADER_SIZE = getHeaderHeight();

export class AssignAssessmentComponent extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            listItems: [],
            filteredListItems: [],
            selectedAssessment: '',
            showBack: true
        };

        this.ERROR_SERVICES_UNREACHABLE =
            "Something went wrong, we couldn't reach Confidant Services";

        this.getConversations();
    }

    getConversations = async () => {
        try {
            const conversations = await this.props.getConversations();

            if (conversations.errors) {
                AlertUtil.showErrorMessage(response.errors[0].endUserMessage);
                this.setState({isLoading: false});
            } else {
                this.setState({
                    listItems: conversations,
                    filteredListItems: conversations,
                    isLoading: false,
                });
            }
        } catch (error) {
            AlertUtil.showErrorMessage(this.ERROR_SERVICES_UNREACHABLE);
            this.setState({isLoading: false});
        }
    };

    assignConversation = async conversation => {
        try {
            let response;
            if(this.props.isProviderApp) {
                response = await this.props.assignConversation(
                    conversation.id,
                    this.props.organizationId,
                    this.props.connectionId
                );
            } else {
                response = await this.props.assignConversation(
                    conversation.id,
                    this.props.organizationId,
                );
            }
            if (response.errors) {
                AlertUtil.showErrorMessage(response.errors[0].endUserMessage);
            } else {
                let successMessage = 'Assessment has been added to your conversation Queue';
                if(this.props.isProviderApp) {
                    const segmentPayload = {
                        providerId : this.props?.providerProfile?.providerId,
                        providerName : this.props?.providerProfile?.fullName,
                        providerRole : this.props?.providerProfile?.designation,
                        userId: this.props?.connectionId,
                        chatbotName : conversation?.name,
                        assignedAt: moment.utc(Date.now()).format()
                    }
                    Analytics.track(ASSIGNED_CHATBOT,segmentPayload)
                    successMessage = 'Assessment has been added to member\'s conversation Queue';
                }
                AlertUtil.showSuccessMessage(
                    successMessage
                );

                if(this.props.onSuccessfulAssignment) {
                    this.props.onSuccessfulAssignment();
                }
                this.props.goBack();
            }
        } catch (error) {
            AlertUtil.showErrorMessage(this.ERROR_SERVICES_UNREACHABLE);
        }
    };

    propagate = result => {
        this.setState({
            filteredListItems: result.assessments,
            selectedAssessment: '',
        });
    };

    renderAssessments = () => {
        if (this.state.filteredListItems.length > 0) {
            const assessments = this.state.filteredListItems.map(
                (assessment, key) => {
                    return (
                        <TouchableOpacity
                            {...addTestID('Selected-assessment')}
                            style={
                                this.state.selectedAssessment?.id === assessment.id
                                    ? [styles.singleAssessment, {borderColor: '#3fb2fe'}]
                                    : styles.singleAssessment
                            }
                            onPress={() => {
                                this.setState({selectedAssessment: assessment});
                            }}
                            key={key}>
                            <Text style={styles.head}>{assessment.name}</Text>
                            <Text style={styles.description}>
                                {assessment.description
                                    ? assessment.description
                                    : 'Description not available for this assessment'}
                            </Text>
                        </TouchableOpacity>
                    );
                },
            );

            return (
                <Content style={styles.wrapper}>
                    <Text style={styles.mainQuestion}>
                        What chatbot would you like to {this.props.isProviderApp?'assign':'connect with'}?
                    </Text>
                    <View style={styles.assessmentList}>{assessments}</View>
                </Content>
            );
        } else {
            return (
                <Content style={styles.wrapper}>
                    <Text style={styles.mainQuestion}>
                        We couldn't find any assessment for this organization
                    </Text>
                </Content>
            );
        }
    };

    render = () => {
        if (this.state.isLoading) {
            return <AlfieLoader/>;
        } else {
            StatusBar.setBackgroundColor('transparent', true);
            StatusBar.setBarStyle('dark-content', true);
            return (
                <Container>
                    <Header transparent style={styles.header}>
                        <StatusBar
                            backgroundColor="transparent"
                            barStyle="dark-content"
                            translucent
                        />
                        <SliderSearch
                            options={{
                                screenTitle: 'Select Assessment',
                                searchFieldPlaceholder: 'Search Assessment',
                                listItems: {
                                    assessments: this.state.listItems,
                                },
                                filter: (assessments, query) => {
                                    return {
                                        assessments: assessments.assessments.filter(assessment =>
                                            assessment.name
                                                .toLowerCase()
                                                .includes(query.toLowerCase().trim()),
                                        ),
                                    };
                                },
                                showBack: this.state.showBack,
                                backClicked: this.props.goBack,
                            }}
                            propagate={this.propagate}
                        />
                    </Header>
                    {this.renderAssessments()}
                    {this.state.selectedAssessment !== '' ? (
                        <View style={styles.assessBtn}>
                            <PrimaryButton
                                testId = "assessment"
                                onPress={() => {
                                    this.assignConversation(this.state.selectedAssessment);
                                }}
                                text={this.props.isProviderApp?'Assign Chatbot':'Start Chatbot'}
                            />
                        </View>
                    ) : null}
                </Container>
            );
        }
    };
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        paddingTop: 15,
        paddingLeft: 18,
        paddingRight: 18,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        elevation: 0,
        height: HEADER_SIZE,
    },
    wrapper: {
        backgroundColor: '#f7f9ff',
        paddingLeft: 24,
        paddingRight: 24,
    },
    mainQuestion: {
        color: '#25345c',
        fontSize: 17,
        lineHeight: 25.5,
        letterSpacing: 0.8,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        marginTop: 40,
        marginBottom: 40,
        width: '80%',
        alignSelf: 'center',
    },
    head: {
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 14,
        letterSpacing: 0.3,
        color: '#25345c',
        marginBottom: 16,
    },
    description: {
        color: '#646c73',
        fontFamily: 'Roboto-Regular',
        lineHeight: 22,
        fontSize: 14,
    },
    assessmentList: {
        paddingBottom: isIphoneX() ? 40 : 20,
    },
    singleAssessment: {
        borderWidth: 1,
        borderColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: '#f5f5f5',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        elevation: 0,
        backgroundColor: '#fff',
        padding: 23,
    },
    assessBtn: {
        padding: 24,
        paddingBottom: isIphoneX() ? 40 : 24,
        ...CommonStyles.styles.stickyShadow
    },
});
