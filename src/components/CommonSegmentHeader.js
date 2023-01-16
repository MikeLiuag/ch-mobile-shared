import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text, Segment} from 'native-base';
import {Colors, TextStyles} from '../styles';

export class CommonSegmentHeader extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            activeTabId: this.props.segments[0].segmentId,
            sections : this.props?.sections
        };
        this.props.segmentChanged(this.props.segments[0].segmentId);
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        if (prevProps.segments.length > this.props.segments.length) {
            this.setActiveTab(this.props.segments[0].segmentId);
        }
    }

    componentDidMount = () => {
        if(this.props.setTabControl) {
            this.props.setTabControl(this.setActiveTab);
        }
    };

    setActiveTab = (tabId) => {
        this.setState({activeTabId: tabId});
        this.props.segmentChanged(tabId);
    };

    render() {
        const {activeTabId} = this.state;

        let showIcon = false;
        const {sections} = this.state;
        if(sections){
            const unreadSection = sections?.find(section => section.title === "unReadConnections");
            if(unreadSection){
                showIcon = unreadSection?.count>0;
            }
        }

        return (
            <Segment style={styles.segmentWrap}>
                {
                    this.props.segments?.map((tab, index) => {
                        const active = activeTabId === tab.segmentId;
                        return (
                            <Button
                                style={active?styles.segmentBtnActive:styles.segmentBtn}
                                onPress={()=>{
                                    if(!active) {
                                        this.setActiveTab(tab.segmentId);
                                    }
                                }}
                            >
                                <Text style={styles.segmentBtnText}>{tab.title}</Text>
                                {(sections && active && activeTabId === "members" && showIcon) && (<View style ={styles.notificationDot}></View>)}
                            </Button>
                        );
                    })
                }
            </Segment>
        );
    }
}

const styles = StyleSheet.create({
    segmentWrap: {
        backgroundColor: Colors.colors.highContrastBG,
        borderRadius: 10,
        padding: 4,
        height: 40,
        marginBottom: 16
    },
    segmentBtn: {
        flex: 0.5,
        alignItems: 'center',
        borderRadius: 8,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    segmentBtnActive: {
        flex: 0.5,
        alignItems: 'center',
        borderRadius: 8,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        backgroundColor: Colors.colors.white
    },
    thirdTab: {
        // height: 20,
        borderLeftWidth: 1,
        borderColor: Colors.colors.neutral50Icon,
        // borderRadius: 0
    },
    segmentBtnText: {
        textAlign: 'center',
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.subTextS,
        width: '100%',
    },
    notificationDot:{
        width: 12,
        height: 12,
        backgroundColor: Colors.colors.errorIcon,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: Colors.colors.whiteColor,
        position: 'absolute',
        top: 4,
        right: 4,
    }
});
