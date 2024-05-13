import React, { Component } from 'react'
import { Text, View,StyleSheet, TouchableOpacity,FlatList, StatusBar, Image, TextInput, Modal,Alert ,Dimensions,Keyboard} from 'react-native'
import { Colors, Font,apifuntion,msgTitle,mobileH,Mapprovider,localimag,msgProvider,msgText,config,mobileW,localStorage,consolepro,handleback,Lang_chg } from './Provider/utilslib/Utils'
import { WebView } from 'react-native-webview';
export default class Payment_savecard extends Component {
    state = {
        user_id: 0,
        subscription_amount:0,
        charge_type:'later',
        booking_arr:'NA',
        booking_number:'',
        transaction_id:'',
        total_amount:'',
        all_amount_total:'',
        status:'',
        activity_arr:'NA',
        num_player_new:'',
        pay_condition:false,
        sendprice:''
       
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener('focus', () => {
            this.getData()
            
        });
    }

    getData=async()=>{
        let user_details   = await localStorage.getItemObject('user_arr');
        let user_id        = user_details.user_id
    this.setState({user_id:user_id})
       
    }
  
   
    _onNavigationStateChange(webViewState) {
        webViewState.canGoBack = false
        if (webViewState.loading == false) {
            console.log('webViewState', webViewState);
            console.log(webViewState.url)
            var t = webViewState.url.split('/').pop().split('?')[0]
            if (typeof (t) != null) {
                var p = webViewState.url.split('?').pop().split('&')
                console.log('file name', t);
                if (t == 'payment_success_final_subscription.php') {

                    var payment_id=0;
                     console.log('p.length', p.length);
                     console.log('p.length', p);;

                    for (var i = 0; i < p.length; i++) {
                        var val = p[i].split('=');
                        console.log('val', val);
                        if (val[0] == "payment_id") {
                            payment_id = val[1]
                            console.log('val[1]',val[1])
                        }
                    }
                       console.log('payment_id',payment_id)
                       consolepro.consolelog('pay_condition',this.state.pay_condition)
                       consolepro.consolelog('t',t)
                       if(this.state.pay_condition==false){
                           
                           this.setState({pay_condition:true})
                        setTimeout(()=>{
                            msgProvider.toast('Card added successfully', 'center');
                            this.props.navigation.goBack();
                         },200)
                       }
                    
                }  else if (t == 'payment_cancel.php') {
                   
                        this.props.navigation.goBack();
                
                    msgProvider.toast('Payment unsuccessful', 'center');
                    return false
                }
                else if (t == 'payment_failed.php') {
                    msgProvider.alert(msgTitle.information[config.language], "Payment unsuccessful", false);
                    this.props.navigation.goBack();
                }
                else if (t == 'payment_cancel_subscription.php') {
                    msgProvider.alert(msgTitle.information[config.language], "Payment transfer unsuccessfully", false);
                    this.props.navigation.goBack();
                }
            }
        }
    }
    render() {

        return (
            <View style={{ flex: 1, backgroundColor: Colors.theme_color }}>
                <StatusBar
                    hidden={false}
                    backgroundColor={Colors.whiteColor}
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                    barStyle="dark-content"
                />
                   {/* =============== header Start ================ */}
                   <View style={{ width: mobileW, backgroundColor: Colors.whiteColor, alignItems: 'center' }}>
                        <View style={{ backgroundColor: Colors.whiteColor, height: mobileH * 8 / 100, flexDirection: 'row', alignItems: 'center', width: mobileW * 92 / 100, justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => { this.props.navigation.goBack() }}
                                style={{ width: mobileW * 5 / 100, height: mobileW * 5 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100, }}
                            >
                                <Image resizeMode='contain' style={{ width: 35, height: 30, }}
                                    source={localimag. black_back}></Image>
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center', alignSelf: 'center', }}>
                                <Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.FontRegular, color: Colors.whiteColor }}>{Lang_chg.payment_processing_txt[config.language]}</Text>
                            </View>
                            <TouchableOpacity

                                style={{ width: mobileW * 7 / 100, height: mobileW * 7 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}

                            >
                            </TouchableOpacity>
                        </View>
                    </View>
       
               
                <View style={{flex:1}}>
                
                    <WebView
                        //  source={{ uri:config.baseURL+'stripe_payment/payment_url_subscription.php?user_id='+this.state.user_id+'&order_id=1&descriptor_suffix=Clinicalhire&transfer_user_id=0&transfer_amount=0&amount='+this.state.subscription_amount+'&charge_type='+this.state.charge_type}}
                         source={{ uri:config.baseURL+'stripe_payment/payment_url_subscription.php?user_id='+this.state.user_id+'&order_id=1&&amount=0'}}
                        //  source={{ uri: config.baseURL + 'stripe_payment/payment_url.php?user_id=' + this.state.user_id + '&order_id=0&descriptor_suffix=VenYou&transfer_user_id=0&transfer_amount=0&amount=' + this.state.subscription_amount }}
                              
                         onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                         javaScriptEnabled={true}
                         domStorageEnabled={true}
                         startInLoadingState={false}
                    />
                </View>
                    
            </View>
        )
       
    }
}
const styles = StyleSheet.create({
        
    container: {
        flex: 1,
        backgroundColor: Colors.whiteColor
    },
    mainheader: {
        height: mobileW * 15 / 100,
        width: mobileW * 100 / 100,
        alignItems: 'center',
        justifyContent: "space-between",
        flexDirection: "row",
        paddingHorizontal: mobileW * 4 / 100,
        backgroundColor: Colors.theme_color
    },
    Email_pass_box1: {
        backgroundColor: Colors.logintextinputcolor,
        borderRadius: mobileW * 7 / 100,
        height: mobileW * 14 / 100,
        width: mobileW * 84 / 100,
        alignSelf: "center",
        justifyContent: "center",
        marginTop: mobileW * 4 / 100,
        alignItems: "center"

    },

});
