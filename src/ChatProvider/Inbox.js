import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, firebaseprovider } from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import firebase from './Config1';
class Inbox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_id: 1,
            search: false,
            searchtxt: '',
            inboxmessage: [],
            inboxmessage2: [],
        }
    }
    componentDidMount() {
        consolepro.consolelog('I am on Chats page')
        this.props.navigation.addListener('focus', payload => {
            firebaseprovider.firebaseUserGetInboxCount();
            //firebaseprovider.getMyInboxAllDataNew()
            this.getMyInboxAllData1()
            this.showUserInbox()
        });
        // firebaseprovider.firebaseUserGetInboxCount();
        //     firebaseprovider.getMyInboxAllDataNew()
        //     this.getMyInboxAllData1()
        //     this.showUserInbox()
    }
    getMyInboxAllData1 = async () => {
        consolepro.consolelog('getMyInboxAllData123');
        userdata = await localStorage.getItemObject('user_arr')
        //---------- firbase code get user inbox ---------------
        if (userdata != null) {
            var id = 'u_' + userdata.user_id;
            consolepro.consolelog('id', id)
            consolepro.consolelog('inboxoffcheck', inboxoffcheck)
            consolepro.consolelog('userChatIdGlobal', userChatIdGlobal)
            if (inboxoffcheck > 0) {
                consolepro.consolelog('getMyInboxAllDatainboxoffcheck');
                // var queryOffinbox = firebase.database().ref('users/' + id + '/myInbox/').child(userChatIdGlobal);
                // queryOffinbox.off('child_changed');
            }

            var queryUpdatemyinboxmessage = firebase.database().ref('users/' + id + '/myInbox/');
            queryUpdatemyinboxmessage.on('child_changed', (data) => {
                consolepro.consolelog('inboxkachildchangemessage', data.toJSON())
                setTimeout(() => { this.showUserInbox() }, 1000);
            })

            var queryUpdatemyinboxadded = firebase.database().ref('users/' + id + '/myInbox/');
            queryUpdatemyinboxadded.on('child_added', (data) => {
                consolepro.consolelog('inboxkaadded', data.toJSON())
                setTimeout(() => { this.showUserInbox() }, 1000);
            })
        }
    }
    convertTimeAllFormat = (time11, format) => {
        consolepro.consolelog(' convertTimeAllFormat time11', time11)
        time11 = parseInt(time11);
        var date1 = new Date(time11);
        var curr_day = date1.getDay();
        var curr_date = date1.getDate();
        var curr_month = date1.getMonth(); //Months are zero based
        var curr_year = date1.getFullYear();
        var hours = date1.getHours();
        var minutes = date1.getMinutes();
        if (format == 12) {
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
        } else if (format == 24) {
            var ampm = hours >= 12 ? 'PM' : 'AM';
            //hours = hours < 10 ? '0'+hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes;
        } else if (format == 'other') {
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTimeAll = hours + ':' + minutes + ' ' + ampm;
            var strTime = curr_date + '. ' + m_names_sort[curr_month] + ' ' + curr_year + ' ' + strTimeAll;
        } else if (format == 'ago') {
            var strTime = timeSince(new Date(time11));
        } else if (format == 'date_time') {
            var date = new Date(time11);

            var seconds = Math.floor((new Date() - date) / 1000);
            var interval = Math.floor(seconds / 3600);
            if (interval <= 24) {
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
            } else {
                var curr_month = date1.getMonth() + 1; //Months are zero based
                var curr_year = date1.getFullYear();
                var curr_year_small = String(curr_year);
                consolepro.consolelog('curr_year_small', curr_year_small);
                curr_year_small = curr_year_small.substring(2, 4);
                consolepro.consolelog('curr_year_small', curr_year_small);
                var strTime = curr_month + '/' + curr_date + '/' + curr_year_small;
            }
        }
        else if (format == 'date_time_full') {
            var date = new Date(time11);

            var seconds = Math.floor((new Date() - date) / 1000);
            var interval = Math.floor(seconds / 3600);
            if (interval <= 24) {
                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTime = hours + ':' + minutes + ' ' + ampm;
            } else {
                var curr_month = date1.getMonth() + 1; //Months are zero based
                var curr_year = date1.getFullYear();
                var curr_year_small = String(curr_year);
                consolepro.consolelog('curr_year_small', curr_year_small);
                curr_year_small = curr_year_small.substring(2, 4);
                consolepro.consolelog('curr_year_small', curr_year_small);

                var ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTimeAll = hours + ':' + minutes + ' ' + ampm;

                var strTime = curr_month + '/' + curr_date + '/' + curr_year_small + ' ' + strTimeAll;
            }

        }

        return strTime;
    }

    showUserInbox = async () => {
        consolepro.consolelog('showUserInboxmesssagepabgewala');
        let userdata = await localStorage.getItemObject('user_arr')
        var user_id = userdata.user_id
        var login_type = userdata.login_type


        var user_id_send = 'u_' + user_id;
        var other_user_id_send = 'u_' + other_user_id;
        var inbox_id_me = 'u_' + other_user_id;
        var inbox_id_other = 'u_' + user_id;

        var FirebaseInboxJsonInbox = [];
        var query = firebase.database().ref('users/' + user_id_send + '/myInbox/');
        query.once('value', (snap) => {
            consolepro.consolelog("inbox data me", snap.toJSON());

            snap.forEach(function(item) {
                var itemVal = item.val();
                FirebaseInboxJsonInbox.push(itemVal);

            });

        });

            consolepro.consolelog('FirebaseInboxJsonInbox', FirebaseInboxJsonInbox);
            var len = FirebaseInboxJsonInbox.length;
            consolepro.consolelog('FirebaseInboxJsonInbox len', len);

            // consolepro.consolelog('user inbox data',data.val().count);
            // var count_old = data.val() == null ? 0 : data.val().count;
            // consolepro.consolelog('count_old_check', count_old);


        inboxoffcheck = 1
        var inbox = []
        consolepro.consolelog('FirebaseInboxJsonInbox get in-box121', FirebaseInboxJsonInbox);
        var len = FirebaseInboxJsonInbox.length;
        consolepro.consolelog('FirebaseInboxJson len', len);
        if (len > 0) {
            
            FirebaseInboxJsonInbox.sort((a, b) => {
                var x = a.lastMsgTime, y = b.lastMsgTime;
                return x > y ? -1 : x < y ? 1 : 0;
            });
            consolepro.consolelog('FirebaseInboxJsonmessage', FirebaseInboxJson);
            console.log('FirebaseInboxJsonmessage', FirebaseInboxJsonInbox);
            let other_user_id55 = 0
          
            for (let k = 0; k < FirebaseInboxJsonInbox.length; k++)
            
            {
                let keyValue = FirebaseInboxJsonInbox[k]
                 
                    consolepro.consolelog('message user_id', keyValue);
                    var other_user_id = keyValue.user_id;
                    var blockstatus = keyValue.block_status
                    other_user_id55 = keyValue.user_id;
                    consolepro.consolelog('other_user_id55', other_user_id55)
                    consolepro.consolelog('other_user_id', other_user_id)
                    consolepro.consolelog('FirebaseUserJson', FirebaseUserJson);
                    var user_data_other = FirebaseUserJson.findIndex(x => x.user_id == other_user_id);
                    consolepro.consolelog("user_data_other", user_data_other);
                    if (user_data_other != -1) {
                        var userDataMe = FirebaseUserJson[user_data_other];

                        consolepro.consolelog('userdata', userDataMe)
                        var count = keyValue.count;
                        var lastMessageType = keyValue.lastMessageType;
                        var lastMsg = keyValue.lastMsg;
                        var lastMsgTime = keyValue.lastMsgTime;

                        consolepro.consolelog('lastMsg', lastMsg);
                        var userId = userDataMe.user_id;
                        if (userDataMe.login_type == 'app') {
                            var userImage = config.img_url + userDataMe.image;
                        }
                        else {
                            var userImage = config.img_url + userDataMe.image;
                        }

                        var userName = userDataMe.name;
                        var onlineStatus = userDataMe.onlineStatus;

                        var lastMsgShow = '';
                        if (lastMessageType == 'text') {
                            lastMsgShow = lastMsg;
                        } else if (lastMessageType == 'image') {
                            lastMsgShow = 'Photo';
                        }

                        var imgOnline = '';

                        var countHtml = '';
                        consolepro.consolelog('lastMsgTime', lastMsgTime);
                        if (lastMsgTime != '') {
                            lastMsgTime = this.convertTimeAllFormat(lastMsgTime, 'date_time');
                            countHtml = '';
                        } else {
                            lastMsgTime = '';
                        }
                        if (count > 0) {
                            countHtml = count;
                        }
                        consolepro.consolelog('myuserid', user_id)
                        consolepro.consolelog('otheruserid', other_user_id)
                        var blockinbox='no'

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
            
                                            consolepro.consolelog('blockinbox290', blockinbox)
            
                                           // this.setState({blocked_by_other_user:blockinbox})
                
                                        }
                                    }
                                }
                            }
                        }

                        if (user_id != other_user_id) {
                            let data5 = {
                                'name': userName,
                                'images': userImage,
                                'message': lastMsgShow,
                                'time': lastMsgTime,
                                'count': count,
                                'other_user_id': other_user_id,
                                'blockstatus': blockstatus,
                                'vip_staus_me': userdata.vip_staus_me,
                                'online_status': onlineStatus,
                                'blockinbox':blockinbox

                            };
                            consolepro.consolelog('lastMsgShowlastMsgShow', lastMsgShow);
                            consolepro.consolelog('nilesh1 count', count);
                            consolepro.consolelog('upervalapushdataconsole', data5)

                            inbox.push(data5)
                            consolepro.consolelog('pushdataconsoleafter', inbox)
                        }
                    }
                    consolepro.consolelog('inboxmessage', inbox)

                // }

            }
        }

        this.setState({ inboxmessage: inbox, inboxmessage2: inbox, refresh: false })
        

    }

    SearchFilterFunction = (text) => {
        let data1 = this.state.inboxmessage2
        const newData = data1.filter(function (item) {
            const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
       
        if (newData.length > 0) {
            this.setState({
                inboxmessage: newData,
            });
        }
        else {
            this.setState({
                inboxmessage: 'NA',
            });
            this.setState({ msg: 'This Type of data is not available' })
        }
    }

    _onRefresh = () => {
        this.setState({ refresh: true })
        this.showUserInbox()
    }

    loadMore = () => {
        consolepro.consolelog('vikas')
        if (this.state.notification_arr != 'NA') {
            this.setState({
                loadMoreloading: true, page: this.state.page + 1
            }, () => {
                this.getallnotification1()
            });
        }
    }

    checkfreindstatus = async (item) => {
        this.props.navigation.navigate('Chat',
            {
                'chatdata': {
                    'other_user_id': item.other_user_id,
                    'other_user_name': item.name,
                    'image': item.images,
                    blockstatus: item.blockstatus
                }
            })
    }
    //2-------  class_arr1 error-------//
    StudentErrorImage2 = (item, index) => {
        consolepro.consolelog('I am in image error image')
        let data = this.state.inboxmessage
        data[index].images = null;
        this.setState({ inboxmessage: data })
    }
    renderitem = ({ item, index }) => {
        if (this.state.inboxmessage.length >= 0) {
            consolepro.consolelog('item.image', item.images)
            consolepro.consolelog('titleee-', item)
            return (
                <TouchableOpacity
                    onPress={() => { this.checkfreindstatus(item) }}
                    activeOpacity={0.7}
                    style={{
                        width: mobileW * 90 / 100, alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                        marginBottom: mobileH * 2.5 / 100
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{
                        }}>
                            <ImageBackground
                                onError={() => this.StudentErrorImage2(item, index)}
                                imageStyle={{
                                    width: mobileW * 13 / 100,
                                    height: mobileW * 13 / 100,
                                    borderRadius: mobileW * 6.5 / 100
                                }}
                                style={{
                                    width: mobileW * 13 / 100,
                                    height: mobileW * 13 / 100,
                                    borderRadius: mobileW * 6.5 / 100
                                }}
                                source={item.images != null ? { uri: item.images } : localimag.userplaceholder}
                            ></ImageBackground>
                            {item.blockinbox=='no' &&
                            <> 
                            {item.online_status == "false" &&
                                <View style={{
                                    width: mobileW * 2.2 / 100, height: mobileW * 2.2 / 100
                                    , backgroundColor: Colors.redColor,
                                    borderRadius: mobileW * 50 / 100,
                                    alignSelf: 'flex-end',
                                    bottom: mobileH * 2 / 100
                                }}></View>}
                            {item.online_status == "true" &&
                                <View style={{
                                    width: mobileW * 2.2 / 100, height: mobileW * 2.2 / 100
                                    , backgroundColor: Colors.green_color,
                                    borderRadius: mobileW * 50 / 100,
                                    alignSelf: 'flex-end',
                                    bottom: mobileH * 2 / 100
                                }}></View>}
                                 </>}
                        </View>
                        <View style={{
                            width: mobileW * 50 / 100, marginLeft: mobileW * 1.5 / 100,
                            marginRight: config.textalign == 'left' ? 0 : mobileW * 1.5 / 100

                        }}>
                            <Text style={{ fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100, color: Colors.black_color, textAlign: 'left' }}>{item.name}</Text>
                            <Text numberOfLines={1} style={{ fontFamily: Font.FontMedium, fontSize: mobileW * 3.2 / 100, color: Colors.black_color, textAlign: 'left' }}>{item.message}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{ fontFamily: Font.FontSemiBold, fontSize: mobileW * 2.7 / 100, color: Colors.placeholder_color, textAlign: config.textalign }}>{item.time}</Text>
                        {
                            item.count > 0 &&
                            <View
                                style={{
                                    width: mobileW * 4.5 / 100, height: mobileW * 4.5 / 100,
                                    backgroundColor: Colors.theme_color,
                                    borderRadius: mobileW * 50 / 100,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    alignSelf: config.textalign == 'left' ? 'flex-end' : 'flex-start',
                                    marginTop: mobileH * 0.2 / 100
                                }}
                            ><Text style={{ fontFamily: Font.FontRegular, fontSize: mobileW * 2.8 / 100, color: Colors.white_color }}>{item.count}</Text></View>
                        }
                    </View>
                </TouchableOpacity>
            )
        }
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    hidden={false}
                    translucent={false}
                    barStyle="light-content"
                    networkActivityIndicatorVisible={true}
                />
                 
                    <View style={{ paddingVertical: mobileH * 1 / 100, backgroundColor: Colors.theme_color }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.theme_color, paddingHorizontal: mobileW * 3 / 100 }}>
                            <TouchableOpacity
                                onPress={() => { }}
                                activeOpacity={0.9}
                                style={{ width: mobileW * 10 / 100, alignItems: 'center', justifyContent: 'center', height: mobileW * 10 / 100, }}>
                            </TouchableOpacity>
                            <Text style={{ fontFamily: Font.FontMedium, fontSize: mobileW * 5 / 100, color: Colors.white_color }}>{Lang_chg.chats_txt[config.language]}</Text>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={{ width: mobileW * 10 / 100, alignItems: 'center', justifyContent: 'center', height: mobileW * 10 / 100, }}>
                               
                            </TouchableOpacity>
                        </View>
                    </View>
                     <View style={{ width: mobileW, backgroundColor: Colors.theme_color, alignItems: 'center' }}>
                        <View style={{ backgroundColor: Colors.theme_color, paddingVertical: mobileH * 1 / 100, flexDirection: 'row', alignItems: 'center', width: mobileW * 92 / 100, justifyContent: 'space-between' }}>
                            <View style={{
                                width: mobileW * 90 / 100,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: Colors.theme_color,
                                borderWidth: 1,
                                height: mobileH * 5.5 / 100,
                                backgroundColor: Colors.white_color
                            }}>

                                <TextInput style={{
                                    fontFamily: Font.FontMedium, width: mobileW * 80 / 100, backgroundColor: Colors.white_color,
                                    fontSize: mobileW * 3 / 100,
                                    marginLeft: mobileW * 2 / 100,
                                    marginRight: config.textalign == 'left' ? 0 : mobileW * 2 / 100
                                }}
                                    placeholderTextColor={Colors.placeholder_color}
                                    placeholder={Lang_chg.search_here_txt[config.language]}
                                    keyboardType='default'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.SearchFilterFunction(txt) }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        this.mobilefield.clear(),
                                            this.setState({
                                                inboxmessage: this.state.inboxmessage2
                                            })
                                    }
                                    }
                                    activeOpacity={0.7}
                                >
                                    <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100}} source={localimag.cancel}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, alignItems: 'center', justifyContent: 'center', paddingBottom: mobileH * 10 / 100 }} keyboardShouldPersistTaps='handled'>
                    <View>
                        <View style={{ marginTop: mobileH * 2 / 100 }}>

                            {(this.state.inboxmessage.length <= 0 || this.state.inboxmessage == 'NA') ?
                                <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: mobileH * 50 / 100, width: mobileW }}>
                                    <Image resizeMode='contain' style={{ width: mobileW, height: mobileW }} source={localimag.no_data}></Image>
                                </View>
                                :
                                <FlatList
                                    style={{ marginTop: 10 }}
                                    data={this.state.inboxmessage}
                                    renderItem={this.renderitem}

                                    keyExtractor={(item, index) => index.toString()}
                                />
                            }
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
} export default Inbox

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: Colors.white_color
    },
    headstyle: {
        fontFamily: Font.FontSemiBold,
        fontSize: mobileW * 4.5 / 100,
        color: Colors.black_color
    },
    headview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: mobileH * 2 / 100
    },
    view_all: {
        fontFamily: Font.FontSemiBold,
        fontSize: mobileW * 3.5 / 100,
        color: Colors.black_color
    }


})

