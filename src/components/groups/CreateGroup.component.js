import React, {Component} from 'react';
import {Image,
    Keyboard, ScrollView,
    KeyboardAvoidingView, Platform, StatusBar, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {Body, Button, Container, Header, Input, Item, Label, Left, Right, Title} from 'native-base';
import {AlertUtil, isIphoneX, getHeaderHeight} from '../../utilities';
import GradientButton from '../../components/GradientButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import {PERMISSIONS, request} from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import {addTestID} from "../../utilities";


const HEADER_SIZE = getHeaderHeight();

export class CreateGroupComponent extends Component<Props> {
    static navigationOptions = {
        header: null,
    };

    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({
            keyboardOpen: true
        });
    }

    _keyboardDidHide = () => {
        this.setState({
            keyboardOpen: false
        });
    }


    constructor(props) {
        super(props);
        this.state = {
            nameFocus: false,
            imageUploaded: false,
            groupName: '',
            keyboardOpen: false
        };
    }

    checkPermissions = ()=>{
        request(Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
            console.log(result);
            if (result === 'denied' || result==='blocked') {
                AlertUtil.showErrorMessage("Permission denied. Please allow Photo Library Permissions from your phone settings");
            } else {
                this.chooseFile();
            }
        })
    };

    chooseFile = async () => {
        let options = {
            title: 'Update Group Picture',
            allowsEditing: true,
            mediaType: 'photo',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, response => {
            if (response.didCancel) {
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                if (response.error === 'Photo library permissions not granted' || response.error === 'Camera permissions not granted' || response.error === 'Permissions weren\'t granted') {
                    AlertUtil.showErrorMessage(response.error + '. Please go to application settings and allow permissions.');
                }
            } else if (response.customButton) {
                AlertUtil.showErrorMessage(response.customButton);
            } else {
                let source = 'data:' + response.type + ';base64,' + response.data;
                // AlertUtil.showErrorMessage(response.fileSize);

                let imageSize = response.fileSize / 1000000;

                if (imageSize >= 10) {
                    AlertUtil.showErrorMessage('Uploaded file size is too large');
                } else {
                    this.setState({
                        imageUploaded: true,
                        groupImage: source,
                        fileData: {
                            uri: response.uri,
                            name: response.fileName ? response.fileName : 'confidant-health-group-image.jpeg',
                            type: response.type
                        }
                    });
                }

            }
        });
    };

    render() {
        return(
            <KeyboardAvoidingView
                style={{ flex:1, bottom: 0}}
                behavior={Platform.OS==='ios'?'padding':null}>
                <Container>
                    <Header transparent style={styles.header}>
                        <StatusBar
                            backgroundColor="transparent"
                            barStyle="dark-content"
                            translucent
                        />
                        <Left>
                            <Button
                                {...addTestID('back')}
                                onPress={() => this.props.goBack()}
                                transparent
                                style={styles.backButton}>
                                <Icon name="angle-left" size={32} color="#3fb2fe"/>
                            </Button>
                        </Left>
                        <Body style={{ flex: 2}}>
                            <Title style={styles.groupTitle}>Group Information</Title>
                        </Body>
                        <Right/>
                    </Header>
                    <ScrollView contentContainerStyle={{ padding: 40}}>
                        <View style={styles.uploadWrapper}>
                            {
                                this.state.imageUploaded?
                                    <TouchableOpacity
                                        {...addTestID('check-permissions')}
                                        style={styles.imgCircle} onPress={this.checkPermissions}>
                                        <Image
                                            resizeMode="contain"
                                            style={styles.uploadImg}
                                            source={{uri: this.state.groupImage}} />
                                        <View style={styles.editBox}>
                                            <Icon name="pencil" size={15} color="#3fb2fe"/>
                                        </View>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.uploadCircle} onPress={this.checkPermissions}>
                                        <EvilIcon color="#3fb2fe" name="image" size={45} />
                                    </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.inputWrapper}>
                            <Item floatingLabel
                                  style={this.state.nameFocus ? [styles.inputFields, {borderColor: '#3fb2fe'}] : styles.inputFields}
                            >
                                <Label style={this.state.nameFocus? {...styles.inputLabel, color: '#3fb2fe'} : styles.inputLabel}>Group Name</Label>
                                <Input
                                    {...addTestID('input-group-name')}
                                    onChangeText={(groupName)=>{
                                        this.setState({groupName})
                                    }}
                                    style={styles.inputBox}
                                    onFocus={() => {
                                        this.setState({nameFocus: true});
                                    }}
                                    onBlur={() => {
                                        this.setState({nameFocus: false});
                                    }}
                                />
                            </Item>
                        </View>
                    </ScrollView>
                    <View style={this.state.keyboardOpen? {...styles.greBtn, paddingLeft: 0, paddingRight: 0, paddingBottom: 0} : styles.greBtn}>
                        <GradientButton
                            testId = "continue"
                            disabled={this.state.groupName===''}
                            onPress={this.nextStep}
                            text="Continue"
                        />
                    </View>
                </Container>
            </KeyboardAvoidingView>
        );
    };

    nextStep = ()=>{
        const groupParams = {
            name: this.state.groupName,
            file: this.state.imageUploaded ? this.state.fileData : null
        };
        this.props.navigateToAddMembers(groupParams);
    }
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 15,
        paddingLeft: 3,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        elevation: 0,
        justifyContent: 'flex-start',
        height: HEADER_SIZE,
    },
    backButton: {
        marginLeft: 15,
        width: 35
    },
    groupTitle: {
        textAlign: 'center',
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0.3
    },
    uploadWrapper: {
        alignItems: 'center'
    },
    uploadCircle: {
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: '#3fb2fe',
        backgroundColor: '#f7f9ff',
        borderStyle: 'dashed',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imgCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploadImg: {
        width: 120,
        height: 120,
        borderRadius: 60
    },
    editBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: -20
    },
    inputWrapper: {
        marginTop: 40
    },
    inputFields: {
        fontFamily: 'Roboto-Regular',
        color: '#25345C',
        marginBottom: 5,
        elevation: 0,
        borderBottomWidth: 1
    },
    inputLabel: {
        fontFamily: 'Roboto-Regular',
        color: '#b3bec9',
        fontSize: 15,
        lineHeight: 16,
        paddingLeft: 0
    },
    inputBox: {
        color: '#515d7d',
        height: 55,
        fontSize: 15,
        paddingLeft: 0
    },
    greBtn: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX()? 36 : 24
    }
});
