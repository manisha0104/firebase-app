import { Alert, ToastAndroid, I18nManager, Platform } from "react-native";
import { localStorage } from './localStorageProvider';
import { AsyncStorage } from 'react-native';
import { config } from "./configProvider";
import RNRestart from 'react-native-restart';
import { consolepro } from './Messageconsolevalidationprovider/Consoleprovider'
global.language_key = 1;
class Language_provider {

  language_get = async () => {
    var item = await localStorage.getItemObject('language');
    console.log('check launguage option', item)

    consolepro.consolelog('is rtl', I18nManager.isRTL)
    consolepro.consolelog('is rtl config', config.textalign)

    if (item != null) {
      console.log('kya bat h developer', config.language)
      config.language = item;
    }
    console.log('language_key123', config.language)
    if (item != null) {
      if (item == 0) {

        config.textalign = 'left'
        config.inverted = false
      } else {

        config.textalign = 'right'
        config.inverted = true
      }

    } else {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      config.textalign = 'left'
      config.inverted = false
      localStorage.setItemObject('language', 0)

    }
  }

  language_set = async (languagem) => {

    console.log('I18nManager.isRTL Developer', I18nManager.isRTL)
    if (languagem == 0) {
      I18nManager.forceRTL(false);
      I18nManager.allowRTL(false);
      config.textalign = 'left';
      config.inverted = false
      localStorage.setItemObject('language', 0)
      localStorage.removeItem('languagecathc')
      localStorage.removeItem('languagesetenglish');
      config.language = 0
    }
    else {
      I18nManager.forceRTL(true);
      I18nManager.allowRTL(true);
      config.textalign = 'right';
      config.inverted = true
      localStorage.setItemObject('language', 1)
      localStorage.setItemObject('languagecathc', 0)
      config.language = 1
    }

    setTimeout(() => {
      RNRestart.Restart()
    }, 500);
  }
  // Media option ///////////////////
  MediaCamera = ['Choose Camera', ''];
  Mediagallery = ['Choose Gallery', ''];
  cancelmedia = ['Cancel', ''];

  //-----------not for developer use start ------------------//
  go_back_txt = ['Go back', 'Go back']
  do_you_want_exit_txt = ['Do you want to exit app', 'Do you want to exit app']
  do_you_want_goback_txt = ['Do you want to go back', 'Do you want to go back']
  verify_txt = ['Verify', 'Verify']
  resend_txt = ['Resend', 'Resend']
  email_txt = ['Email', 'Email']
  OTP_txt = ['OTP', 'OTP']
  Logout_txt = ['Logout', 'Logout']
  are_you_logout = ['Are you sure , you want to logout?', 'Are you sure , you want to logout?']
  notification_arr = ['Notification', 'Notification']
  terms_and_condition_txt = ['Terms and Conditions', 'Terms and Conditions']
  privacy_policy_txt = ['Privacy Policy', 'Privacy Policy']
  about_us_txt = ['About Us', 'About Us']
  delete_account_txt = ['Delete Account', 'حذف الحساب']
  are_you_sure_delete_txt = ['Are you sure ?', 'هل انت متأكد من حذف الحساب؟']
  content_not_found = ['Content Not Available', 'Content Not Available']
  Contactus = ['Contact Us', 'Contact Us']
  changepassword_txt = ['Change Password', 'Change Password']
  Setting = ['Setting', 'Setting']
  notification = ['notification', 'notification']
  rate_app = ['Rate App', 'Rate App']
  share_app = ['Share App', 'Share App']
  Logout = ['Logout', 'Logout']
  Show = ['Show', 'Show']
  Hide = ['Hide', 'Hide']

  //--for chat start --------

  online_txt = ['Online',]
  offline_txt = ['Offline',]
  type_something_txt = ['Type Something',]

  //-----------------------chat page-------------------------------//
  chattextinputmessage = ['Message', '']
  chataction = ['Action', 'Action', '']
  chatreport = ['Report User', '']
  chatclear = ['Clear Chat', '']
  chatcancel = ['Cancel', '']
  reportmessagepopup = ['Are your sure you want to ? report', '']
  chatclearpopup = ['Are your sure you to ? clear chat', '']
  ChooseMedia = ['Choose', ''];
  Confirm = ["Confirm", '']
  block_permission = ['Are you sure? you want to block this user', '']
  unblock_permission = ['Are you sure? you want to unblock this user', '']
  select_option_txt = ['Select Option', '']
  report_txt = ['Report', '']
  chats_txt = ['Chats', '']
  block_txt = ['Block', '']
  unblock_txt = ['Unblock', '']
  cancel_txt = ['Cancel', '']
  submit_txt = ['Submit', '']
  reason_txt = ['Reason', '']
  search_here_txt = ['Search here',]
  you_blocked_this_user = ['You Block this person']
  no_txt = ['No', 'No']
  yes_txt = ['Yes', 'Yes']
  //--for chat end --------

  //-------create password start-------------//
  create_password_txt = ['Create Password']
  //-------create password end -------------//
  //-------Delete Account start-------------//
  delete_acc_txt = ['Delete Account']
  //-------Delete Account end -------------//
  //-------FAQ's"start-------------//
  faq_txt = ["FAQ's"]
  //-------FAQ's"end -------------//

  //-----------notification start ---------//
  notifications_txt = ['Notifications']
  clear_all = ['Clear All']
  info = ['Information']
  areyousure_txt = ['Are you sure , you want to clear notifications?']
  //-----------notification end

  //----------signup----------//
  signup_txt = ['Signup']
  fullname_txt = ['Full Name']
  mobile_no_txt = ['Mobile Number']
  address_txt = ['Address']
  pincode_txt = ['Pin Code']
  cpass_txt = ['Confirm Password']
  iaccept_txt = ['I Accept all']
  terms_txt = ['Terms & Conditions']
  changepassword_txt = ['Change Password']
  and_txt = ['and']
  Privacy_policy_txt = ['Privacy Policy']
  you_already_txt = ['You already have an account?']
  email_txt = ['Email']
  india_txt = ['India']
  canada_txt = ['Canada']
  enter_password = ['Password'];
  login_txt = ['Login'];

  //-----------not for developer use end ------------------//
  login_successfully=['Login Successfully']
  signup_successfully=['signup Successfully']
  user_and_password_wrong=['email and password not correct']
  email_notregister=['email not registered']
  user_not_exit=['user not exist']

}
export const Lang_chg = new Language_provider();