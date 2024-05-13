import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            message: '',
            user_id: 0,
            other_user_id: this.props.route.params.other_user_id
        }
    }
    componentDidMount() {
        consolepro.consolelog('I am in chat report page...', this.state.other_user_id)
    }

    //-----------------------------function for submit report-------------

    submit_btn = async () => {
        let { other_user_id, message } = this.state;
        let result = await localStorage.getItemString('user_id');
        consolepro.consolelog('result', result);
        let user_id_get = '';
        if (result != null) {

            if (result != null) {
                user_id_get = result;
            }
            this.setState({
                user_id: user_id_get,
            })
        }
        consolepro.consolelog({ other_user_id, message, user_id_get })

        //-----------------------message--------------
        if (message.trim().length <= 0) {
            msgProvider.toast(msgText.emptyReportMessage[config.language], 'center')
            return false
        }
         //-----------------------message--------------
         if (message.trim().length <= 2) {
            msgProvider.toast(msgText.minimumReportMessage[config.language], 'center')
            return false
        }
         
        
        //-------------------api calling--------------

        let url = config.baseURL + "chat_report.php";
        var data = new FormData();
        data.append('user_id', user_id_get)
        data.append('other_user_id', other_user_id)
        data.append('description', message)
        consolepro.consolelog('data', data)
        apifuntion.postApi(url, data).then((obj) => {
            consolepro.consolelog('res_arr', obj)
            if (obj.success == 'true') {
                setTimeout(() => {
                    msgProvider.toast(obj.msg[config.language], 'center');
                }, 300);
                this.props.navigation.goBack()
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

    render() {


        return (

            <SafeAreaView style={styles.container}>
                <StatusBar
                    hidden={false}
                    translucent={false}
                    barStyle="light-content"
                    networkActivityIndicatorVisible={true}
                />
                <View style={{ width: mobileW, backgroundColor: Colors.theme_color, alignItems: 'center' }}>
                    <View style={{ backgroundColor: Colors.theme_color, height: mobileH * 8 / 100, flexDirection:'row', alignItems: 'center', width: mobileW * 92 / 100, justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            style={{ width: mobileW * 9 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
                            onPress={() => this.props.navigation.goBack()}
                        >
                            <Image resizeMode='contain' style={{
                                width: mobileW * 5.5 / 100, height: mobileW * 5.5 / 100, 
                            }}
                                source={localimag.back}></Image>
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', alignSelf: 'center', }}><Text style={{ fontSize: mobileW * 4.5 / 100, fontFamily: Font.FontRegular, color: Colors.white_color }}>{Lang_chg.report_txt[config.language]}</Text></View>
                        <TouchableOpacity
                            style={{ width: mobileW * 9 / 100, height: mobileW * 9 / 100, marginLeft: mobileW * 3.5 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
                        >
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, alignItems: 'center' }} keyboardShouldPersistTaps='handled'>


                    <View style={{
                        width: mobileW * 90 / 100,
                        marginTop: mobileH * 2.5 / 100,
                        borderRadius: 7,
                        flexDirection:'row',
                        borderColor: Colors.theme_color,
                        borderWidth: 2
                    }}>
                        <View style={{ marginLeft: mobileW * 3.5 / 100 ,
                    marginRight:config.textalign=='left'?0:mobileW*3.5/100
                    }}>
                            <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 12 / 100 }} source={localimag.pen}></Image>
                        </View>
                        <TextInput style={{
                            fontFamily: Font.FontRegular, width: mobileW * 70 / 100, fontSize: mobileW * 4.5 / 100, backgroundColor: Colors.white_color,
                            marginLeft: mobileW * 1.5 / 100,
                            height: 150,
                            textAlignVertical: 'top',
                        }}
                            multiline={true}
                            placeholderTextColor={Colors.placeholder_color}
                            placeholder={Lang_chg.reason_txt[config.language]}
                            keyboardType='default'
                            returnKeyLabel='done'
                            returnKeyType='done'
                            ref={(input) => { this.mobilefield = input; }}
                            onSubmitEditing={() => { Keyboard.dismiss() }}
                            onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                            onChangeText={(txt) => { this.setState({ message: txt }) }}
                            maxLength={250}
                        />
                    </View>
                    <View style={{ alignItems: 'center', alignSelf: 'center' }} >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this.submit_btn()}
                            style={{
                                backgroundColor: Colors.theme_color
                                , paddingVertical: mobileH * 1.8 / 100,
                                borderRadius: 7,
                                marginTop: mobileW * 7 / 100,
                                width: mobileW * 90 / 100, alignSelf: 'center'
                            }}
                        >
                            <Text style={{
                                textAlign: 'center',
                                fontFamily: Font.FontMedium,
                                color: Colors.whiteColor,
                                fontSize: mobileW * 4 / 100,
                            }}>{Lang_chg.submit_txt[config.language]}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>

            </SafeAreaView>


        )
    }
} export default Report

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor


    },
})

