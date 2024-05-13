import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput, RefreshControl } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag, pushnotification1, notification, firebaseprovider } from './Provider/utilslib/Utils';


export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user_id: 0,
            user_arr: 'NA',
            booking_arr: [
                {
                    booking_number: '#1001',
                    booking_id: 1,
                    other_user_id:104,
                    name:'Jam',
                    image:null
                },
                {
                    booking_number: '#1002',
                    booking_id: 2,
                    other_user_id:104,
                    name:'Jam',
                    image:null

                },
                {
                    booking_number: '#1003',
                    booking_id: 3,
                    other_user_id:104,
                    name:'Jam',
                    image:null
                },
                {
                    booking_number: '#1004',
                    booking_id: 4,
                    other_user_id:104,
                    name:'Jam',
                    image:null
                },
            ],
            booking_arr_driver: [
                {
                    booking_number: '#1001',
                    booking_id: 1,
                    other_user_id:100,
                    name:'Jerry',
                    image:null
                },
                {
                    booking_number: '#1002',
                    booking_id: 2,
                    other_user_id:100,
                    name:'Jerry',
                    image:null

                },
                {
                    booking_number: '#1003',
                    booking_id: 3,
                    other_user_id:100,
                    name:'Jerry',
                    image:null
                },
                {
                    booking_number: '#1004',
                    booking_id: 4,
                    other_user_id:100,
                    name:'Jerry',
                    image:null
                },
            ],

        }
    }


    componentDidMount() {
        consolepro.consolelog('I am on student home page')
        firebaseprovider.firebaseUserGetInboxCount();
        this.props.navigation.addListener('focus', payload => {
            this.get_all_user();
        });
        this.get_all_user();
    }

    //------for go to inbox  start---------------
    go_to_inbox = () => {
        consolepro.consolelog('i am in go to  inbox ')
        this.props.navigation.navigate('Inbox')
    }
    //------for go to inbox  end---------------
    //------for go to inbox  start---------------
    go_to_inboxbooking = () => {
        consolepro.consolelog('i am in go to  inbox booking ')
        this.props.navigation.navigate('InboxBooking')
    }
    //------for go to inbox  end---------------

    //----------function for get home data --------//

    get_all_user = async (var1 = 0, status = 0) => {
        let result = await localStorage.getItemString('user_id');
        consolepro.consolelog('result', result);
        var user_id_get = 0;
        if (result != null) {
            this.setState({
                user_id: result
            })
            user_id_get = result;
        }
        let url = config.baseURL + "get_all_user.php?user_id=" + user_id_get;
        consolepro.consolelog('url', url)
        apifuntion.getApi(url, var1).then((obj) => {
            consolepro.consolelog(obj)
            if (obj.success == 'true') {
                consolepro.consolelog('home_arr', obj);
                var user_arr = obj.user_arr;
                consolepro.consolelog({ user_arr })

                if (user_arr != 'NA') {
                    this.setState({
                        user_arr: user_arr,
                        refresh: false,
                    })
                }
                else {
                    this.setState({
                        user_arr: "NA",
                        refresh: false,
                    })
                }
            } else {
                this.setState({ refresh: false, show_status: true })
                if (obj.account_active_status == 0) {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                return false;
            }
        }).catch((error) => {
            this.setState({ refresh: false, show_status: true })
            consolepro.consolelog("-------- error ------- " + error);
            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        })
    }

    //2-------  subject image error-------//
    userImageError = (item, index) => {
        consolepro.consolelog('I am in user error image')
        let data = this.state.user_arr
        data[index].image = null;
        this.setState({ user_arr: data })
    }


    //--------------on subject click start-------------
    OnUserClick = (item, index) => {
        consolepro.consolelog('I am in user click...')
        consolepro.consolelog({ item, index })

        var image = item.image;
        var other_user_id = item.other_user_id
        var name = item.name

        if (image != null) {
            image = config.img_url1 + image;
        }
        consolepro.consolelog({ image })
        this.props.navigation.navigate('Chat', {
            'chatdata': {
                'other_user_id': other_user_id,
                 'other_user_name': name,
                'image': image,
                blockstatus: 'no'
            }
        })
    }


    //--------------on subject click start-------------
    OnUserBookingClick = (item, index) => {
        consolepro.consolelog('I am in user click...')
        consolepro.consolelog({ item, index })

        var image = item.image;
        var other_user_id = item.other_user_id
        var name = item.name

        if (image != null) {
            image = config.img_url1 + image;
        }
        consolepro.consolelog({ image })
        
        this.props.navigation.navigate('ChatBooking', {
            'chatdata': {
                'other_user_id': other_user_id,
                 'other_user_name': name,
                'image': image,
                blockstatus: 'no',
                booking_id:item.booking_id,
                booking_number:item.booking_number
            }
        })
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ paddingVertical: mobileH * 1 / 100, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.theme_color, paddingHorizontal: mobileW * 3 / 100 }}>
                        <Text style={{ color: 'white' }}>Home</Text>
                        <TouchableOpacity
                            onPress={() => this.go_to_inbox()}
                            style={{}}
                        >
                            <Text style={{ color: 'white' }}>Inbox </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.go_to_inboxbooking()}
                            style={{}}
                        >
                            <Text style={{ color: 'white' }}>Inbox Booking</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>this.props.navigation.navigate('Setting')}
                            style={{}}
                        >
                            <Text style={{ color: 'white' }}>Setting </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingBottom: mobileH * 7 / 100 }}>
                        <FlatList
                            contentContainerStyle={{}}
                            data={this.state.user_arr}
                            numColumns={3}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity
                                    onPress={() => { this.OnUserClick(item, index) }}
                                    activeOpacity={0.9}
                                >

                                    <View style={{ backgroundColor: Colors.theme_color, width: mobileW, alignContent: 'center', alignItems: 'center', height: mobileW * 30 / 100, width: mobileW * 28 / 100, borderRadius: 10, marginRight: mobileW * 2 / 100, marginTop: mobileH * 1.5 / 100 }}>

                                        <View style={{
                                            borderRadius: mobileW * 50 / 100,
                                            borderWidth: 3,
                                            borderColor: Colors.white_color,

                                        }}>
                                            <ImageBackground
                                                onError={() => this.userImageError(item, index)}
                                                imageStyle={{ width: mobileW * 21 / 100, height: mobileW * 21 / 100, borderRadius: mobileW * 10.5 / 100, }}
                                                source={item.image != null ? { uri: config.img_url1 + item.image } : localimag.user}
                                                //  resizeMode='contain'
                                                style={{
                                                    width: mobileW * 21 / 100, height: mobileW * 21 / 100, borderRadius: mobileW * 10.5 / 100,
                                                }}
                                            ></ImageBackground>

                                        </View>
                                        <View><Text style={{ fontFamily: Font.FontMedium, fontSize: mobileW * 3.2 / 100, color: Colors.white_color }}>{item.name}</Text></View>
                                    </View>
                                    {/* </LinearGradient> */}

                                </TouchableOpacity>
                            }
                        />
                    </View>
                    <View style={{ paddingBottom: mobileH * 7 / 100 }}>
                    <Text >for customer jerry </Text>
                        <FlatList
                            contentContainerStyle={{}}
                            data={this.state.booking_arr}
                            numColumns={3}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity
                                    onPress={() => { this.OnUserBookingClick(item, index) }}
                                    activeOpacity={0.9}
                                >

                                    <View style={{ backgroundColor: Colors.theme_color, width: mobileW, alignContent: 'center', alignItems: 'center', height: mobileW * 30 / 100, width: mobileW * 28 / 100, borderRadius: 10, marginRight: mobileW * 2 / 100, marginTop: mobileH * 1.5 / 100 }}>

                                        <View style={{
                                            borderRadius: mobileW * 50 / 100,
                                            borderWidth: 3,
                                            borderColor: Colors.white_color,

                                        }}>
                                            <ImageBackground
                                                onError={() => this.userImageError(item, index)}
                                                imageStyle={{ width: mobileW * 21 / 100, height: mobileW * 21 / 100, borderRadius: mobileW * 10.5 / 100, }}
                                                source={item.image != null ? { uri: config.img_url1 + item.image } : localimag.user}
                                                //  resizeMode='contain'
                                                style={{
                                                    width: mobileW * 21 / 100, height: mobileW * 21 / 100, borderRadius: mobileW * 10.5 / 100,
                                                }}
                                            ></ImageBackground>

                                        </View>
                                        <View><Text style={{ fontFamily: Font.FontMedium, fontSize: mobileW * 3.2 / 100, color: Colors.white_color }}>{item.booking_number}</Text></View>
                                    </View>
                                    {/* </LinearGradient> */}

                                </TouchableOpacity>
                            }
                        />
                    </View>
                    <View style={{ paddingBottom: mobileH * 7 / 100 }}>
                        <Text >for Driver jam </Text>
                        <FlatList
                            contentContainerStyle={{}}
                            data={this.state.booking_arr_driver}
                            numColumns={3}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) =>
                                <TouchableOpacity
                                    onPress={() => { this.OnUserBookingClick(item, index) }}
                                    activeOpacity={0.9}
                                >

                                    <View style={{ backgroundColor: Colors.theme_color, width: mobileW, alignContent: 'center', alignItems: 'center', height: mobileW * 30 / 100, width: mobileW * 28 / 100, borderRadius: 10, marginRight: mobileW * 2 / 100, marginTop: mobileH * 1.5 / 100 }}>

                                        <View style={{
                                            borderRadius: mobileW * 50 / 100,
                                            borderWidth: 3,
                                            borderColor: Colors.white_color,

                                        }}>
                                            <ImageBackground
                                                onError={() => this.userImageError(item, index)}
                                                imageStyle={{ width: mobileW * 21 / 100, height: mobileW * 21 / 100, borderRadius: mobileW * 10.5 / 100, }}
                                                source={item.image != null ? { uri: config.img_url1 + item.image } : localimag.user}
                                                //  resizeMode='contain'
                                                style={{
                                                    width: mobileW * 21 / 100, height: mobileW * 21 / 100, borderRadius: mobileW * 10.5 / 100,
                                                }}
                                            ></ImageBackground>

                                        </View>
                                        <View><Text style={{ fontFamily: Font.FontMedium, fontSize: mobileW * 3.2 / 100, color: Colors.white_color }}>{item.booking_number}</Text></View>
                                    </View>
                                    {/* </LinearGradient> */}

                                </TouchableOpacity>
                            }
                        />
                    </View>


                </View>
            </View>
        )
    }
}