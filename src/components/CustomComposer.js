import PropTypes from 'prop-types';
import React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import { Colors, TextStyles, CommonStyles } from "../styles";

const styles = StyleSheet.create({
    textInput: {
        flex: 1,
        marginLeft: 16,
        marginRight:0,
        fontSize: 15,
        lineHeight: 17,
        minHeight: 42,
        maxHeight: 160,
        borderWidth: 0,
        borderColor: Colors.colors.borderColor,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingBottom: 5,
        color: '#444',
        height: 'auto',
        // paddingTop: Platform.OS === 'ios'? 12 : 12,
        alignItems: 'center',
        marginTop: Platform.select({
            ios: 8,
            android: 10,
        }),
        marginBottom: Platform.select({
            ios: 8,
            android: 10,
        }),
    },
});

export default class CustomComposer extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            radius: 90,
            paddingTop: 12
        }
        this.contentSize = undefined;
        this.onContentSizeChange = (e) => {

            const { contentSize } = e.nativeEvent;
            // // Support earlier versions of React Native on Android.
            if (!contentSize) {
                return;
            }
            this.props.onInputSizeChanged({...contentSize, height: contentSize.height + 5});
            if (!this.contentSize ||
                (this.contentSize &&
                    (this.contentSize.width !== contentSize.width ||
                        this.contentSize.height !== contentSize.height))) {
                this.contentSize = contentSize;
                const radius = 85 - (contentSize.height+13);

                this.setState({
                    radius: radius>10?radius:10,
                    paddingTop: contentSize.height>17?5:12
                })

            }
        };
        this.onChangeText = (text) => {
            this.props.onTextChanged(text);
            if(this.props.composerTextChanged) {
                this.props.composerTextChanged(text);
            }
        };
    }
    render() {
        return (<TextInput testID={this.props.placeholder}
                           accessibilityLabel={this.props.placeholder}
                           spellCheck={true}
                           placeholder={`Message ${this.props.name}`} placeholderTextColor={'#999'}
                           multiline={this.props.multiline} onChange={this.onContentSizeChange} onContentSizeChange={this.onContentSizeChange}
                           onChangeText={this.onChangeText} style={[
            styles.textInput,
            this.props.textInputStyle,
            {borderRadius: this.state.radius, paddingTop: this.state.paddingTop}
            // { height: this.props.composerHeight },
        ]} autoFocus={this.props.textInputAutoFocus} value={this.props.text} enablesReturnKeyAutomatically
                           underlineColorAndroid='transparent' keyboardAppearance={this.props.keyboardAppearance} {...this.props.textInputProps}/>);
    }
}
CustomComposer.defaultProps = {
    composerHeight: 150,
    text: '',
    placeholderTextColor: "#666",
    textInputProps: null,
    multiline: false,
    textInputStyle: {},
    textInputAutoFocus: false,
    keyboardAppearance: 'default',
    onTextChanged: () => { },
    onInputSizeChanged: () => { },
};
CustomComposer.propTypes = {
    composerHeight: PropTypes.number,
    text: PropTypes.string,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    textInputProps: PropTypes.object,
    onTextChanged: PropTypes.func,
    onInputSizeChanged: PropTypes.func,
    multiline: PropTypes.bool,
    textInputStyle: PropTypes.any,
    textInputAutoFocus: PropTypes.bool,
    keyboardAppearance: PropTypes.string,
};
//# sourceMappingURL=Composer.js.maps
