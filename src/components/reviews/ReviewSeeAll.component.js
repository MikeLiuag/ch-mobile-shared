import React, {Component} from 'react';
import {ActivityIndicator, ScrollView, StatusBar, StyleSheet, Text, View, Platform} from 'react-native';
import {Body, Button, Container, Header, Left, Right} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../styles';
import {Rating} from 'react-native-elements';
import AlfieLoader from '../../components/Loader';
import moment from 'moment';
import {isCloseToBottom, addTestID, getHeaderHeight} from "../../utilities";

const HEADER_SIZE = getHeaderHeight();

export class ReviewSeeAllComponent extends Component<Props> {
  static navigationOptions = {
    header: null,
  };


  constructor(props) {
    super(props);

    this.state = {
      providerInfo: this.props.providerInfo,
      feedbackSummary : this.props.feedbackSummary
    };
  }

  renderReviews = () => {
    {
      return this.props.reviewDetails.map(function (item, i) {
                return (
                    <View key={'review-' + i} style={styles.recentReviews}>
                      <View style={styles.reviewBox}>
                        <View style={styles.singleReview}>
                          <View key={i} style={styles.reviewHead}>
                            <Rating
                                readonly
                                type="star"
                                showRating={false}
                                ratingCount={5}
                                imageSize={15}
                                selectedColor={Colors.colors.starRatingColor}
                                startingValue={item.rating ? item.rating : 0}
                                fractions={2}
                            />
                            <Text style={styles.reviewDate}>
                                {item.createdAt
                                    ? moment(item.createdAt).format('MMMM D, Y')
                                    : ''}
                            </Text>
                          </View>
                            {item.publicComment ? (
                                <Text style={styles.reviewDetail}>{item.publicComment}</Text>
                            ) : null}
                        </View>
                      </View>
                    </View>
                );
            });
    }
  };


  render() {
    const hasMoreReviews = this.props.feedbackSummary && this.props.feedbackSummary.totalReviews > 1;

    if(this.props.isLoading){
      return <AlfieLoader/>;
    }
    else {
        return (
            <Container>
              <Header style={styles.chatHeader}>
                <StatusBar
                    backgroundColor={Platform.OS === 'ios' ? null : "transparent"}
                    translucent
                    barStyle={'dark-content'}
                />
                <LinearGradient
                    start={{x: 0, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={['#fff', '#fff', '#fff']}
                    style={styles.headerBG}>
                  <View style={styles.headerContent}>
                    <Left>
                      <Button
                          {...addTestID('back')}
                          transparent
                          style={styles.backButton}
                          onPress={this.props.goBack}
                          text="GO BACK">
                        <AwesomeIcon name="angle-left" size={32} color="#4FACFE"/>
                      </Button>
                    </Left>
                    <Body style={{flex: 2}}>
                    <Text style={styles.headerText}>
                        {this.state.providerInfo.fullName} Review
                        {hasMoreReviews ? 's' : ''}
                    </Text>
                    </Body>
                    <Right/>
                  </View>
                </LinearGradient>
              </Header>
              <View>
                <View style={styles.ratingWrapper1}>
                  <View style={{flexDirection: 'row'}}>
                    <Rating
                        readonly
                        type="star"
                        showRating={false}
                        ratingCount={5}
                        imageSize={25}
                        selectedColor={Colors.colors.starRatingColor}
                        startingValue={
                            this.state.feedbackSummary
                                ? this.state.feedbackSummary.combinedRating
                                : 0
                        }
                        fractions={2}
                    />
                    <Text style={styles.totalReviewTextNum}>
                        {this.state.feedbackSummary
                            ? this.state.feedbackSummary.combinedRating
                            : 0}
                    </Text>
                  </View>

                  <Text style={styles.totalReviewText}>
                      {this.state.feedbackSummary
                          ? this.state.feedbackSummary.totalReviews
                          : 'No'}{' '}
                    review{hasMoreReviews ? 's' : ''}
                  </Text>
                </View>
              </View>

              <ScrollView
                  onScroll={({nativeEvent}) => {
                      if (
                          isCloseToBottom(nativeEvent) &&
                          this.props.hasMore &&
                          this.props.isLoadingMore !== true
                      ) {
                          this.props.getReviewDetails(true);
                      }
                  }}>
                <View style={styles.subtitleView}>
                  <Text style={styles.subTitleText}>
                    All reviews on this provider are captured after {'\n'}telehealth
                    sessions with Confidant users.
                  </Text>
                </View>
                  {this.renderReviews()}

                  {this.props.isLoadingMore !== null ? (
                      <View style={styles.loadMoreView}>
                        <Text style={styles.loadMoreText}>
                            {this.props.isLoadingMore ? 'Load More' : 'No more reviews'}
                        </Text>
                        <ActivityIndicator
                            style={styles.loadIcon}
                            animating={this.props.isLoadingMore}
                            size="small"
                            color={Colors.colors.lightText2}
                        />
                      </View>
                  ) : null}
              </ScrollView>
            </Container>
        );
    }
  }
}

const ratingCommon = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const commonText = {
  fontFamily: 'Roboto-Regular',
  fontWeight: 'normal',
  fontStyle: 'normal',
};
const styles = StyleSheet.create({
  loadIcon: {
    marginLeft: 5,
  },
  loadMoreView: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadMoreText: {
    color: Colors.colors.lightText2,
  },
  reviewBox: {
    marginBottom: 16,
  },
  reviewDate: {
    color: '#969fa8',
    fontSize: 13,
    fontFamily: 'Roboto-Regular',
  },
  reviewDetail: {
    color: '#646c73',
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
    lineHeight: 21,
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#f5f5f5',
  },
  recentReviews: {
    paddingLeft: 24,
    paddingRight: 24,
  },

  singleReview: {
    borderWidth: 1,
    borderColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#f5f5f5',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 8,
    shadowOpacity: 1.0,
    elevation: 0,
    backgroundColor: '#fff',
  },
  reviewHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5'
  },
  ratingWrapper1: {
    ...ratingCommon,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 24,
    paddingRight: 24,
    marginTop: 24,
  },
  headerText: {
    ...commonText,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.3,
    color: Colors.colors.darkBlue,
  },
  subTitleText: {
    ...commonText,
    fontSize: 14,
    lineHeight: 22,
    color: Colors.colors.lightText1,
    textAlign: 'center',
  },
  commentText: {
    ...commonText,
    fontSize: 14,
    lineHeight: 22,
    color: Colors.colors.lightText1
  },
  dateText: {
    ...commonText,
    fontSize: 13,
    lineHeight: 16,
    color: Colors.colors.lightText2,
  },
  totalReviewText: {
    ...commonText,
    fontSize: 13,
    lineHeight: 22,
    letterSpacing: 0.433333,
    color: Colors.colors.inputValue,
    fontWeight: '500'
  },

  totalReviewTextNum: {
    ...commonText,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 22,
    letterSpacing: 0.433333,
    color: Colors.colors.inputValue,
    fontWeight: '500'
  },
  subtitleView: {
    marginLeft: 19,
    marginRight: 29,
    marginBottom: 40,
    marginTop: 40,
    paddingLeft: 10,
    paddingRight: 10
  },
  commentView: {
    marginLeft: 40,
    marginRight: 40,
    paddingTop: 14,
    marginBottom: 34,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5'
  },
  chatHeader: {
    backgroundColor: 'white',
    height: HEADER_SIZE,
    paddingLeft: 0,
    paddingRight: 0,
    elevation: 0,
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 1
  },
  headerBG: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 5,
    // marginTop: isIphoneX() ? MARGIN_X : MARGIN_NORMAL,
  },
  headerContent: {
    flexDirection: 'row'
  },
  backButton: {
    marginLeft: 17,
    width: 30
  }
});
