
import React, { Component, useRef } from 'react'
import { View, Text, SafeAreaView, StatusBar, ImageBackground, Image, TouchableOpacity, TextInput, BackHandler, Alert, Keyboard } from 'react-native'
import OTPTextView from 'react-native-otp-textinput'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, notification } from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CountDown from 'react-native-countdown-component';
export default class ForgotOTPVerify extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otpText: '',
            user_id: this.props.route.params.user_id,
            showbtn: false,
            forgot_type: this.props.route.params.forgot_type,
            email_mobile: this.props.route.params.email_mobile,
            forgot_id: this.props.route.params.forgot_id,
            otp: this.props.route.params.otp,
            otp_auto_fill: this.props.route.params.otp_auto_fill,
        }
    }
    componentDidMount() {
        consolepro.consolelog('Iam otp forgot page ')
        consolepro.consolelog('Iam otp ', this.state.otp)
        if (this.state.otp_auto_fill == true) {
            this.otpInput.setValue("" + this.state.otp + "");
        }
    }


    //--------------------------resend funcation ---------------------
    Resendotpbtn = async () => {
        if (config.app_status == 0) {
            this.setState({ showbtn: false, })
            return false
        } else {
            Keyboard.dismiss()
            let url = config.baseURL + "forgot_password.php";
            var data = new FormData();
            data.append('email_mobile', this.state.email_mobile)
            data.append('forgot_type', this.state.forgot_type) //----1=email,2=mobile
            consolepro.consolelog('data', data)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('user_arr', obj)
                if (obj.success == 'true') {
                    var forgot_id = obj.forgot_id;
                    var otp = obj.otp;
                    var otp_auto_fill = obj.otp_auto_fill;

                    if (otp_auto_fill == false) {
                        otp = ''
                    } else {
                        this.otpInput.setValue("" + otp + "");
                    }

                    this.setState({
                        forgot_id: forgot_id,
                        otp: otp,
                    })

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

        if (config.app_status == 0) {
            this.props.navigation.navigate('CreatePassword')
            return false
        } else {
            Keyboard.dismiss()

            var otp = this.state.otp;
            if (otp.length <= 0) {
                msgProvider.toast(msgText.emptyOtp[config.language], 'center')
                return false
            }
            if (otp.length < 4) {
                msgProvider.toast(msgText.otpMinLength[config.language], 'center')
                return false
            }
            let url = config.baseURL + "forgot_pass_otp_verify.php";
            var data = new FormData();
            data.append('user_id', this.state.user_id)
            data.append('forgot_id', this.state.forgot_id)
            data.append('otp', otp)
            consolepro.consolelog('data', data)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('otp res', obj)
                if (obj.success == 'true') {
                    this.props.navigation.navigate('CreatePassword', {
                        user_id: this.state.user_id
                    })

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
                        ref={e => (this.otpInput = e)}
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
                            style={{ alignItems: 'center' }}
                        >
                            <View >
                                <Text style={{ color: 'red', fontSize: mobileW * 4 / 100, fontFamily: Font.FontSemiBold, alignItems: 'center' }}>{Lang_chg.resend_txt[config.language]}</Text>
                            </View>
                        </TouchableOpacity>}
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}
