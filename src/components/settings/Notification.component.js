import React, {Component} from 'react';
import {FlatList, StatusBar, StyleSheet, TouchableOpacity, View, Platform} from 'react-native';
import { Container, Content, Text} from 'native-base';
import Loader from './../Loader';
import {NOTIFICATION_SETTINGS} from '../../constants';
import {addTestID, isIphoneX} from '../../utilities';
import { BackButton } from '../BackButton';
import { ToggleSwitch } from '../ToggleSwitch';
import {Colors, TextStyles} from "../../styles";

export class NotificationSettingsComponent extends Component<props> {
    constructor(props) {
        super(props);
        this.state = {
            notificationSettings: this.props.notificationSettings,
        };
    }

    toggleNotificationSettings = async (notificationType) => {
        if (notificationType === '')
            return ;

        const {notificationSettings} = this.state;
        notificationSettings[notificationType] = !notificationSettings[notificationType];
        this.setState({notificationSettings})
        try {
            const data =  await this.props.updateNotificationSettings(notificationSettings);
            if (data.errors) {
                console.warn(data.errors[0].endUserMessage);
            }
        } catch (e) {
            console.log(e);
            this.setState({isLoading: false, isError: true});
        }
    };
    render() {
        // StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('dark-content', true);
        if (this.props.isLoading) {
            return <Loader/>
        }
        return (
            <Container>
                <StatusBar
                    backgroundColor={Platform.OS === 'ios'? null : "transparent"}
                    translucent
                    barStyle={'dark-content'}
                />
                <View style={styles.backButtonWrapper}>
                    <BackButton
                        {...addTestID('back-btn')}
                        onPress={this.props.backClicked}
                    />
                </View>
                <Content
                    showsVerticalScrollIndicator={false}
                    style={{padding: 24}}>
                    <View>
                        <Text {...addTestID('notifications')}
                              style={styles.mainTitle}>Notifications</Text>
                        {/*<Text style={styles.subTitle}>*/}
                        {/*    Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet.*/}
                        {/*</Text>*/}
                    </View>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={NOTIFICATION_SETTINGS}
                        renderItem={(item) => {
                            if(!item.item.applicableFor.includes(this.props.type)) {
                                return null;
                            }
                            return (
                                <View style={styles.notificationList}>
                                    <Text style={styles.sectionTitle}>{item.item.title}</Text>
                                    <FlatList
                                        data={item.item.settings}
                                        renderItem={({ item }) => {
                                            if(!item.applicableFor.includes(this.props.type)) {
                                                return null;
                                            }
                                            if(item.key === 'appointmentPreReminder'){
                                                if(this.state.notificationSettings[item.parent] !== true){
                                                    return null;
                                                }
                                            }
                                            return (
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                    style={styles.singleItem}>
                                                    <Text style={styles.itemName}>{item.title}</Text>
                                                    <View>
                                                        <ToggleSwitch
                                                            testId={'setting-dark-toggle'}
                                                            switchOn={this.state.notificationSettings[item.key]}
                                                            backgroundColorOn={Colors.colors.mainPink}
                                                            onPress={() => {
                                                                this.toggleNotificationSettings(item.key)
                                                            }}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            )}}
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            )
                        }}
                        keyExtractor={(item, index) => index.toString()}>
                    </FlatList>
                </Content>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    backButtonWrapper: {
        position: 'relative',
        zIndex: 2,
        paddingTop: isIphoneX()? 50 : 44,
        paddingLeft: 22
    },
    mainTitle: {
        ...TextStyles.mediaTexts.serifProExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
        // marginTop: 16,
        marginBottom: 8
    },
    subTitle: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextM,
        color: Colors.colors.mediumContrast,
        marginBottom: 40
    },
    sectionTitle: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.overlineTextS,
        textTransform: 'uppercase',
        color: Colors.colors.lowContrast,
        marginTop: 24,
        marginBottom: 24
    },
    notificationList: {
        marginBottom: 50
    },
    singleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12
    },
    itemName: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.mediumContrast,
        flex: 1,
        paddingRight: 10
    }
});
