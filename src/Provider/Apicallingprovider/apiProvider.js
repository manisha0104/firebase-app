import NetInfo from '@react-native-community/netinfo';
import firestore from '@react-native-firebase/firestore';
import { Webfunction } from '../Webservice';
class ApiContainer {

  getApi = async (url,status) => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          if(status!=1)
          {
            global.props.showLoader();
          }
         // global.props.showLoader();
          fetch(url, {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
               Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
             },
           }).then((response) => response.json())
            .then((obj) => {
              global.props.hideLoader();
              resolve(obj);
            })
            .catch((error) => {
              global.props.hideLoader();
              reject(error);
            });
        }else {
          global.props.hideLoader();
          reject('noNetwork');
        }
      })
    })
  }
  postApi = async (url,data,status) => {
    return new Promise((resolve, reject) => {
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          if(status!=1)
          {
            global.props.showLoader();
          }
          // global.props.showLoader();
          fetch(url, {
            method: 'POST',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
               Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
             },
             body:data
           }).then((response) => response.json())
            .then((obj) => {
              global.props.hideLoader();
              resolve(obj);
            })
            .catch((error) => {
              global.props.hideLoader();
              reject(error);
            });
        }else {
          global.props.hideLoader();
          reject('noNetwork');
        }
      })
    })
  }
  callapi=async(url,data,status)=>{
    return new Promise(async(resolve, reject) => {
       NetInfo.fetch().then(state => {
         if (state.isConnected == true) {
           if(status!=1)
             {
               global.props.showLoader();
             }
        
           if(url=='login'){Webfunction.Loginbtn(data).then((res)=>{
               global.props.hideLoader();
                resolve(res);
             }).catch(()=>{global.props.hideLoader();
                 reject(res)
             })
             }
           if(url=='signup'){Webfunction.signupbtn(data).then((res)=>{
               global.props.hideLoader();
                resolve(res);
             }).catch(()=>{global.props.hideLoader();
                 reject(res)
             })
             }
             if(url=='userlogin'){Webfunction.userlogin(data).then((res)=>{
               global.props.hideLoader();
                resolve(res);
             }).catch(()=>{global.props.hideLoader();
                 reject(res)
             })
             }
            else if(url=='forgot'){Webfunction.Forgot_pass(data).then((res)=>{
               global.props.hideLoader();
                resolve(res);
             }).catch(()=>{global.props.hideLoader();
                 reject(res)
             })
             }
             else if(url=='otp_verify_forgot'){Webfunction.forgotOTPverify(data).then((res)=>{
               global.props.hideLoader();
                resolve(res);
             }).catch(()=>{global.props.hideLoader();
                 reject(res)
             })
             }
             else if(url=='reset_pass'){Webfunction.reset_password(data).then((res)=>{
               global.props.hideLoader();
                resolve(res);
             }).catch(()=>{global.props.hideLoader();
                 reject(res)
             })
             }
             else if(url=='resend_verify'){Webfunction.Resendotp(data).then((res)=>{
               global.props.hideLoader();
               resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
            }
            else if(url=='editprofile'){Webfunction.Edit_profile(data).then((res)=>{
             global.props.hideLoader();
              resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
            }
           else if(url=='change_pass'){Webfunction.changepassword(data).then((res)=>{
             global.props.hideLoader();
              resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
           }
           else if(url=='broadcast_msg'){Webfunction.broadcastnotification(data).then((res)=>{
             global.props.hideLoader();
              resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
           }
           else if(url=='get_history'){Webfunction.getallbrodcastHistory(data).then((res)=>{
             global.props.hideLoader();
              resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
           }
           else if(url=='get_user_data'){Webfunction.get_user_data(data).then((res)=>{
             global.props.hideLoader();
              resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
           }
           else if(url=='get_user_data'){Webfunction.getbrodcast_user_side(data).then((res)=>{
             global.props.hideLoader();
              resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
           }
           else if(url=='reply_msg'){Webfunction.replymsg(data).then((res)=>{
             global.props.hideLoader();
              resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
           }
           else if(url=='delete_msg'){Webfunction.Delete_brodcast_msg(data).then((res)=>{
             global.props.hideLoader();
              resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
           }
           else if(url=='delete_reply_msg'){Webfunction.Delete_brodcast_reply_msg(data).then((res)=>{
             global.props.hideLoader();
              resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
           }
           else if(url=='get_content'){Webfunction.get_contant(data).then((res)=>{
             global.props.hideLoader();
              resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
           }
           else if(url=='vip_success'){Webfunction.vip_success(data).then((res)=>{
             global.props.hideLoader();
              resolve(res);
           }).catch(()=>{global.props.hideLoader();
               reject(res)
           })
           }
            
            
             
             
         }else {
              global.props.hideLoader();
              reject('noNetwork');
         }
       })
     })
    }
  
}
//--------------------------- Config Provider End -----------------------
export const apifuntion = new ApiContainer();
