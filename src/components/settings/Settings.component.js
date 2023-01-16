import React, {Component} from 'react';
import {Button, Container, Content, Text, View, Icon} from 'native-base';
import {FlatList, StatusBar, StyleSheet, Platform, SectionList} from 'react-native';
import {addTestID, isIphoneX} from '../../utilities';
import {SHOW_APP_META, APP_ENVIRONMENT} from './../../constants/CommonConstants';
import PackageJson from './../../../package.json';
import {BackButton} from '../BackButton';
import {PrimaryButton} from '../PrimaryButton';
import {SingleSettingItem} from '../SingleSettingItem';
import {Colors, TextStyles} from '../../styles';
import { SETTING_COLOR_ARRAY, SETTING_BG_COLOR_ARRAY } from '../../constants';

export class SettingsComponent extends Component<Props> {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            darkEnabled: false,
        };
    }

    render() {
        console.log(this.props.sections);
        const updateSections  = !this.props.isMatchmaker  ? this.props.sections.filter(item=> item.title!=="Match Maker Auto Connection") : this.props.sections
        const sections = [
            {
                title: 'My Profile', data: [{
                    profileItem: true,
                    title: this.props.name,
                    avatar: this.props.avatar,
                    screen: this.props.profileScreen,
                    des: 'Edit profile details',
                }],
            },
            ...updateSections,
        ];
        const hasBack = this.props.hasBack || this.props.isMember;
        return (
            <Container>
                <StatusBar
                    backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                    translucent
                    barStyle={'dark-content'}
                />
                {hasBack && (
                    <View style={styles.backButtonWrapper}>
                        <BackButton
                            {...addTestID('back-btn')}
                            onPress={this.props.backClicked}
                        />
                    </View>
                )}

                <Content showsVerticalScrollIndicator={false}>
                    <View>
                        <Text {...addTestID('setting')}
                              style={styles.settingTitle}>Settings</Text>
                    </View>
                    <View style={styles.listWrap}>

                        <SectionList
                            sections={sections}
                            keyExtractor={(item, index) => item + index}
                            renderItem={({item, index}) =>
                                <SingleSettingItem
                                    testId={'navigate-to-screen-' + index + 1}
                                    titleId={'screen-title-' + index + 1}
                                    desId={'screen-description-' + index + 1}
                                    onPress={() => {
                                        if (item.screen) {
                                            this.props.navigateTo(item.screen);
                                        } else if(item.onPress) {
                                            item.onPress();
                                        }
                                    }}
                                    settingItem={item}
                                />}
                            renderSectionHeader={({section: {title}}) => (
                                <Text style={styles.sectionTitle}>{title}</Text>
                            )}
                        />
                        {/*<Text style={styles.sectionTitle}>*/}
                        {/*    Dark Mode*/}
                        {/*</Text>*/}
                        {/*<View style={styles.darkModeWrap}>*/}
                        {/*    <View>*/}
                        {/*        <Button*/}
                        {/*            transparent*/}
                        {/*            style={styles.moonIconWrap}>*/}
                        {/*            <Icon name={'moon'} type={'Feather'} style={styles.moonIcon}/>*/}
                        {/*        </Button>*/}
                        {/*    </View>*/}
                        {/*    <View style={styles.itemDetail}>*/}
                        {/*        <Text style={styles.itemName}>*/}
                        {/*            Dark mode*/}
                        {/*        </Text>*/}
                        {/*        <Text style={styles.itemDes} numberOfLines={2}>*/}
                        {/*            Dark mode is disabled*/}
                        {/*        </Text>*/}
                        {/*    </View>*/}
                        {/*    <View style={styles.nextWrapper}>*/}
                        {/*        <ToggleSwitch*/}
                        {/*            testId={'setting-toggle'}*/}
                        {/*            switchOn={this.state.darkEnabled}*/}
                        {/*            onPress={() => {*/}
                        {/*                this.setState({*/}
                        {/*                    darkEnabled: !this.state.darkEnabled,*/}
                        {/*                });*/}
                        {/*            }}*/}
                        {/*        />*/}
                        {/*    </View>*/}
                        {/*</View>*/}

                        {/*<Text style={styles.sectionTitle}>*/}
                        {/*    My profile*/}
                        {/*</Text>*/}
                        {/*<FlatList*/}
                        {/*    data={this.props.data}*/}
                        {/*    style={styles.list}*/}
                        {/*    renderItem={({item, index}) => (*/}
                        {/*        <View>*/}
                        {/*            <SingleSettingItem*/}
                        {/*                testId={'navigate-to-screen-' + index + 1}*/}
                        {/*                titleId={'screen-title-' + index + 1}*/}
                        {/*                desId={'screen-description-' + index + 1}*/}
                        {/*                onPress={() => {*/}
                        {/*                    if (item.screen) {*/}
                        {/*                        this.props.navigateTo(item.screen);*/}
                        {/*                    } else {*/}
                        {/*                        this.props.shareAppLink();*/}
                        {/*                    }*/}
                        {/*                }}*/}
                        {/*                settingItem={item}*/}
                        {/*                iconType={'Feather'}*/}
                        {/*                iconName={'user-plus'}*/}
                        {/*            />*/}
                        {/*        </View>*/}

                        {/*    )}*/}
                        {/*    keyExtractor={(item, index) => index.toString()}*/}
                        {/*/>*/}
                        {
                            SHOW_APP_META && (
                                <View style={styles.darkModeWrap}>
                                    <View>
                                        <Button
                                            transparent
                                            style={styles.moonIconWrap}>
                                            <Icon name={'bug'} type={'FontAwesome'} style={styles.moonIcon}/>
                                        </Button>
                                    </View>
                                    <View style={styles.itemDetail}>
                                        <Text
                                            style={styles.itemName}>Debug Info</Text>
                                        <Text style={styles.itemDes}>Shared
                                            Environment: {APP_ENVIRONMENT}</Text>
                                        <Text style={{...styles.itemDes, marginBottom: 5}}>Connected Shared
                                            Branch: {PackageJson._from?.replace('github:SafeOpioidUseCoalition/ch-mobile-shared#', '')}</Text>
                                    </View>

                                </View>
                            )
                        }

                        <View style={styles.logOutWrap}>
                            <PrimaryButton
                                testId={'logout-btn'}
                                bgColor={'transparent'}
                                text={'Log Out'}
                                textColor={Colors.colors.primaryText}
                                onPress={() => this.props.logout()}
                            />
                        </View>
                    </View>

                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    backButtonWrapper: {
        position: 'relative',
        zIndex: 2,
        paddingTop: isIphoneX() ? 50 : 44,
        paddingLeft: 22,
    },
    settingTitle: {
        ...TextStyles.mediaTexts.serifProExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
        marginTop: 16,
        marginBottom: 20,
        paddingLeft: 24,
    },
    sectionTitle: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.overlineTextS,
        textTransform: 'uppercase',
        color: Colors.colors.lowContrast,
        marginTop: 20,
        marginBottom: 12,
    },
    listWrap: {
        paddingHorizontal: 24,
    },
    logOutWrap: {
        padding: 30,
    },
    itemDetail: {
        flex: 2,
        paddingLeft: 12,
    },
    itemName: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.highContrast,
    },
    itemDes: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText,
        color: Colors.colors.lowContrast,
    },
    darkModeWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12,
    },
    moonIconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.colors.neutral300Icon,
        paddingTop: 0,
        paddingBottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moonIcon: {
        fontSize: 24,
        color: Colors.colors.white,
        marginLeft: 0,
        marginRight: 0,
    },
});
