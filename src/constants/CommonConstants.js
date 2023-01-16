/*==================Code For Production Specific Credentials====================*/
import Config from "react-native-config";
// import RemoteConfig from './../../../../configurations.json';

// export const extractDynamicConfigurations = (remoteConfig) => {
//     if (remoteConfig) {
//         let propertySources = remoteConfig.propertySources;
//         if (propertySources && propertySources.length > 0) {
//             const appConfigSource = propertySources.find(propSource => propSource.name &&
//                 (propSource.name.includes('confidant-health-mobile') || propSource.name.includes('confidant-health-provider')));
//             if (appConfigSource) {
//                 return appConfigSource.source;
//             }
//         }
//     }
//     return null;
// }
// let applicationConfig = extractDynamicConfigurations(RemoteConfig);
// if (!applicationConfig) {
//     throw new Error("Unable to find dynamic environment configurations. Please check that the environment specific build scripts you used didn't throw any error. i.e. ./build-latest-dev.sh");
// }

// console.log('================CH-SHARED working environment===============');
// console.log(Config.REACT_APP_ENVIRONMENT);


// export const S3_BUCKET_LINK = applicationConfig['s3.bucket.url'];
// export const CONTENTFUL_SPACE_ID = applicationConfig['contentful.spaceId'];
// export const CONTENTFUL_ACCESS_TOKEN = applicationConfig['contentful.accessToken'];
export const APP_ENVIRONMENT = Config.REACT_APP_ENVIRONMENT;
export const SHOW_APP_META = APP_ENVIRONMENT !== 'production' && APP_ENVIRONMENT !== 'prod';
/*=======================================Code ENDS==========================================*/


export const CHATBOT_DEFAULT_AVATAR = 'https://i.imgur.com/Tgbdv8K.png';
export const EMAIL_REGEX = /^[\_a-zA-Z0-9]{1,64}([\.\_a-zA-Z0-9]{0,63})@[a-zA-Z0-9-]{1,64}(\.[a-zA-Z0-9-])*(\.[a-zA-Z]{2,4})?(\.[a-zA-Z]{2,4})$/;

export const PHONE_REGEX = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;

export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d.!@#$%^&*()_+-=<>]{8,}$/;

export const NAME_REGEX = /^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/;
export const AGE_REGEX = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|1[01][0-3])$/;
export const AUTH_TOKEN_KEY = 'authorizationToken';
export const AUTH_TOKEN_EXPIRATION_KEY = 'authorizationTokenExpiration';
export const CONTINUE_SUBTITLE = "With Confidant Telehealth you’re able" + '\n' + "to have HIPAA compliant video chat " + '\n' + " sessions right inside the application." + '\n' + ' ' + " The system has been designed to " + '\n' + "make this process as easy as possible " + '\n' + " for everyone involved. Now you have " + '\n' + "your device properly connected and" + '\n' + "you’re good to go";
export const DEFAULT_IMAGE = 'profileImages/testUser_defaultAvatar.png';
export const DEFAULT_GROUP_IMAGE = 'profileImages/testUser_defaultGroupAvatar.png';
export const RESEND_CODE_TIMEOUT = '60';
export const GET_SUPPORT_HELP_LINE = '203.767.8696';
export const GET_SUPPORT_EMAIL = 'help@confidanthealth.com';


export const VERIFICATION_CODE_TYPE = {
    ACCOUNT_VERIFICATION: 'ACCOUNT_VERIFICATION',
    PASSWORD_RECOVERY: 'PASSWORD_RECOVERY',
    ONE_TIME_PASSWORD: 'ONE_TIME_PASSWORD'

};
export const VALID_IMAGE_TYPES = ['image/gif', 'image/jpeg', 'image/png'];
export const VALID_VIDEO_TYPES = ['video/x-flv', 'video/mp4', 'application/x-mpegURL', 'video/MP2T', 'video/3gpp', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'];

export const HEADER_X = 78;
export const HEADER_NORMAL = 70;
export const HEADER_12 = 100;

export const DEFAULT_AVATAR_COLOR = '#505D80';
export const AVATAR_COLOR_ARRAY = ['#7a00e7', '#f78795', '#d97eff', '#2bb826', '#ff7f05'];
export const OVERLAP_IMAGES_COUNT = 5;

// Topic Colors Array
export const COLOR_ARRAY = [[
    '#1ed0de', '#50abf1', '#6078ea'
], ["#1edeae", "#12B783", "#068e56"
], ["#fbeb4b", "#F08B23", "#e73500"
], ["#d97eff", "#A63BF2", "#7a00e7"
],
];
export const MARGIN_X = -42;
export const MARGIN_NORMAL = -18;

export const NOTIFICATION_SETTINGS = [
    {
        title: 'Reminders',
        applicableFor: ['PROVIDER', 'MEMBER'],
        settings: [
            {
                title: 'Enable Reminders',
                key: 'appointmentReminder',
                applicableFor: ['PROVIDER', 'MEMBER'],
                parent: null,
            },
            {
                title: 'Remind me before 15 minutes',
                key: 'appointmentPreReminder',
                applicableFor: ['PROVIDER', 'MEMBER'],
                parent: 'appointmentReminder',
            }
        ]
    },
    {
        title: 'Notify When Appointment',
        applicableFor: ['PROVIDER', 'MEMBER'],
        settings: [
            {
                title: 'is requested',
                key: 'appointmentRequested',
                applicableFor: ['PROVIDER', 'MEMBER'],
                parent: null,
            },
            {
                title: 'is confirmed',
                key: 'appointmentConfirmed',
                applicableFor: ['PROVIDER', 'MEMBER'],
                parent: null,
            },
            {
                title: 'is cancelled',
                key: 'appointmentCancelled',
                applicableFor: ['PROVIDER', 'MEMBER'],
                parent: null,
            },
            {
                title: 'needs action',
                key: 'appointmentNeedsAction',
                applicableFor: ['PROVIDER', 'MEMBER'],
                parent: null,
            },
            {
                title: 'feedback is completed',
                applicableFor: ['PROVIDER'],
                key: 'appointmentFeedbackCompleted',
                parent: null,
            }
        ]
    },
    {
        title: 'Notify When Group',
        applicableFor: ['PROVIDER', 'MEMBER'],
        settings: [
            {
                title: 'is created',
                key: 'groupCreated',
                applicableFor: ['PROVIDER', 'MEMBER'],
                parent: null,
            },
            {
                title: 'Member is added',
                applicableFor: ['PROVIDER', 'MEMBER'],
                key: 'groupMemberAdded',
                parent: null,
            },
            {
                title: 'Member is removed',
                applicableFor: ['PROVIDER', 'MEMBER'],
                key: 'groupMemberRemoved',
                parent: null,
            }
        ]
    },
    {
        title: 'Notify When Message',
        applicableFor: ['PROVIDER', 'MEMBER'],
        settings: [
            {
                title: 'is received',
                key: 'chatMessageReceived',
                applicableFor: ['PROVIDER', 'MEMBER'],
                parent: null,
            }
        ]
    },
    {
        title: 'Notify When Conversation',
        applicableFor: ['PROVIDER', 'MEMBER'],
        settings: [
            {
                title: 'is completed',
                key: 'conversationCompleted',
                applicableFor: ['PROVIDER'],
                parent: null,
            },
            {
                title: 'is pending since 48 hours',
                key: 'conversationPendingSince48Hours',
                applicableFor: ['PROVIDER'],
                parent: null,
            },
            {
                title: 'is assigned',
                key: 'conversationAssigned',
                applicableFor: ['MEMBER'],
                parent: null,
            }
        ]
    },
    {
        title: 'Notify When Content',
        applicableFor: ['MEMBER', 'PROVIDER'],
        settings: [
            {
                title: 'is read',
                key: 'contentRead',
                applicableFor: ['PROVIDER'],
                parent: null,
            },
            {
                title: 'is assigned',
                key: 'contentAssigned',
                applicableFor: ['MEMBER'],
                parent: null,
            },
            {
                title: 'is pending since 48 hours',
                key: 'contentPendingSince48Hours',
                applicableFor: ['PROVIDER'],
                parent: null,
            }
        ]
    }
];

/* Constant to Send Section Name to Segment for Recommended Category*/
export const SEGMENT_RECOMMENDED_CATEGORY = {
    categoryName: 'Recommended For You',
}

/* Constant to send assigned chatbot event to Segment*/
export const ASSIGNED_CHATBOT = {
    ASSIGNED_CHATBOT: 'Assigned chatbot',
}

export const UPDATE_PROFILE_DROPDOWN_TYPES = {
    zip_code: 'Zip code',
    city: 'City',
    state: 'State'
}

export const TIME_PICKER = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24'
];

export const ACTIVITY_ACTION_TYPES = {
    LOGIN: "Login",
    CONTENT_BOOKMARKED: "Education added to favorites",
    CONTENT_REMOVED_BOOKMARKED: "Education removed from favorites",
    CONTENT_MARKED_AS_COMPLETE: "Education marked as read",
    CONVERSATION_ASSIGNED: "Conversation assigned",
    CONVERSATION_COMPLETED: "Conversation completed",
    DCT_STARTED: "Dct started",
    DCT_COMPLETED: "Dct completed",
    APPOINTMENT_SCHEDULED: "Appointment scheduled",
    APPOINTMENT_COMPLETED: "Appointment completed",
    CONNECTED: "Connected with user",
    DISCONNECTED: "Disconnected with user",
    JOINED_GROUP: "Joined group",
    LEFT_GROUP: "Left group",
    JOINED_GROUP_SESSION: "Joined group session"
};


export const TIME_KEY_VALUE = [
    {key: '00', value: 0}, {key: '01', value: 1}, {key: '02', value: 2}, {key: '03', value: 3}, {key: '04', value: 4},
    {key: '05', value: 5}, {key: '06', value: 6}, {key: '07', value: 7}, {key: '08', value: 8}, {key: '09', value: 9},
    {key: '10', value: 10}, {key: '11', value: 11}, {key: '12', value: 12}, {key: '13', value: 13}, {
        key: '14',
        value: 14
    },
    {key: '15', value: 15}, {key: '16', value: 16}, {key: '17', value: 17}, {key: '18', value: 18}, {
        key: '19',
        value: 19
    },
    {key: '20', value: 20}, {key: '21', value: 21}, {key: '22', value: 22}, {key: '23', value: 23}, {
        key: '24',
        value: 24
    }
];


export const TAB_SEGMENTS_OPTIONS = {
    ACTIVE: 'active',
    PAST: 'past',
    PENDING: 'pending',
    CURRENT: 'current'
}

export const CONNECTION_TYPES = {
    PATIENT: 'PATIENT',
    PRACTITIONER: 'PRACTITIONER',
    MATCH_MAKER: 'MATCH_MAKER',
    CHAT_BOT: "CHAT_BOT",
    CHAT_GROUP: 'CHAT_GROUP'
}

export const APPOINTMENT_STATUS = {
    NEEDS_ACTION: 'NEEDS_ACTION',
    FULFILLED: 'FULFILLED',
    CANCELLED: 'CANCELLED',
    BOOKED: "BOOKED",
    NO_SHOW: 'NO_SHOW'
}

export const PENDING_CONNECTION_STATUS = {
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED'
}

export const APPOINTMENT_SIGNOFF_STATUS = {
    DRAFTED : 'DRAFTED',
    REVIEW : 'REVIEW',
    REJECTED : 'REJECTED',
    APPROVED: 'APPROVED'
}

export const PROVIDER_ROLES = {
    DEFAULT : "DEFAULT",
    SUPERVISOR : "SUPERVISOR",
    ASSOCIATE : "ASSOCIATE",
}

export const NOTIFICATION_TYPES = {
    APPOINTMENT_REMINDER: "APPOINTMENT_REMINDER",
    APPOINTMENT_PRE_REMINDER : "APPOINTMENT_PRE_REMINDER",
    APPOINTMENT_REQUESTED : "APPOINTMENT_REQUESTED",
    APPOINTMENT_NEEDS_ACTION : "APPOINTMENT_NEEDS_ACTION",
    APPOINTMENT_CONFIRMED : "APPOINTMENT_CONFIRMED",
    APPOINTMENT_CANCELLED : "APPOINTMENT_CANCELLED",
    APPOINTMENT_FEEDBACK_COMPLETED : "APPOINTMENT_FEEDBACK_COMPLETED",
    GROUP_CREATED : "GROUP_CREATED",
    GROUP_MEMBER_ADDED : "GROUP_MEMBER_ADDED",
    GROUP_MEMBER_REMOVED : "GROUP_MEMBER_REMOVED",
    GROUP_MEMBER_LEFT : "GROUP_MEMBER_LEFT",
    CHAT_MESSAGE_RECEIVED : "CHAT_MESSAGE_RECEIVED",
    GROUP_MESSAGE_RECEIVED : "GROUP_MESSAGE_RECEIVED",
    CONVERSATION_ASSINGED : "CONVERSATION_ASSIGNED",
    CONVERSATION_COMPLETED : "CONVERSATION_COMPLETED",
    CONVERSATION_PENDING_SINCE_48_HOURS : "CONVERSATION_PENDING_SINCE_48_HOURS",
    CONTENT_ASSIGNED : "CONTENT_ASSIGNED",
    CONTENT_READ : "CONTENT_READ",
    MATCHMAKER_AUTO_ASSIGNED : "MATCHMAKER_AUTO_ASSIGNED",
    NEW_CONNECTION_REQUESTED : "NEW_CONNECTION_REQUESTED",
    CONTENT_PENDING_SINCE_48_HOURS : "CONTENT_PENDING_SINCE_48_HOURS",
    APP_SUBSCRIPTION_RENEWED : "APP_SUBSCRIPTION_RENEWED",
    APP_SUBSCRIPTION_RENEWAL_FAILED : "APP_SUBSCRIPTION_RENEWAL_FAILED",
    GROUP_CALL_STARTED : "GROUP_CALL_STARTED",
    INCOMING_TELESESSION : "INCOMING_TELESESSION"
}


export const CONTACT_NOTES_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    REMOVED: 'REMOVED'
};
export const CONTACT_NOTES_FLAGS = {
    PROHIBITIVE: 'PROHIBITIVE',
    CAUTION: 'CAUTION',
    RELEASE_OF_INFORMATION: 'RELEASE_OF_INFORMATION',
    LAB_REQUEST: 'LAB_REQUEST',
    CONTACT: 'CONTACT',
    GENERAL: 'GENERAL',
};
export const RECURRING_SUBSCRIPTION_STATUS = {
    ACTIVE:"ACTIVE",
    INACTIVE:"INACTIVE",
    PAUSED:"PAUSED",
    CANCELLED:"CANCELLED",
}
