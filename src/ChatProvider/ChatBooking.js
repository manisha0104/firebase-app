import React, { Component } from 'react';
import { Text, View, Image, Platform, Modal, Alert, StyleSheet, FlatList, TextInput, StatusBar, KeyboardAvoidingView, Dimensions, TouchableOpacity, SafeAreaView, Keyboard, Linking } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, Cameragallery, mediaprovider, firebaseprovider, notification } from '../Provider/utilslib/Utils';
import firebase from './Config1';
import Firebase from 'firebase';
import ImagePicker from 'react-native-image-picker/lib/commonjs'
import DeviceInfo from 'react-native-device-info';
global.userChatIdGlobal = '';
global.blockinbox = 'no';
global.messagedata = []
 



export default class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            optionmsg: '',
            data1: [],
            user_id: '',
            chatmsg: '',
            other_user_name: '',
            data: this.props.route.params.chatdata,
            name: '',
            message_type: 'text',

            filePath: {},
            messages: [],
            isVisible: false,
            modalVisible: false,
            fileData: '',
            fileUri: '',
            user_image: '',
            imgBlob: '',
            isConnected: true,
            loading: false,
            behavior: 'position',
            bottom: 0,
            block_status: 'no',
            online_status: false,
            notch: false,
            newpad: true,
            document: ''
        }
        this.getmessagedata()
        this.show_user_message_chat = this.show_user_message_chat.bind(this);
    }
    componentDidMount() {
        var hasNotch = DeviceInfo.hasNotch()
        consolepro.consolelog('notch', hasNotch)
        this.setState({ notch: hasNotch })
        this.getmessagedata()
    }

    OpenDoc = (name) => {
        consolepro.consolelog('iamopendoc', name)
        if (name != null) {
            var docurl = config.img_url3 + name;
            consolepro.consolelog({ docurl })
            Linking.openURL(docurl).catch(err =>
                alert('Please contact to admin')
            );
        }
    }
    getmessagedata = async () => {
        var userdata = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('getmessagedata')

        this.setState({ user_id: userdata.user_id, })



        var data = this.state.data
        consolepro.consolelog('data', data)
        var other_user_id = data.other_user_id
        var booking_id = data.booking_id


        var inbox_id_me = 'u_' + other_user_id+'_b_'+booking_id;
        var inbox_id_other = 'u_' + userdata.user_id+'_b_'+booking_id;

        // var item_id = data.item_id;
        consolepro.consolelog('other_user_id', other_user_id);
        // consolepro.consolelog('item_id',item_id);
        consolepro.consolelog('firebaseprovider', FirebaseUserJson)
        var inbox_count = FirebaseUserJson.findIndex(x => x.user_id == other_user_id);
        consolepro.consolelog("chat name inbox count before", inbox_count);
        if (inbox_count >= 0) {
            consolepro.consolelog("chat name inbox count", inbox_count);
            var jsonData = FirebaseUserJson[inbox_count];
            consolepro.consolelog('jsonData', jsonData);
            if (jsonData.name != 'NA') {
                consolepro.consolelog("onlineStatus", jsonData.onlineStatus)
                this.setState({ name: jsonData.name, online_status: jsonData.onlineStatus })

                // if (userProvider.getMe().user_type == 'user') {
                //   $('#chat_name').attr("onclick","redirectChefProfile("+other_user_id+")");
                // }
            } else {
                this.setState({ name: 'Chat' })
            }

        } else {
            this.setState({ name: 'Chat' })
        }

        var blockinbox = data.block_status;
        if (FirebaseInboxJson.length > 0) {
            var find_inbox_index2 = FirebaseInboxJson.findIndex(x => x.booking_id == booking_id);
            consolepro.consolelog('find_inbox_index', find_inbox_index2)

            if (find_inbox_index2 >= 0) {
                let myinboxdata = FirebaseInboxJson[find_inbox_index2]
                consolepro.consolelog('myinboxdatablock', myinboxdata.block_status)
                blockinbox = myinboxdata.block_status
                this.setState({ block_status: blockinbox });
            }
        }

        this.show_user_message_chat()
    }
    sendmessagebtn = async () => {
        consolepro.consolelog('sendmessagebtn')

        let messageType = 'text';
        let message = this.state.chatmsg
        consolepro.consolelog('message', message)
        this.chatmsg.clear();
        this.setState({ chatmsg: '' })
        if (message.trim().length <= 0) {
            msgProvider.toast(msgText.emptyMessage[config.language], 'center')
            return false
        }
        this.sendmessagecallbtn(messageType, message)
    }
    sendmessagecallbtn = async (messageType, message) => {
        let userdata = await localStorage.getItemObject('user_arr')
        let data1 = this.state.data
        var user_id = userdata.user_id
        var other_user_id = data1.other_user_id
        var booking_id = data1.booking_id
        var booking_number = data1.booking_number
        var chat_type = 'Item_chat';
        var user_id_send = 'u_' + user_id;
        var other_user_id_send = 'u_' + other_user_id;
        var inbox_id_me = 'u_' + other_user_id+'_b_'+booking_id;
        var inbox_id_other = 'u_' + user_id+'_b_'+booking_id;
        consolepro.consolelog('inbox_id', inbox_id_me)
        consolepro.consolelog('inbox_id_other', inbox_id_other)
        //---------------------- this code for create inbox in first time -----------
        consolepro.consolelog('FirebaseInboxJsonChck', FirebaseInboxJson);
        consolepro.consolelog('other_user_id', other_user_id)
        consolepro.consolelog('FirebaseInboxJsonChck', FirebaseInboxJson);
        consolepro.consolelog('Firebaseuserjson', FirebaseUserJson);

        if (FirebaseUserJson.length > 0) {
            var find_inbox_index2 = FirebaseUserJson.findIndex(x => x.user_id == other_user_id);
            consolepro.consolelog('find_inbox_index', find_inbox_index2)

            if (find_inbox_index2 != -1) {
                if ('myInbox' in FirebaseUserJson[find_inbox_index2]) {
                    let myinbox2 = FirebaseUserJson[find_inbox_index2].myInbox
                    if (myinbox2 != undefined) {
                        //  myinbox=myinbox.findIndex(x => x.user_id == other_user_id)
                        consolepro.consolelog('myinbox2', myinbox2)
                        if (inbox_id_other in myinbox2) {
                            let myinboxdata = myinbox2[inbox_id_other]

                            consolepro.consolelog('inbox_id_me', inbox_id_me)
                            consolepro.consolelog('inbox_id_other', inbox_id_other)
                            blockinbox = myinboxdata.block_status

                        }
                    }
                }
            }
        }
        var find_inbox_index = FirebaseInboxJson.findIndex(x => x.booking_id == booking_id);
        consolepro.consolelog('find_inbox_index chat', find_inbox_index);
        consolepro.consolelog('other_user_id chat', other_user_id);
        if (find_inbox_index == -1) {

            var jsonUserDataMe = {
                count: 0,
                lastMessageType: "",
                lastMsg: "",
                user_id: other_user_id,
                booking_id: booking_id,
                booking_number: booking_number,
                typing_status: 'no',
                block_status: 'no',
                lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,
            };

            var jsonUserDataother = {
                count: 0,
                lastMessageType: "",
                lastMsg: "",
                user_id: user_id,
                booking_id: booking_id,
                booking_number: booking_number,
                typing_status: 'no',
                block_status: 'no',
                lastMsgTime: Firebase.database.ServerValue.TIMESTAMP,

            };

            firebaseprovider.UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
            if (blockinbox == 'no') {
                firebaseprovider.UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataother);
            }

            //  consolepro.consolelog('FirebaseUserJson',FirebaseUserJson);
        }
        //---------------------- this code for create inbox in first time end -----------

        //---------------------- this code for send message to both -----------
        var messageIdME = 'u_' + user_id + '__u_' + other_user_id+'_b_'+booking_id;
        var messageIdOther = 'u_' + other_user_id + '__u_' + user_id+'_b_'+booking_id;
        var senderId = user_id;
        var inputId = 'xyz'
        // var timestamp = new Date().getTime();
        var messageJson = {
            message: message,
            messageType: messageType,
            senderId: senderId,
            timestamp: Firebase.database.ServerValue.TIMESTAMP
        }

        // this.chatmsg.clear();

        firebaseprovider.SendUserMessage(messageIdME, messageJson, messageType, inputId);
        if (this.state.block_status == 'no') {
            if (blockinbox == 'no') {
                firebaseprovider.SendUserMessage(messageIdOther, messageJson, messageType, inputId);
            }

        }
        //---------------------- this code for send message to both end -----------


        //----------------update user inbox----------------------------
        var jsonUserDataMe = {
            count: 0,
            lastMessageType: messageType,
            lastMsg: message,
            lastMsgTime: Firebase.database.ServerValue.TIMESTAMP
        };
        firebaseprovider.UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);

        var user_id_me = userdata.user_id
        var chat_room_id = other_user_id;
        this.chatRoomIdUpdate(user_id_me, chat_room_id);

        //------------------------- get other user inbox -------------------

        consolepro.consolelog('other_user_id_send', other_user_id_send);
        consolepro.consolelog('user_id_send', user_id_send);
        var count_new = 0;
        var query = firebase.database().ref('users/' + other_user_id_send + '/myInbox/' + inbox_id_other);
        query.once('value', (data) => {
            consolepro.consolelog("chat_data", data.toJSON());
            // consolepro.consolelog('user inbox data',data.val().count);
            var count_old = data.val() == null ? 0 : data.val().count;
            consolepro.consolelog('count_old_check', count_old);
            count_new = parseInt(count_old) + 1;

            var jsonUserDataOther = {
                count: count_new,
                lastMessageType: messageType,
                lastMsg: message,
                lastMsgTime: Firebase.database.ServerValue.TIMESTAMP
            };
            // alert("dddd");      
            // consolepro.consolelog('jsonUserDataOther',jsonUserDataOther);
            if (blockinbox == 'no') {
                firebaseprovider.UpdateUserInboxOther(other_user_id_send, inbox_id_other, jsonUserDataOther);
            }

        })
        //---------------------- send message notifications ----------------
        var title = config.appname;
        var message_send = message;
        var SenderName = userdata.name;
        if (messageType != 'text' && messageType != 'location' && messageType != 'file') {
            message_send = SenderName + ' sent: ' + messageType;
        } else {
            message_send = SenderName + ' ' + message_send;
        }

        var other_user_id = chat_room_id;
        consolepro.consolelog('other_user_id_noti', other_user_id);
        var message_noti = message_send;
        var action_json = {
            user_id: user_id_me,
            other_user_id: other_user_id,
            booking_id: booking_id,
            booking_number: booking_number,
            chat_type: chat_type,
            image: userdata.image,
            action_id: booking_id,
            action: 'chat_booking',
            // action_id : user_id_me,
            SenderName: SenderName,
        };
        // alert(user_id_me);  
        consolepro.consolelog({ action_json })
        // return false
        this.sendNotificationSignle(title, message_noti, action_json, other_user_id);
        //---------------------- send message notifications end----------------

    }
    sendNotificationSignle = async (title, message, action_json, user_id_member) => {
        let userdata = await localStorage.getItemObject('user_arr')
        consolepro.consolelog('sendNotificationSignle action_json', action_json);
        consolepro.consolelog('sendNotificationSignle message', message);
        consolepro.consolelog('sendNotificationSignle user_id_member', user_id_member);

        consolepro.consolelog('update delete_flag', user_id_member);
        consolepro.consolelog("sendNotificationSignle FirebaseUserJson", FirebaseUserJson);
        var user_check_inbox = FirebaseUserJson.findIndex(x => x.user_id == user_id_member);
        consolepro.consolelog("user_check_inbox subuser", user_check_inbox);
        if (user_check_inbox >= 0) {
            consolepro.consolelog('FirebaseUserJson subuser', FirebaseUserJson[user_check_inbox]);
            var player_id_get = FirebaseUserJson[user_check_inbox].player_id;
            var chat_room_id_get = FirebaseUserJson[user_check_inbox].chat_room_id;
            var notification_status = FirebaseUserJson[user_check_inbox].notification_status;

            consolepro.consolelog('chat_room_id_get', chat_room_id_get + '//' + chat_room_id_get);
            consolepro.consolelog('player_id_get', user_id_member + '//' + player_id_get);
            consolepro.consolelog('notification_status', notification_status);

            if (notification_status == 1) {
                var user_id_me = userdata.user_id;
                consolepro.consolelog('chat_room_id_get', chat_room_id_get + '!=' + user_id_me);
                // if(chat_room_id_get != user_id_me){
                if (player_id_get != 'no' && player_id_get != '123456') {
                    var player_id_arr = [];
                    player_id_arr.push(player_id_get);
                    consolepro.consolelog('player_id_arr', player_id_arr);

                    if (player_id_arr.length > 0) {
                        consolepro.consolelog('vikas slonakfsdsend notihd');
                        notification.Chatnotificationfunction(message, action_json, player_id_get, title);
                    }
                    // }
                }
            }
        }
    }
    chatRoomIdUpdate = (user_id, other_user_id) => {
        consolepro.consolelog('chatRoomIdUpdate user_id', user_id);
        consolepro.consolelog('chatRoomIdUpdate other_user_id', other_user_id);
        var id = 'u_' + user_id;
        var jsonUserDataMe = {
            chat_room_id: other_user_id,
        };
        firebaseprovider.CreateUser(id, jsonUserDataMe);
    }
    myInboxCountZeroChat = () => {
        consolepro.consolelog('myInboxCountZeroChat');
        var data = this.state.data
        var user_id = this.state.user_id
        var booking_id = data.booking_id
        var other_user_id = data.other_user_id
        var user_id_send = 'u_' + user_id;
        var other_user_id_send = 'u_' + other_user_id + '_b_' + booking_id;

        var jsonUserDataOther = {
            count: 0,
            user_id: other_user_id,
        };
        firebaseprovider.UpdateUserInboxOther(user_id_send, other_user_id_send, jsonUserDataOther);
    }

    show_user_message_chat = () => {

        //  var messagedata=[]
        var other_user_id = this.state.data.other_user_id
        var booking_id = this.state.data.booking_id
        var find_inbox_index = FirebaseInboxJson.findIndex(x => x.booking_id == booking_id);
        consolepro.consolelog('find_inbox_index chatshow_user_message_chat', find_inbox_index);
        consolepro.consolelog('other_user_id chatshow_user_message_chat', other_user_id);
        if (find_inbox_index >= 0) {
            consolepro.consolelog('inboxfinguser')
            this.myInboxCountZeroChat()
        }

        consolepro.consolelog('show_user_message');

        // var userdata= await localStorage.getItemObject('user_arr');
        var data = this.state.data
        var user_id = this.state.user_id
        var other_user_id = data.other_user_id
        // var item_id = data.item_id;
        var chat_type = 'Item_chat';

        var userChatId = 'u_' + user_id + '__u_' + other_user_id+'_b_'+booking_id;
        if (userChatIdGlobal == '') {
            userChatIdGlobal = userChatId;
        }
        consolepro.consolelog('userChatIdGlobal', userChatIdGlobal);
        var queryOff = firebase.database().ref('message/').child(userChatIdGlobal);
        queryOff.off('child_added');
        queryOff.off('child_changed');
        // alert('userChatId======'+userChatId);
        var image_index_me = 0;
        var image_index_other = 0;
        userChatIdGlobal = userChatId;
        var query = firebase.database().ref('message/' + userChatId).orderByChild("timestamp");
        query.on('child_added', (data) => {
            consolepro.consolelog('message child_added chat all data', data.toJSON());
            // LoadingEnd();

            var msgKey = data.key;
            var message = data.val().message;
            var messageType = data.val().messageType;
            var senderId = data.val().senderId;
            var timestamp = data.val().timestamp;
            var lastMsgTime = firebaseprovider.convertTimeAllFormat(timestamp, 'date_time_full');
            var messageDataShow = '';
            consolepro.consolelog('senderId', senderId);
            consolepro.consolelog('user_id', user_id);

            if (senderId == user_id) {
                consolepro.consolelog('senderId', senderId);

                if (messageType == 'text') {

                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJoson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })
                } else if (messageType == 'location') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJoson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })
                }
                else if (messageType == 'image') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJoson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })

                }
                else if (messageType == 'file') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJoson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })

                }
            } else {
                if (messageType == 'text') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })

                }
                else if (messageType == 'location') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })
                }
                else if (messageType == 'image') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJoson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })

                }
                else if (messageType == 'file') {
                    var messageJson = {
                        'name': message,
                        'userid': senderId,
                        'messageType': messageType,
                        'time': lastMsgTime
                    }
                    consolepro.consolelog('messageJoson', messageJson)
                    let data6 = this.state.data1
                    data6.push(messageJson)
                    this.setState({ data1: data6 })

                }
            }
            consolepro.consolelog('this.state.data1', this.state.data1)
        });
        consolepro.consolelog('enndshowfunction')
    }
    senduserreport = async () => {
        let userdata = await localStorage.getItemObject('user_arr')
        consolepro.consolelog('userdata', userdata)
        let user_id = userdata.user_id
        let data = this.state.data
        var other_user_id = data.other_user_id
        this.setState({ modalVisible: false })

        consolepro.consolelog({ user_id, other_user_id })
        this.props.navigation.navigate('ChatReport', {
            other_user_id: other_user_id
        })
    }
    ClearChatConfirm = async () => {
        let userdata = await localStorage.getItemObject('user_arr')
        consolepro.consolelog('userdata', userdata)
        let data = this.state.data
        var user_id = userdata.user_id
        var other_user_id = data.other_user_id
        var booking_id = data.booking_id
        // var item_id = data.item_id;
        var chat_type = 'Item_chat';

        var messageIdME = 'u_' + user_id + '__u_' + other_user_id+'_b_'+booking_id;
        var id = 'u_' + user_id;
        var otherid = 'u_' + other_user_id;
        let jsonUsesadsssfrData = {};

        firebase.database().ref().child('message' + '/' + messageIdME + '/').remove();
        // messagedata=[] 
        this.setState({ data1: [], modalVisible: false })
        let jsonUserData = {};


        var jsonUserDataMe = {
            count: 0,
            lastMessageType: "",
            lastMsg: "",
            lastMsgTime: "",
            user_id: other_user_id,
        };
        var user_id_send = 'u_' + user_id;
        var other_user_id_send = 'u_' + other_user_id;
        var inbox_id_me = 'u_' + other_user_id+'_b_'+booking_id;

        firebaseprovider.UpdateUserInboxMe(user_id_send, inbox_id_me, jsonUserDataMe);
        firebaseprovider.getMyInboxAllData();

    }
    btnOpneImageOption = (index) => {
        const options = {
            title: Lang_chg.ChooseMedia[config.language],
            takePhotoButtonTitle: Lang_chg.MediaCamera[config.language],
            chooseFromLibraryButtonTitle: Lang_chg.Mediagallery[config.language],
            cancelButtonTitle: Lang_chg.cancelmedia[config.language],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            maxWidth: 1000,
            maxHeight: 1000,
            quality: 0.8
        };

        ImagePicker.showImagePicker(options, (response) => {
            consolepro.consolelog('Response = ', response);

            if (response.didCancel) {
                consolepro.consolelog('User cancelled image picker');
            } else if (response.error) {
                consolepro.consolelog('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                consolepro.consolelog('User tapped custom button: ', response.customButton);
            } else {


                this.setState({
                    filePath: response,
                    fileData: response.data,
                    fileUri: response.uri,
                    imagedata: true,
                    camraon: true,
                    loading: true,
                    profileimagehide: true,
                    openDate: false
                });
                let user_id = this.state.user_id
                consolepro.consolelog('this.state.fileUri', response.uri)
                var url = config.baseURL + 'chat_file_upload.php';
                var data = new FormData();
                data.append('user_id', user_id)
                data.append('file_type', 'image')
                data.append('image', {
                    uri: response.uri,
                    type: 'image/jpg', // or photo.type
                    name: 'image.jpg'
                });
                consolepro.consolelog('url', url)
                consolepro.consolelog('data', data)
                apifuntion.postApi(url, data).then((obj) => {
                    consolepro.consolelog('obj', obj);
                    if (obj.success == 'true') {
                        this.setState({ bottom: 0, loading: false })
                        this.sendmessagecallbtn('image', obj.file)
                    }
                    else {
                        this.setState({ loading: false });
                        msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                        return false;
                    }
                }).catch((error) => {
                    consolepro.consolelog('error', error)
                    msgProvider.alert(msgTitle.server[config.language], msgText.servermessage[config.language], false);
                })
            }
        });

    }
    permmissionclearchat = () => {
        Alert.alert(
            //This is title
            Lang_chg.Confirm[config.language],
            //This is body text
            Lang_chg.chatclearpopup[config.language],
            [
                { text: Lang_chg.yes_txt[config.language], onPress: () => this.ClearChatConfirm() },
                { text: Lang_chg.no_txt[config.language], onPress: () => consolepro.consolelog('No Pressed'), style: 'cancel' },
            ],
            { cancelable: false }
            //on clicking out side, Alert will not dismiss
        );
    }

    //----------function for block unblock--------------//
    block_unblock = () => {
        consolepro.consolelog('i am in block unblock user')
        var data = this.state.data;
        var blockstatus = this.state.block_status;
        consolepro.consolelog({ blockstatus })
        if (blockstatus == 'no') {
            this.permmissionsendblock();
        } else {
            this.permmissionsendunblock();
        }

    }

    //--------permission for block user------------//
    permmissionsendblock = () => {
        Alert.alert(
            Lang_chg.Confirm[config.language],
            Lang_chg.block_permission[config.language],
            [
                { text: Lang_chg.yes_txt[config.language], onPress: () => { this.block_unblock_user_final() } },
                { text: Lang_chg.no_txt[config.language], onPress: () => { this.setState({ modalVisible: false }); consolepro.consolelog('No Pressed') }, style: 'cancel' },
            ],
            { cancelable: false }
            //on clicking out side, Alert will not dismiss
        );
    }


    //--------permission for unblock user------------//
    permmissionsendunblock = () => {
        Alert.alert(
            Lang_chg.Confirm[config.language],
            Lang_chg.unblock_permission[config.language],
            [
                { text: Lang_chg.yes_txt[config.language], onPress: () => { this.block_unblock_user_final() } },
                { text: Lang_chg.no_txt[config.language], onPress: () => { this.setState({ modalVisible: false }); consolepro.consolelog('No Pressed') }, style: 'cancel' },
            ],
            { cancelable: false }
        );
    }

    //-------block_unblock_user_final-------------//

    block_unblock_user_final = () => {
        consolepro.consolelog('I am in block_unblock_user_final')
        var data = this.state.data;
        consolepro.consolelog({ data })
        var other_user_id = data.other_user_id;
        var blockstatus = this.state.block_status;
        consolepro.consolelog({ blockstatus })
        consolepro.consolelog({ other_user_id })
        consolepro.consolelog('I user id...', this.state.user_id)

        var status = 'no';
        if (blockstatus == 'no') {
            status = 'yes';
        } else {
            status = 'no';
        }
        consolepro.consolelog({ status })
        this.setState(
            {
                modalVisible: false,
                block_status: status,
            }
        )
        firebaseprovider.blockuserfunction(this.state.user_id, other_user_id, status);


    }


    //------for chat design start ---------------------
    chatrenderdata = () => {
        return (
            <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => {
                Keyboard.dismiss()
            }}>
                <SafeAreaView style={styles.container}>
                    <StatusBar
                        hidden={false}
                        translucent={false}
                        barStyle="light-content"
                        networkActivityIndicatorVisible={true}
                    />
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { this.setState({ modalVisible: false }) }}>
                        <View style={{ flex: 1 }}>
                            <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                            <StatusBar
                                hidden={false}
                                StatusBarStyle='light-content'
                                backgroundColor={Colors.theme_color}
                                translucent={false}
                                networkActivityIndicatorVisible={true}
                            />
                            <View style={{ flex: 1, backgroundColor: '#00000090' }}>
                                <View style={styles.cameraview}>
                                    <View style={styles.topview}>
                                        <View style={styles.txt_topview}>
                                            <Text style={{
                                                alignItems: 'center',
                                                fontSize: mobileW * 4.2 / 100,
                                                fontFamily: Font.FontSemiBold,
                                                color: Colors.cancletextcolor,
                                                alignSelf: 'center'
                                            }}>{Lang_chg.select_option_txt[config.language]}</Text>
                                        </View>
                                        <View style={{
                                            width: '100%', borderBottomColor: Colors.border_color,
                                            borderBottomWidth: 1,
                                        }}></View>
                                        <TouchableOpacity activeOpacity={1}
                                            onPress={() => { this.senduserreport() }}
                                            style={styles.txt_topview}>
                                            <Text style={{
                                                alignItems: 'center',
                                                fontSize: mobileW * 3.8 / 100,
                                                fontFamily: Font.FontSemiBold,
                                                color: Colors.cancletextcolor,
                                                alignSelf: 'center'
                                            }}>{Lang_chg.report_txt[config.language]}</Text>
                                        </TouchableOpacity>
                                        {/* <View style={{
                                            width: '100%', borderBottomColor: Colors.border_color,
                                            borderBottomWidth: 1,
                                        }}></View>
                                        <TouchableOpacity activeOpacity={1}
                                            onPress={() => this.block_unblock()}
                                            style={styles.txt_topview}>
                                            <Text style={{
                                                alignItems: 'center',
                                                fontSize: mobileW * 3.8 / 100,
                                                fontFamily: Font.FontSemiBold,
                                                color: Colors.cancletextcolor,
                                                alignSelf: 'center'
                                            }}>{
                                                    this.state.block_status == 'no' ?
                                                        Lang_chg.block_txt[config.language]
                                                        :
                                                        Lang_chg.unblock_txt[config.language]
                                                }
                                            </Text>
                                        </TouchableOpacity> */}
                                        <View style={{
                                            width: '100%', borderBottomColor: Colors.border_color,
                                            borderBottomWidth: 1,
                                        }}></View>
                                        <TouchableOpacity activeOpacity={1}
                                            onPress={() => this.permmissionclearchat()}
                                            style={styles.txt_topview}>
                                            <Text style={{
                                                alignItems: 'center',
                                                fontSize: mobileW * 3.8 / 100,
                                                fontFamily: Font.FontSemiBold,
                                                color: Colors.cancletextcolor,
                                                alignSelf: 'center'
                                            }}>{Lang_chg.chatclear[config.language]}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => { this.setState({ modalVisible: false }) }}
                                        style={[styles.topview, { marginTop: mobileW * 5 / 100 }]}>
                                        <View style={styles.txt_topview}>
                                            <Text style={{
                                                alignItems: 'center',
                                                fontSize: mobileW * 3.8 / 100,
                                                fontFamily: Font.FontSemiBold,
                                                color: Colors.redColor,
                                                alignSelf: 'center'
                                            }}>{Lang_chg.cancel_txt[config.language]}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                    <View style={{ flex: 1, backgroundColor: Colors.white_color }}>
                        <View style={{ paddingVertical: mobileH * 1 / 100, backgroundColor: Colors.theme_color }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: mobileW * 3 / 100, backgroundColor: Colors.theme_color }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => { this.props.navigation.goBack() }}
                                        activeOpacity={0.9}
                                        style={{ width: mobileW * 10 / 100, alignItems: 'center', justifyContent: 'center', height: mobileW * 10 / 100, }}>
                                        <Image resizeMode='contain' style={{
                                            width: mobileW * 5.5 / 100, height: mobileW * 5.5 / 100,
                                        }} source={localimag.back}></Image>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            onError={() => {
                                                var data = this.state.data;
                                                data.image = null
                                                this.setState({
                                                    data: data
                                                })
                                            }
                                            }
                                            source={this.state.data.image != null ? { uri: this.state.data.image } : localimag.userplaceholder}
                                            style={{
                                                width: mobileW * 12 / 100,
                                                height: mobileW * 12 / 100,
                                                borderRadius: mobileW * 6 / 100
                                            }}
                                        ></Image>
                                        <View style={{
                                            marginLeft: mobileW * 2 / 100
                                            , marginRight: config.textalign == 'left' ? 0 : mobileW * 2 / 100
                                        }}>
                                            <Text style={{
                                                fontFamily: Font.FontRegular, fontSize: mobileW * 4 / 100,
                                                color: Colors.white_color
                                            }}>{this.state.data.other_user_name}</Text>
                                            <Text style={{
                                                fontFamily: Font.FontRegular, fontSize: mobileW * 4 / 100,
                                                color: Colors.white_color
                                            }}>{this.state.data.booking_number}</Text>
                                            {this.state.online_status == 'true' &&
                                                <Text style={{
                                                    fontFamily: Font.FontRegular, fontSize: mobileW * 3.5 / 100,
                                                    color: Colors.green_color
                                                }}>{Lang_chg.online_txt[config.language]}</Text>}
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => { this.setState({ modalVisible: true }) }}
                                    activeOpacity={0.9}
                                    style={{ alignItems: 'center', justifyContent: 'center', height: mobileW * 10 / 100, }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100 }} source={localimag.dots}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={{ width: '95%', alignSelf: 'center', paddingTop: 10, paddingBottom: mobileH * 20 / 100 }}
                        >
                            <FlatList
                                data={this.state.data1}
                                showsVerticalScrollIndicator={false}
                                ref={ref => (this.FlatListRef = ref)}
                                onContentSizeChange={() => this.FlatListRef.scrollToEnd()}
                                contentContainerStyle={{ marginBottom: mobileH * 0 / 100 }}
                                keyboardDismissMode='interactive'
                                keyboardShouldPersistTaps='always'
                                renderItem={({ item, index }) => {
                                    return (
                                        <View style={{ width: '97%', alignSelf: 'center', paddingVertical: 7 }}>
                                            {item.userid != this.state.user_id && <View style={{ alignSelf: 'flex-start', width: '70%' }}>
                                                <View style={{ backgroundColor: Colors.chat_back, paddingVertical: 1.5, paddingHorizontal: 8, alignSelf: 'flex-start', borderTopStartRadius: 6, borderTopEndRadius: 6, borderBottomLeftRadius: 6 }}>
                                                    {item.messageType == 'text' && <Text style={{ fontSize: 14, fontFamily: Font.FontBold, color: Colors.black_color }}>{item.name}</Text>}
                                                    {item.messageType == 'image' && <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('ViewImage', { 'image': item.name }) }}>
                                                        <Image source={{ uri: config.img_url1 + item.name }} style={{ width: mobileW * 42 / 100, height: mobileH * 30 / 100, borderRadius: 5, backgroundColor: Colors.imagebackcolor }} />
                                                    </TouchableOpacity>}
                                                    <Text style={{ fontSize: 14, fontFamily: Font.FontMedium, color: 'gray' }}>{item.time}</Text>
                                                </View>
                                            </View>}
                                            {item.userid == this.state.user_id && <View style={{ width: '70%', alignSelf: 'flex-end', alignItems: 'flex-end', }}>
                                                <View style={{ backgroundColor: Colors.chat_back, borderTopStartRadius: 6, borderTopEndRadius: 6, borderBottomLeftRadius: 6, paddingVertical: 1.5, paddingHorizontal: 8, alignSelf: 'flex-end' }}>
                                                    {item.messageType == 'text' && <Text style={{ fontSize: 14, fontFamily: Font.FontMedium, color: Colors.black_color }}>{item.name}</Text>}
                                                    {item.messageType == 'image' && <TouchableOpacity activeOpacity={0.9} onPress={() => { this.props.navigation.navigate('ViewImage', { 'image': item.name }) }}>
                                                        <Image source={{ uri: config.img_url + item.name }} style={{ width: mobileW * 42 / 100, height: mobileH * 30 / 100, borderRadius: 5, backgroundColor: Colors.imagebackcolor }} />
                                                    </TouchableOpacity>}
                                                    <Text style={{ fontSize: 14, fontFamily: Font.FontMedium, color: Colors.black_color }}>{item.time}</Text>
                                                </View>
                                            </View>}
                                        </View>
                                    )
                                }}
                            />
                        </View>
                        {this.state.block_status == 'no' &&
                            <View style={{ height: mobileH * 8 / 100, bottom: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.theme_color, justifyContent: 'space-between', position: 'absolute', borderTopWidth: 0.6, bottom: Platform.OS === 'ios' ? this.state.bottom : 0, }}>
                                <TouchableOpacity
                                    onPress={() => { this.btnOpneImageOption() }}
                                    style={{ alignItems: 'center', justifyContent: 'center', width: mobileW * 15 / 100, height: mobileH * 8 / 100, backgroundColor: Colors.theme_color, borderRightWidth: 0.5, borderColor: Colors.white_color }}
                                >
                                    <Image
                                        resizeMode='contain'
                                        style={{
                                            width: mobileW * 5.5 / 100,
                                            height: mobileW * 5.5 / 100
                                        }}
                                        source={localimag.camera}
                                    ></Image>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    style={{
                                        width: mobileW * 70 / 100,
                                        paddingVertical: mobileH * 1.7 / 100,
                                    }}>
                                    <View style={{ width: '100%', marginLeft: mobileW * 2 / 100 }}>
                                        <TextInput
                                            onChangeText={(txt) => { this.setState({ chatmsg: txt }) }}
                                            ref={(input) => { this.chatmsg = input; }}
                                            keyboardType='default'
                                            returnKeyLabel='done'
                                            returnKeyType='done'
                                            onSubmitEditing={() => { Keyboard.dismiss() }}
                                            style={[styles.txteditemail]}
                                            placeholderTextColor={Colors.black_color}
                                            placeholder={Lang_chg.type_something_txt[config.language]}
                                            onFocus={() => { this.setState({ newpad: false }); }}
                                            onBlur={() => { this.setState({ newpad: true }) }}
                                        >
                                        </TextInput>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { this.sendmessagebtn() }}
                                    style={{ alignItems: 'center', justifyContent: 'center', width: mobileW * 15 / 100, height: mobileH * 8 / 100, backgroundColor: Colors.theme_color, borderLeftWidth: 0.5, borderColor: Colors.white_color }}
                                >
                                    <Image
                                        resizeMode='contain'
                                        style={{
                                            width: mobileW * 5.5 / 100,
                                            height: mobileW * 5.5 / 100,
                                        }}
                                        source={localimag.share}
                                    ></Image>
                                </TouchableOpacity>
                            </View>}
                        {this.state.block_status == 'yes' &&
                            <View style={{ height: mobileH * 8 / 100, bottom: 0,   justifyContent: 'center', position: 'absolute',alignItems:'center' ,width:mobileW }}>
                                <Text style={{color:Colors.redColor,fontFamily:Font.FontBold,fontSize:mobileW*4/100}}>{Lang_chg.you_blocked_this_user[config.language]}</Text>
                            </View>}
                    </View>
                </SafeAreaView>
            </TouchableOpacity>
        )
    }
    //------for chat design end ---------------------
    render() {
        consolepro.consolelog('this.state.data.other_user_name', this.state.data)
        if (config.device_type == 'ios') {
            return (
                <KeyboardAvoidingView style={styles.container} behavior='padding'>
                    {this.chatrenderdata()}
                </KeyboardAvoidingView>
            )
        }
        else {
            return (
                this.chatrenderdata()
            )
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.whiteColor
    },
    button: {
        backgroundColor: Colors.chat_back,
        width: '90%',
        borderRadius: 8,
        paddingVertical: 8.5,
        marginTop: 7,
        marginTop: 10,
        alignSelf: 'center',
        alignItems: 'center'
    },
    container:
    {
        flex: 1,
        backgroundColor: Colors.white_color
    },
    txteditemail: {
        fontSize: mobileW * 3.5 / 100,
        width: '100%',
        paddingVertical: mobileW * .01 / 100,
        fontFamily: Font.FontLight,
        color: Colors.whiteColor,
    },
    txt_topview: {
        backgroundColor: Colors.whiteColor,
        alignSelf: 'center',
        alignItems: 'center',
        paddingVertical: mobileW * 4 / 100,
        width: '90%'
    },
    topview: {
        backgroundColor: Colors.whiteColor,
        width: mobileW * 90 / 100,
        alignSelf: 'center',
        borderRadius: 10,
    },
    cameraview: {
        bottom: mobileW * 5 / 100,
        position: 'absolute',
        alignSelf: 'center',
        width: mobileW,
        zIndex: 1.3
    },


})