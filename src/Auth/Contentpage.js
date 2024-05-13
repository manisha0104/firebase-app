import React, { Component } from 'react';
import { Text, BackHandler, SafeAreaView, StatusBar, KeyboardAvoidingView, Alert, View, StyleSheet, Keyboard, Dimensions, ImageBackground, TouchableOpacity, Image, Modal, FlatList, ScrollView, RadioButton, Button, TextInput } from 'react-native'
import { config, msgProvider, localStorage, apifuntion, msgText, msgTitle, consolepro, Lang_chg, Font, Colors, mobileH, mobileW, localimag } from '../Provider/utilslib/Utils';
import HTMLView from 'react-native-htmlview';
class Contentpage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pagename: this.props.route.params.pagename,
            contentpage: this.props.route.params.contentpage,
            data_not_found: '',
            datafound: 'NA',
        }
    }
    componentDidMount() {
        if (config.app_status == 1) {
            this.getContent();
        }
        consolepro.consolelog('global content arr', content_arr)
    }
    //---------function for get all content-------//
    getContent = async () => {
        if (content_arr == 'NA') {
            let url = config.baseURL + "get_all_content.php?user_id=1";
            consolepro.consolelog('url', url)
            apifuntion.getApi(url).then((obj) => {
                consolepro.consolelog(obj)
                if (obj.success == 'true') {
                    consolepro.consolelog('content_obj', obj);
                    var data = obj.content_arr;
                    if (data != 'NA') {
                        this.setState({ datafound: obj.content_arr });
                        content_arr = obj.content_arr
                    }
                    else {
                        this.setState({ datafound: 'NA', data_not_found: Lang_chg.content_not_found[config.language] })
                    }
                } else {
                    msgProvider.alert(msgTitle.information[config.language], obj.msg[config.language], false);
                    return false;
                }
            }).catch((error) => {
                consolepro.consolelog("-------- error ------- " + error);
                msgProvider.alert(msgTitle.internet[config.language], msgText.networkconnection[config.language], false);
            })
        }
        else {
            consolepro.consolelog('if content arr not NA', content_arr);
            var data = content_arr;
            if (data != 'NA') {
                this.setState({ datafound: content_arr });
            }
            else {
                this.setState({ datafound: 'NA', data_not_found: Lang_chg.content_not_found[config.language] })
            }
        }
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

                <View style={{
                    backgroundColor: Colors.theme_color, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', paddingHorizontal: mobileW * 4 / 100, paddingVertical: mobileH * 2 / 100, width: mobileW
                }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack()}
                        activeOpacity={0.9}
                        style={{ width: mobileW * 9 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            resizeMode='contain'
                            style={{
                                width: mobileW * 5.5 / 100, height: mobileW * 5.5 / 100,
                            }}
                            source={localimag.back}
                        ></Image>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: Font.FontMedium, fontSize: mobileW * 4.5 / 100, color: Colors.whiteColor }}>{this.state.pagename}</Text>
                    <View style={{ width: mobileW * 9 / 100, height: mobileW * 9 / 100, alignItems: 'center', justifyContent: 'center' }}></View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false} contentContainerStyle={{ width: mobileW, }} keyboardShouldPersistTaps='handled'>
                    {config.app_status == 1 &&
                        <View style={{ alignItems: 'center', marginTop: mobileH * 2 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                            {
                                (this.state.datafound != 'NA')
                                    ?
                                    this.state.datafound.map((item, index) => (
                                        (item.content_type == this.state.contentpage)
                                            ?
                                            <HTMLView
                                                value={config.language == 0 ? item.content : item.content}
                                                stylesheet={styles12}
                                            />
                                            :
                                            null))
                                    :
                                    <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 19 }}>{this.state.data_not_found}</Text>
                            }

                        </View>}
                    {config.app_status == 0 &&
                        <View style={{ alignItems: 'center', marginTop: mobileH * 2 / 100, width: mobileW * 90 / 100, alignSelf: 'center' }}>
                            <Text style={{ alignSelf: 'center', marginTop: 10, fontSize: 19 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</Text>
                        </View>}
                </ScrollView>

            </SafeAreaView>


        )
    }
} export default Contentpage

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor


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
})
const styles12 = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        // backgroundColor: 'red'
    },
    button:
    {
        marginBottom: 13,
        borderRadius: 6,
        paddingVertical: 12,
        width: '50%',
        margin: 15,
        backgroundColor: '#fa5252'
    },
    textbutton: {
        borderBottomColor: '#f2f2f2'
        , borderBottomWidth: 1,
        paddingVertical: 16,
        width: '95%',
        alignSelf: 'center'
    },
    textfont: {
        fontSize: 13,
        paddingLeft: 10
    },
    p: {
        fontWeight: '300',
        color: 'black',
        marginBottom: -50,
        lineHeight: 24,
        letterSpacing: 0.8,
        fontStyle: 'normal',
    },

})



