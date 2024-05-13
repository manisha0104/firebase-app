import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';
import Entypo from 'react-native-vector-icons/Entypo'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class DeleteAccount extends Component {

  constructor(props) {

    super(props)

    this.state = {
      message: '',
      user_id: '',
    }


  }
  componentDidMount() {
    consolepro.consolelog('iamdelete account')
  }
  //-----------------------------function for submit report-------------

  submit_btn = async () => {
    if (config.app_status == 0) {
      this.props.navigation.navigate('Login')
      return false
    } else {
      let { message } = this.state;
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
      consolepro.consolelog({ message, user_id_get })
      //-----------------------message--------------
      if (message.trim().length <= 0) {
        msgProvider.toast(msgText.emptyDeleteReasonMessage[config.language], 'center')
        return false
      }
      if (message.trim().length <= 2) {
        msgProvider.toast(msgText.enterMinimumThree[config.language], 'center')
        return false
      }
      //-------------------api calling--------------

      let url = config.baseURL + "delete_account.php";
      var data = new FormData();
      data.append('user_id', user_id_get)
      data.append('comment', message.trim())
      consolepro.consolelog('data', data)
      apifuntion.postApi(url, data).then((obj) => {
        consolepro.consolelog('res_arr', obj)

        if (obj.success == 'true') {
          setTimeout(() => {
            msgProvider.toast(obj.msg[config.language], 'center');
          }, 300);
          this.props.navigation.navigate('Login')
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
              activeOpacity={0.7}
              onPress={() => this.props.navigation.goBack()}
              style={{ width: mobileW * 7 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
            >
              <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, }}
                source={localimag.back}></Image>
            </TouchableOpacity>
            <View style={{ alignItems: 'center', alignSelf: 'center', }}><Text style={{ fontSize: mobileW * 5.3 / 100, fontFamily: Font.FontRegular, color: Colors.white_color }}>{Lang_chg.delete_acc_txt[config.language]}</Text></View>
            <TouchableOpacity
              style={{ width: mobileW * 7 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
            >
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, }}
          keyboardShouldPersistTaps='handled'>

          <View style={{
            width: mobileW * 90 / 100,
            marginTop: mobileH * 2.5 / 100,
            //height: mobileH * 6 / 100,
            // backgroundColor:'green',
            // borderRadius: 7,
            flexDirection: 'row',
            // alignItems: 'center',
            borderColor: Colors.theme_color,
            borderWidth: 0.7,
            alignSelf: 'center'
          }}>

            <View style={{ marginLeft: mobileW * 3.5 / 100 }}>
              <Image resizeMode='contain' style={{ width: mobileW * 5 / 100, height: mobileW * 8 / 100 }} source={localimag.pen}></Image>
            </View>


            <TextInput style={{
              fontFamily: Font.FontRegular, width: mobileW * 70 / 100, fontSize: mobileW * 3.5 / 100, backgroundColor: Colors.white_color,
              // backgroundColor:'red',
              marginLeft: mobileW * 2 / 100,
              height: 175,
              textAlignVertical: 'top'
            }}
              multiline={true}
              placeholderTextColor={Colors.placeholder_color}
              placeholder=''
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

              onPress={() => this.submit_btn()}
              activeOpacity={0.7} style={{
                backgroundColor: Colors.theme_color,
                height: mobileH * 5.5 / 100,
                width: mobileW * 90 / 100,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 7,
                marginTop: mobileH * 2 / 100
              }}>
              <Text style={{ color: Colors.white_color, fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100 }}>{Lang_chg.submit_txt[config.language]}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>

      </SafeAreaView>


    )
  }
} export default DeleteAccount

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white_color
  },


})

