import React, {Component} from 'react';
import {StyleSheet, Text, View, Animated, Easing, Dimensions} from 'react-native';
import {Button, Icon, Input, Title} from 'native-base';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {Colors, TextStyles} from "../styles";
import {addTestID} from "../utilities";

export class SliderSearch extends Component<Props> {
  constructor(props) {
    super(props);
    const screenWidth = Math.round(Dimensions.get('window').width);

    this.state = {
      isSearching: false,
      searchQuery: '',
      listItems: this.props.options.listItems,
      screenWidth: screenWidth - 60,
      x: new Animated.Value(0),
    };
  }

  startSearch = () => {

    Animated.spring(this.state.x, {
      toValue: -this.state.screenWidth,
      speed: 40,
      bounciness: 0,
      restDisplacementThreshold: 1,
      restSpeedThreshold: 1,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    this.setState({
      searchQuery: '',
      isSearching: true,
    });
    this.props.propagate(this.props.options.listItems);
  };

  toggleSearching = () => {

    Animated.spring(this.state.x, {
      toValue: 0,
      speed: 40,
      bounciness: 0,
      restDisplacementThreshold: 1,
      restSpeedThreshold: 1,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    this.setState({
      searchQuery: '',
      isSearching: !this.state.isSearching,
    });

    this.props.propagate(this.props.options.listItems);


  };

  slide = () => {
    Animated.spring(this.state.x, {
      toValue: -this.state.screenWidth,
      speed: 40,
      bounciness: 0,
      restDisplacementThreshold: 1,
      restSpeedThreshold: 1,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  render() {
    return (
        <View style={styles.slideSearch}>
          <View style={styles.leftBox}>
            {this.state.isSearching ? (
                <Button transparent style={{width: 45}}></Button>
            ) : (
                this.props.options.showBack ?
                    <Button
                        {...addTestID('back')}
                        transparent
                        style={styles.backBtn}
                        onPress={() => {
                          this.props.options.backClicked();
                        }}>
                      {this.props.options.isDrawer ? null
                          //     (
                          //   <AntIcon name="setting" size={24} color="#3fb2fe" style={{ paddingLeft: 10}} />
                          // )
                          : (this.props.options.showFilter ?
                                  <AntIcon
                                      name="filter"
                                      size={28}
                                      color={Colors.colors.primaryIcon}
                                      style={Platform.OS === 'ios'? null : { paddingRight: 10}}
                                  /> :
                                  <Icon
                                      name="chevron-thin-left"
                                      type={'Entypo'}
                                      style={styles.backIcon}
                                  />
                          )}
                    </Button> : this.props.options.leftIcon ?
                    <Button transparent style={styles.leftButton} onPress={this.props.options.leftIconClicked}>
                      {this.props.options.leftIcon}
                    </Button> :

                    <Button transparent style={{width: 45}}></Button>


            )}
          </View>
          <View style={styles.centerBox}>
            {this.state.isSearching ? (
                <Input
                    {...addTestID('search-field')}
                    autoFocus={true}
                    placeholder={this.props.options.searchFieldPlaceholder}
                    value={this.state.searchQuery}
                    onChangeText={text => {
                      this.setState({searchQuery: text});
                      this.props.propagate(
                          this.props.options.filter(this.props.options.listItems, text),
                      );
                    }}
                    style={styles.searchField}
                />
            ) : (
                <Title style={this.props.options.stepperText ? styles.selectProTitle : styles.headerTitle}>
                  {this.props.options.screenTitle}
                </Title>
            )}
          </View>

          <View style={styles.rightBox}>
            {this.state.isSearching ? (
                <Button
                    {...addTestID('cancel-btn')}
                    transparent
                    style={[styles.searchBtn, {marginRight: -45}]}
                    onPress={this.toggleSearching}>
                  <Text {...addTestID('cancel-text')} style={styles.cancelBtn}>Cancel</Text>
                </Button>
            ) : null}

            <Animated.View
                style={[
                  {width: 50, height: 50},
                  {
                    transform: [
                      {
                        translateX: this.state.x,
                      },
                    ],
                  },
                ]}>
              {!this.props.hideSearchIcon && (
                  <Button
                      {...addTestID('search-btn')}
                      transparent
                      style={styles.searchBtn}
                      onPress={this.startSearch}>
                    <Icon
                        {...addTestID('search-icon')}
                        type={'AntDesign'}
                        name="search1"
                        style={styles.searchIcon}
                    />
                  </Button>
              )}

            </Animated.View>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  slideSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  leftBox: {},
  centerBox: {
    flex: 2,
  },
  rightBox: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },

  wrapper: {
    backgroundColor: '#fafbfd',
  },
  backBtn: {
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft: 4,
  },
  leftButton: {
    paddingLeft: 0,
    paddingRight: 0,
    marginLeft:-9
  },
  backIcon: {
    color: Colors.colors.primaryIcon,
    fontSize: 30,
    marginLeft: 0,
    // alignSelf: 'flex-start'
  },
  cancelBtn: {
    ...TextStyles.mediaTexts.manropeMedium,
    ...TextStyles.mediaTexts.captionText,
    color: Colors.colors.lowContrast
  },
  searchBtn: {
    paddingRight: 0,
  },
  searchIcon: {
    width: 25,
    marginRight: 0,
    color: Colors.colors.primaryIcon,
    fontSize: 26,
    marginTop: 8,
    // transform: [{rotateZ: '90deg'}],
  },
  headerTitle: {
    ...TextStyles.mediaTexts.manropeBold,
    ...TextStyles.mediaTexts.TextH5,
    color: Colors.colors.highContrast,
    paddingLeft: 0
  },
  selectProTitle: {
    color: '#969fa8',
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    lineHeight: 12,
    paddingLeft: 0
  },
  searchField: {
    width: '100%',
  },
});
