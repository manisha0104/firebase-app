import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity,Alert, Image, SafeAreaView, StatusBar } from 'react-native'
import {
  Colors, config, Font, Lang_chg, localimag,
  pushnotification, localStorage, msgProvider, mediaprovider, msgText, msgTitle, apifuntion, mobileH, mobileW, consolepro
} from './Provider/utilslib/Utils';
import Footer from './Provider/Footer';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default class Home extends Component {
  logoutbtn = () => {

    Alert.alert(Lang_chg.Logout_txt[config.language], Lang_chg.are_you_logout[config.language], [
        {
            text: Lang_chg.no_txt[config.language],
            onPress: () => { consolepro.consolelog('nothing') },
        },
        { text: Lang_chg.yes_txt[config.language], onPress: () => config.AppLogout(this.props.navigation) }
    ], { cancelable: false });
}
  render() {
    return (
      <View style={{ flex: mobileW * 1 / 100, backgroundColor: Colors.whiteColor }}>
        <SafeAreaView style={{ backgroundColor: Colors.whiteColor }} />
        <StatusBar
          hidden={false}
          translucent={false}
          barStyle="dark-content"
          backgroundColor={Colors.white_color}
          networkActivityIndicatorVisible={true}
        />
        {/* ----------Header---------- */}
        <TouchableOpacity 
        onPress={() => this.logoutbtn()}
        style={styles.HeaderView}>

          <Image style={{ width: mobileW, height: mobileW * 15 / 100 }}
            // resizeMode="contain"
            source={localimag.HomeHeader}>
          </Image>
        </TouchableOpacity>

        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: mobileH * 10 / 100 }} keyboardShouldPersistTaps='handled'>

        <View style={{
          width: mobileW * 88 / 100,
          alignSelf: 'center',
          // backgroundColor:'red',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <View>
            <Text style={{
              fontFamily: Font.FontBold,
              fontSize: mobileW * 5.5 / 100,
              color: Colors.black_color
            }}>{'Hello Alex'}</Text>
            <Text style={{
              fontFamily: Font.FontRegular,
              fontSize: mobileW * 3.3 / 100,
              color: Colors.black_color
            }}>{'Good morning'}</Text>
          </View>
          <TouchableOpacity style={{
            paddingHorizontal: mobileW * 2 / 100,
            height: mobileW * 6.3 / 100,
            justifyContent: 'center',
            backgroundColor: Colors.theme_color,
            alignItems: 'center',
            borderRadius: mobileW * 1.5 / 100
          }}>
            <Text style={{
              fontFamily: Font.FontMedium,
              fontSize: mobileW * 3 / 100,
              color: Colors.whiteColor,
              textAlign: 'center'
            }}>+ {'Add'}</Text>
          </TouchableOpacity>
        </View>

        <LinearGradient
       
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        colors={['#FB9017','#FB6B3B']}
     style={{
          width: mobileW * 88 / 100,
          alignSelf: 'center',
          backgroundColor: 'red',
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: mobileW * 4.5 / 100,
          paddingVertical: mobileH * 2 / 100,
          marginTop: mobileH * 2.5 / 100
        }}>  
      
          <View style={{
            width: mobileW * 88 / 100,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: mobileW * 4 / 100
          }}>
            <View style={{
              alignItems: 'center',
            }}>
              <Image source={localimag.RupeyBag}
                style={{
                  height: mobileW * 20 / 100,
                  width: mobileW * 20 / 100
                }} />
              <Text style={{
                fontFamily: Font.FontSemiBold,
                fontSize: mobileW * 3.8 / 100,
                color: Colors.whiteColor,
                paddingTop:mobileH*1/100
              }}>{'July'}</Text>
            </View>

            <View style={{
              width: mobileW * 0.18 / 100,
              height: mobileW * 20 / 100,
              backgroundColor: Colors.whiteColor,
              marginLeft: mobileW * 4.5 / 100
            }} />
            <View style={{ marginLeft: mobileW * 9.5 / 100 }}>
              <View>
                <Text style={{
                  fontFamily: Font.FontSemiBold,
                  fontSize: mobileW * 3.8 / 100,
                  color: Colors.whiteColor
                }}>{'Income'}</Text>
                <Text style={{
                  fontFamily: Font.FontRegular,
                  fontSize: mobileW * 3 / 100,
                  color: Colors.whiteColor,
                  paddingTop:mobileH*0.5/100
                }}>${'22,000'}</Text>
              </View>
              <View style={{marginTop:mobileH*1.7/100}}>
                <Text style={{
                  fontFamily: Font.FontSemiBold,
                  fontSize: mobileW * 3.8 / 100,
                  color: Colors.whiteColor
                }}>{'Expenses'}</Text>
                <Text style={{
                  fontFamily: Font.FontRegular,
                  fontSize: mobileW * 3 / 100,
                  color: Colors.whiteColor,
                  paddingTop:mobileH*0.5/100
                }}>${'5,000'}</Text>
              </View>
            </View>
          </View>
        
</LinearGradient>


        <View style={{
          marginTop: mobileH * 3 / 100,
          width: mobileW * 88 / 100, alignSelf: 'center',
          justifyContent:'space-between',
          flexDirection: 'row'
        }}>
          <View style={{
          }}>
            <View style={{
              width: mobileW * 41.2 / 100,
              borderRadius: mobileW * 4 / 100,
              height: mobileH * 26.5 / 100,
              backgroundColor: '#FFF6EC',
            }}>
              <Image source={localimag.Home}
                style={{
                  height: mobileW * 16.5 / 100,
                  width: mobileW * 16.5 / 100,
                  marginTop:mobileH*5/100,
                  alignItems: 'center',
                  alignSelf:'center'
                }} />
                <View style={{marginLeft:mobileW*3.5/100}}>
              <Text style={styles.Property}>{'Listed properties'}</Text>
                <Text style={styles.Number}>{'10'}</Text>
              </View>
            </View>
            <View style={{
               width: mobileW * 41.2 / 100,
               borderRadius: mobileW * 4 / 100,
               height: mobileH * 20.5 / 100,
               backgroundColor: '#E6E6FA',
               marginTop: mobileH * 2.5 / 100,
            }}>
             <Image source={localimag.Enquiry}
                style={{
                  height: mobileW * 15 / 100,
                  width: mobileW * 15 / 100,
                  marginTop:mobileH*2.5/100,
                  alignItems: 'center',
                  alignSelf:'center'
                }} />
                <View style={{marginLeft:mobileW*3.5/100}}>
              <Text style={styles.Property1}>{'Tenant Enquires'}</Text>
                <Text style={styles.Number}>{'10'}</Text>
              </View>
            </View>
          </View>

          <View style={{
          }}>
             <View style={{
               width: mobileW * 41.2 / 100,
               borderRadius: mobileW * 4 / 100,
               height: mobileH * 20.5 / 100,
               backgroundColor: '#E3F6F4',
            }}>
             <Image source={localimag.User}
                style={{
                  height: mobileW * 15 / 100,
                  width: mobileW * 15 / 100,
                  marginTop:mobileH*2.5/100,
                  alignItems: 'center',
                  alignSelf:'center'
                }} />
                <View style={{marginLeft:mobileW*3.5/100}}>
              <Text style={styles.Property1}>{'Active Tenant'}</Text>
                <Text style={styles.Number}>{'10'}</Text>
              </View>
            </View>
            <View style={{
              width: mobileW * 41.2 / 100,
              borderRadius: mobileW * 4 / 100,
              height: mobileH * 26.5 / 100,
              backgroundColor: '#F3F3FF',
              marginTop: mobileH * 2.5 / 100,
            }}>
              <Image source={localimag.Dues}
                style={{
                  height: mobileW * 17 / 100,
                  width: mobileW * 17 / 100,
                  marginTop:mobileH*5/100,
                  alignItems: 'center',
                  alignSelf:'center'
                }} />
                <View style={{marginLeft:mobileW*3.5/100}}>
              <Text style={styles.Property}>{'Pending Dues'}</Text>
                <Text style={styles.Number}>{'10'}</Text>
              </View>
            </View>
           
          </View>
        </View>

</KeyboardAwareScrollView>



      </View>
    )
  }
}
const styles = StyleSheet.create({
  HeaderView: {
    width: mobileW,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: mobileH * 2 / 100
  },
  HeaderText: {
    fontSize: mobileW * 5.5 / 100,
    fontFamily: Font.FontBold,
    Colors: Colors.black_color,
    marginTop: config.device_type == 'android' ? mobileH * 0.6 / 100 : mobileH * 0 / 100,
  },
  Property:{
    fontFamily: Font.FontRegular,
    fontSize: mobileW * 3.1 / 100,
    color: Colors.black_color,
    marginTop:mobileH*4/100
  },
  Property1:{
    fontFamily: Font.FontRegular,
    fontSize: mobileW * 3.1 / 100,
    color: Colors.black_color,
    marginTop:mobileH*1.3/100
  },
  ListesProperty:{
    fontFamily: Font.FontRegular,
    fontSize: mobileW * 3.1 / 100,
    color: Colors.black_color
  },
  Number:{
    fontFamily: Font.FontSemiBold,
    fontSize: mobileW * 6.5/ 100,
    color: Colors.black_color,
    marginTop:mobileH*0.6/100
  }
})