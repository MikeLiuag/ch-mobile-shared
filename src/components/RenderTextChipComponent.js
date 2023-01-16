import React, {Component} from "react";
import {ScrollView, StyleSheet} from "react-native";
import {Text, View} from "native-base";
import {Colors, TextStyles} from "../styles";

export class RenderTextChipComponent extends Component<Props> {
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
                    paddingRight: 20,
                    marginTop:16
                }}
                style={styles.filtersView}>
                {this.props.renderList && this.props.renderList.map(item => {
                    return (
                        <View style={styles.chipView}>
                            <Text style={styles.chipText} numberOfLines={1}>{item}</Text>
                        </View>
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
    chipView: {
        backgroundColor: Colors.colors.highContrastBG,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 12,
        paddingRight:12,
        borderRadius: 16,
        marginRight: 4,
        maxWidth:150,
        flexDirection: 'row'
    },
    chipText:{
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.captionText,
        color: Colors.colors.mediumContrast
    }
})
