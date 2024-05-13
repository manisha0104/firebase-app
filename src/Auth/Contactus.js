import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW ,localimag} from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';  
class Contactus extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email:'',
            name:'',
            message:'',
            user_id:0
        }
    }

    componentDidMount() {
        consolepro.consolelog('I am on student contact us  page')
        this._setUserProfile();
    }

    //-----------set user profile details from local------------------------
    _setUserProfile = async () => {
        let result = await localStorage.getItemObject('user_arr');
        console.log('result', result);
        if (result != null) {
            this.setState({
                name: result.name,
                user_id: result.user_id,
                email: result.email,
            })
        }
    }

    //------------submit btn------------//
    submitBtn = () => {
        consolepro.consolelog('I am in submit btn')
        if(config.app_status==0)
        {
            this.props.navigation.goBack()
        }else
        {
            let { user_id, name, email, message } = this.state;
            consolepro.consolelog({ user_id, name, email, message })
    
            //------------------name===================
            if (name.trim().length <= 0) {
                msgProvider.toast(msgText.emptyName[config.language], 'center')
                return false
            }
            if (name.trim().length <= 2) {
                msgProvider.toast(msgText.nameMinLength[config.language], 'center')
                return false
            }
            //===========email============================
            if (email.length <= 0) {
                msgProvider.toast(msgText.emptyEmail[config.language], 'center')
                return false
            }
            var emailvalidation = config.emailvalidation;
            if (emailvalidation.test(email) !== true) {
                msgProvider.toast(msgText.validEmail[config.language], 'center')
                return false
            }
    
            //-----------------------message--------------
            if (message.trim().length <= 0) {
                msgProvider.toast(msgText.emptyContactMessage[config.language], 'center')
                return false
            }
            if (message.trim().length <= 2) {
                msgProvider.toast(msgText.messageMinLength[config.language], 'center')
                return false
            }
            let url = config.baseURL + "contact_us.php";
            var data = new FormData();
            data.append('user_id', user_id)
            data.append('name', name.trim())
            data.append('email', email)
            data.append('message', message.trim())
    
            consolepro.consolelog('data', data)
            apifuntion.postApi(url, data).then((obj) => {
                consolepro.consolelog('email_arr', obj)
                if (obj.success == 'true') {
                    let email_arr = obj.email_arr;
                    setTimeout(() => {
                        msgProvider.toast(obj.msg[config.language], 'center');
                    }, 300);
                    this.props.navigation.goBack()
                    return false;
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
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, }}
                                source={localimag.back}></Image>
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', alignSelf: 'center', }}><Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.FontSemiBold, color: Colors.back_color }}>{Lang_chg.Contactus[config.language]}</Text></View>
                        <TouchableOpacity
                            style={{ width: mobileW * 9 / 100, height: mobileW * 9 / 100, marginLeft: mobileW * 3.5 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
                        >
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW,alignItems:'center' }} keyboardShouldPersistTaps='handled'>
                      
                      <View style={{
                                width: mobileW * 85 / 100,
                                marginTop: mobileH * 5 / 100,
                                height: mobileH * 6 / 100,
                                // backgroundColor:'green',
                                borderRadius: 7,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: Colors.theme_color,
                                borderWidth:2
                            }}>
                                <View style={{ marginLeft: mobileW * 3.5 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 4 / 100 }} source={localimag.user}></Image>
                                </View>
                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 70 / 100, fontSize: mobileW * 3 / 100, backgroundColor: Colors.back_color,
                                    // backgroundColor:'red',
                                    marginLeft: mobileW * 2 / 100
                                }}
                                    placeholderTextColor="#d4d0d6"
                                    placeholder='Full Name'
                                    keyboardType='default'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ name: txt }) }}
                                    maxLength={100}
                                    value={""+this.state.name+""}
                                />
                            </View>
                       <View style={{
                                width: mobileW * 85 / 100,
                                marginTop: mobileH * 2.5 / 100,
                                height: mobileH * 6 / 100,
                                borderRadius: 7,
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderColor: Colors.theme_color,
                                borderWidth:2
                            }}>
                                <View style={{ marginLeft: mobileW * 3.5 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 4 / 100 }} source={localimag.email}></Image>
                                </View>
                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 70 / 100, fontSize: mobileW * 3 / 100, backgroundColor: Colors.back_color,
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
                                    maxLength={100}
                                    value={""+this.state.email+""}
                                />
                            </View>
                            <View style={{
                                width: mobileW * 85 / 100,
                                marginTop: mobileH * 2.5 / 100,
                                //height: mobileH * 6 / 100,
                                // backgroundColor:'green',
                                borderRadius: 7,
                                flexDirection: 'row',
                               // alignItems: 'center',
                                borderColor: Colors.theme_color,
                                borderWidth:2
                            }}>
                                <View style={{ marginLeft: mobileW * 3.5 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height:mobileW*8/100 }} source={localimag.user}></Image>
                                </View>
                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 70 / 100, fontSize: mobileW * 3 / 100, backgroundColor: Colors.back_color,
                                    // backgroundColor:'red',
                                    marginLeft: mobileW * 2 / 100,
                                    height:150,
                                    textAlignVertical:'top'
                                }}
                                    multiline={true}
                                    maxLength={250}
                                    placeholderTextColor="#d4d0d6"
                                    placeholder='Messages'
                                    keyboardType='default'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ message: txt }) }}
                                />
                            </View>
                            <View style={{ alignItems: 'center', alignSelf: 'center' }} >
                                    <TouchableOpacity
                                    onPress={()=>{this.submitBtn()}}
                                        activeOpacity={0.7} style={{
                                            backgroundColor: Colors.theme_color,
                                            height: mobileH * 5.5 / 100,
                                            width: mobileW * 88 / 100,
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius:25,
                                            marginTop: mobileH * 5 / 100
                                        }}>
                                        <Text style={{ color: '#f5f4f5', fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100 }}>Submit</Text>
                                    </TouchableOpacity>
                            </View>
                </KeyboardAwareScrollView>

            </SafeAreaView>


        )
    }
} export default Contactus

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

