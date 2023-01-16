import { Toast } from "native-base";

export class AlertUtil {
  static showSuccessMessage(
    message,
    dismissLabel = "Close",
    position = "top"
  ) {
    AlertUtil.showMessage(message, dismissLabel, position, "success");
  }

  static showErrorMessage(message, errorClearRoutine) {
    AlertUtil.showMessage(message, 'Close', 'top', "danger");
    if(errorClearRoutine) {
      errorClearRoutine();
    }

  }

  static showMessage(message, dismissLabel, position, type) {
    if (message instanceof Error) {
      message = message.message;
    }
    Toast.show({
      text: message.charAt(0).toUpperCase() + message.slice(1).toLowerCase(),
      buttonText: dismissLabel,
      position: position,
      type: type,
      duration: 5000
    });
  }
}
