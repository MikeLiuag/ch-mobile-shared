import React from 'react';
import {ActivityIndicator,Dimensions, StyleSheet, Text, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {HEADER_NORMAL, HEADER_X} from '../../constants';
import {isIphoneX} from "../../utilities";
const {width} = Dimensions.get('window');
export const NetworkContext = React.createContext({isConnected: true});

export class NetworkProvider extends React.PureComponent {


    constructor(props) {
        super(props);
        this.unsubscribe = null;
        this.state = {
            isConnected: true,
        };
    }

    componentDidMount() {
        NetInfo.fetch().then(state => {
            console.log('Initial Fetch: Connection type', state.type);
            console.log('Initial Fetch: Is connected?', state.isConnected);
            console.log('State Change: Has internet?', state.isInternetReachable);
            this.handleConnectivityChange(state.isConnected && (state.isInternetReachable === null ? true : state.isInternetReachable));
        });
        this.unsubscribe = NetInfo.addEventListener(state => {
            console.log('State Change: Connection type', state.type);
            console.log('State Change: Is connected?', state.isConnected);
            console.log('State Change: Has internet?', state.isInternetReachable);
            this.handleConnectivityChange(state.isConnected && (state.isInternetReachable === null ? true : state.isInternetReachable));
        });
    }


    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }

    handleConnectivityChange = isConnected => {
        this.setState({isConnected});
        this.props.updateNetworkStatus({
            isConnected
        })
    };

    renderSendbirdConnectivity = ()=>{
        if(this.props.nav && this.props.nav._navigator) {
            const currentNavParams = this.props.nav.getCurrentRouteParams();
            if (currentNavParams.routeName === 'chatInstance') {
                return null;
            }
        }
        if(this.props.auth.meta && this.props.auth.meta.userId) {
            if(this.props.chat.sendbirdStatus===0) {
                return (
                    <View style={styles.offlineContainer}>
                        <Text style={styles.offlineText}>Chat Service disconnected</Text>
                    </View>
                )
            } else if(this.props.chat.sendbirdStatus===3) {
                return (
                    <View style={styles.chatReconnectingContainer}>
                        <Text style={styles.offlineText}>Reconnecting Chat Service</Text>
                        <ActivityIndicator color={'white'} style={{marginStart: 5}}/>
                    </View>
                )
            }
        }
        return null;
    };

    render() {
        return (

            <NetworkContext.Provider value={this.state}>

                {this.props.children}
                {!this.state.isConnected ?
                    <View style={styles.offlineContainer}>
                        <Text style={styles.offlineText}>No Internet Connection</Text>
                    </View>
                    : !this.props.auth.socketConnected ?
                        <View style={styles.socketDisconnectedContainer}>
                            <Text style={styles.offlineText}>Trying to reconnect</Text>
                            <ActivityIndicator color={'white'} style={{marginStart: 5}}/>
                        </View>
                        : this.renderSendbirdConnectivity()}
            </NetworkContext.Provider>
        );
    }
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        position: 'absolute',
        top: isIphoneX() ? HEADER_X : HEADER_NORMAL,
    },
    chatReconnectingContainer: {
        backgroundColor: '#ec7421',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        position: 'absolute',
        top: isIphoneX() ? HEADER_X : HEADER_NORMAL,
    },
    socketDisconnectedContainer: {
        backgroundColor: '#ee978c',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
        position: 'absolute',
        top: isIphoneX() ? HEADER_X : HEADER_NORMAL,
    },
    offlineText: {color: '#fff'},
});
