import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput } from 'react-native'
//import { TextInput } from 'react-native-paper';
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW ,mediaprovider,Cameragallery} from '../Provider/utilslib/Utils';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto'
import { CheckBox } from 'react-native-elements'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Switch } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';  

class Editprofile extends Component {

    constructor(props) {

        super(props)

        this.state = {
            mobile: '',
            btn: true,
            securetext: true,
            remember_me: false,
            pagename: 'Edit Profile',
            isSwitchOn: false,
            firstname:'',
            lastname:'',
            email:'',
            profile_img:'',
            mediamodal:false
        }


    }

    componentDidMount() {


    }
    componentWillUnmount() {

    }
    Camerapopen = async () => {
        mediaprovider.launchCamera(true).then((res) => {
            console.log('camerares', res)
            this.setState({
                mediamodal: false,
                imagefile: res.path,
            })

        }).catch((error) => {
            this.setState({ mediamodal: false, })
            consolepro.consolelog('error', error);

        })
    }
    Galleryopen = () => {
        mediaprovider.launchGellery(true).then((res) => {
            console.log('camerares', res)
            this.setState({
                mediamodal: false,
                imagefile: res.path,
            })
        }).catch((error) => {
            this.setState({ mediamodal: false })
            consolepro.consolelog('error', error);

        })
    }
    
    logoutbtn = () => {

        Alert.alert("Logging Out", 'Are you sure', [
            {
                text: 'No',
                onPress: () => { consolepro.consolelog('nothing') },
                style: "cancel"
            },
            { text: 'Yes', onPress: () => this.props.navigation.navigate('Login') }
            // { text: 'Yes', onPress: () =>  {config.AppLogout(this.props.navigation)}}
        ], { cancelable: false });
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
                                source={require('./Icons/back.png')}></Image>
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', alignSelf: 'center', }}><Text style={{ fontSize: mobileW * 5 / 100, fontFamily: Font.FontSemiBold, color: Colors.back_color }}>{this.state.pagename}</Text></View>
                        <TouchableOpacity
                            style={{ width: mobileW *6 / 100, height: mobileW * 9 / 100, marginLeft: mobileW * 3.5 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
                        >
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: windowWidth, }} keyboardShouldPersistTaps='handled'>
                    <View style={{ alignSelf: 'center', width: mobileW * 46 / 100, height: mobileW * 46 / 100, borderRadius: mobileW * 23 / 100, marginTop: mobileH * 3 / 100,alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity activeOpacity={1}>
                        <Image resizeMode='cover' style={{ width: mobileW * 42 / 100, height: mobileW * 42 / 100, borderRadius: mobileW * 21 / 100 }} source={require('./Icons/1.jpg')}></Image>
                        </TouchableOpacity>
                    </View>

                    <View style={{ alignSelf: 'center', alignItems: 'center', marginTop: mobileH * 1 / 100 }}>
                    <TouchableOpacity
                    onPress={()=>this.setState({mediamodal:true})}
                    activeOpacity={0.7}>
                        <Text style={{ fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100, color:Colors.theme_color }}>Change Profile Photo</Text>
                      </TouchableOpacity>

                    </View>
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
                                borderColor: Colors.edit_border_color,
                                borderBottomWidth: 0.5
                            }}>
                                <View style={{ marginLeft: mobileW * 2.5 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 4 / 100 }} source={require('./Icons/user.png')}></Image>
                                </View>


                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 70 / 100, fontSize: mobileW * 3.5 / 100, backgroundColor: Colors.back_color,
                                    // backgroundColor:'red',
                                    marginLeft: mobileW * 2 / 100
                                }}
                                    placeholderTextColor={Colors.edit_border_color}
                                    placeholder='First Name'
                                    keyboardType='default'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ firstname: txt }) }}
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
                                borderColor: Colors.edit_border_color,
                                borderBottomWidth: 0.5
                            }}>
                                <View style={{ marginLeft: mobileW * 2.5 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 4 / 100 }} source={require('./Icons/user.png')}></Image>
                                </View>


                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 70 / 100, fontSize: mobileW * 3.5 / 100, backgroundColor: Colors.back_color,
                                    // backgroundColor:'red',
                                    marginLeft: mobileW * 2 / 100
                                }}
                                    placeholderTextColor={Colors.edit_border_color}
                                    placeholder='Last Name'
                                    keyboardType='default'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ lastname: txt }) }}
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
                                borderColor: Colors.edit_border_color,
                                borderBottomWidth: 0.5
                            }}>
                                <View style={{ marginLeft: mobileW * 2.5 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 4 / 100 }} source={require('./Icons/phone.png')}></Image>
                                </View>
                                {config.device_type=='android'?
                                <View style={{borderEndWidth:1,borderColor:Colors.border_color,alignItems:'center',justifyContent:'center',width:mobileW*10/100,alignSelf:'center' }}>
                                <Text style={{  fontFamily:Font.FontRegular,fontSize:mobileW*3.5/100 ,color:Colors.edit_border_color }}>{config.country_code}</Text>
                                    </View>
                                : <View style={{borderEndWidth:1,borderColor:Colors.border_color,alignItems:'center',justifyContent:'center',width:mobileW*10/100,alignSelf:'center' }}>
                                <Text style={{  fontFamily:Font.FontRegular,fontSize:mobileW*3.5/100 ,color:Colors.edit_border_color }}>{config.country_code}</Text>
                                    </View>}

                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 60 / 100, fontSize: mobileW * 3.5 / 100, backgroundColor: Colors.back_color,
                                    // backgroundColor:'red',
                                    marginLeft: mobileW * 2 / 100
                                }}
                                    placeholderTextColor={Colors.edit_border_color}
                                    placeholder='Mobile Number'
                                    keyboardType='number-pad'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ mobile: txt }) }}
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
                                borderColor: Colors.edit_border_color,
                                borderBottomWidth: 0.5
                            }}>
                                <View style={{ marginLeft: mobileW * 2.5 / 100 }}>
                                    <Image resizeMode='contain' style={{ width: mobileW * 4.5 / 100 }} source={require('./Icons/email.png')}></Image>
                                </View>


                                <TextInput style={{
                                    fontFamily: Font.FontRegular, width: mobileW * 70 / 100, fontSize: mobileW * 3.5 / 100, backgroundColor: Colors.back_color,
                                    // backgroundColor:'red',
                                    marginLeft: mobileW * 2 / 100
                                }}
                                    placeholderTextColor={Colors.edit_border_color}
                                    placeholder='Email'
                                    keyboardType='email-address'
                                    returnKeyLabel='done'
                                    returnKeyType='done'
                                    ref={(input) => { this.mobilefield = input; }}
                                    onSubmitEditing={() => { Keyboard.dismiss() }}
                                    onFocus={() => { this.setState({ errorno: 0, activeinput: 1 }) }}
                                    onChangeText={(txt) => { this.setState({ email: txt }) }}
                                    value={this.state.email}

                                />
                            </View>
                            </View>
                            <View style={{ alignItems: 'center', alignSelf: 'center' }} >
                                    <TouchableOpacity

                                    onPress={()=>this.props.navigation.navigate('Profile')}
                                        activeOpacity={0.7} style={{
                                            backgroundColor: Colors.theme_color,
                                            height: mobileH * 5.5 / 100,
                                            width: mobileW * 85 / 100,
                                            alignSelf: 'center',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 20,
                                            marginTop: mobileH * 5 / 100,
                                            marginBottom:mobileH*4/100
                                        }}>
                                        <Text style={{ color: '#f5f4f5', fontFamily: Font.FontSemiBold, fontSize: mobileW * 4 / 100 }}>Update</Text>
                                    </TouchableOpacity>
                            </View>
                            </View>

                </KeyboardAwareScrollView>
                <Cameragallery mediamodal={this.state.mediamodal} Camerapopen={() => { this.Camerapopen() }}
                        Galleryopen={() => { this.Galleryopen() }} Canclemedia={() => { this.setState({ mediamodal: false }) }}
                    />
            </SafeAreaView>


        )
    }
} export default Editprofile

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
        width: windowWidth * 88 / 100,
        alignSelf: 'center',
        alignItems: 'center',

    },
    setting_icons:
    {
        height: windowHeight * 6 / 100,
        width: windowWidth * 11 / 100,
        borderRadius: 10,
        backgroundColor: Colors.theme_color,
        alignItems: 'center',
        justifyContent: 'center'
    },
    setting_view:
    {
        flexDirection: 'row',
        height: windowHeight * 8 / 100,
        justifyContent: 'space-between',
        width: mobileW * 90 / 100,
        alignItems: 'center'
    },





})

