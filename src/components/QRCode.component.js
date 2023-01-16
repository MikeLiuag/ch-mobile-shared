import React from 'react';
import {View, StyleSheet} from 'react-native';
import QRCode from 'react-native-qrcode-generator';
import {Colors} from "../styles";
/**
 * Component to Generate QRCodes
 *
 * @class QRCodeComponent
 * @extends React.PureComponent
 */
export class QRCodeComponent extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                {this.props.value ?
                    <QRCode
                        value={this.props.value}
                        size={290}
                        bgColor={Colors.colors.mainBlue}
                        fgColor={Colors.colors.whiteColor}/>
                    : null }
            </View>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        marginTop:16
    }
});
