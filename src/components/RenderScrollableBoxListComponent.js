import React, {Component} from "react";
import {ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {Text, View} from "native-base";
import {Colors, TextStyles} from "../styles";

export class RenderScrollableBoxListComponent extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                ref={(ref) => {
                    this.scrollView = ref
                }}
                contentContainerStyle={{
                    justifyContent: 'space-evenly',
                    alignItems: 'flex-start',
                    paddingRight: 16,
                    marginTop: 16
                }}
                style={styles.filtersView}>
                {this.props.renderList && this.props.renderList.map(item => {
                    return (
                        <TouchableOpacity
                            onPress={()=>{this.props.onPress(item)}}
                        >
                        <View style={styles.itemView}>
                            <Text style={styles.itemTitleText}>{item.title}</Text>
                            <Text style={styles.itemDurationText}>{item.duration} session</Text>
                        </View>
                        </TouchableOpacity>
                    )

                })}
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    filtersView: {
        display:'flex',
        flexGrow: 0,
        flexShrink: 0,
        flexDirection: 'row'
    },
    itemView: {
        backgroundColor: Colors.colors.whiteColor,
        padding: 16,
        borderRadius: 8,
        marginRight: 8,
    },
    itemTitleText:{
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.primaryText,
    },
    itemDurationText:{
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextExtraS,
        color: Colors.colors.lowContrast
    }
})
