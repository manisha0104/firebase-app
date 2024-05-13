import React, { Component } from 'react';
import { BackHandler, Linking, Alert, View, Text, SafeAreaView, Keyboard, StyleSheet, ImageBackground, Image, Modal, StatusBar, FlatList, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Colors, config, mobileH, mobileW, Font, localStorage, Lang_chg, notification, localimag, consolepro, msgProvider, apifuntion, handleback, msgTitle } from './Provider/utilslib/Utils'
export default class Manage_card extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stripe_card_id: 0,
      customer_id: '',
      card_id: '',
      token: '',
      exp_month: '',
      exst4: '',
      cap_year: '',
      card_arr: 'NA',
      user_id: '',
    }
  }
  async componentDidMount() {

    this._willBlurSubscription = this.props.navigation.addListener('blur', payload =>

      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    );
    var user_id = await localStorage.getItemString('user_id')
    consolepro.consolelog('user_id-----', user_id)
    this.setState({ user_id: user_id })
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.get_card(0);
    });
    this.get_card(1);
  }
  get_card = async (page) => {

    consolepro.consolelog('I am in get card')
    let user_details = await localStorage.getItemObject('user_arr');

    let user_id = user_details.user_id

    let url = config.baseURL + "stripe_payment/get_stripe_card.php?user_id=" + user_id;

    consolepro.consolelog('url', url)

    apifuntion.getApi(url, page).then((obj) => {

      if (obj.success == 'true') {
        console.log('obj', obj)
        this.setState({
          card_arr: obj.card_arr, last4: obj.card_arr.last4,
          exp_year: obj.card_arr.exp_year,
          exp_month: obj.card_arr.exp_month,
          stripe_card_id: obj.card_arr.stripe_card_id,
          customer_id: obj.card_arr.customer_id,
          token: obj.card_arr.token,
        })
        console.log('obj.posted_job_arr mus', obj.card_arr)

      } else {
        if (obj.active_status == 0 || obj.account_active_status == 0) {
          setTimeout(() => {
            config.checkUserDeactivate(this.props.navigation)
          }, 300);
          return false;
        } else {
          setTimeout(() => {
            msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
          }, 300);

        }
        return false;
      }
    }).catch((error) => {
      console.log("-------- error ------- " + error);
    })
  }
  delete_click() {
    Alert.alert(
      'Delete',
      "Do you want to delete this card?",
      [
        {
          text: 'NO',
        },
        {
          text: 'YES',
          onPress: () => this.delete_click_card(),
        },
      ],
      { cancelable: false },
    );
  }
  delete_click_card = async () => {

    let user_details = await localStorage.getItemObject('user_arr');
    let user_id = user_details.user_id

    let url = config.baseURL + "delete_stripe_card.php";
    console.log("url", url)

    var data = new FormData();
    data.append('user_id', user_id)
    data.append('stripe_card_id', this.state.stripe_card_id)


    consolepro.consolelog('data', data)

    apifuntion.postApi(url, data).then((obj) => {
      consolepro.consolelog("obj", obj)
      if (obj.success == 'true') {
        setTimeout(() => {
          this.get_card()

        }, 500)
      } else {
        setTimeout(() => {
          msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
        }, 200)
        return false;
      }
    }).catch((error) => {
      consolepro.consolelog("-------- error ------- " + error);
      this.setState({ loading: false });
    });

  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 0 }} />
        <StatusBar
          hidden={false}
          backgroundColor={Colors.whiteColor}
          translucent={false}
          networkActivityIndicatorVisible={true}
          barStyle="dark-content"
        />
        {/* =============================header============================================= */}
        <View style={{
          flexDirection: 'row', backgroundColor: Colors.whiteColor, height: mobileH * 8 / 100,
          alignItems: 'center', justifyContent: 'space-between', width: mobileW
        }}>
          <View style={{ width: '10%', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100, }} source={localimag.black_back}></Image>
            </TouchableOpacity>
          </View>
          <View style={{ width: '80%', alignItems: 'center' }}>
            <Text style={{
              color: Colors.black_color, fontSize: mobileW * 4.8 / 100,
              fontFamily: Font.FontPoppinsBold
            }}>
              {Lang_chg.AddCard_txt[config.language]}
            </Text>
          </View>
          <View style={{ width: '10%', alignItems: 'center' }}></View>

        </View>

        {/* =================================end header========================================== */}


        {this.state.card_arr != 'NA' && <View style={{ width: mobileW * 90 / 100, alignSelf: 'center', marginTop: mobileW * 5 / 100, borderRadius: mobileW * 2 / 100, paddingVertical: mobileW * 2 / 100, backgroundColor: Colors.whiteColor }}>
          <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image style={{ width: 35, height: 35, resizeMode: 'contain' }} source={localimag.Mastercard_logo}>
            </Image>
            <TouchableOpacity
              onPress={() => { this.delete_click() }}
            >
              <Image style={{ width: 22, height: 22, resizeMode: 'contain', tintColor: 'red' }} source={localimag.bin}>
              </Image>
            </TouchableOpacity>
          </View>

          <Text style={{ marginTop: mobileH * 3 / 100, fontSize: mobileW * 4.7 / 100, color: Colors.black_color, fontFamily: Font.FontBold, width: '90%', alignSelf: 'center' }}>**************{this.state.last4}</Text>
          <View style={{ marginTop: mobileH * 3 / 100, flexDirection: 'row', width: '90%', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center' }}>

            <Text style={{ fontSize: mobileW * 4.7 / 100, color: Colors.black_color, fontFamily: Font.FontBold, width: '96%', alignSelf: 'center' }}>{this.state.exp_month}{this.state.exp_year}</Text>
            <Image style={{ width: 30, height: 30, resizeMode: 'contain', alignSelf: 'flex-end', right: 15 }} source={localimag.credit_icon}>
            </Image>
          </View>
        </View>}
      </View>
    )
  }
}