import {Dimensions, Platform} from 'react-native';
import {DEFAULT_IMAGE, VALID_IMAGE_TYPES, VALID_VIDEO_TYPES, HEADER_X, HEADER_NORMAL, HEADER_12} from '../constants';
import {check, PERMISSIONS,checkNotifications,requestNotifications} from 'react-native-permissions';
import moment from "moment";
import DeviceInfo from 'react-native-device-info';

let deviceId = DeviceInfo.getDeviceId();

export function isIphoneX() {
    const dim = Dimensions.get('window');

    return (
        // This has to be iOS
        Platform.OS === 'ios' &&
        // Check either, iPhone X, XR, 12 pro or 12 max
        (isIPhoneXSize(dim) || isIPhoneXrSize(dim) || isIPhone12ProSize(dim) || isIPhone12MaxSize(dim))
    );
}

export function isIphone12() {
    return (
        // This has to be iOS
        Platform.OS === 'ios' &&
        // Check either iPhone 12, mini, pro or 12 pro max
        (deviceId.includes('iPhone13'))
    );
}
export function isDarkMode() {
    let darkMode = false;
    return(darkMode)
}

export function getHeaderHeight() {
    const dim = Dimensions.get('window');
    let height = HEADER_NORMAL;
    if(isIphoneX()) {
        height = (isIPhone12ProSize(dim) || isIPhone12MaxSize(dim))? HEADER_12 : HEADER_X;
    }
    return height;
}

export function getTabMargin() {
    const dim = Dimensions.get('window');
    let margin = 0;
    if(isIphoneX()) {
        margin = (isIPhone12ProSize(dim) || isIPhone12MaxSize(dim))? 42 : 0;
    }
    return margin;
}


export function isIPhoneXSize(dim) {
    return dim.height === 812 || dim.width === 812;
}

export function isIPhoneXrSize(dim) {
    return dim.height === 896 || dim.width === 896;
}

export function isIPhone12MaxSize(dim) {
    return dim.height === 926 || dim.width === 926;
}

export function isIPhone12ProSize(dim) {
    return dim.height === 844 || dim.width === 844;
}

export const getAvatar = (connection, S3_BUCKET_LINK="") => {
    if (connection.profilePicture && connection.profilePicture.length > 0) {
        if (connection.profilePicture.includes('http')) {
            return connection.profilePicture;
        } else {
            return S3_BUCKET_LINK + connection.profilePicture;
        }
    } else {
        return S3_BUCKET_LINK + DEFAULT_IMAGE;
    }
};

export const checkImageUrl = (image)=>{

    if(image != null){
        const hasHttp = (image.includes('https') || image.includes('http'));
        return hasHttp;
    }

}

/** this needs to be committed */

export const defaultPageSize = 10;

export const isCloseToBottom = ({
                                    layoutMeasurement,
                                    contentOffset,
                                    contentSize,
                                }) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
};

export const isTelehealthConfigured = () => {
    return new Promise((resolve, reject) => {
        Promise.all([
            check(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA),
            check(Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO),
        ]).then(([cameraStatus, microphoneStatus]) => {
            resolve(cameraStatus === 'granted' && microphoneStatus === 'granted');
        });
    });
};

export const hasNotificationPermissions = ()=>{
    return checkNotifications();
};

export const requestNotificationPermissions = ()=>{
    return requestNotifications(['alert', 'sound', 'lockScreen', 'notificationCenter']);
};

export const getDurationText = (duration) => {
    const minText = ' min';
    const hourText = ' Hour';
    if (duration < 60) {
        return duration + minText;
    }
    const hour = parseInt(duration / 60);
    const min = duration % 60;
    let text = hour + hourText;
    if (min > 0) {
        text = text + ' ' + min + minText;
    }
    return text;
};

export const getTimeDifference = (utcTime)=>{
    const startMoment = moment(utcTime);
    const days = startMoment.diff(moment(), 'days');
    const hours = startMoment.diff(moment(), 'hours') - (days*24);
    const minutes = startMoment.diff(moment(), 'minutes') - (hours*60) - (days* 24*60);
    const seconds = startMoment.diff(moment(), 'seconds')  - (hours*60*60) - (minutes*60);
    return {days, hours, minutes, seconds};
};

export const isTimeElapsed = (utcTime)=>{
    const startMoment = moment(utcTime);
    return startMoment.diff(moment())<0;
};

export const isLate = (utcTime)=>{
    const startMoment = moment(utcTime);
    return startMoment.diff(moment(), 'minutes')<-1;
};

export const toRoman = (num)=> {
    if (typeof num !== 'number')
        return false;

    let digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
            "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
            "","I","II","III","IV","V","VI","VII","VIII","IX"],
        roman_num = "",
        i = 3;
    while (i--)
        roman_num = (key[+digits.pop() + (i * 10)] || "") + roman_num;
    return Array(+digits.join("") + 1).join("M") + roman_num;
};


export const getTimeFromMilitaryStamp = (stamp) => {
    const stringStamp = (stamp + "");
    let time, amPm, desc, hour, min;
    if (stringStamp.length === 1) {
        time = '12:0' + stringStamp;
        amPm = 'AM';
        desc = time + ' ' + amPm;
        hour = 0;
        min = stamp;
    } else if (stringStamp.length === 2) {
        time = '12:' + stringStamp;
        amPm = 'AM';
        desc = time + ' ' + amPm;
        hour = 0;
        min = stamp;
    } else if (stringStamp.length === 3) {
        hour = stringStamp.substr(0, 1);
        min = stringStamp.substr(1);
        amPm = 'AM';
        time= '0' + hour + ':' + min;
        desc = time + ' ' + amPm;
    } else {
        hour = stringStamp.substr(0, 2);
        min = stringStamp.substr(2);
        amPm = 'AM';
        if (parseInt(hour) >= 12) {
            if (hour > 12) {
                hour = parseInt(hour) - 12;
                if (hour < 10) {
                    hour = "0" + hour;
                }
            }
            amPm = 'PM';
            if(hour===12) {
                amPm= 'AM';
            }
        }
        time= hour + ':' + min;
        desc = hour + ':' + min + ' ' + amPm;
    }
    return {
        time, amPm, hour, min, desc
    };

};

export const compareDay=(day1, day2)=> {
    const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    return days.indexOf(day1.toUpperCase())-days.indexOf(day2.toUpperCase());
};

export const addTestID = (testId)=>{
    return {
        accessible: __DEV__,
        accessibilityLabel: __DEV__?testId:undefined
    }
};

export const isImage = (type) => {
    return VALID_IMAGE_TYPES.includes(type);
};

export const isVideo = (type) => {
    return VALID_VIDEO_TYPES.includes(type);
};

export const getNamesByLookupKey = (key, lookupMap) => {
    const lookupValues = lookupMap[key];
    if (!lookupValues) {
        return [];
    }
    return lookupValues.map(el => el.name);
}
export const getLookupPair = (lookupKey, enumKey, lookupMap)=>{
    const lookupValues = lookupMap[lookupKey];
    if (!lookupValues) {
        return [];
    }
    return lookupValues.find(el=>el.name===enumKey);
};
export const getValuesByLookupKey = (key, lookupMap) => {
    const lookupValues = lookupMap[key];
    if (!lookupValues) {
        return [];
    }
    return lookupValues.map(el => el.value);
}
export const isMissed = (appt) => {
    return moment(appt.endTime).diff(moment(), 'minutes') < 0;
};

export const getDateDesc = (_moment) => {
    const tz = moment.tz.guess(true);
    return _moment.tz(tz).format('dddd, DD MMM YYYY');
};

export const valueExists = (string) => {
    return string !== null && string !== undefined && string !== '' && !string.isEmpty;
};

export const arrayUniqueByKey = (array, key)=>{
    return [...new Map(array.map(item =>
        [item[key], item])).values()];
}

export const sortAppointments=(appointments)=>{
    return (appointments && appointments.sort((a, b) => moment(a.startTime).diff(moment(b.startTime)))) || [];
};

export const getDSTOffset=()=>{
    return (moment({M:1, d:1}).utcOffset())/60;
};

export const getTimeByDSTOffset=(time)=>{
    const dstOffset = getDSTOffset();
    return moment(time).utcOffset(dstOffset);
};
