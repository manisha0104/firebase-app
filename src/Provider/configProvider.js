import { Platform } from "react-native";
import base64 from 'react-native-base64'
import { msgProvider, localStorage, msgText, msgTitle ,apifuntion,consolepro} from './utilslib/Utils';
// import firebase from 'firebase'
// import {
//     GoogleSignin,
//    } from 'react-native-google-signin';

global.player_id_me1 = '123456';
//--------------------------- Config Provider Start -----------------------
class configProvider {
	baseURL = 'https://youngdecade.org/2022/sample_app/webservice/';
	img_url = 'https://youngdecade.org/2022/sample_app/webservice/images/200X200/';
	img_url1 = 'https://youngdecade.org/2022/sample_app/webservice/images/400X400/';
	img_url2 = 'https://youngdecade.org/2022/sample_app/webservice/images/700X700/';
	img_url3 = 'https://youngdecade.org/2022/sample_app/webservice/images/';
	login_type = 'app';
	onesignalappid = '6284641d-981c-4c5a-a6fe-e6552daab271'
	oneSignalAuthorization="NGQ1ZGUxMDItODA2YS00YWMwLTliMzUtOWNjZDBmOGFiMjM1"
	firebaseServerKey="AAAAaNh4peI:APA91bFkc-R-88j9-0czRpw4bQxz6luJTIxLP2XAJMiNaQKiRe5ZMGT_IKhxd-nsdcJresdPrU7xQXduO89CT7wfuLO_Og4W4iwOy03XnF4bqO5XLUOixF92iyy-4Q-2B4S8igkUHUPz"
	mapkey = 'AIzaSyA8piMVBD4O7W4z-eo4M046_20rk6iXdDg';
	maplanguage = 'en';
	language = 0;
	player_id = '123456';
	player_id_me = '123456';
	device_type = Platform.OS;
	loading_type = false;
	latitude = 23.1815;
	longitude = 79.9864;
	country_code = '+1';
	demoemail='demo@mailinator.com'
	password='123456'
	namevalidation = /^[^-\s][a-zA-Z0-9_\s-]+$/;
	emailvalidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	mobilevalidation = /^[0-9\_]+$/;
	amountvalidation = /^[0-9\_.]+$/;
	passwordvalidation = /^\S{3,}$/;
	messagevalidation = /^[^-\s][a-zA-Z0-9_\s- ,]+$/;
	url_validation = new RegExp("^(http|https)://", "i");
	textalign = 'right';
	app_status = 1 //---0=prototype,1=dynamic
	appname='Demo'
	headersapi = {
		'Authorization': 'Basic ' + base64.encode(base64.encode('mario') + ":" + base64.encode('carbonell')),
		Accept: 'application/json',
		'Content-Type': 'multipart/form-data',
		'Cache-Control': 'no-cache,no-store,must-revalidate',
		'Pragma': 'no-cache',
		'Expires': 0,
	}
	GetPlayeridfunctin = (player_id) => {
		player_id_me1 = player_id
	}

	checkUserDeactivate = async (navigation) => {
		msgProvider.toast(msgText.accountDeactivated[config.language], 'long')
		setTimeout(() => {
			this.AppLogout(navigation);
		}, 200);
		return false;
	}
	AppLogout = async (navigation) => {
		console.log('AppLogout');

		if(this.app_status==0)
		{
			navigation.navigate('Login');
		}else
		{
		//----------------------- if get user login type -------------
		var userdata = await localStorage.getItemObject('user_arr');
		var password = await localStorage.getItemString('password');
		var email = await localStorage.getItemString('email');
		var remember_me = await localStorage.getItemString('remember_me');
		var language = await localStorage.getItemObject('language');
		var languagecathc = await localStorage.getItemObject('languagecathc');
		var languagesetenglish= await localStorage.getItemObject('languagesetenglish');
		//var id = 'u_' + userdata.user_id;
		//var queryOffinbox = firebase.database().ref('users/' + id + '/myInbox/');
		////queryOff.off('child_added');
		//queryOffinbox.off();
		//// var queryOffLoginUsers = firebase.database().ref('users');
		////  queryOffLoginUsers.off();

		//FirebaseInboxJson = [];

		console.log(password);
		console.log(email);
		console.log(remember_me);
		console.log(language);

		if (userdata != null) {
			localStorage.clear();
			navigation.navigate('Login');
			if (userdata.login_type == 'app') {
				localStorage.clear();
				if (remember_me == 'yes') {
					localStorage.setItemString('password', password);
					localStorage.setItemString('email', email);
					localStorage.setItemString('remember_me', remember_me);

				} else {
					localStorage.setItemString('password', password);
					localStorage.setItemString('email', email);
				}
				localStorage.setItemObject('language', language)
				localStorage.setItemObject('languagecathc', languagecathc)
				localStorage.setItemObject('languagesetenglish', languagesetenglish)
				navigation.navigate('Login');

			} else if (userdata.login_type == 'facebook') {
				console.log('face boook login');
				LoginManager.logOut();
				localStorage.clear();
				localStorage.setItemObject('language', language)
				localStorage.setItemObject('languagecathc', languagecathc)
				localStorage.setItemObject('languagesetenglish', languagesetenglish)
				navigation.navigate('Login')
			} else if (userdata.login_type == 'google') {
				console.log('google login')
				try {
					await GoogleSignin.revokeAccess();
					await GoogleSignin.signOut();
				} catch (error) {
					consolepro.consolelog({ error })
					//alert(error);
				}
				localStorage.clear();
				localStorage.setItemObject('language', language)
				localStorage.setItemObject('languagecathc', languagecathc)
				localStorage.setItemObject('languagesetenglish', languagesetenglish)
				navigation.navigate('Login')
			} else if (userdata.login_type == 5) {
				console.log('face boook login')
			}
		} else {
			console.log('user arr not found');
		}
	}
	}


	//-----------------------email send function--------------
    mailsendfunction = (email_arr) => {
        console.log('email_arr', email_arr);
        for (let i = 0; i < email_arr.length; i++) {
            var email = email_arr[i].email;
            var mailcontent = email_arr[i].mailcontent
            var mailsubject = email_arr[i].mailsubject
            var fromName = email_arr[i].fromName
            var url =  this.baseURL + 'mailFunctionsSend.php';
            var data = new FormData();
            data.append("email", email);
            data.append("mailcontent", mailcontent);
            data.append("mailsubject", mailsubject);
            data.append("fromName", fromName);
            data.append("mail_file", 'NA');
            consolepro.consolelog('verification==', data);

            // api calling start==============================
            apifuntion.postApi(url, data, 1).then((obj) => {

                consolepro.consolelog('email_arr', obj)

                if (obj.success == 'true') {
                    consolepro.consolelog('Response', 'Mail Send Success');
                } else {
                    consolepro.consolelog('Response', 'mail not send');
                }
                // api calling end==============================    
            })
        }
    }

};
//--------------------------- Config Provider End -----------------------

export const config = new configProvider();





