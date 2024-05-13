import React, { Component } from 'react'
import { Alert } from 'react-native'
import { CommonActions } from '@react-navigation/native';
//import { appleAuth,AppleButton } from '@invertase/react-native-apple-authentication';
import { msgProvider, msgText, msgTitle, config, localStorage, apifuntion, Lang_chg, consolepro } from '../utilslib/Utils'
//import { GoogleSignin, GoogleSigninButton, statusCodes, } from 'react-native-google-signin';
//import { LoginManager , AccessToken,GraphRequest, GraphRequestManager,} from 'react-native-fbsdk'
global.navigatefunction = '';
class SocialLoginProvider extends Component {
  constructor(props) {
    super(props);
    // GoogleSignin.configure({
    //   webClientId: '230950925497-e30bqvp86raiuhkh7bkgotiu3rqi9lve.apps.googleusercontent.com',
    // });
  }

  goHomePage = (navigation) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'Home' },
        ],
      })
    );
  }

  Socialfunction = (navigation, btn, type) => {
    if (type == 'normal') {
      var social_type = btn;
      var login_type = btn;
      var social_id = '001942.7f1a8d2b59354833977cc59e439459a3.0507';
      var social_name = 'UploadingApp';
      var social_first_name = 'UploadingApp';
      var social_middle_name = '';
      var social_last_name = 'YoungDecade';
      var social_email = 'uploadingapp.youngdecade@gmail.com';
      // var social_image_url = 'img/no_image_found.png';
      var social_image_url = 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200';
      var result = {
        social_id: social_id,
        social_type: social_type,
        login_type: login_type,
        social_name: social_name,
        social_first_name: social_first_name,
        social_last_name: social_last_name,
        social_middle_name: social_middle_name,
        social_email: social_email,
        social_image: social_image_url,
      }
      this.callsocailweb(result, navigation)
    }
    else {
      if (btn == 'facebook') {
        this.FacebookLogin(navigation)
      }
      else if (btn == 'google') {
        this.GoogleLogin(navigation)
      }
      else if (btn == 'apple') {
        this.Applelogin(navigation)
      }
    }

  }

  FacebookLogin = async (navigation) => {
    navigatefunction = navigation;
    LoginManager.logInWithPermissions([
      'public_profile', "email"
    ]).then((result) => {
      if (result.isCancelled) {
        console.log('Login cancelled');
        // alert('login cancel')
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          const processRequest = new GraphRequest(
            '/me?fields=id,name,email,first_name,middle_name,last_name,picture.type(large)',
            null,
            this.get_Response_Info
          );
          new GraphRequestManager().addRequest(processRequest).start();
        });
      }
    })
  }
  get_Response_Info = (error, result) => {
    if (error) {
      Alert.alert('Error fetching data: ' + error.toString());
    } else {
      console.log('aa gya kya bhai')
      consolepro.consolelog({result})
      var socaildata = {
        'social_id': result.id,
        'social_name': result.name,
        'social_first_name': result.first_name,
        'social_last_name': result.last_name,
        'social_middle_name': '',
        'social_email': result.email,
        'social_image': result.picture.data.url,
        'social_type': 'facebook',
        'logintype': 'facebook',
      }
       this.callsocailweb(socaildata, navigatefunction)
    }
  };

  GoogleLogin = async (navigation) => {
    //Prompts a modal to let the user sign in into your application.
    
    try {

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      var result = {
        'social_name': userInfo.user.name,
        'social_first_name': userInfo.user.givenName,
        'social_last_name': userInfo.user.familyName,
        'social_email': userInfo.user.email,
        'social_image': userInfo.user.photo,
        social_type: 'google',
        'logintype': 'google',
        'social_id': userInfo.user.id
      }
      // alert(JSON.stringify(result));
      this.callsocailweb(result, navigation)

    } catch (error) {
      // alert('Message'+error.message)
      console.log('Message', error.message);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log('Some Other Error Happened');
      }
    }
  };
  Applelogin = async (navigation) => {
    await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
    })
      .then(
        res => {
          var result = {
            'social_name': res.fullName.familyName,
            'social_first_name': res.fullName.givenName,
            'social_last_name': res.fullName.familyName,
            'social_email': res.email,
            'social_image': 'NA',
            social_type: 'apple',
            'logintype': 'apple',
            'social_id': userInfo.user
          }
          this.callsocailweb(result, navigation)

        },
        error => {
          console.log(error);
        }
      );

    // TODO: Send the token to backend

  }
  callsocailweb = (result, navigation) => {
    console.log('result', result)
    console.log('navigation', navigation)
    var data = new FormData();
    data.append("social_email", result.social_email);
    data.append("social_id", result.social_id);
    data.append("device_type", config.device_type);
    data.append("player_id", player_id_me1);
    data.append("social_type", result.social_type);
    localStorage.setItemObject('socialdata', result);
    var url = config.baseURL + 'social_login.php';
    console.log('home', data)
    console.log('url', url);
    console.log('navigation', navigation)
    apifuntion.postApi(url, data).then((obj) => {
      console.log(obj);
      console.log('navigation1', navigation)
      if (obj.success == 'true') {
        if (obj.user_exist == 'yes') {
          localStorage.setItemObject('user_arr', obj.user_details)
          localStorage.setItemString('user_id', JSON.stringify(obj.user_details.user_id))
          consolepro.consolelog(navigation.navigate)
          navigation.navigate('Home')
        }
        else {
          consolepro.consolelog(navigation.navigate)
           navigation.navigate('Signup');
        }
      }
      else
      {
        if (obj.active_status == 0) {
          config.checkUserDeactivate(navigation);
          return false;
      }
      }
    }).catch((error) => {
      console.log("-------- error ------- " + error);
      msgProvider.alert(msgTitle.server[config.language], msgText.servermessage[config.language], false);
      this.setState({ loading: false })
    });

  }


}

export const SocialLogin = new SocialLoginProvider();
