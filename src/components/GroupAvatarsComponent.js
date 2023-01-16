import React, {Component} from "react";
import {StyleSheet, Text, Image, View} from "react-native";
import {Button } from "native-base";
import {Colors} from '../styles';
import {OVERLAP_IMAGES_COUNT} from '../constants'
import {getAvatar, addTestID} from '../utilities';

export class GroupAvatarsComponent extends Component<Props> {
    render() {
        let avatars = this.props?.avatars;
        if(avatars.length > OVERLAP_IMAGES_COUNT){
            avatars = avatars.splice(OVERLAP_IMAGES_COUNT);
        }
        return (
            <View>
                <View style={styles.peopleList}>
                    {avatars && avatars.length > 0 && avatars.map((pic, index) =>
                        <Image
                            style={styles.singlePerson}
                            resizeMode={"cover"}
                            key={'pic-' + index}
                            source={{uri: getAvatar(pic, this.props.S3_BUCKET_LINK)}}
                            alt="Image"
                        />
                    )
                    }
                </View>
                {this.props?.onPress && (
                    <View style={styles.btnRow}>
                        <Button
                            style={styles.viewAllBtn}
                            transparent
                            onPress={this.props.onPress}
                        >
                            <Text {...addTestID('view-all')} style={styles.reviewBtnText}>View All</Text>
                        </Button>
                    </View>
                )}
            </View>
        )
    }

}
const styles = StyleSheet.create({
    peopleList: {
        paddingLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 0
    },
    singlePerson: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Colors.colors.whiteColor,
        marginLeft: -15
    },
    viewAllBtn: {}
});
