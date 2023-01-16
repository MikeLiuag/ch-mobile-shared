import React, {Component} from 'react';
import {StyleSheet} from "react-native";
import { View } from "native-base";
import AntIcons from 'react-native-vector-icons/AntDesign';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modalbox';
import { Colors, CommonStyles } from "../../styles";
import {addTestID} from "../../utilities";
import {TransactionSingleActionItem} from  '../TransactionSingleActionItem';


export class AddConnectionsOverlay extends Component {

    constructor(props){
        super(props);
    }

    render(): React.ReactNode {
        return (
            <Modal
                backdropPressToClose={true}
                backdropColor={ Colors.colors.overlayBg}
                backdropOpacity={1}
                isOpen={this.props.modalVisible}
                onClosed={this.props.closeOverlay}
                style={{...CommonStyles.styles.commonModalWrapper, maxHeight: this.props.providerApp?'50%':'30%'}}
                entry={"bottom"}
                position={"bottom"} ref={"addConnectionDrawer"} swipeArea={100}>
                <View style={{...CommonStyles.styles.commonSwipeBar}}
                      {...addTestID('swipeBar')}
                />
                <View style={styles.filterActionList}>
                    <View style={styles.singleAction}>
                        <TransactionSingleActionItem
                            onPress={() => {
                                this.props.navigateToInvitation('MEMBER');
                            }}
                            title={'Invite member'}
                            iconBackground={Colors.colors.primaryColorBG}
                            renderIcon={(size, color) =>
                                <AntIcons size={22} color={Colors.colors.primaryIcon} name="plus"/>
                            }
                        />
                    </View>
                    {/*<View style={styles.singleAction}>
                        <TransactionSingleActionItem
                            onPress={() => {
                                this.props.navigateToInvitation('PROVIDER');
                            }}
                            title={'Invite provider'}
                            iconBackground={Colors.colors.secondaryColorBG}
                            renderIcon={(size, color) =>
                                <AntIcons size={22} color={Colors.colors.secondaryIcon} name="plus"/>
                            }
                        />
                    </View>*/}
                    {/*<View style={styles.singleAction}>
                        <TransactionSingleActionItem
                            onPress={this.props.showProviderSearch}
                            title={'Add provider by code'}
                            iconBackground={Colors.colors.warningBG}
                            renderIcon={(size, color) =>
                                <FeatherIcons size={22} color={Colors.colors.warningIcon} name="user-plus"/>
                            }
                        />
                    </View>*/}
                    { this.props.providerApp && (
                        <View style={styles.singleAction}>
                            <TransactionSingleActionItem
                                onPress={this.props.createGroup}
                                title={'Create group'}
                                iconBackground={Colors.colors.successBG}
                                // styles={styles.gButton}
                                renderIcon={(size, color) =>
                                    <AntIcons size={22} color={Colors.colors.successIcon} name="addusergroup"/>
                                }
                            />
                        </View>
                    )}

                    {/*<View style={styles.singleAction}>*/}
                    {/*    <TransactionSingleActionItem*/}
                    {/*        title={'Browse support groups'}*/}
                    {/*        iconBackground={Colors.colors.errorBG}*/}
                    {/*        renderIcon={(size, color) =>*/}
                    {/*            <FeatherIcons size={22} color={Colors.colors.errorIcon} name="users"/>*/}
                    {/*        }*/}
                    {/*    />*/}
                    {/*</View>*/}
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    filterActionList: {

    },
    singleAction: {
        marginBottom: 16
    }
});
