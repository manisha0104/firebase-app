import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput,Linking } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW,localimag } from '../Provider/utilslib/Utils';
import { Switch } from 'react-native-paper';
import Share from 'react-native-share'
class Setting extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_id: 0,
            amount: 0,
            isSwitchOn: false,
            logoutModal: false,
            rateappurl: '',
            sharemsg: '',
            password_hide: false,
        }
    }

    componentDidMount() {
        consolepro.consolelog('I am on settings page')
        this.getUserId()
        if(config.app_status==1){
            this.getContent()
        }
    }
    //-------------- function for get content arr--------------//
    getContent = async () => {

        let url = config.baseURL + "get_all_content.php?user_id=1";
        consolepro.consolelog('url', url)
        apifuntion.getApi(url, 1).then((obj) => {
            consolepro.consolelog(obj)
            if (obj.success == 'true') {
                consolepro.consolelog('content_obj', obj);
                consolepro.consolelog('content_arr', obj.content_arr)
                consolepro.consolelog('rateappios', obj.content_arr[5].content)
                consolepro.consolelog('rateappandroid', obj.content_arr[4].content)
                consolepro.consolelog('sharemsg', obj.content_arr[6].content)
                var rateappurl = '';
                content_arr = obj.content_arr;
                if (config.device_type == 'ios') {
                    rateappurl = obj.content_arr[5].content;
                }
                if (config.device_type == 'android') {
                    rateappurl = obj.content_arr[4].content;
                }
                consolepro.consolelog('sharemsg', obj.content_arr[6].content)
                this.setState({ sharemsg: obj.content_arr[6].content })
                consolepro.consolelog('rateapp', rateappurl)
                this.setState({ rateappurl: rateappurl });
            } else {
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        })
    }

    //-------------------------get user details-------------------
    getUserId = async () => {
        let result = await localStorage.getItemObject('user_arr');
        consolepro.consolelog('result', result);
        if (result != null) {
            let user_id_get = 0;
            if (result != null) {
                user_id_get = result.user_id
                if (result.notification_status == 0) {
                    this.setState({ isSwitchOn: false })
                }
                else {
                    this.setState({ isSwitchOn: true })
                }
                consolepro.consolelog('login_type', result.login_type)
                if (result.login_type == 'app') {

                    this.setState({ password_hide: false })
                }
                else {
                    this.setState({ password_hide: true })
                }
            }
            this.setState({
                user_id: user_id_get,
            })
        }
    }

    //--------rate us ------------------==
    rate_app = () => {
        consolepro.consolelog('I am in rate app ')
        if(config.app_status==1){
            Linking.openURL(this.state.rateappurl).catch(err =>
                alert('Please check for the Google Play Store')
            );
        }
    }
    //------------------function for share app message-------------------
    shareappbtn = () => {
        console.log(this.state.sharemsg)
        if(config.app_status==1){
        let shareOptions = {
            message: this.state.sharemsg,
            failOnCancel: false,
        };
        Share.open(shareOptions)
    }
    }
    //--------------------------- function for notification on/off=-----------

    //--------------------------- function for notification on/off=-----------

    onToggleSwitch = () => {
        this.setState({ isSwitchOn: !this.state.isSwitchOn })
        let { user_id, isSwitchOn } = this.state;
        consolepro.consolelog({ user_id, isSwitchOn })
        if (user_id != 0) {
            let notification_status = 0;
            if (isSwitchOn == true) {
                notification_status = 0;
            }
            else {
                notification_status = 1;
            }
            let url = config.baseURL + "notification_update.php";
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('notification_status', notification_status)
            consolepro.consolelog('data', data)
            apifuntion.postApi(url, data, 1).then((obj) => {
                consolepro.consolelog('user_arr', obj)
                if (obj.success == 'true') {
                    var user_arr = obj.user_details;
                    var user_id = user_arr.user_id;
                    localStorage.setItemString('user_id', JSON.stringify(user_id));
                    localStorage.setItemObject('user_arr', user_arr);
                    //  firebaseprovider.firebaseUserCreate();
                    //  firebaseprovider.getMyInboxAllData();
                }
                else {
                    if (obj.active_status == 0) {
                        config.checkUserDeactivate(this.props.navigation);
                        return false;
                    }
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                consolepro.consolelog("-------- error ------- " + error);
            });
        }
    }
    //------delete account-----------//
    delete_account = () => {
        consolepro.consolelog('I am in delete account....')
        Alert.alert(
            Lang_chg.delete_account_txt[config.language],
            Lang_chg.are_you_sure_delete_txt[config.language],
            [
                {
                    text: Lang_chg.no_txt[config.language],
                },
                {
                    text: Lang_chg.yes_txt[config.language],
                    onPress: () => this.props.navigation.navigate('DeleteAccount'),
                },
            ],
            { cancelable: false },
        );
    }

    //--------for logout ---------//
    logoutbtn = () => {

        Alert.alert(Lang_chg.Logout_txt[config.language], Lang_chg.are_you_logout[config.language], [
            {
                text: Lang_chg.no_txt[config.language],
                onPress: () => { consolepro.consolelog('nothing') },
            },
            { text: Lang_chg.yes_txt[config.language], onPress: () => config.AppLogout(this.props.navigation) }
        ], { cancelable: false });
    }


    //----for terms and condition
    TermsCondition = () => {
        consolepro.consolelog('iam terms')
        this.props.navigation.navigate('Contentpage', { pagename: Lang_chg.terms_and_condition_txt[config.language], contentpage: 2, user_type: 1 })
    }

    //----for PrivacyPolicy
    PrivacyPolicy = () => {
        consolepro.consolelog('iam privacy')
        this.props.navigation.navigate('Contentpage', { pagename: Lang_chg.privacy_policy_txt[config.language], contentpage: 1, user_type: 1 })
    }

    //----for AboutUs
    AboutUs = () => {
        consolepro.consolelog('iam aboutus')
        this.props.navigation.navigate('Contentpage', { pagename: Lang_chg.about_us_txt[config.language], contentpage: 0, user_type: 1 })
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
                <ScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, }} keyboardShouldPersistTaps='handled'>

                    <View style={{ backgroundColor: Colors.theme_color, height: mobileH * 8 / 100, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ width: mobileW * 9 / 100, height: mobileW * 9 / 100, marginLeft: mobileW * 3.5 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, }}
                                source={localimag.back}></Image>
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', alignSelf: 'center', width: mobileW * 75 / 100 }}><Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.FontSemiBold, color: Colors.back_color }}>{Lang_chg.Setting[config.language]}</Text></View>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 2 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <View style={styles.setting_view}>
                            <View style={styles.setting_icons}>
                                <Image
                                    style={{
                                        height: mobileH * 4 / 100,
                                        width: mobileW * 10 / 100,
                                    }}
                                    source={localimag.notification}></Image>
                            </View>
                            <View style={{ width: mobileW * 70 / 100, marginLeft: mobileW * 1 / 100 }}>
                                <TouchableOpacity activeOpacity={1}>
                                    <Text style={{ color: Colors.setting_text_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4.2 / 100 }}> {Lang_chg.notification[config.language]}</Text>

                                </TouchableOpacity>
                            </View>
                            <Switch
                                color={Colors.theme_color}
                                value={this.state.isSwitchOn}
                                onValueChange={this.onToggleSwitch}
                            />
                        </View>


                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 1 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Changepassword')}
                            activeOpacity={0.7} style={styles.setting_view}>
                            <View style={styles.setting_icons}>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        height: mobileW * 9 / 100,
                                        width: mobileW * 9 / 100,
                                    }}
                                    source={localimag.resetpassword}></Image>

                            </View>
                            <View style={{ width: mobileW * 80 / 100, marginLeft: mobileW * 1 / 100 }}>
                                <View  >
                                    <Text style={{ color: Colors.setting_text_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4.2 / 100 }}> {Lang_chg.changepassword_txt[config.language]}</Text>

                                </View>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 1 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.TermsCondition()}
                            activeOpacity={0.7} style={styles.setting_view}>
                            <View style={styles.setting_icons}>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        height: mobileW * 9 / 100,
                                        width: mobileW * 9 / 100,
                                    }}
                                    source={localimag.terms}></Image>

                            </View>
                            <View style={{ width: mobileW * 80 / 100, marginLeft: mobileW * 1 / 100 }}>
                                <View  >
                                    <Text style={{ color: Colors.setting_text_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4.2 / 100 }}> {Lang_chg.terms_and_condition_txt[config.language]}</Text>

                                </View>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 1 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <TouchableOpacity
                            onPress={() =>  this.PrivacyPolicy()}
                            activeOpacity={0.7} style={styles.setting_view}>
                            <View style={styles.setting_icons}>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        height: mobileW * 9 / 100,
                                        width: mobileW * 9 / 100,
                                    }}
                                    source={localimag.privacy}></Image>

                            </View>
                            <View style={{ width: mobileW * 80 / 100, marginLeft: mobileW * 1 / 100 }}>
                                <View  >
                                    <Text style={{ color: Colors.setting_text_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4.2 / 100 }}> {Lang_chg.privacy_policy_txt[config.language]}</Text>

                                </View>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 1 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.AboutUs()}
                            activeOpacity={0.7} style={styles.setting_view}>
                            <View style={styles.setting_icons}>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        height: mobileW * 9 / 100,
                                        width: mobileW * 9 / 100,
                                    }}
                                    source={localimag.about}></Image>

                            </View>
                            <View style={{ width: mobileW * 80 / 100, marginLeft: mobileW * 1 / 100 }}>
                                <View  >
                                    <Text style={{ color: Colors.setting_text_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4.2 / 100 }}> {Lang_chg.about_us_txt[config.language]}</Text>
                                </View>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 1 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Contactus')}
                            activeOpacity={0.7} style={styles.setting_view}>
                            <View style={styles.setting_icons}>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        height: mobileW * 9 / 100,
                                        width: mobileW * 9 / 100,
                                    }}
                                    source={localimag.contact}></Image>

                            </View>
                            <View style={{ width: mobileW * 80 / 100, marginLeft: mobileW * 1 / 100 }}>
                                <View  >
                                    <Text style={{ color: Colors.setting_text_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4.2 / 100 }}> {Lang_chg.Contactus[config.language]}</Text>
                                </View>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 1 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <TouchableOpacity
                        onPress={()=>{this.props.navigation.navigate('Faq')}}
                            activeOpacity={0.7} style={styles.setting_view}>
                            <View style={styles.setting_icons}>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        height: mobileW * 9 / 100,
                                        width: mobileW * 9 / 100,
                                    }}
                                    source={localimag.rate}></Image>

                            </View>
                            <View style={{ width: mobileW * 80 / 100, marginLeft: mobileW * 1 / 100 }}>
                                <View  >
                                    <Text style={{ color: Colors.setting_text_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4.2 / 100 }}> {Lang_chg.faq_txt[config.language]}</Text>
                                </View>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 1 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <TouchableOpacity
                        onPress={()=>{this.rate_app()}}
                            activeOpacity={0.7} style={styles.setting_view}>
                            <View style={styles.setting_icons}>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        height: mobileW * 9 / 100,
                                        width: mobileW * 9 / 100,
                                    }}
                                    source={localimag.rate}></Image>

                            </View>
                            <View style={{ width: mobileW * 80 / 100, marginLeft: mobileW * 1 / 100 }}>
                                <View  >
                                    <Text style={{ color: Colors.setting_text_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4.2 / 100 }}> {Lang_chg.rate_app[config.language]}</Text>
                                </View>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 1 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <TouchableOpacity
                        onPress={()=>{this.shareappbtn()}}
                            activeOpacity={0.7} style={styles.setting_view}>
                            <View style={styles.setting_icons}>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        height: mobileW * 9 / 100,
                                        width: mobileW * 9 / 100,
                                    }}
                                    source={localimag.shareapp}></Image>

                            </View>
                            <View style={{ width: mobileW * 80 / 100, marginLeft: mobileW * 1 / 100 }}>
                                <View >
                                    <Text style={{ color: Colors.setting_text_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4.2 / 100 }}> {Lang_chg.share_app[config.language]}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 1 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <TouchableOpacity

                            onPress={() => this.delete_account()}
                            activeOpacity={0.7} style={styles.setting_view}>
                            <View style={styles.setting_icons}>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        height: mobileW * 9 / 100,
                                        width: mobileW * 9 / 100,
                                    }}
                                    source={localimag.logout}></Image>

                            </View>
                            <View style={{ width: mobileW * 80 / 100, marginLeft: mobileW * 1 / 100 }}>
                                <View>
                                    <Text style={{ color:Colors.redColor, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4.2 / 100 }}> {Lang_chg.delete_account_txt[config.language]}</Text>
                                </View>
                            </View>

                        </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 1 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                        <TouchableOpacity

                            onPress={() => this.logoutbtn()}
                            activeOpacity={0.7} style={styles.setting_view}>
                            <View style={styles.setting_icons}>
                                <Image
                                    resizeMode='contain'
                                    style={{
                                        height: mobileW * 9 / 100,
                                        width: mobileW * 9 / 100,
                                    }}
                                    source={localimag.logout}></Image>

                            </View>
                            <View style={{ width: mobileW * 80 / 100, marginLeft: mobileW * 1 / 100 }}>
                                <View>
                                    <Text style={{ color:Colors.redColor, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4.2 / 100 }}> {Lang_chg.Logout[config.language]}</Text>
                                </View>
                            </View>

                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </SafeAreaView>


        )
    }
} export default Setting

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.back_color


    },
    view1:
    {
        backgroundColor: Colors.back_color,
        height: mobileH * 8 / 100,

        flexDirection: 'row',
        width: mobileW * 88 / 100,
        alignSelf: 'center',
        alignItems: 'center',

    },
    setting_icons:
    {
        height: mobileH * 6 / 100,
        width: mobileW * 10.5 / 100,
        borderRadius: 10,
        backgroundColor: Colors.theme_color,
        alignItems: 'center',
        justifyContent: 'center'
    },
    setting_view:
    {
        flexDirection: 'row',
        height: mobileH * 8 / 100,
        justifyContent: 'space-between',
        width: mobileW * 90 / 100,
        alignItems: 'center'
    },





})

