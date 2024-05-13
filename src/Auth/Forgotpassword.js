import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput,keyboardType } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag,notification } from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';  

class Forgotpassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            type:1 //1=email,2=mobile
        }
    }
    componentDidMount() {
        consolepro.consolelog('I am on forgot password page')
    }

    forgot_btn = () => {
        Keyboard.dismiss()
        if (config.app_status == 0) {
            this.props.navigation.navigate('ForgotOTPVerify',{
                forgot_type:this.state.type,
                email_mobile:'jack@mailinator.com',
                user_id:0,
                forgot_id:0,
                otp:4512,
                otp_auto_fill:true
            })

        }else
        {
        let { email,type } = this.state;

        if(type==1){
            //=======================================email============================
        if (email.length <= 0) {
            msgProvider.toast(msgText.emptyEmail[config.language], 'center')
            return false
        }
        var reg = config.emailvalidation;
        if (reg.test(email) !== true) {
            msgProvider.toast(msgText.validEmail[config.language], 'center')
            return false
        }
        }else
        {   
            if (email.length <=0) {
                msgProvider.toast(msgText.emptyMobile[config.language], 'center')
                return false
            }
            if (email.length < 7) {
                msgProvider.toast(msgText.mobileMinLength[config.language], 'center')
                return false
            }
            var mobilevalidation = config.mobilevalidation;
            if (mobilevalidation.test(email) !== true) {
                msgProvider.toast(msgText.validMobile[config.language], 'center')
                return false
            }
        }
        
        let url = config.baseURL + "forgot_password.php";
        var data = new FormData();
        data.append('email_mobile', email)
        data.append('forgot_type',type) //----1=email,2=mobile
        consolepro.consolelog('data', data)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('res', obj)
            if (obj.success == 'true') {

                var user_id=obj.user_id;
                var forgot_id=obj.forgot_id;
                var otp=obj.otp;

                var otp_auto_fill=obj.otp_auto_fill;

                if(otp_auto_fill==false)
                {
                    otp=''
                }

                consolepro.consolelog({user_id})
                this.props.navigation.navigate('ForgotOTPVerify',{
                    forgot_type:type,
                    email_mobile:email,
                    user_id:user_id,
                    forgot_id:forgot_id,
                    otp:otp,
                    otp_auto_fill:otp_auto_fill
                })

            }
            else {
                if (obj.active_status == 0) {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
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

            <SafeAreaView style={styles.container}>
                <StatusBar

                    hidden={false}
                    // backgroundColor={Colors.back_color}
                    translucent={false}
                    barStyle="light-content"
                    networkActivityIndicatorVisible={true}


                />
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, }} keyboardShouldPersistTaps='handled'>

                    <View style={{  justifyContent: 'center', backgroundColor: Colors.theme_color, height: mobileH * 18 / 100 }}>
                    <TouchableOpacity 
                            style={{ width: mobileW * 9 / 100, height: mobileW * 9 / 100, marginLeft: mobileW * 3.5 / 100, alignItems:'center',justifyContent:'center' ,borderRadius:mobileW*4.5/100}}
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Image resizeMode='contain' style={{   width: mobileW * 5 / 100,height:mobileW*5/100, }}
                                    source={localimag.back}></Image>

                            </TouchableOpacity>
                    </View>
                    <View style={{ alignItems: 'center', marginTop: mobileH * 6 / 100 }}>
                        <Text style={{ fontSize: mobileW * 6 / 100, fontFamily: Font.FontBold, color: Colors.black_color }}>Forgot password?</Text>
                        <Text style={{ fontSize: mobileW *3.5/ 100, fontFamily: Font.FontRegular, color: Colors.res_time_color, marginTop:mobileH*1/100 }}>  Forgot your password type in your email{'\n'}address and we'll send you a link to reset it.</Text>
                    </View>
                    <View style={{ width: mobileW, alignItems: 'center', alignSelf: 'center' }}>
                        <View style={{ width: mobileW * 90 / 100, alignItems: 'center', alignSelf: 'center', }}>
                            <View style={{
                                width: mobileW * 85 / 100,
                                marginTop: mobileH * 3 / 100,
                                height: mobileH * 7 / 100,
                                borderRadius: 7,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: Colors.border_color,
                                borderWidth: 0.5
                            }}>
                                <View style={{ marginLeft: mobileW * 2.5 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 5 / 100 }} source={localimag.email}></Image>
                                </View>


                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 70 / 100, fontSize: mobileW * 4 / 100, backgroundColor: Colors.back_color,
                                    // backgroundColor:'red',
                                    marginLeft: mobileW * 2 / 100
                                }}
                                    placeholderTextColor="#d4d0d6"
                                    placeholder='Enter Email'
                                    keyboardType={this.state.type==1?'email-address':'phone-pad'}
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ email: txt }) }}
                                    value={this.state.email}

                                />
                            </View>
                            
                            <View style={{ alignItems: 'center', alignSelf: 'center' }} >
                                    <TouchableOpacity
                                    onPress={()=>{
                                        this.forgot_btn()
                                    }}
                                        activeOpacity={0.7} style={{
                                            backgroundColor: Colors.theme_color,
                                            height: mobileH * 7 / 100,
                                            width: mobileW * 85 / 100,
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 25,
                                            marginTop: mobileH * 2 / 100
                                        }}>
                                        <Text style={{ color: '#f5f4f5', fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100 }}>Reset Password</Text>
                                    </TouchableOpacity>
                            </View>
                            
                            
                        </View>
                        

                    </View>
                    
                </KeyboardAwareScrollView>

            </SafeAreaView>


        )
    }
} export default Forgotpassword

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



})

