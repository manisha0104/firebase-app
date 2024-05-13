import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput, RefreshControl } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class Notification extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: 0,
            profile_pic: '',
            notification_arr: 'NAA',
            notification_arr1: 'BA',
            refresh: false,
            loaddata: true,
            offset: 0,
        }
    }

    componentDidMount() {
        if (config.app_status == 1) {
            this.getNotification(0)
        }else{
            this.setState({notification_arr: 'NA'})
        }
    }

    //-------------------function for get notification-------------------//

    getNotification = async (var1) => {
        let result = await localStorage.getItemString('user_id');
        consolepro.consolelog('result', result);
        if (result != null) {
            let user_id_get = '';
            if (result != null) {
                user_id_get = result;
            }
            this.setState({
                user_id: user_id_get,
            })

            {
                var var2 = 0;
                if (var1 == 1) {
                    var2 = 1;
                }
                let url = config.baseURL + "get_notification.php";
                var data = new FormData();
                data.append('user_id', user_id_get)
                data.append('offset', this.state.offset)
                consolepro.consolelog('url', url)
                apifuntion.postApi(url, data, var2).then((obj) => {
                    consolepro.consolelog(obj)

                    if (obj.success == 'true') {
                        consolepro.consolelog('notification_data', obj);
                        var notification_arr = obj.notification_arr;
                        var notification_count = obj.notification_count;

                        consolepro.consolelog('noti_count_1', notification_count_1)

                        notification_count_1 = notification_count;
                        consolepro.consolelog('noti_count_2', notification_count_1)
                        this.setState({ loaddata: obj.loadmore });
                        if (notification_arr != "NA") {
                            if (this.state.offset == 0) {
                                this.setState({
                                    notification_arr: notification_arr,
                                    notification_arr1: notification_arr,
                                    refresh: false,
                                    loaddata: obj.loadmore,
                                })
                            }
                            else {
                                consolepro.consolelog('offset1', this.state.offset)
                                if (obj.notification_arr != 'NA') {
                                    let array1 = this.state.notification_arr
                                    let array2 = obj.notification_arr
                                    var newArray = array1.concat(array2);
                                    consolepro.consolelog('newArray', newArray)
                                    this.setState({
                                        notification_arr: newArray, refresh: false,
                                        notification_arr1: newArray,
                                    });
                                }
                                this.setState({ loaddata: obj.loadmore });
                            }
                            consolepro.consolelog('notification_arr', this.state.notification_arr)
                            if (this.state.notification_arr != 'NA') {
                                let data = this.state.notification_arr
                                this.setState({
                                    offset: data.length,
                                    refresh: false
                                })
                            }
                        }
                        else {
                            if (this.state.offset == 0) {
                                this.setState({
                                    notification_arr: 'NA',
                                    notification_arr1: 'BA',
                                    refresh: false
                                })
                            }
                        }
                    } else {
                        if (obj.account_active_status == 0) {
                            config.checkUserDeactivate(this.props.navigation);
                            return false;
                        }
                        msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                        return false;
                    }
                }).catch((error) => {
                    consolepro.consolelog("-------- error ------- " + error);

                    msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
                })

            }
        }
    }
    //-------------------function for pull to reload---------------//

    _onRefresh = async () => {
        if(config.app_status==1){
            this.setState({
                loaddata: true,
                offset: 0,
            })
            consolepro.consolelog('_onRefresh', '_onRefresh')
            this.setState({ refresh: true })
            setTimeout(() => {
                this.getNotification(1)
            }, 500);
        }
        
    }


    //-------------is close to bottom function----------
    isCloseToBottom = (nativeEvent) => {
        const paddingToBottom = 10
        return nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - paddingToBottom
    }

    //-----------function for load more--------------
    loadmore = () => {
        if (this.state.loaddata == true) {
            this.getNotification(0)
        }
    }

    //----------------function for clear all notifications------------//

    deleteAll = (user_id) => {


        Alert.alert(Lang_chg.info[config.language], Lang_chg.areyousure_txt[config.language], [
            {
                text: Lang_chg.no_txt[config.language],
                onPress: () => { consolepro.consolelog('nothing') },
                style: "cancel"
            },
            // { text: Lang_chg.YesTxt[config.language], onPress: () => { consolepro.consolelog('nothing') } }
            { text: Lang_chg.yes_txt[config.language], onPress: () => { this.deleteAllConfirm(user_id) } }
        ], { cancelable: false });
    }


    //----------------function for delete all notification----------------//

    deleteAllConfirm = (user_id) => {


        let url = config.baseURL + "delete_all_notification.php";
        var data = new FormData();
        data.append('user_id', user_id)
        consolepro.consolelog('url', url)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog(obj)

            if (obj.success == 'true') {
                consolepro.consolelog('notification_data', obj);
                msgProvider.toast(obj.msg[config.language], 'center')
                this.setState({
                    loaddata: true,
                    offset: 0,
                })
                setTimeout(() => {
                    this.getNotification(0)
                }, 300);

            } else {
                if (obj.active_status == 0) {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);

            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        })

    }
    //---------------function for delete single notification----------//

    deleteSingle = (notification_id) => {
        let { user_id } = this.state;
        //alert(notification_id)
        //alert(user_id)
        let url = config.baseURL + "delete_single_notification.php";
        var data = new FormData();
        data.append('user_id', user_id)
        data.append('notification_id', notification_id)
        consolepro.consolelog('url', url)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog(obj)
            if (obj.success == 'true') {
                consolepro.consolelog('notification_data', obj);
                msgProvider.toast(obj.msg[config.language], 'center')
                this.setState({
                    loaddata: true,
                    offset: 0,
                })
                setTimeout(() => {
                    this.getNotification(1)
                }, 300);
            } else {
                if (obj.active_status == 0) {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);

            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        })
    }


    //---------------on click of notification-------------//
    onClick = (action, action_id) => {
        consolepro.consolelog('I am in on click of notification')
        consolepro.consolelog({ action, action_id })
        if (action == 'add_subscription_order' || action == 'cancel_subscription_order' || action == 'add_subscription' || action == 'update_subscription_order' || action == 'edit_subscription_notification' || action == 'subscription_order') {
            this.props.navigation.navigate('SubscriptionHistoryDetails',
                {
                    subscription_order_id: action_id
                })
        }
        else {
            if (action == 'buy_subscription' || action == 'cancel_subscription') {
                this.props.navigation.navigate('MySubscription')
            }
            else {
                if (action == 'cancel_one_time_purchase_order' || action == 'add_one_time_purchase_order' || action == 'update_one_time_purchase_order' || action == 'normal_order') {
                    this.props.navigation.navigate('OrderHistoryDetails',
                        {
                            order_id: action_id
                        })
                } else {
                    if (action == 'subscription_reminder') {
                        this.props.navigation.navigate('MySubscription')
                    }
                }
            }
        }
    }

    render() {


        return (

            <SafeAreaView style={styles.container}>
                <StatusBar
                    hidden={false}
                    // backgroundColor={Colors.back_color}
                    translucent={false}
                    barStyle="light-content"
                    networkActivityIndicatorVisible={true}
                />
                <View style={{ width: mobileW, backgroundColor: Colors.theme_color, alignItems: 'center' }}>
                    <View style={{ backgroundColor: Colors.theme_color, height: mobileH * 8 / 100, flexDirection: 'row', alignItems: 'center', width: mobileW * 92 / 100, justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ width: mobileW * 20 / 100 }}
                        >
                        </TouchableOpacity>
                        <View style={{ width: mobileW * 50 / 100, alignItems: 'center', alignSelf: 'center', }}><Text style={{ fontSize: mobileW * 5.5 / 100, fontFamily: Font.FontRegular, color: Colors.white_color }}>{Lang_chg.notifications_txt[config.language]}</Text></View>

                        {this.state.notification_arr != 'NA' ?
                            <TouchableOpacity
                                onPress={() =>  this.deleteAll(this.state.user_id)}
                                style={{ alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderColor: Colors.white_color }}

                            >
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.FontBold, color: Colors.white_color }}>{Lang_chg.clear_all[config.language]}</Text>
                            </TouchableOpacity> : <TouchableOpacity
                                //onPress={() =>  this.deleteAll(this.state.user_id)}
                                style={{ alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderColor: Colors.white_color }}

                            >
                                <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.FontBold, color: Colors.white_color }}>{Lang_chg.clear_all[config.language]}</Text>
                            </TouchableOpacity>}
                    </View>
                </View>
                <KeyboardAwareScrollView
                    // onMomentumScrollEnd={({ nativeEvent }) => {
                    //     consolepro.consolelog('scroll end try', nativeEvent)
                    //     if (this.isCloseToBottom(nativeEvent)) {
                    //         consolepro.consolelog('scroll end success', nativeEvent)
                    //         this.loadmore()
                    //     }
                    // }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refresh}
                            onRefresh={this._onRefresh}
                            tintColor={Colors.theme_color}
                            colors={[Colors.theme_color]}
                        //tintColor="#fff" titleColor="#fff" colors={[Colors.theme_color, "green", "blue"]}
                        />
                    }
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, }}
                    keyboardShouldPersistTaps='handled'>
                    {config.app_status == 1 ?
                        <>
                            {this.state.notification_arr != 'NA' && this.state.notification_arr != 'NAA' &&
                                <View style={{ paddingBottom: mobileH * 10 / 100 }}>
                                    <FlatList
                                        data={this.state.notification_arr}
                                        horizontal={false}
                                        // refreshing={this.state.refresh}
                                        // onRefresh={this._onRefresh}
                                        renderItem={({ item, index }) =>
                                            <TouchableOpacity
                                                onPress={() => this.onClick(item.action, item.action_id)}
                                                activeOpacity={0.7}>
                                                <View style={{ paddingVertical: 18, borderBottomWidth: 1, borderColor: Colors.border_color }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', width: mobileW * 73 / 100 }}>
                                                            {item.image != null ?
                                                                <Image
                                                                    onError={() => {
                                                                        consolepro.consolelog('error')
                                                                        var arr = this.state.notification_arr
                                                                        arr[index].image = null
                                                                        this.setState({
                                                                            notification_arr: arr
                                                                        })
                                                                    }}
                                                                    resizeMode='cover' style={{ width: mobileW * 14 / 100, height: mobileW * 14 / 100, borderRadius: mobileW * 7 / 100 }} source={{ uri: config.img_url + item.image }}></Image>
                                                                :
                                                                <Image resizeMode='cover' style={{ width: mobileW * 14 / 100, height: mobileW * 14 / 100, borderRadius: mobileW * 7 / 100 }} source={localimag.userplaceholder}></Image>
                                                            }
                                                            <View>
                                                                <View style={{ flexDirection: 'row', marginLeft: mobileW * 2.5 / 100, }}>
                                                                    <Text style={{ color: Colors.not_time_color, fontFamily: Font.FontBold, fontSize: mobileW * 2.5 / 100 }}>{item.noti_datetime}</Text>
                                                                </View>
                                                                <Text style={{ marginLeft: mobileW * 2.5 / 100, color: Colors.black_color, fontSize: mobileW * 3.5 / 100, fontFamily: Font.FontBold, width: mobileW * 64 / 100 }}>{item.message}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ alignItems: 'center' }}>
                                                            <TouchableOpacity
                                                                onPress={() => this.deleteSingle(item.notification_message_id)}
                                                                style={{ width: mobileW * 7 / 100, height: mobileW * 5 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}

                                                            >
                                                                <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, }}
                                                                    source={localimag.cancel}></Image>
                                                            </TouchableOpacity>

                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                    />
                                    {this.state.loaddata == true &&
                                        <View style={{ alignItems: 'center', alignSelf: 'center' }} >
                                            <TouchableOpacity
                                                onPress={() => this.loadmore()}
                                                activeOpacity={0.7} style={{
                                                    backgroundColor: Colors.theme_color,
                                                    height: mobileH * 3 / 100,
                                                    width: mobileW * 30 / 100,
                                                    alignSelf: 'center',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    borderRadius: 20,
                                                    marginTop: mobileH * 5 / 100
                                                }}>
                                                <Text style={{ color: '#f5f4f5', fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100 }}>View more</Text>
                                            </TouchableOpacity>
                                        </View>}
                                </View>}
                            {this.state.notification_arr == 'NA' && <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: mobileH * 60 / 100 }}>
                                <Image resizeMode='contain' style={{ width: mobileH *40 / 100, height: mobileH *40 / 100 }} source={localimag.no_data}></Image>
                            </View>}
                        </>
                        :
                        <>
                            <TouchableOpacity
                                activeOpacity={0.7}>
                                <View style={{ paddingVertical: 18, borderBottomWidth: 1, borderColor: Colors.border_color }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', width: mobileW * 80 / 100 }}>
                                            <Image resizeMode='cover' style={{ width: mobileW * 14 / 100, height: mobileW * 14 / 100, borderRadius: mobileW * 7 / 100 }} source={localimag.userplaceholder}></Image>
                                            <View>
                                                <View style={{ flexDirection: 'row', marginLeft: mobileW * 2.5 / 100, }}>
                                                    <Text style={{ color: Colors.not_time_color, fontFamily: Font.FontBold, fontSize: mobileW * 2.5 / 100 }}>17-09-2021</Text>
                                                    <Text style={{ color: Colors.not_time_color, fontFamily: Font.FontBold, fontSize: mobileW * 2.5 / 100 }}>8:00 Am</Text>
                                                </View>
                                                <Text style={{ marginLeft: mobileW * 2.5 / 100, color: Colors.black_color, fontSize: mobileW * 3.5 / 100, fontFamily: Font.FontBold, width: mobileW * 64 / 100 }}>Your parcel will be arrived on 04/10/21</Text>
                                            </View>
                                        </View>
                                        <View style={{ alignItems: 'center' }}>
                                            <TouchableOpacity
                                                style={{ width: mobileW * 3.5 / 100, height: mobileW * 5 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}

                                            >
                                                <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, }}
                                                    source={localimag.cancel}></Image>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </>}

                </KeyboardAwareScrollView>
            </SafeAreaView>


        )
    }
} export default Notification

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white_color
    },


})

