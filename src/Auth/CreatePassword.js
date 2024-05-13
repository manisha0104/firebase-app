import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag,notification } from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';  
class CreatePassword extends Component {
    _didFocusSubscription;
    _willBlurSubscription;

    constructor(props) {
        super(props)
        this.state = {
            securetext1: true,
            securetext2:true,
            securetext3:true,
            oldpassword:'',
            newpassword:'',
            cpassword:'',
            confirmpassword:'',
            user_id:this.props.route.params.user_id
        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );


    }

    componentDidMount() {
        consolepro.consolelog('iam create password')
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    );

    }


     //    for backhandler
     handleBackPress = () => {
        Alert.alert(
            Lang_chg.go_back_txt[config.language],
            Lang_chg.do_you_want_goback_txt[config.language], [{
                text: Lang_chg.no_txt[config.language],
                onPress: () => consolepro.consolelog('Cancel Pressed'),
            }, {
                text: Lang_chg.yes_txt[config.language],
                onPress: () => this.props.navigation.navigate('Login')
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };

    eyepress1 = () => {

        if (this.state.securetext1) {
            this.setState({ securetext1: false })
        } else {
            this.setState({ securetext1: true })
        }
    }
    eyepress2 = () => {

        if (this.state.securetext2) {
            this.setState({ securetext2: false })
        } else {
            this.setState({ securetext2: true })
        }
    }
    eyepress3 = () => {

        if (this.state.securetext3) {
            this.setState({ securetext3: false })
        } else {
            this.setState({ securetext3: true })
        }
    }

    onSubmit=()=>{
        consolepro.consolelog('Iamonsubmit...')

        if (config.app_status == 0) {
            //----for prototype----------//
            consolepro.consolelog('iam prototype')
            this.props.navigation.navigate('Login')
            return false
        }else{

        let { user_id, newpassword, confirmpassword } = this.state;
        consolepro.consolelog({ user_id, newpassword, confirmpassword })
        var pattern = config.passwordvalidation;
        //======================================= newpassword===================
        if (newpassword.length <= 0) {
            msgProvider.toast(msgText.emptyNewPassword[config.language], 'center')
            return false
        }
        if (newpassword.length <= 5) {
            msgProvider.toast(msgText.newPasswordMinLength[config.language], 'center')
            return false
        }
        //================================confirmpassword===================
        if (confirmpassword.length <= 0) {
            msgProvider.toast(msgText.emptyConfirmPassword[config.language], 'center')
            return false
        }
        if (confirmpassword.length <= 5) {
            msgProvider.toast(msgText.confirmPasswordMinLength[config.language], 'center')
            return false
        }

        if (confirmpassword !== newpassword) {
            msgProvider.toast(msgText.passwordNotMatch[config.language], 'center')
            return false
        }
        //----------------------api calling----------

        let url = config.baseURL + "create_password.php";
        var data = new FormData();
        data.append('user_id', user_id)
        data.append('password', newpassword)
        consolepro.consolelog('data', data)
       // return false
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('user_arr', obj)
            if (obj.success == 'true') {
               setTimeout(() => {
                msgProvider.toast(obj.msg[config.language], 'center');
               }, 300);
                this.props.navigation.navigate('Login')
            }
            else {
                if (obj.account_active_status == 0) {
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
                            style={{ width: mobileW * 9 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
                            onPress={() => this.handleBackPress()}
                        >
                            <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, }}
                                source={localimag.back}></Image>
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', alignSelf: 'center', }}><Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.FontSemiBold, color: Colors.back_color }}>{Lang_chg.create_password_txt[config.language]}</Text></View>
                        <TouchableOpacity
                            style={{ width: mobileW * 9 / 100, height: mobileW * 9 / 100, marginLeft: mobileW * 3.5 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
                        >
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW,alignItems:'center' }} keyboardShouldPersistTaps='handled'>
                            <View style={{
                                width: mobileW * 90 / 100,
                                marginTop: mobileH * 2 / 100,
                                height: mobileH * 6.5 / 100,
                                borderRadius: 7,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: Colors.theme_color,
                                borderWidth:2.5,
                            }}>
                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 70 / 100, fontSize: mobileW * 3.5 / 100, backgroundColor: Colors.back_color,
                                    marginLeft: mobileW * 5 / 100
                                }}
                                    secureTextEntry={this.state.securetext2}
                                    placeholderTextColor="#d4d0d6"
                                    placeholder='New Password'
                                    keyboardType='default'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ newpassword: txt }) }}
                                    maxLength={16}
                                />
                                <TouchableOpacity activeOpacity={0.7} style={{ justifyContent: 'center', alignSelf: 'center' }}
                                    onPress={() => { this.eyepress2() }}  >
                                    {this.state.securetext2 ? <Text style={{ color: Colors.placeholder_color, fontFamily: Font.FontBold, fontSize: mobileW * 4 / 100 }}>{Lang_chg.Show[config.language]}</Text> : <Text style={{ color: Colors.placeholder_color, fontFamily: Font.FontBold, fontSize: mobileW * 4 / 100 }}>{Lang_chg.Hide[config.language]}</Text>}
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                width: mobileW * 90 / 100,
                                marginTop: mobileH * 2 / 100,
                                height: mobileH * 6.5 / 100,
                            // backgroundColor:'green',
                                borderRadius: 7,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: Colors.theme_color,
                                borderWidth:2.5,
                            }}>

                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 70 / 100, fontSize: mobileW * 3.5 / 100, backgroundColor: Colors.back_color,
                                    // backgroundColor:'red',
                                    marginLeft: mobileW * 5 / 100
                                }}
                                    secureTextEntry={this.state.securetext3}
                                    placeholderTextColor="#d4d0d6"
                                    placeholder='Confirm New Password'
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
                                    onPress={() => { this.eyepress3() }}  >
                                    {this.state.securetext3 ? <Text style={{ color: Colors.placeholder_color, fontFamily: Font.FontBold, fontSize: mobileW * 4 / 100 }}>{Lang_chg.Show[config.language]}</Text> : <Text style={{ color: Colors.placeholder_color, fontFamily: Font.FontBold, fontSize: mobileW * 4 / 100 }}>{Lang_chg.Hide[config.language]}</Text>}
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center', alignSelf: 'center' }} >
                                    <TouchableOpacity
                                    onPress={()=>{
                                        this.onSubmit()
                                    }}
                                        activeOpacity={0.7} style={{
                                            backgroundColor: Colors.theme_color,
                                            height: mobileH * 6.5 / 100,
                                            width: mobileW * 90 / 100,
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 7,
                                            marginTop: mobileH * 5 / 100
                                        }}>
                                        <Text style={{ color: '#f5f4f5', fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100 }}>{Lang_chg.create_password_txt[config.language]}</Text>
                                    </TouchableOpacity>
                            </View>
                </KeyboardAwareScrollView>

            </SafeAreaView>


        )
    }
} export default CreatePassword

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
        width: mobileW * 11 / 100,
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

