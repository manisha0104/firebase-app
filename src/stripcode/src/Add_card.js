import { BackHandler, Linking, Alert, View, Text, SafeAreaView, StyleSheet, ImageBackground, Image, Modal, StatusBar, FlatList, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import React, { Component } from 'react'
import { Colors, config, mobileH, mobileW, Font, localStorage, Lang_chg, notification, localimag, consolepro, msgProvider, apifuntion, handleback, msgTitle } from './Provider/utilslib/Utils'
export default class Add_card extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user_id: '',
      stripe_card_id: 0,
      customer_id: '',
      card_id: '',
      token: '',
      exp_month: '',
      exst4: '',
      cap_year: '',
      lard_arr: 'NA',
      card_arr: 'NA',
      pay_amount: this.props.route.params.pay_amount,
      // job_payment_id: this.props.route.params.job_payment_id,
      type: this.props.route.params.type,
      descriptor_suffix: 'Job payment',
      transaction_id:''
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

      }  else{
        if (obj.active_status == 0 || obj.account_active_status==0) {
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
  add_card_payment = async () => {
    let user_details1 = await localStorage.getItemObject('user_arr')
    let url = config.baseURL + "stripe_payment/payment_using_card_id.php";
    var data = new FormData();
    data.append('user_id', user_details1.user_id)
    data.append('card_token_id', this.state.card_arr.token)
    data.append('customer_id', this.state.card_arr.customer_id)
    data.append('amount', this.state.pay_amount)
    data.append('descriptor_suffix', this.state.descriptor_suffix)
    consolepro.consolelog('dataaa', data)
    consolepro.consolelog('url', url)
    apifuntion.postApi(url, data).then((obj) => {

      consolepro.consolelog('Addcard123', obj)

      if (obj.success == 'true') {

        consolepro.consolelog("obj", obj);
        consolepro.consolelog("transaction_id", obj.transactions_id);
        this.setState({transaction_id:obj.transactions_id,user_id:this.state.user_id})

        //------next navigation
        
      }
      else{
        if (obj.active_status == 0 || obj.account_active_status==0) {
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

    }).catch((err) => {

      consolepro.consolelog('err', err);

    });
  }
 


  render() {
    return (
      <SafeAreaView>
        <StatusBar
          hidden={false}
          backgroundColor={Colors.whiteColor}
          translucent={false}
          barStyle="dark-content"
          networkActivityIndicatorVisible={true}
        />

        {/* ----------------------------------header -------------------- */}
        <View colors={[Colors.theme_color]}
          style={{
            width: mobileW,
            paddingHorizontal: mobileW * 3 / 100,
            paddingVertical: mobileH * 2 / 100,
            backgroundColor: Colors.whiteColor,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity style={{ width: '10%' }} activeOpacity={1} onPress={() => this.props.navigation.goBack()}>
            <Image source={localimag.black_back}
              style={{ width: mobileW * 5.5 / 100, height: mobileW * 5.5 / 100 }}

              resizeMode='contain' />
          </TouchableOpacity>
          <View style={{ width: '80%', alignItems: 'center' }}>
            <Text
              style={{
                color: Colors.black_color, fontSize: mobileW * 4.5 / 100,
                fontFamily: Font.FontPoppinsBold
              }}
            >Add Card</Text>
          </View>
        </View>
        {this.state.card_arr == 'NA' &&
          <TouchableOpacity activeOpacity={1}
            onPress={() => this.props.navigation.navigate('Payment_savecard')}
            style={{width: mobileW * 80 / 100, alignSelf: 'center', marginTop: mobileW * 6 / 100,
            paddingVertical: mobileW * 4 / 100, backgroundColor: Colors.whiteColor, borderRadius: mobileW * 1 / 100}}>
            <Text style={{
              color: Colors.blueColor, textAlign: 'center',
              fontSize: mobileW * 4.5 / 100, fontFamily: Font.FontPoppinsBold
            }}
            >{Lang_chg.yourCard_txt[config.language]}</Text>
          </TouchableOpacity>}
        {/* =============================card ======================================================= */}
        {this.state.card_arr != 'NA' && <View style={{ width: mobileW * 90 / 100, alignSelf: 'center',  marginTop: mobileW * 5 / 100, borderRadius: mobileW * 2 / 100, paddingVertical: mobileW * 2 / 100 }}>
          <View style={{ flexDirection: 'row', width: '90%', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image style={{ width: 35, height: 35, resizeMode: 'contain' }} source={localimag.Mastercard_logo}>
            </Image>
            <TouchableOpacity
            // onPress={() => { this.delete_click() }}
            >
              <Image style={{ width: 22, height: 22, resizeMode: 'contain', tintColor: 'red' }} source={localimag.bin}>
              </Image>
            </TouchableOpacity>
          </View>
        
          <Text style={{ marginTop: mobileH * 3 / 100, fontSize: mobileW * 4.7 / 100, color: Colors.black_color, fontFamily: Font.FontBold, width: '90%', alignSelf: 'center' }}>**************{this.state.last4}</Text>
          <View style={{ marginTop: mobileH * 3 / 100, flexDirection: 'row', width: '90%', alignSelf: 'center', justifyContent: 'space-between', alignItems: 'center' }}>

            <Text style={{ fontSize: mobileW * 4.7 / 100, color: Colors.black_color, fontFamily: Font.FontBold, width: '96%', alignSelf: 'center' }}>{this.state.exp_month}/{this.state.exp_year}</Text>
            <Image style={{ width: 30, height: 30, resizeMode: 'contain', alignSelf: 'flex-end', right: 15 }} source={localimag.credit_icon}>
            </Image>
          </View>
        </View>}

        {this.state.card_arr != 'NA' &&
          <TouchableOpacity activeOpacity={1}
            onPress={() => this.add_card_payment()}
            style={styles.login_btn}
          >
            <Text style={{
              color: Colors.whiteColor, textAlign: 'center',
              fontSize: mobileW * 4.5 / 100, fontFamily: Font.FontPoppinsBold,
            }}
            >{Lang_chg.contine_txt[config.language]}</Text>
          </TouchableOpacity>}
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  login_btn: {

    width: mobileW * 80 / 100, alignSelf: 'center', marginTop: mobileW * 6 / 100,
    paddingVertical: mobileW * 4 / 100, backgroundColor: Colors.theme_color, borderRadius: mobileW * 1 / 100
  }
})
