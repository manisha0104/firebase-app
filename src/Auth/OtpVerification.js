import React, { Component, useRef } from 'react'
import { View, Text, SafeAreaView, StatusBar, ImageBackground, Image, TouchableOpacity, TextInput, BackHandler, Alert,Keyboard } from 'react-native'
import OTPTextView from 'react-native-otp-textinput'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag,notification } from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CountDown from 'react-native-countdown-component';
export default class OtpVerification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otpText: '',
            otp: '',
            user_id: 0,
            showbtn: false,
        }
    }
    componentDidMount() {
        consolepro.consolelog('Iam otp page ')
    }


    //--------------------------resend funcation ---------------------
    Resendotpbtn = async () => {
        if(config.app_status==0)
        {
            this.setState({ showbtn: false, })
            return false
        }else
        {
        Keyboard.dismiss()
        let result = await localStorage.getItemString('user_id');
        consolepro.consolelog('result', result);
        let user_id_get = 0;
        if (result != null) {
            user_id_get = result;
            this.setState({
                user_id: user_id_get,
            })
        }
        let url = config.baseURL + "resend_otp.php";
        var data = new FormData();
        data.append('user_id', user_id_get)
        consolepro.consolelog('data', data)
        apifuntion.postApi(url, data, 1).then((obj) => {
            consolepro.consolelog('user_arr', obj)
            if (obj.success == 'true') {
                let otp = (obj.otp).toString();
                var email_arr = obj.email_arr;
                consolepro.consolelog('resend', obj);
                this.setState({ showbtn: false, })
            }
            else {
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);

        });
    }
    }

    //-------------------otp verification funcation----------------------


    Otpveryfication = async () => {

        if(config.app_status==0)
        {
            this.props.navigation.navigate('Home')
            return false
        }else
        {
        Keyboard.dismiss()
        let result = await localStorage.getItemString('user_id');
        consolepro.consolelog('result', result);
        let user_id_get = 0;
        if (result != null) {
            user_id_get = result;
            this.setState({
                user_id: user_id_get,
            })
        }
        var otp = this.state.otp;
        if (otp.length <= 0) {
            msgProvider.toast(msgText.emptyOtp[config.language], 'center')
            return false
        }
        if (otp.length < 4) {
            msgProvider.toast(msgText.otpMinLength[config.language], 'center')
            return false
        }
        let url = config.baseURL + "otp_verify.php";
        var data = new FormData();
        data.append('user_id',user_id_get)
        data.append('otp', otp)
        consolepro.consolelog('data', data)
        apifuntion.postApi(url, data, 1).then((obj) => {
            consolepro.consolelog('otp res', obj)
            if (obj.success == 'true') {
                var user_arr = obj.user_details;
                let user_id = user_arr.user_id;
                let email = user_arr.email;
                let otp_verify = user_arr.otp_verify;
                let profile_complete = user_arr.profile_complete;
                var notification_arr = obj.notification_arr;
                consolepro.consolelog({ notification_arr })
                if (otp_verify == 0) {
                    this.setState({
                        user_id: user_id,
                        email: email,
                        showbtn: false
                    })
                }
                if (otp_verify == 1) {
                    {
                        consolepro.consolelog({ notification_arr })
                        if (notification_arr != "NA") {
                            consolepro.consolelog({ notification_arr })
                            notification.notification_arr(notification_arr);
                        }
                        this.setState({
                            otppopup: false,
                        })
                        localStorage.setItemString('user_id', JSON.stringify(user_id));
                        localStorage.setItemObject('user_arr', user_arr);
                        localStorage.setItemString('email', this.state.email);
                        this.props.navigation.navigate('Home')
                    }
                }
            }
            else {
                setTimeout(() => {
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }, 300);

            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);
        });
    }
    }


    render() {
        return (

            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.theme_color }}>
                <StatusBar
                    barStyle='light-content'
                    backgroundColor={Colors.statusbarcolor}
                    hidden={false} translucent={false}
                    networkActivityIndicatorVisible={true} />
                {/* ........................Background...................... */}


                <KeyboardAwareScrollView

                    showsVerticalScrollIndicator={false}>
                    <TouchableOpacity
                        onPress={() => { this.props.navigation.goBack() }}
                        style={{
                            flexDirection: 'row',
                            padding: mobileW * 4 / 100,
                        }}>
                        <Image
                            style={{
                                height: mobileW * 5 / 100,
                                width: mobileW * 5 / 100,
                                resizeMode: 'contain'
                            }}
                            source={localimag.back}
                        ></Image>
                    </TouchableOpacity>
                    <View style={{
                        paddingHorizontal: mobileW * 4 / 100,
                        paddingVertical: mobileW * 2 / 100,
                        flexDirection: 'row',
                        justifyContent: 'flex-start'

                    }}>
                        <Text
                            style={{
                                color: Colors.whiteColor,
                                fontSize: mobileW * 5 / 100,
                                fontFamily: Font.SemiBold
                            }}>
                            {Lang_chg.OTP_txt[config.language]}
                        </Text>
                    </View>


                    <View
                        style={{
                            flexDirection: 'row',
                            paddingHorizontal: mobileW * 4 / 100,
                            paddingVertical: mobileW * 2 / 100,
                            justifyContent: 'flex-end'
                        }}>
                        <Text
                            style={{
                                color: Colors.whiteColor,
                                fontFamily: Font.Medium
                            }}>
                            {Lang_chg.email_txt[config.language]}
                        </Text>
                    </View>
                    {/* .....................Text input............... */}

                    <OTPTextView
                        handleTextChange={(text) => {
                            this.setState({ otp: text }),
                                console.log(text)
                        }}
                        containerStyle={{
                            marginVertical: mobileW * 10 / 100,
                            width: mobileW * 55 / 100,
                            alignSelf: 'center'
                        }}
                        textInputStyle={{
                            borderRadius: mobileW * 2 / 100,
                            borderWidth: mobileW * 0.2 / 100,
                            width: mobileW * 8 / 100,
                            color: Colors.orange
                        }}
                        inputCount={4}
                        inputCellLength={1}
                        // tintColor={Colors.orange}
                        offTintColor={Colors.whiteColor}
                    />
                    {/* ..............button............. */}
                    <TouchableOpacity
                        onPress={() => {
                            this.Otpveryfication()
                        }}


                        style={{
                            height: mobileW * 12 / 100,
                            width: mobileW * 45 / 100,
                            backgroundColor: Colors.whiteColor,
                            alignSelf: 'center',
                            borderRadius: mobileW * 10 / 100,
                            alignItems: "center",
                            justifyContent: 'center',
                            marginTop: mobileW * 7 / 100
                        }} >
                        <Text style={{
                            fontSize: mobileW * 5 / 100,
                            color: Colors.theme_color,
                            fontFamily: Font.FontBold
                        }}>
                            {Lang_chg.verify_txt[config.language]}
                        </Text></TouchableOpacity>
                        {this.state.showbtn == false ?
                                        <CountDown
                                            until={5 * 2}
                                            size={mobileW * 3.3 / 100}
                                            onFinish={() => { this.setState({ showbtn: true }) }}
                                            digitStyle={{ backgroundColor: Colors.whiteColor }}
                                            digitTxtStyle={{ color: Colors.redColor }}
                                            timeLabelStyle={{ color: Colors.time_lable_color, fontSize: 1, }}
                                            timeToShow={['M', 'S']}
                                            timeLabels={{ m: '', s: '' }}
                                            showSeparator={true}
                                            separatorStyle={{ color: Colors.redColor }}
                                            style={{
                                                paddingTop: 5.5,
                                                paddingBottom: 5.5
                                            }}
                                        />
                                        : <TouchableOpacity
                                            onPress={() => this.Resendotpbtn()}
                                            activeOpacity={0.7}  
                                            style={{alignItems:'center'}}
                                        >
                                            <View >
                                                <Text style={{ color: 'red', fontSize: mobileW * 4 / 100, fontFamily: Font.FontSemiBold,alignItems:'center' }}>{Lang_chg.resend_txt[config.language]}</Text>
                                            </View>
                                        </TouchableOpacity>}
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}
