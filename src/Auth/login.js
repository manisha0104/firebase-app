import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, Alert, View, StyleSheet, Keyboard, TouchableOpacity, Image, TextInput } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, firebaseprovider } from '../Provider/utilslib/Utils';
import Fontisto from 'react-native-vector-icons/Fontisto'
import auth from '@react-native-firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
class Login extends Component {

    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {

        super(props)

        this.state = {
            //predefined don't change
            securetext: true,
            remember_me: false,
            email: '',
            password: '',
            //your variable start here


        }
        this._didFocusSubscription = props.navigation.addListener('focus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    componentDidMount() {
        this.checkRememberMe();
        this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
        );
    }
    //-------do not change ------------//
    //--------------remember me check function---------------------
    checkRememberMe = async () => {
        var remember_me = await localStorage.getItemString('remember_me');
        consolepro.consolelog('rememberme', remember_me);
        if (remember_me == 'yes') {
            let email = await localStorage.getItemString('email');
            let password = await localStorage.getItemString('password');
            consolepro.consolelog('email', email);
            consolepro.consolelog('password', password);
            this.setState({
                email: email,
                password: password,
                remember_me: true,
            });
        }
        else {
            this.setState({
                email: '',
                password: '',
                remember_me: false,
            });
        }
    }
    //    for backhandler
    handleBackPress = () => {
        Alert.alert(
            Lang_chg.go_back_txt[config.language],
            Lang_chg.do_you_want_exit_txt[config.language], [{
                text: Lang_chg.no_txt[config.language],
                onPress: () => consolepro.consolelog('Cancel Pressed'),
            }, {
                text: Lang_chg.yes_txt[config.language],
                onPress: () => BackHandler.exitApp()
            }], {
            cancelable: false
        }
        ); // works best when the goBack is async
        return true;
    };
    // for password hide show
    eyepress = () => {

        if (this.state.securetext) {
            this.setState({ securetext: false })
        } else {
            this.setState({ securetext: true })
        }
    }
    // for remember me 
    remember_me = () => {

        if (this.state.remember_me) {
            this.setState({ remember_me: false })
        } else {
            this.setState({ remember_me: true })
        }
    }
  //-----------on singin button start------------//
  loginBtn = () => {
     

    let { email, password } = this.state;
   

    // if (email.trim().length <= 0 && password.length <= 0) {
    //     msgProvider.toast(msgText.emptyAll[config.language], 'center')
    //     return false
    // }
    // //=============email============================
    // if (email.trim().length <= 0) {
    //     msgProvider.toast(msgText.emptyEmail[config.language], 'center')
    //     return false
    // }
    // var reg = config.emailvalidation;
    // if (reg.test(email) !== true) {
    //     msgProvider.toast(msgText.validEmail[config.language], 'center')
    //     return false
    // }
    //=====================================password===================
    // if (password.trim().length <= 0) {
    //     msgProvider.toast(msgText.emptyPassword[config.language], 'center')
    //     return false
    // }
    // if (password.trim().length <= 5) {
    //     msgProvider.toast(msgText.passwordMinLength[config.language], 'center')
    //     return false
    // }
    this.firstlogin()
    //return false
    setTimeout(() => {
    let data = {
        email: email.toLowerCase(),
        password: password,
        login_type: 'app'
    }
    
    apifuntion.callapi('login', data, 0).then((res) => {
        consolepro.consolelog('res res',res)
        if (res.success == 'true') {
            var user_arr = res.user_details
            var user_id = res.user_details;
            var email = res.user_details;
            var profile_complete = user_arr.profile_complete;
            var otp_verify = user_arr.otp_verify;

            this.loginbtnfinal()
            

            let user_login={email:this.state.email, password:this.state.password}
            localStorage.setItemObject('user_login',user_login)
            
            consolepro.consolelog({ user_id, profile_complete, otp_verify })
        
            localStorage.setItemObject('user_arr', res.user_details)
            localStorage.setItemObject('user_id',res.user_details.user_id)
            // this.textinput.clear();
            // this.textinput_email.clear();

            setTimeout(() => {
                this.props.navigation.navigate('Home')
            }, 500);
            

        }
        else {
                setTimeout(() => {
                    //msgProvider.alert(msgTitle.information[config.language], res.msg[config.language], false);
                    msgProvider.toast(res.msg[config.language], 'center')
                    return false;
                }, 300);
            

        }
    }).catch((error) => {
        consolepro.consolelog('errror', error)
    })
}, 1000);




}
firstlogin = async () => {

    auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((user) => {
            consolepro.consolelog('user199',user)
            console.log('User account created & signed in!');

        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');

            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }

            console.error(error);
        });
}
//-----------on singin button end------------//

loginbtnfinal = async () => {

    auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then(() => {
            console.log('User account created & signed in!');

        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');

            }

            if (error.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }

            console.error(error);
        });
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
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, }} keyboardShouldPersistTaps='handled'>
                    <View style={{ width: mobileW, alignItems: 'center', alignSelf: 'center' }}>
                        <View style={{ width: mobileW * 90 / 100, alignItems: 'center', alignSelf: 'center', }}>
                            <View style={{
                                width: mobileW * 85 / 100,
                                marginTop: mobileH * 3 / 100,
                                height: mobileH * 7 / 100,
                                // backgroundColor:'green',
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
                                    keyboardType='email-address'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ email: txt }) }}
                                    value={this.state.email}
                                    maxLength={100}

                                />
                            </View>
                            <View style={{
                                width: mobileW * 85 / 100,
                                marginTop: mobileH * 2 / 100,
                                height: mobileH * 7 / 100,
                                // backgroundColor:'green',
                                borderRadius: 7,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: Colors.border_color,
                                borderWidth: 0.5,
                            }}>
                                <View style={{ marginLeft: mobileW * 2.5 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 5 / 100 }} source={localimag.password}></Image>
                                </View>


                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 62 / 100, fontSize: mobileW * 4 / 100, backgroundColor: Colors.back_color,
                                    // backgroundColor:'red',
                                    marginLeft: mobileW * 2 / 100
                                }}
                                    secureTextEntry={this.state.securetext}
                                    placeholderTextColor="#d4d0d6"
                                    placeholder='Enter Password'
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
                                    onPress={() => { this.eyepress() }}  >
                                    {this.state.securetext ? <Text style={{ color: Colors.theme_color, fontFamily: Font.FontBold, fontSize: mobileW * 4 / 100 }}>show</Text> : <Text style={{ color: Colors.theme_color, fontFamily: Font.FontBold, fontSize: mobileW * 4 / 100 }}>hide</Text>}
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                width: mobileW * 85 / 100,
                                marginTop: mobileH * 2 / 100,
                                //  backgroundColor: 'green',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}>
                                <TouchableOpacity
                                    onPress={() => this.remember_me()}
                                    style={{ flexDirection: 'row', width: mobileW * 30 / 100, justifyContent: 'space-between' }}>
                                    {this.state.remember_me ? <Fontisto name='checkbox-active' size={19} color={Colors.theme_color} /> : <Fontisto name='checkbox-passive' size={19} color={Colors.border_color} />}
                                    <Text style={{ color: Colors.text_color2, fontFamily: Font.FontBold, fontSize: mobileW * 3 / 100 }}>Remember me</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Forgotpassword')}
                                >
                                    <Text style={{ color: Colors.text_color2, fontFamily: Font.FontBold, fontSize: mobileW * 3 / 100, marginLeft: mobileW * 2 / 100 }}>Forgot Password?</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ alignItems: 'center', alignSelf: 'center' }} >
                                <TouchableOpacity
                                    onPress={() => this.loginBtn()}
                                    activeOpacity={0.7} style={{
                                        backgroundColor: Colors.theme_color,
                                        height: mobileH * 6.5 / 100,
                                        width: mobileW * 85 / 100,
                                        alignSelf: 'center',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: 20,
                                        marginTop: mobileH * 5 / 100
                                    }}>
                                    <Text style={{ color: '#f5f4f5', fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100 }}>Login</Text>
                                </TouchableOpacity>
                            </View>


                        </View>


                    </View>
                    <View style={{ alignItems: 'center', alignSelf: 'center', flexDirection: 'row', marginTop: mobileH * 10 / 100, marginBottom: mobileH * 4 / 100 }} >
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Signup')}
                            activeOpacity={0.7} style={{
                                marginLeft: mobileW * 1 / 100
                            }}>
                            <Text style={{ color: Colors.theme_color, fontFamily: Font.FontBold, fontSize: mobileW * 4 / 100 }}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ alignItems: 'center', alignSelf: 'center', flexDirection: 'row', marginBottom: mobileH * 4 / 100 }} >
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('Setting')}
                            activeOpacity={0.7} style={{
                                marginLeft: mobileW * 1 / 100
                            }}>
                            <Text style={{ color: Colors.theme_color, fontFamily: Font.FontBold, fontSize: mobileW * 4 / 100 }}>Setting</Text>
                        </TouchableOpacity>
                    </View> */}
                </KeyboardAwareScrollView>

            </SafeAreaView>


        )
    }
} export default Login

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

