import React, { Component } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { View, Button, Text, Picker, Icon } from "native-base";
import LinearGradient from "react-native-linear-gradient";
import GradientButton from "./GradientButton";
import {addTestID} from "../utilities";

export default class CustomChatView extends Component<Props> {
  constructor(props) {
    super(props);
    this.scrollView = null;
    this.state = {
      selected: undefined,
      contentType:
        this.props.message &&
        this.props.message.attachments &&
        this.props.message.attachments.length &&
        this.props.message.attachments[0].contentType,
      selectedChoices: [],
      dropdowns: {
        "0": "",
        "1": ""
      }
    };
  }

  onChoiceToggle = choice => {
    if (this.state.selectedChoices.indexOf(choice) < 0) {
      this.setState({
        ...this.state,
        selectedChoices: [...this.state.selectedChoices, choice]
      });
    } else {
      this.setState({
        ...this.state,
        selectedChoices: this.state.selectedChoices.filter(value => value !== choice)
      });
    }
  };

  onValueChange = (value, index) => {
    const state = this.state;
    state.dropdowns[index] = value;
    this.setState(state);
  };

  onMultiSelectPressed = () => {
    return Object.values(this.state.dropdowns).join(", ");
  };

  render = () => {
    const contentType =
      this.props.message &&
      this.props.message.attachments &&
      this.props.message.attachments.length &&
      this.props.message.attachments[0].contentType;

    switch (contentType) {
      case "single-select": {
        const choices = this.props.message.attachments[0].content.choices;
        const decoratedChoices = choices.map((choice, key) => (
          <Button
            transparent
            onPress={() => {
              this.props.onSend([{ text: choice, type: "message" }]);
            }}
            key={key}
            style={styles.singleSelectBtn}
          >
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              colors={["#4FACFE", "#34b6fe", "#00C8FE"]}
              style={styles.buttonBG}
            >
              <Text style={styles.buttonText}>{choice}</Text>
            </LinearGradient>
          </Button>
        ));
        return (
            <ScrollView style={[styles.optionContainer, { paddingRight: 10, marginBottom: 10}]}
                        nestedScrollEnabled>
            <View style={{ alignSelf: 'flex-end'}}>{decoratedChoices}</View>
          </ScrollView>
        );
      }
      case "multi-select": {
        const choices = this.props.message.attachments[0].content.choices;
        const decoratedChoices = choices.map((choice, key) => (


            <Button
            transparent
            onPress={() => {
              this.onChoiceToggle(choice);
            }}
            key={key}
            style={
              this.state.selectedChoices.indexOf(choice) > -1
                ? styles.multiSelectBtn
                : styles.notSelected
            }
          >
            <LinearGradient
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              colors={
                this.state.selectedChoices.indexOf(choice) > -1
                  ? ["#4FACFE", "#34b6fe", "#00C8FE"]
                  : ["transparent", "transparent", "transparent"]
              }
              style={styles.buttonBGMulti}
            >
              <Text
                style={
                  this.state.selectedChoices.indexOf(choice) > -1
                    ? styles.whiteText
                    : styles.multiText
                }
              >
                {choice}
              </Text>
            </LinearGradient>
          </Button>
        ));
        return (
          <View style={{ paddingRight: 10 }}>
            <ScrollView style={styles.optionContainer}
                        nestedScrollEnabled >
              <View style={{ marginBottom: 10, alignSelf: 'flex-end'}}>
                {decoratedChoices}
              </View>
            </ScrollView>
            <Button
                {...addTestID('cancel-all')}
                transparent
                style={styles.clearBtn}
                onPress={() => {
                  this.props.onSend([
                    {
                      text: this.props.message.attachments[0].content.cancelAll,
                      type: "message"
                    }
                  ]);
                  this.setState({selectedChoices: []});
                }}
            >
              <Text uppercase={false} style={styles.clearBtnText}>{this.props.message.attachments[0].content.cancelAll}</Text>
            </Button>
            {this.state.selectedChoices.length > 0 ? (
                <Button
                    {...addTestID('submit')}
                    full
                    style={styles.submitBtn}
                    onPress={() => {
                      this.props.onSend([
                        {
                          text: this.state.selectedChoices.join(", "),
                          type: "message"
                        }
                      ]);
                      this.setState({selectedChoices: []});
                    }}
                >
                  <Text>Submit</Text>
                </Button>
            ) : null}
          </View>
        );
      }
      case "multi-dropdown": {
        let dropdowns = this.props.message.attachments[0].content.dropdowns.map(
          (dropdown, key) => {
            const pickerItems = dropdown.values.map((value, key) => {
              return (
                <Picker.Item
                  label={value}
                  value={key === 0 ? "" : value}
                  key={key}
                />
              );
            });

            return (
              <View style={styles.pickerBorder} key={key}>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  placeholder={dropdown.label}
                  textStyle={{ color: "#25345C" }}
                  itemTextStyle={{ color: "#25345C" }}
                  style={styles.singleDropdown}
                  selectedValue={this.state.dropdowns[key]}
                  onValueChange={value => this.onValueChange(value, key)}
                >
                  {pickerItems}
                </Picker>
              </View>
            );
          }
        );
        return (
          <View style={styles.dropWrapper}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownText} />
              <View style={styles.twinDropdowns}>{dropdowns}</View>

              <GradientButton
                testId = "submit"
                disabled={
                  this.state.dropdowns[0] === "" ||
                  this.state.dropdowns[1] === ""
                }
                style={styles.dropdrownSubmit}
                text="Submit"
                onPress={() => {
                  this.props.onSend([
                    { text: this.onMultiSelectPressed(), type: "message" }
                  ]);
                  this.setState({
                    ...this.state,
                    dropdowns: {
                      "0": "",
                      "1": ""
                    }
                  });
                }}
              />
            </View>
          </View>
        );
      }
      default: {
        return <View />;
      }
    }
  };
}

const styles = StyleSheet.create({
  optionContainer: {
    maxHeight: 300,
    marginTop: 10,
    paddingLeft: 10,
    flex: 0,
    flexShrink: 1,
    flexGrow: 0
  },
  singleSelectBtn: {
    paddingTop: 0,
    paddingBottom: 0,
    height: 'auto',
    marginBottom: 8,
    alignSelf: "flex-end"
  },
  multiSelectBtn: {
      borderColor: "transparent",
      borderWidth: 1.5,
      justifyContent: "center",
      paddingTop: 0,
      paddingBottom: 0,
      height: 'auto',
      marginBottom: 8,
      minWidth: 200,
      maxWidth: "85%",
  },
  notSelected: {
      borderColor: "#4FACFE",
      borderWidth: 1.5,
      justifyContent: "center",
      paddingTop: 0,
      paddingBottom: 0,
      height: 'auto',
      marginBottom: 8,
      minWidth: 200,
      maxWidth: "85%",
  },
  buttonBG: {
    borderRadius: 2,
    flex: 1,
    // height: 50,
    justifyContent: "center",
    minWidth: 130,
    maxWidth: "65%",
    paddingTop:12,
    paddingBottom:12,
  },
  buttonBGMulti: {
    borderRadius: 2,
    flex: 1,
    // height: 50,
    justifyContent: "center",
    // width: 200,
    paddingTop:12,
    paddingBottom:12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    paddingLeft: 20
  },
  multiText: {
    color: "#4FACFE",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    paddingLeft: 20
  },
  whiteText: {
    color: "#FFF",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    paddingLeft: 20
  },
  submitBtn: {
    backgroundColor: "#25345C",
    marginBottom: 15,
    alignSelf: 'flex-end',
    width: 200,
  },
  clearBtn: {
    textAlign: 'center',
    width: 200,
    alignSelf: 'flex-end',
    justifyContent: 'center'
  },
  clearBtnText: {
    color: "#4FACFE",
    textDecorationLine: 'underline',
    fontSize: 12
  },
  dropWrapper: {
    justifyContent: "flex-end",
    flexDirection: "row"
  },
  dropdownContainer: {
    maxWidth: "70%",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderColor: "rgba(63, 177, 254, 0.2)",
    borderWidth: 1,
    padding: 13,
    backgroundColor: "#fff",
    marginRight: 15,
    marginBottom: 15,
    flexDirection: "column",
    alignItems: "center"
  },
  dropdownText: {
    color: "#25345C",
    fontSize: 16,
    fontWeight: "300"
  },
  twinDropdowns: {
    width: "100%"
  },
  pickerBorder: {
    borderColor: "#E2E5ED",
    borderWidth: 1.5,
    borderRadius: 4,
    width: "100%",
    height: 50,
    justifyContent: "center",
    marginTop: 10
  },
  singleDropdown: {
     width: '100%'
  },
  dropdrownSubmit: {
    alignSelf: "center"
  }
});
