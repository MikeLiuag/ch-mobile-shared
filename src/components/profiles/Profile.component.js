import React, {Component} from 'react';
import {StyleSheet, Image, Platform, StatusBar, TouchableOpacity} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import FeatherIcons from "react-native-vector-icons/Feather";
import AlfieLoader from '../Loader';
import ImagePicker from 'react-native-image-picker';
import {
    NAME_REGEX,
    EMAIL_REGEX,
    PHONE_REGEX,
    AGE_REGEX,
    Nick_Name_Input_Label,
    Email_Input_Label,
    Phone_Input_Label,
    Nick_Name_Input_Error,
    DOB_Label,
    Personal_Info_Label,
    Contact_Info_Label,
    Emergency_Info_Label,
    First_Name_Input_Label,
    First_Name_Input_Error,
    Last_Name_Input_Label,
    Last_Name_Input_Error,
    Address_One_Input_Label,
    Address_One_Input_Error,
    Address_Two_Input_Label,
    Address_Two_Input_Error,
    City_Input_Label,
    City_Input_Error,
    State_Input_Label,
    State_Input_Error,
    ZipCode_Input_Label,
    ZipCode_Input_Error,
    DEFAULT_CITIES_OPTIONS,
    DEFAULT_STATES_OPTIONS,
    DEFAULT_ZIPCODES_OPTIONS,
    UPDATE_PROFILE_DROPDOWN_TYPES,
    Emergency_Phone_Input_Label,
    Emergency_Phone_Input_Error,
    Emergency_Name_Input_Label,
    Emergency_Name_Input_Error,
    Provider_Name_Input_Error,
    Provider_Name_Input_Label
} from "../../constants";
import {
    Container,
    Text,
    Content,
    Form,
    Item,
    Input,
    Label,
    Body,
    View,
    Button,
    Header,
    Left,
    Title,
    Right,
    Picker
} from 'native-base';
import {addTestID, isIphoneX, AlertUtil, getHeaderHeight} from "../../utilities";
import {DEFAULT_AVATAR_COLOR} from "../../constants";
import {PERMISSIONS, request} from 'react-native-permissions';
import DatePicker from 'react-native-datepicker';
import moment from "moment";
import {BackButton} from '../BackButton';
import {PrimaryButton} from '../PrimaryButton';
import {FloatingInputField} from '../FloatingInputField';
import {StackedInputField} from '../StackedInputField';
import {Colors, CommonStyles, TextStyles} from "../../styles";
import {DropDownInputField} from "../DropDownInputField";
import {ToggleSwitch} from "../ToggleSwitch";
import { TextInput } from 'react-native-gesture-handler';
import FontAwesome from "react-native-vector-icons/FontAwesome";

const HEADER_SIZE = getHeaderHeight();

export class ProfileComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.componentReference = null;
        this.state = {
            fullName: null,
            fullNameError: null,
            fullNameFocus: false,
            firstName: null,
            firstNameError: null,
            firstNameFocus: false,
            lastName: null,
            lastNameError: null,
            lastNameFocus: false,
            dob: null,
            dobError: null,
            dobFocus: false,
            emailAddress: null,
            emailAddressError: null,
            emailAddressFocus: false,
            phoneNumber: null,
            phoneNumberError: null,
            phoneNumberFocus: false,
            addressOne: null,
            addressOneError: null,
            addressOneFocus: false,
            addressTwo: null,
            addressTwoError: null,
            addressTwoFocus: false,
            city: null,
            cityError: null,
            cityFocus: false,
            state: null,
            stateError: null,
            stateFocus: false,
            zipCode: null,
            zipCodeError: null,
            zipCodeFocus: false,
            emergencyContact: null,
            emergencyContactError: null,
            emergencyContactFocus: false,
            emergencyPhone: null,
            emergencyPhoneError: null,
            emergencyPhoneFocus: false,


            viewProfile: true,
            profileImage: null,
            imageUpdated: false,
            fileData: null,
            requiredFieldsError: null,


            bioError: null,
            providerCode: null,
            currentDate: moment().toDate(),
            toggleValue: false

        };
        this.form = {
            fullNameField: null,
            emailField: null,
            phoneField: null,
            dobField: null,
            genderField: null,
        };
        this.stateMapped = false;
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if (!this.props.isLoading && !this.stateMapped) {
            this.mapPropsToState();
        }
    }

    componentDidMount(): void {
        if (!this.props.isLoading && !this.stateMapped) {
            this.mapPropsToState();
        }
    }

    mapPropsToState = () => {
        if (this.props.isLoading) {
            return;
        }
        const {profile} = this.props;
        this.setState({
            fullName: profile.fullName,
            firstName: profile.firstName,
            lastName: profile.lastName,
            dob: profile.dob,
            emailAddress: profile.emailAddress,
            phoneNumber: profile.phoneNumber,
            addressOne: profile.address1,
            addressTwo: profile.address2,
            city: profile.city,
            state: profile.state,
            zipCode: profile.zipCode,
            emergencyContact: profile.emergencyContact,
            emergencyPhone: profile.emergencyPhone,

            gender: profile.gender,
            bio: profile.bio,

            profileImage: profile.profileImage,
            providerCode: profile.providerCode
        });
        this.stateMapped = true;
    };

    openDatePicker = () => {
        if (!this.state.viewProfile && this.componentReference) {
            this.componentReference.onPressDate();
        }
    }

    onToggle = () => {
        if (!this.state.viewProfile) {
            this.setState({toggleValue: !this.state.toggleValue})
        }
    }


    updateProfile = () => {
        let {viewProfile, fullNameError, ageError, bioError} = this.state;
        if (viewProfile) {
            viewProfile = false;
        } else {
            if (this.isFormValid()) {

                const profileRequestBody = {
                    fullName: this.state.fullName ? this.state.fullName.trim() : null,
                    firstName: this.state.firstName ? this.state.firstName.trim() : null,
                    lastName: this.state.lastName ? this.state.lastName.trim() : null,
                    dob: this.state.dob ? this.state.dob : null,
                    emailAddress: this.props.profile.emailAddress,
                    phoneNumber: this.state.phoneNumber ? this.state.phoneNumber.trim() : null,
                    address1: this.state.addressOne ? this.state.addressOne.trim() : null,
                    address2: this.state.addressTwo ? this.state.addressTwo.trim() : null,
                    city: this.state.city ? this.state.city.trim() : null,
                    state: this.state.state ? this.state.state : null,
                    zipCode: this.state.zipCode ? this.state.zipCode.trim() : null,
                    emergencyContact: this.state.emergencyContact ? this.state.emergencyContact.trim() : null,
                    emergencyPhone: this.state.emergencyPhone ? this.state.emergencyPhone.trim() : null,
                    gender: this.state.gender,
                    bio: this.state.bio? this.state.bio : this.props.profile.bio,
                };

                const updateProfileRequest = {
                    profile: profileRequestBody,
                    file: this.state.imageUpdated ? this.state.fileData : null
                };
                this.props.updateProfile(updateProfileRequest);
                if (this.props.error) {
                    viewProfile = false;
                } else {
                    viewProfile = true;
                    fullNameError = null;
                    ageError = null;
                    if (this.props.userType === 'PRACTITIONER') {
                        bioError = null;
                    }
                }
            }
        }
        this.setState({viewProfile, fullNameError, ageError, bioError});
    }


    validateFullName = () => {
        let fullNameError = false;
        this.setState({fullNameFocus: false});
        if (this.state.fullName === null || this.state.fullName === '') {
            fullNameError = true;
        } else if (this.state.fullName && this.state.fullName !== '') {
            fullNameError = !NAME_REGEX.test(this.state.fullName.trim());

        }
        this.setState({fullNameError});
        return !fullNameError;
    };

    focusFullName = () => {
        this.setState({fullNameFocus: true});
    };

    onChangeFullNameText = (fullName) => {
        this.setState({fullNameError: null, fullName: fullName});
    };


    validateFirstName = () => {
        let firstNameError = false;
        this.setState({firstNameFocus: false});
        if ((this.state.firstName === null || this.state.firstName === '' ) && this.props.profile.firstName) {
            firstNameError = true;
        } else if (this.state.firstName && this.state.firstName !== '') {
            firstNameError = !NAME_REGEX.test(this.state.firstName.trim());

        }
        this.setState({firstNameError});
        return !firstNameError;
    };

    focusFirstName = () => {
        this.setState({firstNameFocus: true});
    };

    clearText = (stateKey) => {
        const  {state} = this;
        state[stateKey] = "";
        this.setState(state);
    };

    onChangeFirstNameText = (firstName) => {
        this.setState({firstNameError: null, firstName: firstName});
    };


    validateLastName = () => {
        let lastNameError = false;
        this.setState({lastNameFocus: false});
        if ((this.state.lastName === null || this.state.lastName === '') && this.props.profile.lastName) {
            lastNameError = true;
        } else if (this.state.lastName && this.state.lastName !== '') {
            lastNameError = !NAME_REGEX.test(this.state.lastName.trim());

        }
        this.setState({lastNameError});
        return !lastNameError;
    };

    focusLastName = () => {
        this.setState({lastNameFocus: true});
    };

    onChangeLastNameText = (lastName) => {
        this.setState({lastNameError: null, lastName: lastName});
    };


    validateEmailAddress = () => {
        let emailAddressError = false;
        if ((this.state.emailAddress === null || this.state.emailAddress === '') && this.props.profile.emailAddress) {
            emailAddressError = true;
        } else if (this.state.emailAddress && this.state.emailAddress !== '') {
            emailAddressError = !EMAIL_REGEX.test(this.state.emailAddress);
        }
        this.setState({emailAddressError});
        return !emailAddressError;
    };

    focusEmailAddress = () => {
        this.setState({emailAddressFocus: true});
    };

    onChangeEmailText = (emailAddress) => {
        if (emailAddress === '') {
            this.setState({emailAddress: null});
        } else {
            this.setState({emailAddress: emailAddress.trim()});
        }
    };


    validatePhoneNumber = () => {
        let phoneNumberError = false;
        this.setState({phoneNumberFocus: false});
        if ((this.state.phoneNumber === null || this.state.phoneNumber === '') && this.props.profile.phoneNumber) {
            phoneNumberError = true;
        } else if (this.state.phoneNumber && this.state.phoneNumber !== '') {
            phoneNumberError = !PHONE_REGEX.test(this.state.phoneNumber.trim());

        }
        this.setState({phoneNumberError});
        return !phoneNumberError;
    };

    focusPhoneNumber = () => {
        this.setState({phoneNumberFocus: true});
    };

    onChangePhoneNumberText = (phoneNumber) => {
        if (/^\d+$/.test(phoneNumber) || phoneNumber === '') {
            this.setState({phoneNumberError: null, phoneNumber: phoneNumber});
        }
    };


    validateAddressOne = () => {
        let addressOneError = false;
        if ((this.state.addressOne === null || this.state.addressOne === '') && this.props.profile.address1) {
            addressOneError = true;
        }
        this.setState({addressOneError});
        return !addressOneError;
    };

    focusAddressOne = () => {
        this.setState({addressOneFocus: true});
    };

    onChangeAddressOneText = (addressOne) => {
        this.setState({addressOneError: null, addressOne: addressOne});
    };


    validateAddressTwo = () => {
        let addressTwoError = false;
        if ((this.state.addressTwo === null || this.state.addressTwo === '') && this.props.profile.address2) {
            addressTwoError = true;
        }
        this.setState({addressTwoError});
        return !addressTwoError;
    };

    focusAddressTwo = () => {
        this.setState({addressTwoFocus: true});
    };

    onChangeAddressTwoText = (addressTwo) => {
        this.setState({addressTwoError: null, addressTwo: addressTwo});
    };


    validateCity = () => {
        let cityError = false;
        this.setState({cityFocus: false});
        if ((this.state.city === null || this.state.city === '') && this.props.profile.city) {
            cityError = true;
        }
        this.setState({cityError});
        return !cityError;
    };

    focusCity = () => {
        this.setState({cityFocus: true});
    };

    onChangeCityText = (city) => {
        this.setState({cityError: null, city: city});
    };


    validateState = () => {
        let stateError = false;
        this.setState({stateFocus: false});
        if ((this.state.state === null || this.state.state === '') && this.props.profile.state) {
            stateError = true;
        }
        this.setState({stateError});
        return !stateError;
    };

    focusState = () => {
        this.setState({stateFocus: true});
    };

    onChangeStateText = (state) => {
        this.setState({stateError: null, state: state});
    };


    validateZipCode = () => {
        let zipCodeError = false;
        this.setState({zipCodeFocus: false});
        if ((this.state.zipCode === null || this.state.zipCode === '') && this.props.profile.zipCode) {
            zipCodeError = true;
        }
        this.setState({zipCodeError});
        return !zipCodeError;
    };

    focusZipCode = () => {
        this.setState({fullNameFocus: true});
    };

    onChangeZipCodeText = (zipCode) => {
        this.setState({zipCodeError: null, zipCode: zipCode});
    };


    validateEmergencyContact = () => {
        let emergencyContactError = false;
        this.setState({emergencyContactFocus: false});
        if ((this.state.emergencyContact === null || this.state.emergencyContact === '') && this.props.profile.emergencyContact) {
            emergencyContactError = true;
        } else if (this.state.emergencyContact && this.state.emergencyContact !== '') {
            emergencyContactError = !NAME_REGEX.test(this.state.emergencyContact.trim());
        }
        this.setState({emergencyContactError});
        return !emergencyContactError;
    };

    focusEmergencyContact = () => {
        this.setState({emergencyContactFocus: true});
    };

    onChangeEmergencyContactText = (emergencyContact) => {
        this.setState({emergencyContactError: null, emergencyContact: emergencyContact});
    };


    validateEmergencyPhone = () => {
        let emergencyPhoneError = false;
        this.setState({emergencyPhoneFocus: false});
        if ((this.state.emergencyPhone === null || this.state.emergencyPhone === '') && this.props.profile.emergencyPhone) {
            emergencyPhoneError = true;
        } else if (this.state.emergencyPhone && this.state.emergencyPhone !== '') {
            emergencyPhoneError = !PHONE_REGEX.test(this.state.emergencyPhone.trim());
        }
        this.setState({emergencyPhoneError});
        return !emergencyPhoneError;
    };

    focusEmergencyPhone = () => {
        this.setState({emergencyPhoneFocus: true});
    };

    onChangeEmergencyPhoneText = (emergencyPhone) => {
        if (/^\d+$/.test(emergencyPhone) || emergencyPhone === '') {
            this.setState({emergencyPhoneError: null, emergencyPhone: emergencyPhone});
        }
    };


    validateBio = () => {
        let bioError = false;
        if (this.state.bio === null || this.state.bio === '') {
            bioError = true;
        }
        this.setState({bioError});
        return !bioError;
    };

    validateAge = () => {
        let ageError = false;
        if (this.state.age === null || this.state.age === '') {
            ageError = true;
        } else if (this.state.age && this.state.age !== '') {
            if (this.state.age < 13 || this.state.age > 113) {
                ageError = true;
            } else {
                ageError = !AGE_REGEX.test(this.state.age);
            }
        }

        this.setState({ageError});
        return !ageError;
    };

    isFormValid = () => {
        if (!this.validateFullName()) {
            if (this.props.userType === 'PATIENT') {
                AlertUtil.showErrorMessage(this.props.isProviderApp ? 'Invalid provider name' : 'Invalid nick name');
            } else {
                AlertUtil.showErrorMessage('Invalid full name');
            }
            return false;
        }

        if (!this.validateFirstName()) {
            AlertUtil.showErrorMessage('Invalid first name');
            return false;
        }

        if (!this.validateLastName()) {
            AlertUtil.showErrorMessage('Invalid last name');
            return false;
        }

        if (this.props.userType === 'PATIENT' && !this.state.dob) {
            AlertUtil.showErrorMessage('Please Enter Date of Birth');
            return false;
        }

        if (!this.validatePhoneNumber()) {
            AlertUtil.showErrorMessage('Invalid phone number');
            return false;
        }

        if (!this.validateAddressOne()) {
            AlertUtil.showErrorMessage('Invalid address 1');
            return false;
        }

        if (!this.validateAddressTwo()) {
            AlertUtil.showErrorMessage('Invalid address 2');
            return false;
        }

        if (!this.validateCity()) {
            AlertUtil.showErrorMessage('Invalid city');
            return false;
        }

        /*if (!this.validateState()) {
            AlertUtil.showErrorMessage('Invalid state');
            return false;
        }*/

        if (!this.validateZipCode()) {
            AlertUtil.showErrorMessage('Invalid zip code');
            return false;
        }

        if (!this.validateEmergencyContact()) {
            AlertUtil.showErrorMessage('Invalid emergency contact');
            return false;
        }

        if (!this.validateEmergencyPhone()) {
            AlertUtil.showErrorMessage('Invalid emergency phone');
            return false;
        }

        // if (this.props.userType === 'PATIENT' && !this.validateAge()) {
        //     AlertUtil.showErrorMessage('Invalid age limit');
        //     return false;
        // }

        if (this.props.userType === 'PRACTITIONER' && !this.validateBio()) {
            AlertUtil.showErrorMessage('Invalid bio');
            return false;
        }
        return true;
    };

    checkPermissions = () => {
        request(Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
            console.log(result);
            if (result === 'denied' || result === 'blocked') {
                AlertUtil.showErrorMessage("Permission denied, please allow Photo Library Permissions from your phone settings");
            } else {
                this.chooseFile();
            }
        })
    };

    chooseFile = async () => {
        let options = {
            title: 'Update Profile Picture',
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
                let imageSize = response.fileSize / 1000000;

                if (imageSize >= 10) {
                    AlertUtil.showErrorMessage('Uploaded file size is too large');
                } else {
                    this.setState({
                        imageUpdated: true,
                        profileImage: source,
                        fileData: {
                            uri: response.uri,
                            name: response.fileName ? response.fileName : 'confidant-health-image.jpeg',
                            type: response.type
                        }
                    });
                }

            }
        });
    };


    render() {
        const { S3_BUCKET_LINK } = this.props;
        if (this.props.isLoading) {
            <AlfieLoader/>
        }
        const profileImageUri = this.state.imageUpdated
            ? this.state.profileImage : this.state.profileImage
                ? S3_BUCKET_LINK + this.props.profile.profileImage : null;
        return (
            <Container style={{backgroundColor: Colors.colors.screenBG}}>
                <StatusBar
                    backgroundColor={Platform.OS === 'ios' ? null : "transparent"}
                    translucent
                    barStyle={'dark-content'}
                />
                <View style={styles.backButtonWrapper}>
                    <BackButton
                        {...addTestID('back')}
                        onPress={() => {
                            this.props.backClicked();
                        }}
                    />
                </View>
                <Content enableResetScrollToCoords={false}>
                    <View style={styles.headerWrapper}>
                        {!this.state.viewProfile
                            ? <TouchableOpacity onPress={this.checkPermissions}
                                                {...addTestID('profile-details')}
                            >
                                {profileImageUri ?
                                    <View style={{alignSelf: 'center'}}>
                                        <Image
                                            {...addTestID('profile-pic')}
                                            style={styles.avatarImage}
                                            source={{uri: profileImageUri}}/>
                                        <Icon style={{position: "absolute", alignSelf: "center", opacity: 0.8, top: 40}}
                                              name='pencil' size={33} color={Colors.colors.neutral50Icon}/>
                                    </View> :
                                    <View style={{
                                        ...styles.proBgMain,
                                        backgroundColor: this.props.profile.colorCode ? this.props.profile.colorCode : DEFAULT_AVATAR_COLOR
                                    }}><Text
                                        {...addTestID('full-name')}
                                        style={styles.proLetterMain}>{this.props.profile.fullName.charAt(0).toUpperCase()}</Text>
                                        <Icon style={{position: "absolute", alignSelf: "center", opacity: 0.8, top: 40}}
                                              name='pencil' size={33} color={Colors.colors.neutral50Icon}/></View>

                                }
                            </TouchableOpacity>
                            : profileImageUri ?
                                <Image
                                    {...addTestID('profile-image')}
                                    style={styles.avatarImage}
                                    source={
                                        {uri: profileImageUri}
                                    }/> :
                                <View style={{
                                    ...styles.proBgMain,
                                    backgroundColor: this.props.profile.colorCode ? this.props.profile.colorCode : DEFAULT_AVATAR_COLOR
                                }}><Text
                                    {...addTestID('full-name')}
                                    style={styles.proLetterMain}>{this.props.profile.fullName.charAt(0).toUpperCase()}</Text></View>

                        }

                        <Text style={styles.userFullName}>{this.props.profile.fullName}</Text>
                        {/*<Text style={styles.userRole}>User Role</Text>*/}
                    </View>
                    <View style={styles.formsty}>
                        <Form>
                            {this.props.userType === 'PATIENT' && (
                                <Text style={styles.sectionTitle}>{Personal_Info_Label}</Text>
                            )}

                            {this.props.userType === 'PATIENT' && (
                                <View style={styles.inputRow}>
                                    <View style={styles.inputRow}>
                                        <StackedInputField
                                            testId={'nick-name-input'}
                                            hasError={this.state.fullNameError}
                                            hasFocus={this.state.fullNameFocus}
                                            keyboardType={'default'}
                                            blur={this.validateFullName}
                                            focus={this.focusFullName}
                                            changeText={this.onChangeFullNameText}
                                            returnKeyType={'next'}
                                            value={this.state.fullName}
                                            labelErrorText={Nick_Name_Input_Error}
                                            labelText={Nick_Name_Input_Label}
                                            maxLength={32}
                                            inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                            inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                            editable={!this.state.viewProfile}
                                            clearText={()=>{this.clearText("fullName")}}
                                        />
                                    </View>
                                    <View style={styles.inputRow}>
                                        <StackedInputField
                                            testId={'first-name-input'}
                                            hasError={this.state.firstNameError}
                                            hasFocus={this.state.firstNameFocus}
                                            keyboardType={'default'}
                                            blur={this.validateFirstName}
                                            focus={this.focusFirstName}
                                            changeText={this.onChangeFirstNameText}
                                            returnKeyType={'next'}
                                            value={this.state.firstName}
                                            labelErrorText={First_Name_Input_Error}
                                            labelText={First_Name_Input_Label}
                                            maxLength={32}
                                            inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                            inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                            editable={!this.state.viewProfile}
                                            clearText={()=>{this.clearText("firstName")}}
                                        />
                                    </View>
                                    <View style={styles.inputRow}>
                                        <StackedInputField
                                            testId={'last-name-input'}
                                            hasError={this.state.lastNameError}
                                            hasFocus={this.state.lastNameFocus}
                                            keyboardType={'default'}
                                            blur={this.validateLastName}
                                            focus={this.focusLastName}
                                            changeText={this.onChangeLastNameText}
                                            returnKeyType={'next'}
                                            value={this.state.lastName}
                                            labelErrorText={Last_Name_Input_Error}
                                            labelText={Last_Name_Input_Label}
                                            maxLength={32}
                                            inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                            inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                            editable={!this.state.viewProfile}
                                            clearText={()=>{this.clearText("lastName")}}
                                        />
                                    </View>

                                    {this.props.userType === 'PATIENT' && (this.state.dob || !this.state.viewProfile) && (
                                        <View style={styles.inputWrapper}>
                                            <Item stackedLabel
                                                  style={styles.inputContainer}
                                                  error={this.state.dobError}
                                                  success={this.state.dobError === false}>
                                                <Label style={[styles.inputLabel, { marginBottom: -10, marginTop: 5}]}>Date of Birth</Label>
                                                <Input
                                                    {...addTestID('date-of-birth')}
                                                    style={[styles.inputField, { height: 25}]}
                                                    onFocus={() => {
                                                        this.openDatePicker()
                                                    }}
                                                    editable={!this.state.viewProfile}
                                                    placeholder={DOB_Label}
                                                    placeholderTextColor={Colors.colors.inputPlaceholder}
                                                    value={this.state.dob ? moment(this.state.dob).format("MMM D, YYYY") : ''}
                                                />
                                                {!this.state.viewProfile && (
                                                    <DatePicker
                                                        ref={(ref) => {
                                                            this.componentReference = ref;
                                                        }}
                                                        style={{width: 0, position: 'absolute'}}
                                                        date={this.state.dob}
                                                        mode="date"
                                                        placeholder="select date"
                                                        format="YYYY-MM-DD"
                                                        //minDate="2016-05-01"
                                                        maxDate={moment(this.state.currentDate).format("YYYY-MM-DD")}
                                                        confirmBtnText="Confirm"
                                                        cancelBtnText="Cancel"
                                                        customStyles={{
                                                            dateInput: {
                                                                height: 0,
                                                                width: 0,
                                                                borderWidth: 0
                                                            },
                                                            datePicker: {
                                                                justifyContent: 'center'
                                                            },
                                                        }}
                                                        onDateChange={(date) => {
                                                            this.setState({dob: date})
                                                        }}
                                                        showIcon={false}
                                                    />
                                                )}

                                                {
                                                    !this.state.viewProfile && (
                                                        <FeatherIcons style={styles.editIcon}
                                                                      color={Colors.colors.neutral50Icon}
                                                                      size={20}
                                                                      name='calendar'/>
                                                    )
                                                }

                                            </Item>
                                        </View>
                                    )}
                                </View>

                            )}

                            {this.props.userType === 'PATIENT' && (
                                <Text style={styles.sectionTitle}>{Contact_Info_Label}</Text>
                            )}

                            {this.props.userType === 'PATIENT' && this.state.emailAddress && (
                                <View style={styles.inputRow}>
                                    <StackedInputField
                                        testId={'email-address-input'}
                                        hasError={this.state.emailAddressError}
                                        hasFocus={this.state.emailAddressFocus}
                                        keyboardType={'default'}
                                        blur={this.validateEmailAddress}
                                        focus={this.focusEmailAddress}
                                        changeText={this.onChangeEmailText}
                                        returnKeyType={'next'}
                                        value={this.state.emailAddress}
                                        labelErrorText={Email_Input_Label}
                                        labelText={Email_Input_Label}
                                        inputIconType={!this.state.viewProfile ? 'Feather' : null}
                                        inputIconName={!this.state.viewProfile ? 'mail' : null}
                                        editable={false}
                                        clearText={()=>{this.clearText("emailAddress")}}
                                    />
                                </View>
                            )}

                            {this.props.userType === 'PATIENT' && (
                                <View style={styles.inputRow}>
                                    <StackedInputField
                                        testId={'phone-number-input'}
                                        hasError={this.state.phoneNumberError}
                                        hasFocus={this.state.phoneNumberFocus}
                                        keyboardType={'phone-pad'}
                                        blur={this.validatePhoneNumber}
                                        focus={this.focusPhoneNumber}
                                        changeText={this.onChangePhoneNumberText}
                                        returnKeyType={'next'}
                                        value={this.state.phoneNumber}
                                        labelErrorText={Phone_Input_Label}
                                        labelText={Phone_Input_Label}
                                        inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                        inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                        maxLength={11}
                                        editable={!this.state.viewProfile}
                                        clearText={()=>{this.clearText("phoneNumber")}}
                                    />
                                </View>
                            )}


                            {this.props.userType === 'PATIENT' && (
                                <View style={styles.inputRow}>
                                    <View style={styles.inputRow}>
                                        <StackedInputField
                                            testId={'address-1-input'}
                                            hasError={this.state.addressOneError}
                                            hasFocus={this.state.addressOneFocus}
                                            keyboardType={'default'}
                                            blur={this.validateAddressOne}
                                            focus={this.focusAddressOne}
                                            changeText={this.onChangeAddressOneText}
                                            returnKeyType={'next'}
                                            value={this.state.addressOne}
                                            labelErrorText={Address_One_Input_Error}
                                            labelText={Address_One_Input_Label}
                                            inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                            inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                            editable={!this.state.viewProfile}
                                            clearText={()=>{this.clearText("addressOne")}}
                                            multiline={true}
                                        />
                                    </View>
                                    <View style={styles.inputRow}>
                                        <StackedInputField
                                            testId={'address -2-input'}
                                            hasError={this.state.addressTwoError}
                                            hasFocus={this.state.addressTwoFocus}
                                            keyboardType={'default'}
                                            blur={this.validateAddressTwo}
                                            focus={this.focusAddressTwo}
                                            changeText={this.onChangeAddressTwoText}
                                            returnKeyType={'next'}
                                            value={this.state.addressTwo}
                                            labelErrorText={Address_Two_Input_Error}
                                            labelText={Address_Two_Input_Label}
                                            inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                            inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                            editable={!this.state.viewProfile}
                                            clearText={()=>{this.clearText("addressTwo")}}
                                            multiline={true}
                                        />
                                    </View>
                                    <View style={styles.inputRow}>
                                        <StackedInputField
                                            testId={'city-input'}
                                            hasError={this.state.cityError}
                                            hasFocus={this.state.cityFocus}
                                            keyboardType={'default'}
                                            blur={this.validateCity}
                                            focus={this.focusCity}
                                            changeText={this.onChangeCityText}
                                            returnKeyType={'next'}
                                            value={this.state.city}
                                            labelErrorText={City_Input_Error}
                                            labelText={City_Input_Label}
                                            maxLength={32}
                                            inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                            inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                            editable={!this.state.viewProfile}
                                            clearText={()=>{this.clearText("city")}}
                                        />
                                    </View>
                                    <View style={styles.inputRow}>
                                        {/*<Text>State</Text>*/}
                                        {
                                            this.state.viewProfile ?
                                                <StackedInputField
                                                    testId={'state-input'}
                                                    hasError={this.state.cityError}
                                                    hasFocus={this.state.cityFocus}
                                                    keyboardType={'default'}
                                                    blur={this.validateCity}
                                                    focus={this.focusCity}
                                                    changeText={this.onChangeCityText}
                                                    returnKeyType={'next'}
                                                    value={this.state.state}
                                                    labelErrorText={City_Input_Error}
                                                    labelText={State_Input_Label}
                                                    inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                                    inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                                    editable={!this.state.viewProfile}
                                                /> :
                                                <DropDownInputField
                                                    testId={'state-input'}
                                                    hasError={this.state.stateError}
                                                    hasFocus={this.state.stateFocus}
                                                    keyboardType={'default'}
                                                    onChange={this.onChangeStateText}
                                                    focus={this.focusState}
                                                    value={this.state.state}
                                                    labelErrorText={State_Input_Error}
                                                    labelText={State_Input_Label}
                                                    editable={!this.state.viewProfile}
                                                    options={DEFAULT_STATES_OPTIONS}
                                                    type={UPDATE_PROFILE_DROPDOWN_TYPES.state}
                                                    dropDownIconColor={Colors.colors.mainBlue}
                                                    style={styles.dropDownCustomStyle}
                                                />}
                                    </View>
                                    <View style={styles.inputRow}>
                                        <StackedInputField
                                            testId={'zipCode-input'}
                                            hasError={this.state.zipCodeError}
                                            hasFocus={this.state.zipCodeFocus}
                                            keyboardType={'default'}
                                            blur={this.validateZipCode}
                                            focus={this.focusZipCode}
                                            changeText={this.onChangeZipCodeText}
                                            returnKeyType={'next'}
                                            value={this.state.zipCode}
                                            maxLength={5}
                                            labelErrorText={ZipCode_Input_Error}
                                            labelText={ZipCode_Input_Label}
                                            inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                            inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                            editable={!this.state.viewProfile}
                                            clearText={()=>{this.clearText("zipCode")}}
                                        />
                                    </View>
                                    <Text style={styles.sectionTitle}>{Emergency_Info_Label}</Text>
                                    <View style={styles.inputRow}>
                                        <StackedInputField
                                            testId={'emergency-name-input'}
                                            hasError={this.state.emergencyContactError}
                                            hasFocus={this.state.emergencyContactFocus}
                                            keyboardType={'default'}
                                            blur={this.validateEmergencyContact}
                                            focus={this.focusEmergencyContact}
                                            changeText={this.onChangeEmergencyContactText}
                                            returnKeyType={'next'}
                                            value={this.state.emergencyContact}
                                            labelErrorText={Emergency_Name_Input_Error}
                                            labelText={Emergency_Name_Input_Label}
                                            maxLength={32}
                                            inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                            inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                            editable={!this.state.viewProfile}
                                            clearText={()=>{this.clearText("emergencyContact")}}
                                        />
                                    </View>
                                    <View style={styles.inputRow}>
                                        <StackedInputField
                                            testId={'emergency-phone-number-input'}
                                            hasError={this.state.emergencyPhoneError}
                                            hasFocus={this.state.emergencyPhoneFocus}
                                            keyboardType={'phone-pad'}
                                            blur={this.validateEmergencyPhone}
                                            focus={this.focusEmergencyPhone}
                                            changeText={this.onChangeEmergencyPhoneText}
                                            returnKeyType={'next'}
                                            value={this.state.emergencyPhone}
                                            labelErrorText={Emergency_Phone_Input_Error}
                                            labelText={Emergency_Phone_Input_Label}
                                            inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                            inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                            maxLength={11}
                                            editable={!this.state.viewProfile}
                                            clearText={()=>{this.clearText("emergencyPhone")}}
                                        />
                                    </View>
                                </View>
                            )}

                            {/*{this.props.userType === 'PATIENT' && (
                                <View style={styles.toggleRow}>
                                    <Text style={styles.faceIdText}>
                                        Login with Face ID
                                    </Text>
                                    <View>
                                        <ToggleSwitch
                                            testId={'setting-toggle'}
                                            switchOn={this.state.toggleValue}
                                            onPress={this.onToggle}
                                            backgroundColorOn={Colors.colors.mainBlue}
                                            backgroundColorOff={Colors.colors.neutral50Icon}
                                        />
                                    </View>
                                </View>
                            )}*/}

                            {this.props.userType === 'PRACTITIONER' && (
                                <View style={styles.inputRow}>
                                    <StackedInputField
                                        testId={'full-name-input'}
                                        hasError={this.state.fullNameError}
                                        hasFocus={this.state.fullNameFocus}
                                        keyboardType={'default'}
                                        blur={this.validateFullName}
                                        focus={this.focusFullName}
                                        changeText={this.onChangeFullNameText}
                                        returnKeyType={'next'}
                                        value={this.state.fullName}
                                        maxLength={32}
                                        labelErrorText={this.props.isProviderApp ? Provider_Name_Input_Error : Nick_Name_Input_Error}
                                        labelText={this.props.isProviderApp ? Provider_Name_Input_Label : Nick_Name_Input_Label}
                                        inputIconType={!this.state.viewProfile ? 'FontAwesome' : null}
                                        inputIconName={!this.state.viewProfile ? 'pencil' : null}
                                        editable={!this.state.viewProfile}
                                        clearText={()=>{this.clearText("fullName")}}
                                    />
                                </View>
                            )}

                            <View style={styles.inputRow}>
                                <View style={{...styles.inputWrapper, marginBottom: 0}}>
                                    {
                                        this.props.userType === 'PRACTITIONER' && (
                                            this.state.viewProfile ?
                                                <Item
                                                    {...addTestID('gender')}
                                                    stackedLabel style={styles.inputContainer}>
                                                    <Label style={styles.inputLabel}>Gender</Label>
                                                    <Text
                                                        style={styles.genderDisplay}>
                                                        {this.state.gender}
                                                    </Text>

                                                </Item> :

                                                <Item
                                                    {...addTestID('select-gender')}
                                                    stackedLabel style={styles.inputContainer}>
                                                    <Label style={styles.inputLabel}>Gender</Label>

                                                    <Picker
                                                        mode="dropdown"
                                                        style={Platform.OS === 'ios' ? null : styles.pickerStyle}
                                                        editable={!this.state.viewProfile}
                                                        placeholderStyle={{color: Colors.colors.highContrast}}
                                                        selectedValue={this.state.gender}
                                                        textStyle={{
                                                            color: Colors.colors.highContrast,
                                                            width: '100%',

                                                        }}
                                                        iosIcon={<Icon name='angle-down' style={styles.nextIcon} size={45}
                                                                       color="#B3BEC9"/>}
                                                        onValueChange={(value) => {
                                                            this.setState({gender: value})
                                                        }}
                                                    >
                                                        <Picker.Item label='Male' value="Male"/>
                                                        <Picker.Item label='Female' value="Female"/>
                                                        <Picker.Item label='Other' value="Other"/>
                                                    </Picker>
                                                </Item>
                                        )}
                                </View>
                            </View>

                            {this.props.userType === 'PRACTITIONER' && (
                                <View style={styles.inputRow}>
                                    <View style={{...styles.inputWrapper, marginBottom: 0}}>
                                        <Item stackedLabel style={{...styles.inputContainer, height: 80}}
                                              error={this.state.bioError || this.state.requiredFieldsError}
                                              success={this.state.bioError === false}>
                                            <Label style={styles.inputLabel}>Bio</Label>

                                            <TextInput
                                                {...addTestID('bio-input')}
                                                multiline={true} ref={field => {
                                                this.form.bioField = field;
                                            }}
                                                returnKeyType="next"
                                                value={this.state.bio}
                                                style={{...styles.inputField, width: '100%', paddingRight: 40}}
                                                onBlur={this.validateBio}
                                                onChangeText={(bio) => this.setState({bio})}
                                                editable={!this.state.viewProfile}/>

                                            {!this.state.viewProfile &&
                                                <FontAwesome style={styles.editIcon}
                                                             color={Colors.colors.neutral50Icon}
                                                             size={20}
                                                             name='pencil'/>
                                            }
                                        </Item>
                                    </View>
                                </View>
                            )}

                            {this.props.userType === 'PRACTITIONER' && (
                                <View style={styles.inputRow}>
                                    <View style={{...styles.inputWrapper, marginBottom: 0}}>
                                        <Item stackedLabel style={styles.inputContainer}>
                                            <Label style={styles.inputLabel}>Provider Code</Label>
                                            <TextInput
                                                {...addTestID('provider-code-input')}
                                                returnKeyType="next"
                                                editable={false}
                                                style={{...styles.inputField, width: '100%'}}
                                                value={this.state.providerCode}/>
                                        </Item>
                                    </View>
                                </View>
                            )}

                        </Form>
                    </View>
                </Content>
                <View style={styles.gradientWrapper}>
                    <PrimaryButton
                        testId="edit-profile"
                        onPress={this.updateProfile}
                        text={this.state.viewProfile ? 'Edit Profile' : (this.props.userType === 'PRACTITIONER' ? 'Update Profile' : "Save Changes")}/>
                </View>
            </Container>

        )
    }
}

const styles = StyleSheet.create({
    dropDownCustomStyle:{
        padding:50
    },
    userFullName: {
        marginTop: 12,
        marginBottom: 4,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.TextH4,
        color: Colors.colors.highContrast,
        textAlign: 'center',
        paddingHorizontal: 24
    },
    userRole: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.subTextS,
        color: Colors.colors.lowContrast,
        textAlign: 'center'
    },
    inputBox: {
        ...TextStyles.mediaTexts.inputText,
        ...TextStyles.mediaTexts.manropeRegular,
        color: Colors.colors.highContrast,
        height: 30,
        width:'90%'
    },
    backButtonWrapper: {
        position: 'relative',
        zIndex: 2,
        paddingTop: isIphoneX() ? 50 : 44,
        paddingLeft: 22,
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    formsty: {
        paddingLeft: 24,
        paddingRight: 24,
        marginTop: 60
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    headerWrapper: {
        height: 180,
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
        paddingTop: 16,
        position: "relative"
    },
    avatarBtn: {
        alignSelf: 'center',
        width: 120,
        height: 120,
    },
    avatarImage: {
        width: 112,
        height: 112,
        borderRadius: 60,
        borderColor: Colors.colors.mainBlue,
        borderWidth: 1,
        alignSelf: 'center'
    },
    proBgMain: {
        width: 112,
        height: 112,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proLetterMain: {
        ...TextStyles.mediaTexts.manropeExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.white,
        textTransform: 'uppercase'
    },
    inputWrapper: {
        width: '100%',
        backgroundColor: Colors.colors.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.colors.white,
        marginBottom: 16

    },
    inputRow: {
        marginBottom: 16
    },
    inputFields: {
        elevation: 0,
        borderBottomWidth: 0
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 20,
        // marginTop:20,
        borderBottomWidth: 0,
        marginLeft: 0,
        // width: '85%',
        height: 50,
    },
    pickerContainer: {
        position: 'relative',
        marginBottom: 10,
        borderColor: '#ECEBEB',
        borderBottomWidth: 1,
        // width: '85%',
    },
    inputLabel: {
        ...TextStyles.mediaTexts.manropeBold,
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.inputLabel,
        paddingLeft: 16,
        opacity: 0.8
    },

    inputField: {
        ...TextStyles.mediaTexts.inputText,
        ...TextStyles.mediaTexts.manropeRegular,
        color: Colors.colors.highContrast,
        paddingLeft: 16,
        // height: 70,
        // borderBottomWidth: 0,
        // marginBottom:10,
    },
    inputFieldNonEditable: {
        ...TextStyles.mediaTexts.inputText,
        ...TextStyles.mediaTexts.manropeRegular,
        color: Colors.colors.highContrast,
        height: 40,
        paddingLeft: 16,
        borderBottomWidth: 0,
        marginBottom:10,
    },
    genderDisplay: {
        ...TextStyles.mediaTexts.inputText,
        ...TextStyles.mediaTexts.manropeRegular,
        color: Colors.colors.highContrast,
        alignSelf: 'flex-start',
        marginTop: 10,
        marginLeft: 16
    },
    editIcon: {
        position: 'absolute',
        right: 16,
        bottom: 20,
    },
    nextIcon: {
        position: 'absolute',
        right: 18,
        bottom: 10,
        backgroundColor: '#fff'
    },
    pickerStyle: {
        // color: '#4EACFE',
        borderBottomColor: '#ECEBEB',
        borderBottomWidth: 0,
        width: '95%',
        marginLeft: Platform.OS === 'ios' ? -15 : 2,
    },
    toggleWrapper: {
        position: 'relative',
        marginLeft: 15
    },
    statusToggle: {
        position: 'absolute',
        right: 20,
        bottom: 5,
        height: 50,
    },
    gradientWrapper: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX() ? 34 : 24
    },
    updateButton: {
        width: 250,
        height: 50,
        marginTop: 10,
        borderRadius: 3,
        backgroundColor: '#4EACFE',
    },
    clearBg: {
        textAlign: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
        fontWeight: '600',
        textAlign: 'center',
        width: '100%',
        color: '#ffffff',
    },
    sectionTitle: {
        marginTop: 16,
        marginBottom: 16,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.TextH4,
        color: Colors.colors.highContrast
    },
    toggleRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        marginBottom: 60
    },

    faceIdText: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.highContrast
    },
    inputContainerNonEditable:{
        marginTop:30
    }
});

