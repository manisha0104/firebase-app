import React, { Component } from 'react';
import { Text, SafeAreaView, StatusBar, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import { config, msgProvider, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class Faq extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_id: '',
            show: false,
            faq_arr: '',
            faq_arr: [
                {
                question_arr: ['Hello', 'Hello'],
                answer_arr: ['Hello Answer', 'Hello Answer'],
                status: false
            },
            {
                question_arr: ['Hello1', 'Hello1'],
                answer_arr: ['Hello1 Answer', 'Hello1 Answer'],
                status: false
            },
            {
                question_arr: ['Hello2', 'Hello2'],
                answer_arr: ['Hello2 Answer', 'Hello2 Answer'],
                status: false
            },
        
        ],
           
        }


    }
    componentDidMount() {
        if (config.app_status == 1) {
            this.get_faq();
        }
    }
    componentWillUnmount() {

    }

    //----------function for get faq--------//

    get_faq = async () => {


        let url = config.baseURL + "faq_get.php?user_id=0";
        consolepro.consolelog('url', url)
        apifuntion.getApi(url).then((obj) => {
            consolepro.consolelog(obj)
            //  alert(JSON.stringify(obj))
            if (obj.success == 'true') {
                consolepro.consolelog('faq_obj', obj);
                var faq_arr = obj.faq_arr;

                if (faq_arr != 'NA') {
                    this.setState({ faq_arr: obj.faq_arr });
                }
                else {
                    this.setState({ faq_arr: 'NA' })
                }
            } else {
                if (obj.account_active_status == 0) {
                    config.checkUserDeactivate(this.props.navigation);
                    return false;
                }
                msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                return false;
            }
        }).catch((error) => {
            consolepro.consolelog("-------- error ------- " + error);

            msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
        })

    }

    //---------function for open close faq ---------//

    setSupport = (item, index) => {

        let data1 = this.state.faq_arr;

        data1[index].status = !data1[index].status;

        var send_data = [];
        for (let i = 0; i < data1.length; i++) {
            if (data1[i].status == true) {
                send_data.push(data1[i].answer);
            }
        }

        if (send_data.length <= 0) {
            this.setState({
                faq_arr: data1,

            })
        } else {
            this.setState({
                faq_arr: data1,

            })
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
                    <View style={{ backgroundColor: Colors.theme_color, height: mobileH * 8 / 100, flexDirection: 'row', alignItems: 'center', width: mobileW * 90 / 100, justifyContent: 'space-between' }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.goBack()}
                            activeOpacity={0.7}
                            style={{ width: mobileW * 5 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
                        >
                            <Image resizeMode='contain' style={{ width: mobileW * 5.5 / 100, height: mobileW * 5.5 / 100, }}
                                source={localimag.back}></Image>
                        </TouchableOpacity>
                        <View style={{ alignItems: 'center', alignSelf: 'center', }}><Text style={{ fontSize: mobileW * 5.5 / 100, fontFamily: Font.FontRegular, color: Colors.white_color }}>{Lang_chg.faq_txt[config.language]}</Text></View>
                        <TouchableOpacity
                            style={{ width: mobileW * 5 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
                        >
                        </TouchableOpacity>
                    </View>
                </View>
                <KeyboardAwareScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, alignItems: 'center', justifyContent: 'center', }}
                    keyboardShouldPersistTaps='handled'>

                    <View style={{ marginTop: mobileH * 2 / 100 }}>
                        {this.state.faq_arr != 'NA' ?
                            <FlatList
                                data={this.state.faq_arr}
                                renderItem={({ item, index }) =>
                                    <View style={{
                                        width: mobileW,
                                        alignItems: 'center',
                                        borderColor: Colors.border_color,
                                        borderTopWidth: 1,
                                        borderBottomWidth: 1,
                                        paddingVertical: 12,
                                        marginTop: mobileH * 1 / 100

                                    }}>
                                        {item.status == false ?
                                            <TouchableOpacity
                                                onPress={() => this.setSupport(item, index)}
                                                activeOpacity={0.7}
                                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: mobileW * 90 / 100 }}>
                                                <View style={{ width: mobileW * 84 / 100, }}>
                                                    <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.FontSemiBold, color: Colors.profile_color }} >
                                                        {item.question_arr[config.language]}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={{ width: mobileW * 5 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
                                                >
                                                    <Image resizeMode='contain' style={{ width: mobileW * 4 / 100, height: mobileW * 4 / 100, }}
                                                        source={localimag.up_arrow}></Image>
                                                </View>
                                            </TouchableOpacity>
                                            : <View style={{ justifyContent: 'space-between', alignItems: 'center', width: mobileW * 90 / 100 }}>
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    onPress={() => this.setSupport(item, index)}
                                                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: mobileW * 90 / 100 }}>
                                                    <View style={{ width: mobileW * 84 / 100, }}>
                                                        <Text style={{ fontSize: mobileW * 4 / 100, fontFamily: Font.FontSemiBold, color: Colors.profile_color }} >
                                                            {item.question_arr[config.language]}
                                                        </Text>

                                                    </View>
                                                    <View

                                                        activeOpacity={0.7}
                                                        style={{ width: mobileW * 5 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center', borderRadius: mobileW * 4.5 / 100 }}
                                                    >
                                                        <Image resizeMode='contain' style={{ width: mobileW * 4 / 100, height: mobileW * 4 / 100, }}
                                                            source={localimag.down}></Image>
                                                    </View>
                                                </TouchableOpacity>
                                                <View style={{ marginTop: mobileH * 2 / 100 }}>
                                                    <Text style={{ fontSize: mobileW * 3.5 / 100, fontFamily: Font.FontSemiBold, color: Colors.profile_color }} >
                                                        {item.answer_arr[config.language]}
                                                    </Text>
                                                </View>
                                            </View>}
                                    </View>
                                }
                            />
                            : <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', height: mobileH * 60 / 100 }}>
                                <Image resizeMode='contain' style={{ width: mobileW * 40 / 100, height: mobileH * 20 / 100 }} source={localimag.no_data}></Image>
                            </View>}
                    </View>

                </KeyboardAwareScrollView>

            </SafeAreaView>


        )
    }
} export default Faq

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white_color
    },

})

