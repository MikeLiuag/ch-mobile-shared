import React, {Component} from "react";
import {StyleSheet, TouchableOpacity, Image} from "react-native";
import {Icon, View, Item, Label, Input, TextArea, Textarea, Form, Text} from "native-base";
import {isIphoneX} from "ch-mobile-shared";
import AntIcon from "react-native-vector-icons/AntDesign";
import EntypoIcons from "react-native-vector-icons/Entypo";
import {addTestID} from "../utilities";
import {Colors, TextStyles} from "../styles";
import {Rating} from "react-native-elements";

export class RatingComponent extends Component<Props> {

    render() {
        return(
            <View style={{flexDirection: "row",alignItems:'center'}}>
                <Rating
                    ratingImage={this.props.ratingImage}
                    readonly={this.props.readonly}
                    type={this.props.type}
                    showRating={this.props.showRating}
                    selectedColor={this.props.selectedColor}
                    imageSize = {this.props.size}
                    fractions={this.props.fractions}
                    ratingColor={this.props.ratingColor}
                    ratingBackgroundColor={this.props.ratingBackgroundColor}
                    count = {this.props.ratingCount}
                    defaultRating={this.props.defaultRating}
                    startingValue={this.props.startingValue}
                />
                <Text style={styles.providerInfoRatingText}>{this.props.defaultRating}</Text>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    providerInfoRatingText: {
        marginLeft: 8,
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextExtraS,
        color: Colors.colors.highContrast,
    },
});
