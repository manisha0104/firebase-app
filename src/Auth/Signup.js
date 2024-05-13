import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput, ActivityIndicator,  } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, notification } from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CountDown from 'react-native-countdown-component';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


class Signup extends Component {

    constructor(props) {

        super(props)

        this.state = {
            mobile: '',
            btn: true,
            email: '',
            password: '',
            securetext1: true,
            securetext2: true,
            password: '',
            confirmpassword: '',
            firstname: '',
            lastname: '',
            remember_me: false,
            user_id: '',
            otp: '',
            showbtn: false,
            fullname: '',
            country_code: '91',
            country_code_modal: false,
            country_code_arr: [{
                code: '1',
                status: false,
                flag:localimag.canada,
                name:'Canada'
            },
            {
                code: '91',
                status: true,
                flag:localimag.india,
                name:'India'
            },
            ],
            social_data: 'NA',
            password_hide: false,
            email_edit: true,
            fullname_edit: true,
            otp_loader:false,
        }

    }
    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this.setProfileData();
        });
        this.setState({ social_data: 'NA' })
        this.setProfileData();
    }
    //---------set profile while social login---------//
    setProfileData = async () => {
        let result = await localStorage.getItemObject('socialdata');
        // alert(JSON.stringify(result))
        consolepro.consolelog({ result })
        if (result != null) {
            let email = result.social_email;
            let fullname = result.social_name;
            if (email != null) {
                this.setState({ email: email, email_edit: false, social_data: result, password_hide: true })
            }
            if (fullname != null) {
                this.setState({ fullname: fullname, fullname_edit: false, social_data: result, password_hide: true })
            }
        }
    }

    //---------for password-------------
    eyepress1 = () => {

        if (this.state.securetext1) {
            this.setState({ securetext1: false })
        } else {
            this.setState({ securetext1: true })
        }
    }

    //-----------------for confirm password-----------------
    eyepress2 = () => {

        if (this.state.securetext2) {
            this.setState({ securetext2: false })
        } else {
            this.setState({ securetext2: true })
        }
    }

    //-------------for accept terms and conditions---------------
    remember_me = () => {

        if (this.state.remember_me) {
            this.setState({ remember_me: false })
        } else {
            this.setState({ remember_me: true })
        }
    }



signup_btn=async()=>{

    //  let user_id = await localStorage.getItemObject('user_id')
    //  consolepro.consolelog('Home user id====...',user_id)
     let data={
   
    name: this.state.fullname,
    mobile_no: this.state.mobile,
    email: this.state.email,
    password:this.state.password,
    createtime:new Date(),
    delete_flag:0,
    updatetime:new Date(),
   
     }
    consolepro.consolelog('signup data====...',data)
   
       apifuntion.callapi('signup',data,0).then((res)=>{
           consolepro.consolelog('hello',res)
            if(res.success=='true')
             { 
                localStorage.setItemObject('user_arr', res.user_arr)
                localStorage.setItemObject('user_id',res.user_arr.user_id)

               setTimeout(() => {
                this.props.navigation.navigate('Home')
                 }, 1000);

                 
                 
                }
                else{
                 setTimeout(() => {
                   msgProvider.toast(res.msg[config.language],'center')
                 }, 1000);
                }
       
         }).catch((error)=>{
           consolepro.consolelog('errror',error)
       })
   
   
      
      }



    //---------------------SetCountryCode function -------------
    SetCountryCode = (item, index) => {
        consolepro.consolelog({ item, index })
        let data = this.state.country_code_arr;
        let len = this.state.country_code_arr.length;
        for (let i = 0; i < len; i++) {
            data[i].status = false;
        }

        data[index].status = !data[index].status;
        this.setState({
            country_code: data[index].code,
            country_code_modal: false,
            country_code_arr: data,
        })
    }

    //----------------SetCountryCode funtion end------------//

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
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, }} keyboardShouldPersistTaps='handled'
                    >

                    
                    <View style={{ alignItems: 'center', marginTop: mobileH * 2 / 100 }}><Text style={{ fontFamily: Font.FontSemiBold, fontSize: mobileW * 6.5 / 100, color: Colors.theme_color }}>{Lang_chg.signup_txt[config.language]}</Text></View>
                    <View style={{ width: mobileW, alignItems: 'center', alignSelf: 'center' }}>
                        <View style={{ width: mobileW * 90 / 100, alignItems: 'center', alignSelf: 'center', }}>
                            <View style={{
                                width: mobileW * 85 / 100,
                                marginTop: mobileH * 3 / 100,
                                height: mobileH * 7 / 100,
                                borderRadius: 25,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: Colors.theme_color,
                                borderWidth: 2.5,
                                backgroundColor: Colors.white_color
                            }}>
                                <View style={{ marginLeft: mobileW * 4 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 5 / 100 }} source={localimag.user}></Image>
                                </View>


                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 68 / 100, fontSize: mobileW * 4 / 100, backgroundColor: Colors.white_color,
                                    marginLeft: mobileW * 2 / 100
                                }}
                                    placeholderTextColor={Colors.black_color}
                                    placeholder={Lang_chg.fullname_txt[config.language]}
                                    keyboardType='default'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ fullname: txt }) }}
                                    value={this.state.fullname}
                                    // editable={this.state.fullname_edit}
                                    maxLength={50}

                                />
                            </View>
                            <View style={{
                                width: mobileW * 85 / 100,
                                marginTop: mobileH * 2 / 100,
                                height: mobileH * 7 / 100,
                                borderRadius: 25,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: Colors.theme_color,
                                borderWidth: 2.5,
                                backgroundColor: Colors.white_color,
                            }}>
                                <View style={{ marginLeft: mobileW * 4 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 5 / 100 }} source={localimag.mobile}></Image>
                                </View>
                                <TouchableOpacity
                                activeOpacity={1}
                                   // onPress={() => this.setState({ country_code_modal: true })}
                                >
                                    {config.device_type == 'android' ?
                                        <View style={{ borderEndWidth: 1, borderColor: Colors.theme_color, alignItems: 'center', justifyContent: 'center', width: mobileW * 15 / 100, alignSelf: 'center', flexDirection: 'row' }}>
                                            <Text style={{ fontFamily: Font.FontRegular, fontSize: mobileW * 4 / 100, color: Colors.black_color }}>+{this.state.country_code}</Text>
                                            {/* <View style={{ marginLeft: mobileW * 1/ 100 }}>
                                                <Image resizeMode='contain' style={{ width: mobileW * 4 / 100,height:mobileW*4/100 }} source={localimag.down}></Image>
                                            </View> */}
                                            
                                        </View>
                                        : <View style={{ borderEndWidth: 1, borderColor: Colors.theme_color, alignItems: 'center', justifyContent: 'center', width: mobileW * 15 / 100, alignSelf: 'center', flexDirection: 'row'  }}>
                                            <Text style={{ fontFamily: Font.FontRegular, fontSize: mobileW * 4 / 100, color: Colors.black_color }}>+{this.state.country_code}</Text>
                                            {/* <View style={{ marginLeft: mobileW * 1/ 100 }}>
                                                <Image resizeMode='contain' style={{ width: mobileW * 4 / 100,height:mobileW*4/100 }} source={localimag.down}></Image>
                                            </View> */}
                                        </View>}

                                </TouchableOpacity>
                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 52 / 100, fontSize: mobileW * 4 / 100, backgroundColor: Colors.white_color,
                                     // backgroundColor:'red',
                                    marginLeft: mobileW * 2 / 100
                                }}
                                    placeholderTextColor={Colors.black_color}
                                    placeholder={Lang_chg.mobile_no_txt[config.language]}
                                    keyboardType='number-pad'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ mobile: txt }) }}
                                    value={this.state.mobile}
                                    maxLength={15}

                                />
                            </View>
                            <View style={{
                                width: mobileW * 85 / 100,
                                marginTop: mobileH * 2 / 100,
                                height: mobileH * 7 / 100,
                                borderRadius: 25,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: Colors.theme_color,
                                borderWidth: 2.5,
                                backgroundColor: Colors.white_color
                            }}>
                                <View style={{ marginLeft: mobileW * 4 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 5 / 100 }} source={localimag.email}></Image>
                                </View>


                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 68 / 100, fontSize: mobileW * 4 / 100, backgroundColor: Colors.white_color,
                                    // backgroundColor:'red',
                                    marginLeft: mobileW * 2 / 100
                                }}
                                    placeholderTextColor={Colors.black_color}
                                    placeholder={Lang_chg.email_txt[config.language]}
                                    keyboardType='email-address'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ email: txt }) }}
                                    value={this.state.email}
                                    editable={this.state.email_edit}
                                    maxLength={100}

                                />
                            </View>
                            {
                                (this.state.password_hide != true) &&
                                <View style={{
                                    width: mobileW * 85 / 100,
                                    marginTop: mobileH * 2 / 100,
                                    height: mobileH * 7 / 100,
                                    borderRadius: 25,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderColor: Colors.theme_color,
                                    borderWidth: 2.5,
                                    backgroundColor: Colors.white_color
                                }}>
                                    <View style={{ marginLeft: mobileW * 3.5 / 100 }}>
                                        <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100 }} source={localimag.password}></Image>
                                    </View>
                                    <TextInput style={{
                                        fontFamily: Font.FontRegular, width: mobileW * 58 / 100, fontSize: mobileW * 4 / 100, backgroundColor: Colors.white_color,
                                        marginLeft: mobileW * 2 / 100,
                                        marginTop: mobileH * 0.5 / 100,
                                    }}
                                        secureTextEntry={this.state.securetext1}
                                        placeholderTextColor={Colors.black_color}
                                        placeholder={Lang_chg.enter_password[config.language]}
                                        keyboardType='default'
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        ref={(input) => { this.mobilefield = input; }}
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                        onChangeText={(txt) => { this.setState({ password: txt }) }}
                                        maxLength={16}
                                    />
                                    <TouchableOpacity activeOpacity={0.7} style={{ justifyContent: 'center', alignSelf: 'center' }}
                                        onPress={() => { this.eyepress1() }}  >
                                        {this.state.securetext1 ? <Text style={{ color: Colors.hide_show_color, fontFamily: Font.FontBold, fontSize: mobileW * 3.5 / 100 }}>{Lang_chg.Show[config.language]}</Text> : <Text style={{ color: Colors.hide_show_color, fontFamily: Font.FontBold, fontSize: mobileW * 3.5 / 100 }}> {Lang_chg.Hide[config.language]}</Text>}
                                    </TouchableOpacity>
                                </View>
                            }
                            {
                                (this.state.password_hide != true) &&
                                <View style={{
                                    width: mobileW * 85 / 100,
                                    marginTop: mobileH * 2 / 100,
                                    height: mobileH * 7 / 100,
                                    borderRadius: 25,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderColor: Colors.theme_color,
                                    borderWidth: 2.5,
                                    backgroundColor: Colors.white_color
                                }}>
                                    <View style={{ marginLeft: mobileW * 3.5 / 100 }}>
                                        <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100 }} source={localimag.password}></Image>
                                    </View>
                                    <TextInput style={{
                                        fontFamily: Font.FontRegular, width: mobileW * 58 / 100, fontSize: mobileW * 4 / 100, backgroundColor: Colors.white_color,
                                        marginLeft: mobileW * 2 / 100,
                                        marginTop: mobileH * 0.5 / 100,
                                    }}
                                        secureTextEntry={this.state.securetext2}
                                        placeholderTextColor={Colors.black_color}
                                        placeholder={Lang_chg.cpass_txt[config.language]}
                                        keyboardType='default'
                                        returnKeyLabel='done'
                                        returnKeyType='done'
                                        ref={(input) => { this.mobilefield = input; }}
                                        onSubmitEditing={() => { Keyboard.dismiss() }}
                                        onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                        onChangeText={(txt) => { this.setState({ confirmpassword: txt }) }}
                                        maxLength={16}
                                    />
                                    <TouchableOpacity activeOpacity={0.7} style={{ justifyContent: 'center', alignSelf: 'center' }}
                                        onPress={() => { this.eyepress2() }}  >
                                        {this.state.securetext2 ? <Text style={{ color: Colors.hide_show_color, fontFamily: Font.FontBold, fontSize: mobileW * 3.5 / 100 }}>{Lang_chg.Show[config.language]}</Text> : <Text style={{ color: Colors.hide_show_color, fontFamily: Font.FontBold, fontSize: mobileW * 3.5 / 100 }}> {Lang_chg.Hide[config.language]}</Text>}
                                    </TouchableOpacity>
                                </View>
                            }
                            <View style={{
                                width: mobileW * 80 / 100,
                                marginTop: mobileH * 2 / 100,
                                //  backgroundColor: 'green',
                                flexDirection: 'row',
                                // justifyContent: 'space-between',
                                alignItems:'center'
                            }}>
                                <TouchableOpacity
                                    onPress={() => this.remember_me()}
                                    style={{ flexDirection: 'row',alignItems:'center' }}>

                                    {this.state.remember_me ? <MaterialCommunityIcons name='check-box-outline' size={25} color={Colors.theme_color} /> : <MaterialCommunityIcons name='checkbox-blank-outline' size={25} color={Colors.theme_color} />}
                                    <Text style={{ color: Colors.black_color, fontFamily: Font.FontBold, fontSize: mobileW * 3 / 100, marginLeft: mobileW * 2 / 100 }}>{Lang_chg.iaccept_txt[config.language]}</Text>

                                </TouchableOpacity>
                                {/* <Text style={{ color: Colors.black_color, fontFamily: Font.FontBold, fontSize: mobileW * 3 / 100, marginLeft: mobileW * 2 / 100 }}>{Lang_chg.iaccept_txt[config.language]}</Text> */}
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Contentpage', { pagename: Lang_chg.terms_txt[config.language], contentpage: 2 })}
                                    style={{ borderBottomWidth: 1, marginLeft: mobileW * 1 / 100, height: mobileH * 2.5 / 100 }}>
                                    <Text style={{ color: Colors.black_color, fontFamily: Font.FontBold, fontSize: mobileW * 3 / 100 }}>{Lang_chg.terms_txt[config.language]}</Text>
                                </TouchableOpacity>
                                <Text style={{ color: Colors.black_color, fontFamily: Font.FontBold, fontSize: mobileW * 3 / 100, marginLeft: mobileW * 1 / 100 }}>{Lang_chg.and_txt[config.language]}</Text>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Contentpage', { pagename: Lang_chg.Privacy_policy_txt[config.language], contentpage: 1 })}
                                    style={{}}>
                                    <View style={{ borderBottomWidth: 1, marginLeft: mobileW * 1 / 100, height: mobileH * 2.5 / 100 }}>
                                        <Text style={{ color: Colors.black_color, fontFamily: Font.FontBold, fontSize: mobileW * 3 / 100 }}>{Lang_chg.Privacy_policy_txt[config.language]}</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                            <View style={{ alignItems: 'center', alignSelf: 'center' }} >
                                <TouchableOpacity
                                   // onPress={() => { (this.state.social_data == 'NA') ? this.signup_btn() : this._btnSocialDataSubmit() }}
                                    onPress={() => this.signup_btn()}
                                    activeOpacity={0.7} style={{
                                        backgroundColor: Colors.theme_color,
                                        height: mobileH * 7.8 / 100,
                                        width: mobileW * 85 / 100,
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 22.5,
                                        marginTop: mobileH * 2 / 100
                                    }}>
                                    <Text style={{ color: Colors.white_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100 }}>{Lang_chg.signup_txt[config.language]}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.navigate('Login')}
                                activeOpacity={0.7}
                                style={{ alignItems: 'center', alignSelf: 'center', flexDirection: 'row', marginTop: mobileH * 2 / 100, marginBottom: mobileH * 4 / 100 }} >
                                <Text style={{ color: Colors.text_color2, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100 }}>{Lang_chg.you_already_txt[config.language]}</Text>
                                <View
                                    style={{
                                        marginLeft: mobileW * 1 / 100
                                    }}>
                                    <Text style={{ color: Colors.theme_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100 }}>{Lang_chg.login_txt[config.language]}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>


        )
    }
} export default Signup

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white_color
    },
    // otp pop start ===================
    otptitle: {
        fontFamily: Font.FontBold,
        fontSize: 26,
        textAlign: 'center',
        marginTop: 10,
    },
    optTxt: {
        textAlign: 'center',
        fontFamily: Font.FontSemiBold,
        fontSize: 14,
        color: '#CBC9C9'
    },
    otpInpoutType: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: '80%',
        alignSelf: 'center',
        textAlign: 'center',
        height: 40,
        marginTop: 15,
        marginBottom: 20,
    },
    verifyBox: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#ccc',
        marginTop: 10,
    },
    resendboxLeft: {
        width: '50%',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderColor: '#ccc',
        paddingTop: 15,
        paddingBottom: 15,
    },
    resendbox: {
        width: '50%',
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
    },
    OTpLeftverify: {
        color: Colors.theme_color,
        fontFamily: Font.FontBold,
        fontSize: mobileW * 4 / 100,
    },


})

