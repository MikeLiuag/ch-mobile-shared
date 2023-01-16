import React, {Component} from 'react';
import {StatusBar, StyleSheet, Text, View, Image} from "react-native";
import {Body, Button, Container, Content, Header, Icon, Input, Item, Label, Left, Right, Title} from "native-base";
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {addTestID, isIphoneX,AlertUtil, getHeaderHeight} from "../../utilities";
import {DEFAULT_IMAGE, HEADER_NORMAL, HEADER_X, DEFAULT_AVATAR_COLOR} from "../../constants";
import {ContentLoader} from "../ContentLoader";
import GradientButton from "../GradientButton";

const HEADER_SIZE = getHeaderHeight();

export class ProviderSearchComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSearching: false,
            code: "",
            hasError: false,
            searchFocus: false
        };
        this.searchField = null;
    }

    render(): React.ReactNode {
        const { S3_BUCKET_LINK } = this.props;
        return (
            <Container style={styles.container}>
                <Header noShadow style={styles.providerHeader}>
                    <StatusBar backgroundColor='transparent'
                               barStyle='dark-content'
                               translucent animated showHideTransition="slide"/>
                    <Left style={{alignSelf: 'flex-end'}}>
                        <Button
                            {...addTestID('back')}
                            style={{width: 45, marginLeft: 5}} onPress={this.props.goBack} transparent>
                            <AwesomeIcon name="angle-left" size={32} color="#3fb2fe"/>
                        </Button>
                    </Left>
                    <Body style={{alignSelf: 'flex-end', flex: 3}}>
                        <Title style={styles.headerText}>Add Provider By Code</Title>
                    </Body>
                    <Right style={{alignSelf: 'flex-end'}}/>
                </Header>
                <Content style={styles.content}>
                    <Item
                        floatingLabel
                        style={this.state.searchFocus ? [styles.searchField, {borderColor: '#3fb2fe'}] : styles.searchField}
                        error={this.state.hasError > 0}
                        disabled={this.props.isLoading}>
                        <Label
                            style={this.state.hasError ? [styles.inputLabel, {color: '#f78795'}] : styles.inputLabel}>Provider
                            Code</Label>
                        <Input
                            {...addTestID('search-input')}
                            style={styles.inputBox}
                            autoFocus={true}
                            ref={(field) => {
                                this.searchField = field;
                            }}

                            value={this.state.code}
                            onSubmitEditing={() => {
                                this.searchProvider();
                            }}
                            returnKeyType="search"
                            onChangeText={code => {
                                this.setState({code: code.trim()});
                            }}
                            onFocus={() => {
                                this.setState({searchFocus: true});
                            }}
                            onBlur={() => {
                                this.setState({searchFocus: false});
                            }}
                        />
                        {this.state.code !== "" && (
                            <Icon active
                                  onPress={() => {
                                      this.resetSearch();
                                  }}
                                  type="AntDesign" name='closecircleo'
                                  style={styles.searchIcon}/>
                        )}

                    </Item>
                    {this.props.isLoading && (
                        <View
                            style={{marginLeft: -25, overflow: 'hidden'}}
                        >
                            <ContentLoader type={'provider-search-card'}/>
                        </View>
                    )}
                    {this.props.notFound && (
                        <View style={styles.notFoundCard}>
                            <AwesomeIcon style={styles.notFoundIcon} name="frown-o" size={40} color="#f78795"/>
                            <Text style={styles.notFoundMainText}>No results for your search</Text>
                            <Text style={styles.notFoundSecText}>Please try again and make sure
                                the code is correct.</Text>
                        </View>
                    )}
                    {
                        !this.props.isLoading && !this.props.notFound && this.props.provider && (
                            <View style={styles.foundWrapper}>
                                <View style={styles.top}>
                                    {this.props.provider.profileImage?
                                        <Image
                                            {...addTestID('provider-profile-image')}
                                            style={styles.proImage}
                                            source={{uri: this.props.provider.profileImage ? this.props.provider.profileImage : S3_BUCKET_LINK + DEFAULT_IMAGE}}
                                        />
                                        :
                                        <View style={{
                                            ...styles.proBgMain,
                                            backgroundColor: this.props.provider.colorCode?this.props.provider.colorCode:DEFAULT_AVATAR_COLOR
                                        }}><Text
                                            style={styles.proLetterMain}>{this.props.provider.fullName.charAt(0).toUpperCase()}</Text></View>
                                    }
                                    <View style={{flex: 1}}>
                                        <Text style={styles.providerName}>{this.props.provider.fullName}</Text>
                                        <Text style={styles.specialty}>{this.props.provider.designation ? this.props.provider.designation : "Therapist"}</Text>
                                    </View>
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    {!this.props.isSelf && (
                                        <GradientButton
                                            testId = "connection"
                                            disabled={this.props.isRequested}
                                            onPress={() => {
                                                if (!this.props.isRequested) {
                                                    this.props.connect(!this.props.isConnected);
                                                }
                                            }}
                                            text={this.props.isConnected ? "GO TO CHAT" : this.props.isRequested ? "Connection Requested" : "Get Connected"}
                                        />
                                    )}

                                    <Button
                                        {...addTestID('see-profile')}
                                        transparent
                                            style={styles.seeProfileBtn}
                                            onPress={() => {
                                                this.props.openProfile();
                                            }}>
                                        <Text style={styles.seeProfileText}>SEE PROFILE</Text>
                                    </Button>
                                </View>
                            </View>
                        )
                    }
                </Content>
            </Container>
        )
    }

    searchProvider = async () => {
        if (this.state.code.length !== 6) {
            AlertUtil.showErrorMessage('Code must be 6 characters long');
            this.setState({hasError: true});
            this.props.hasError();
            return;
        }
        this.setState({hasError: false});
        this.props.searchProvider(this.state.code);
    };

    resetSearch = () => {
        this.setState({
            code: '',
            notFound: false,
            hasError: ''
        });
        if (this.searchField && this.searchField._root) {
            this.searchField._root.focus();
        }
        this.props.resetSearch();
    };
}

const styles = StyleSheet.create({
    foundWrapper: {
        marginTop: 20,
        alignSelf: 'center',
        width: '100%',
        padding: 24,
        backgroundColor: '#efefef',
        borderRadius: 9,
        borderWidth: 0.5,
        borderColor: '#eee',
        shadowColor: '#eee',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.01,
        elevation: 1
    },
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20
    },
    proImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 15
    },
    proBgMain:{
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 15,
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
    providerName: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        fontSize: 15,
        marginBottom: 4,
        width: 'auto',
        paddingRight: 10
    },
    specialty: {
        color: '#646c73',
        fontFamily: 'Roboto-Regular',
        fontWeight: '300',
        fontSize: 15,
        width: '90%'
    },
    seeProfileBtn: {
        width: '100%',
        borderRadius: 6,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#3fb2fe',
        justifyContent: 'center'
    },
    seeProfileText: {
        color: '#3fb2fe',
        fontFamily: 'Roboto-Bold',
        fontSize: 13,
        letterSpacing: 0.7,
        lineHeight: 19.5
    },
    container: {
        flex: 1,
        flexDirection: "column"
    },
    providerHeader: {
        backgroundColor: "#fff",
        marginBottom: 0,
        elevation: 0,
        height: HEADER_SIZE
    },
    headerText: {
        color: "#30344D",
        fontFamily: "Roboto-Regular",
        fontWeight: "600",
        fontSize: 20,
        marginBottom: 8,
        alignSelf: 'center'
    },
    content: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20
    },
    searchField: {
        fontFamily: 'Roboto-Regular',
        color: '#30344D',
        marginBottom: 5,
        elevation: 0,
        borderBottomWidth: 1
    },
    inputLabel: {
        fontFamily: 'Roboto-Regular',
        color: '#b3bec9',
        fontSize: 15,
        lineHeight: 16,
        paddingLeft: 0,
        top: 0,
        paddingTop: 15
    },
    inputBox: {
        color: '#515d7d',
        height: 63,
        fontSize: 15,
        paddingLeft: 0
    },
    searchIcon: {
        top: 2,
        color: '#b3bec9',
        paddingRight: 0,
        fontSize: 24
    },
    notFoundCard: {
        marginTop: 20,
        alignSelf: 'center',
        width: '100%',
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 9,
        borderWidth: 0.5,
        borderColor: '#eee',
        shadowColor: '#eee',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.01,
        elevation: 1
    },
    notFoundIcon: {
        alignSelf: 'center',
        margin: 25
    },
    notFoundMainText: {
        alignSelf: 'center',
        fontSize: 14,
        fontFamily: "Roboto-Bold",
        color: '#515d7d',
        textTransform: 'uppercase',
        lineHeight: 21,
        marginBottom: 8,
        textAlign: 'center'
    },
    notFoundSecText: {
        alignSelf: 'center',
        fontSize: 15,
        lineHeight: 22,
        color: '#646c73',
        fontFamily: "Roboto-Regular",
        textAlign: 'center'
    }
});
