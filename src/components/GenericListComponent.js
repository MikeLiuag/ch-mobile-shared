import React, {Component} from "react";
import {StyleSheet, TouchableOpacity, Image} from "react-native";
import {View, Text} from "native-base";
import {Colors, TextStyles} from "../styles";
import {isIphoneX} from "ch-mobile-shared";
import EntypoIcons from "react-native-vector-icons/Entypo";

export class GenericListComponent extends Component<Props> {

    render() {
        const {itemDetail} = this.props;
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.singleItem}
                onPress={() => {
                    this.props.onPress();
                    //this.setState({selectedMember: itemDetail})
                }}
            >
                <View style={styles.imageWrapper}>
                    {itemDetail.profilePicture ?
                        <Image
                            style={styles.proImage}
                            resizeMode="cover"
                            source={{uri: itemDetail.profilePicture}}/>
                        :
                        <View style={{
                            ...styles.proBgMain,
                            backgroundColor: itemDetail.colorCode
                        }}><Text
                            style={styles.proLetterMain}>{itemDetail.name.charAt(0).toUpperCase()}</Text></View>
                    }
                </View>
                <View style={styles.itemDetail}>
                    <Text style={styles.itemName}>{itemDetail.name}</Text>
                    <Text style={styles.itemDes} numberOfLines={1}>
                        {itemDetail.designation}
                    </Text>
                </View>
                {
                    <View style={styles.checkWrapper}>
                        <EntypoIcons name="chevron-thin-right" size={25} color="#3fb2fe"/>
                    </View>
                }
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    singleItem: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        borderRadius: 12,
        marginBottom: 8,
        shadowColor: 'rgba(0,0,0,0.07)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 10,
        shadowOpacity: 0.8,
        elevation: 1,
        backgroundColor: Colors.colors.whiteColor,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    proImage: {
        width: 48,
        height: 48,
        borderRadius: 25,
        overflow: 'hidden'
    },
    proBgMain:{
        width: 48,
        height: 48,
        borderRadius: 60,
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
    itemName: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.TextH7
    },
    itemDes: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextExtraS,
        color: Colors.colors.lowContrast,
    },
    checkWrapper: {},
    nextBtn: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX()? 34 : 24
    },
});
