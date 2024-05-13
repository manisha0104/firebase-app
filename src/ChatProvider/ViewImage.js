import { View, Image, TouchableOpacity, StatusBar, ScrollView, SafeAreaView } from "react-native";
import React, { Component } from 'react';
import { Colors, mobileH, mobileW, config, consolepro, localimag } from '../Provider/utilslib/Utils'
import Image1 from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import ImageZoom from 'react-native-image-pan-zoom';
export default class ViewImage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image: this.props.route.params.image
        }
    }
    componentDidMount = () => {
        consolepro.consolelog('image', this.state.image)
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                <SafeAreaView style={{ flex: 0, backgroundColor: Colors.theme_color }} />
                <StatusBar
                    hidden={false}
                    StatusBarStyle='light-content'
                    backgroundColor={Colors.theme_color}
                    translucent={false}
                    networkActivityIndicatorVisible={true}
                />

                <View style={{
                    paddingTop: 5,
                    paddingBottom: 5,
                    backgroundColor: Colors.theme_color,
                    width: mobileW,
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <TouchableOpacity style={{ height: mobileW * 12 / 100, width: mobileW * 12 / 100, justifyContent: 'center', alignItems: 'center' }}
                        activeOpacity={0.8} onPress={() => { this.props.navigation.goBack() }}
                    >
                        <Image source={localimag.back} style={{ height: mobileW * 6 / 100, width: mobileW * 6 / 100 }} resizeMode='contain' />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: Colors.whiteColor }}>
                    <ImageZoom style={{ flex: 1 }} cropWidth={mobileW}
                        cropHeight={mobileH}
                        imageWidth={mobileW}
                        imageHeight={mobileH}>
                        <Image1
                            renderError={() => {
                                consolepro.consolelog('I am here in banner image error')
                                this.setState({ image: null })
                            }}
                            indicator={ProgressBar.Circle}
                            resizeMode='contain'
                            style={{ width: mobileW, height: mobileH, borderRadius: 5, }} source={{ uri: config.img_url3 + this.state.image }} />
                    </ImageZoom>
                </View>
            </View>
        );
    }
}
