import firestore from '@react-native-firebase/firestore';
import { Lang_chg } from '../Language_provider';
import storage from '@react-native-firebase/storage';
// import RNSmtpMailer from "react-native-smtp-mailer";
import { config } from '../configProvider';
import { apifuntion } from '../Apicallingprovider/apiProvider';
import { consolepro } from '../Messageconsolevalidationprovider/Consoleprovider';
class Webservicecontainer {

  
  //---------------------for email send start-----------------//
  mailsendfunction = (email, mailcontent, mailsubject, fromName) => {
    // console.log('email_arr', email_arr);

    var email = email;
    var mailcontent = mailcontent
    var mailsubject = mailsubject
    var fromName = fromName
    var url = config.mailapi;
    var data = new FormData();
    data.append("email", email);
    data.append("mailcontent", mailcontent);
    data.append("mailsubject", mailsubject);
    data.append("fromName", fromName);
    data.append("mail_file", 'NA');
    consolepro.consolelog('verification==', data);
    consolepro.consolelog('api==', url);

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
  //---------------------for email send end-----------------//
  // Signup webservice
  getuserdetaile = async (user_id) => {
    consolepro.consolelog('user check@@user_id',user_id)
    return new Promise((resolve, reject) => {
      firestore().collection("construction_db").doc('' + user_id + '').get().then((res) => {
        console.log('res get', res)
        if (res.exists == true) {
          let user_dateil_me = res.data();
          user_dateil_me.payment_status = 0;
          resolve(user_dateil_me);
        }
        else {
          resolve('NA');
        }

      }).catch((error) => {
        console.log('error', error)
        resolve('NA');
      })
    })
  }
  insertplayer_id = async (user_id) => {
    return new Promise((resolve, reject) => {
      let id_get = 0;
      // firestore().collection("user_notification").get().then((querySnapshot)=>{
      //   id_get = querySnapshot.size;
      //   console.log('getlast_id655',id_get);
      //   id_get=id_get+1;

      //   let id_get=0;

      firestore().collection("user_notification").orderBy("notification_id", "desc").limit(1).get().then(async (querySnapshot) => {
        console.log('querySnapshot', querySnapshot.size)
        if (querySnapshot.size > 0) {
          console.log('hello_akash')
          id_get = querySnapshot.docs[0].data().notification_id + 1
        }
        else {
          id_get = 1
        }



        if (id_get != 0) {

          firestore().collection("user_notification").where("user_id", "==", parseInt(user_id))
            .get().then((doc) => {

              console.log('player_id check user', doc)
              if (doc.size > 0) {
                let data_notification = doc.docs[0].data();
                firestore().collection("user_notification").doc('' + data_notification.notification_id + '').update({ player_id:fcmtoken }).then(async (res) => {
                  resolve('yes')
                }).catch((eror) => {
                  resolve('no')
                })
              }
              else {
                let player_id_update = {
                  device_type: config.device_type,
                  inserttime: new Date(),
                  player_id: fcmtoken,
                  user_id: user_id,
                  notification_id: id_get
                }
                firestore().collection("user_notification").doc('' + id_get + '').set(player_id_update).then(async (res) => {

                  resolve('yes')
                }).catch((eror) => {

                  resolve('no')
                })
              }

            })
        }
      })
    })
  }
  checkactivateuser = async (user_id) => {
    return new Promise((resolve, reject) => {
      firestore().collection("user_master").where('user_id', '==', parseInt(user_id)).where("active_flag", "==", 1)
        .get().then((doc) => {
          console.log('docsdgsd', doc.size)
          if (doc.size > 0) {
            resolve('activate')
          }
          else {
            resolve('deactivate')
          }
        }).catch((erro) => {
          resolve('deactivate')
        })
    })
  }


  EnterPassword = async (data) => {
    return new Promise((resolve, reject) => {
      firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).get().then((res1) => {
        console.log('res.size', res1.size)
        if (res1.size > 0) {
          firestore().collection("user_master").doc('' + data.user_id + '').update({ password: data.password, signup_step: data.signup_step }).then(async (res) => {
            console.log('ressdgasdgag', res)
            let user_details = await this.getuserdetaile(data.user_id);
            let myjosonretur = { success: 'true', msg: Lang_chg.password_set, 'user_details': user_details }
            resolve(myjosonretur);
          }).catch((error) => {
            console.log('error', error)
            let myjosonretur = { success: 'false', msg: Lang_chg.password_not_set }
            resolve(myjosonretur);
          })
        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      })

    })
  }
  Loginbtn = async (data) => {
    console.log('admin data', data)
    return new Promise((resolve, reject) => {
      console.log('admin data', data)
      console.log('admin data',data.email)
      firestore().collection("construction_db").where('email', '==', data.email.toLowerCase()).where('delete_flag', '==', 0).get().then(async (res) => {
        console.log('check email', res)
        console.log('check email', res.size)
        if (res.size > 0) {
          firestore().collection("construction_db").where('email', '==', data.email.toLowerCase()).where('password', '==', '' + data.password + '').where('delete_flag', '==', 0).get().then(async (res1) => {
            console.log('passwordcheck', res1)
            console.log('passwordcheck', res1.size)
            if (res1.size > 0) {
           
              // let player_id_success = await this.insertplayer_id(res1.docs[0].data().user_id);
              // if (player_id_success == 'no') {
              //   await this.insertplayer_id(id_get);
              // }
              let user_details = await this.getuserdetaile(res1.docs[0].data().user_id);
             
                  
             
              let myjosonretur = { success: 'true', msg: Lang_chg.login_successfully, 'user_details': user_details }
              resolve(myjosonretur);
            }
            else {
              let myjosonretur = { success: 'false', msg: Lang_chg.user_and_password_wrong }
              resolve(myjosonretur);
            }
          })
          // consolepro.consolelog('user_id check',res.docs[0].data().user_id)
          // let user_details = await this.getuserdetaile(res.docs[0].data().user_id);
          // let myjosonretur = { success: 'true', msg: Lang_chg.login_successfully, 'user_details': user_details }
          // resolve(myjosonretur);
        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.email_notregister }
          resolve(myjosonretur);
        }
      }).catch((error) => {
        console.log('last error', error)
        let myjosonretur = { success: 'false', msg: Lang_chg.email_notregister }
        resolve(myjosonretur);
      })
    })
  }
  signupbtn = async (data) => {
   
    return new Promise((resolve, reject) => {
      console.log('signup data1', data)
      let id_get=0;
      firestore().collection("construction_db").orderBy("user_id", "desc").limit(1).get().then(async (querySnapshot) => {
      console.log('querySnapshot', querySnapshot)

      if(querySnapshot.size>0)
          {
              console.log('hello_akash')
              id_get=querySnapshot.docs[0].data().user_id+1
          }
        else{
              id_get=1
            }
          console.log('user side #### user_id',id_get)

     let myupdate = {
      name: data.name,
      mobile_no: data.mobile_no,
      email: data.email,
      password:data.password,
      delete_flag:0,
      otp_verify:1,
      user_id:id_get,
      'createtime':new Date(),
      'updatetime': new Date()
      // device_id:data.device_id,
      // password:data.password,
      // player_id: data.fcmtoken,
      // user_id:id_get,
      // plan_type:data.plan_type,
      // transection_id:data.transection_id,
      // createtime:data.createtime,

  }
  console.log('my userhome @@@@ myupdate data',myupdate)

  
  await firestore().collection("construction_db").doc(''+id_get+'').set(myupdate).then(async (res) => {

    //console.log('user side #### res get',res)

     //let user_data =res.docs[0].data();
     let user_data = await this.getuserdetaile(id_get);
      console.log('user side #### user_data get',user_data)
     

        
        let myjosonretur = { success: 'true', msg: Lang_chg.signup_successfully,'user_arr':user_data}
        resolve(myjosonretur);

      

    }).catch((error) => {
      let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
      console.log({error})
      resolve(myjosonretur);
  
    })

  })
      // firestore().collection("construction_db").where('user_id', '==', parseInt(data.user_id)).where('delete_flag', '==', 0).get().then(async (res) => {
      //   console.log('res.size@@', res.size)
      //   if (res.size > 0) {
         
        
      //     let myupdate = {
      //       name: data.name,
      //       mobile_no: data.mobile,
      //       email: data.email,
      //       password:data.password,
      //       delete_flag:0,
      //       'createtime':new Date(),
      //       'updatetime': new Date()
      //     }
      //     console.log('myupdate@@', myupdate)
      //     await firestore().collection("construction_db").doc('' + data.user_id + '').update(myupdate).then(async (res) => {
      //       console.log('signup myupdate', res)
      //       let user_details = await this.getuserdetaile(data.user_id)
      //       let myjosonretur = { success: 'true', msg: Lang_chg.profile_update, 'user_details': user_details }
      //       resolve(myjosonretur);
      //     }).catch((eror) => {
      //       let myjosonretur = { success: 'false', msg: Lang_chg.profile_not_update }
      //       resolve(myjosonretur);
      //     })

      //   }
      //   else {
      //     let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
      //     resolve(myjosonretur);
      //   }
      // })

    })
  }
  Edit_profile = async (data) => {
   
    return new Promise((resolve, reject) => {
      console.log('edit profile data1', data)
      firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).where('delete_flag', '==', 0).get().then(async (res) => {
        if (res.size > 0) {
         
          let imageuploading = 'NA'
          if (data.image_identity == 'yes') {
            imageuploading = await this.uploadImageToStorage(data.path,data.path_name)
            console.log('imageuploading........',imageuploading)
           
            if (imageuploading == 'no') {
              alert('image not uploaded');
              let myjosonretur = { success: 'false', msg: Lang_chg.profile_not_update }
              resolve(myjosonretur);
            }

          }
           else{
           
            imageuploading=data.path
          }
          let myupdate = {
            name: data.name,
            email: data.email,
            image: imageuploading,
            image_url:imageuploading,
            'updatetime': new Date()
          }
          await firestore().collection("user_master").doc('' + data.user_id + '').update(myupdate).then(async (res) => {
            console.log('editprofile', res)
            let user_details = await this.getuserdetaile(data.user_id)
            let myjosonretur = { success: 'true', msg: Lang_chg.profile_update, 'user_details': user_details }
            resolve(myjosonretur);
          }).catch((eror) => {
            let myjosonretur = { success: 'false', msg: Lang_chg.profile_not_update }
            resolve(myjosonretur);
          })

        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      })

    })
  }
  replymsg = async (data) => {
    console.log('reply msg page', data)
    return new Promise((resolve, reject) => {
      firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).where('delete_flag', '==', 0).get().then(async (res) => {
        console.log('reply msg page res', res.size )
        if (res.size > 0) {

        
        
          let myupdate = {
                    user_status:data.user_status,
                    title:data.title,
                    message:data.message,
                    image:data.image,
                    image_url:data.image,
                    reply_msg_id :data.broadcast_id,
	                  reply_status : data.reply_status,
	                  reply_msg :data.reply_msg,
                    createtime:new Date(),
                    delete_flag:0,
                    broadcast_id:data.broadcast_id,
                    user_id:data.user_id,
                    updatetime:new Date(),
          }
          console.log('brodcast reply myupdate', myupdate)

          await firestore().collection("broadcast_master").doc('' + parseInt(data.broadcast_id) + '').update(myupdate).then(async (res) => {
            console.log('brodcast reply msg', res)


            let notification_arr = []
            firestore().collection("user_master").where('plan_type', '==', parseInt(data.user_status)).get().then(async (doc) => {
              console.log(' get doc',doc);
            
              for (let i = 0; i < doc.docs.length; i++) {

              let other_user_id =doc.docs[i].data().user_id;

                      if(other_user_id != 1){

                      
                      this.insertplayer_id(data.user_id);
                    
                      //let user_details = await this.getuserdetaile(data.user_id)
                      
                      let mynotifacationdata = {
                        user_id_notication:data.user_id,
                        other_user_id_notication:other_user_id,
                        action: 'login',
                        action_id:data.user_id,
                        title: 'Replied message',
                        title_2: 'Replied message', 
                        title_3:'Replied message', 
                        title_4:'Replied message',
                        message: data.reply_msg,
                        message_2:data.reply_msg,
                        message_3: data.reply_msg,
                        message_4: data.reply_msg,
                      }
                      let notification_arr_get = await this.notificationinsert(mynotifacationdata, data.user_id, other_user_id);
                      console.log('notification_arr_get rrrrr',notification_arr_get);
                     
                      if(notification_arr_get != 'NA'){
                        notification_arr.push(notification_arr_get);
                      }

                      console.log('notification_arr rrrrr',notification_arr);
                      
                    }
              
          
              }

              let myjosonretur = { success: 'true', msg: Lang_chg.replied_sucessful,'notification_arr':notification_arr }
              resolve(myjosonretur);
              
            })
          }).catch((eror) => {
            let myjosonretur = { success: 'false', msg: Lang_chg.profile_not_update }
            resolve(myjosonretur);
          })

        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      })

    })
  }

  // get_user_data = async (device_id) => {
  //   return new Promise((resolve, reject) => {
  //     console.log('res get user info device_id***', device_id)
  //     firestore().collection("user_master").doc('' + device_id + '').get().then((res) => {
  //       console.log('res get user info***', res.size)
  //       if (res.size > 0) {
  //         let user_dateil_me = res.data();
  //         console.log('res get user info user_dateil_me***', user_dateil_me)
  //         resolve(user_dateil_me);
  //       }
  //       else {
  //         resolve('NA');
  //       }

  //     }).catch((error) => {
  //       console.log('error', error)
  //       resolve('NA');
  //     })
  //   })
  // }
  userlogin = async (data) => {
    //console.log('user data', data)
    return new Promise((resolve, reject) => {
      //console.log('user data', data)
      firestore().collection("user_master").where("device_id", "==", data.device_id).get().then(async (doc) => {
            if (doc.size > 0) {
              //console.log('user side #### user_data',data)
              console.log('user side #### doc',doc)
              let user_id =doc.docs[0].data().user_id;
              let user_data = await this.getuserdetaile(user_id);
              console.log('user side #### user_data get',user_data)
              let player_id_success = await this.insertplayer_id(doc.docs[0].data().user_id);
              if (player_id_success == 'no') {
                await this.insertplayer_id(doc.docs[0].data().user_id);
              }
              console.log('user side #### user_dat get',user_data)
                let myjosonretur = { success: 'true', msg: Lang_chg.login_successfully,'user_arr':user_data }
              resolve(myjosonretur);
            
            
            }
            else{

              let id_get=0;
              firestore().collection("user_master").orderBy("user_id", "desc").limit(1).get().then(async (querySnapshot) => {
              console.log('querySnapshot', querySnapshot)
        
              if(querySnapshot.size>0)
                  {
                      console.log('hello_akash')
                      id_get=querySnapshot.docs[0].data().user_id+1
                  }
                else{
                      id_get=1
                    }
                  console.log('user side #### user_id',id_get)

             let myupdate = {
              device_id:data.device_id,
              password:data.password,
              player_id: data.fcmtoken,
              user_id:id_get,
              plan_type:data.plan_type,
              transection_id:data.transection_id,
              createtime:data.createtime,

          }
          console.log('my userhome @@@@ myupdate data',myupdate)
  
          
          await firestore().collection("user_master").doc(''+id_get+'').set(myupdate).then(async (res) => {

            //console.log('user side #### res get',res)

             //let user_data =res.docs[0].data();
             let user_data = await this.getuserdetaile(id_get);
              console.log('user side #### user_data get',user_data)
              let player_id_success = await this.insertplayer_id(id_get);
              if (player_id_success == 'no') {
                await this.insertplayer_id(id_get);
              }

                
                let myjosonretur = { success: 'true', msg: Lang_chg.login_successfully,'user_arr':user_data}
                resolve(myjosonretur);
  
              

            }).catch((error) => {
              let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
              console.log({error})
              resolve(myjosonretur);
          
            })

          })
          }
          
          })

     
       
  
    })
  }

  vip_success = async (data) => {
    return new Promise((resolve, reject) => {
           console.log('vip success data',data)
           let myupdate = {
            
            plan_type:data.plan_type,
            transection_id:data.transection_id,
           
          }
          console.log('my vip success @@@@ myupdate data',myupdate)
          console.log('my vip success @@@@ data.device_id data',data.device_id)

          firestore().collection("user_master").doc('' + data.user_id + '').update(myupdate).then(async (doc) => {
            firestore().collection("user_master").doc('' + data.user_id + '').get().then((doc) => {
              console.log('vip get doc',doc);
              let user_data =doc.data();
             
              console.log('user side #### updated user_dat get',user_data)
            let myjosonretur = { success: 'true', msg: Lang_chg.msg_update_success,'user_arr':user_data}
            resolve(myjosonretur);
            })
            
          }).catch((eror) => {
            console.log('eroreror',eror);
            let myjosonretur = { success: 'false', msg: Lang_chg.msg_update_unsuccess}
            resolve(myjosonretur);
          })

        
    

    })
  }

  // get_user_data = async (data) => {
  //   console.log('data get______',data )
  //   return new Promise((resolve, reject) => {
  //     firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).where('delete_flag', '==', 0).get().then(async (res) => {
  //       if (res.size > 0) {

  //         firestore().collection("broadcast_master").where('delete_flag', '==', 0).where('user_status', '==', parseInt(data.user_status)).get().then(async (res) => {


  //           let broadcast_arr = 'NA'
    
  //           if (res.size > 0) {
  //             broadcast_arr = [];
  //             for (let i = 0; i < res.docs.length; i++) {
  //               broadcast_arr[i] = res.docs[i].data()
  //               //console.log("broadcast arr",broadcast_arr)
  //             }
  //           }
            
  //           let myjosonretur = { success:'true',broadcast_arr:broadcast_arr }
  //           resolve(myjosonretur);
  //         }).catch((error) => {
  //           console.log('errorhomecityerro', error)
  //           let myjosonretur = { success: 'false', msg: Lang_chg.data_not_found }
  //           resolve(myjosonretur);
  //         })

  //       }
  //       else {
  //         let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
  //         resolve(myjosonretur);
  //       }
  //     })

  //   })
  // }
  Forgot_pass=async(data)=>{
    console.log('forgot password email data',data)
    return new Promise((resolve, reject) => {
      console.log('forgot password email data',data)
      var genrate_otp = Math.floor(1000 + Math.random() * 9000); 
      firestore().collection("user_master").where('email','==',data.email.toLowerCase()).where('delete_flag','==',0).get().then(async(res)=>{
        console.log('forgot password  res',res)
        if(res.size>0)
            { 
              console.log('forgot password email data........')

            await firestore().collection("user_master").doc(''+parseInt(res.docs[0].data().user_id)+'').update({forgot_verify:1,otp:genrate_otp}).then(async(res1)=>{
                
              console.log('forgot password otp........')

              let user_details=await this.getuserdetaile(res.docs[0].data().user_id);

              console.log('user_details........',user_details)

             let myjosonretur={success:'true',msg:Lang_chg.password_reset_otp_successfully,'user_details':user_details}
             
              let title='Reset Password';
              let message='For completing reset password process enter the below OTP.'
              let name=res.docs[0].data().name
         
               //-------for mail send start ----------------
            var mailcontent = "<!DOCTYPE html><head><meta name='viewport' content='width=device-width, initial-scale=1' /><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title >Welcome to "+config.appName+"</title></head><body style='margin: 0; padding: 0; background-color:#ECEFF1; font-size:13px; color:#444; font-family:Arial, Helvetica, sans-serif; padding-top:70px; padding-bottom:70px;'><table  cellspacing='0' cellpadding='0' align='center' width='768' class='outer-tbl' style='margin:0 auto;'><tr><td class='pad-l-r-b' style='padding:0 70px 40px'><table cellpadding='0' cellspacing='0' class='full-wid'></table><table cellpadding='0' cellspacing='0'  style='width:100%; background-color:#FFFFFF; border-radius:4px; box-shadow:0 0 20px #ccc'> <tr><td><table border='0' style='margin:0; width:100%' cellpadding='0' cellspacing='0'><tr style='background:#000000'><td class='logo' style='padding:40px 0 30px 0; text-align:center; border-bottom:1px solid #000000';><h1 style='color:#ffffff'>"+config.appName+"</h1></br><h1 style='color:#ffffff'>"+title+"</h1></td></tr><tr><td></td></tr><tr><td class='content' style='padding:40px 40px;'><p style='font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333333; margin-top:0'>Dear "+name+"</p><p style='font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333333; margin-top:0'>"+message+"</p><p style='font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333333; margin-top:0'>OTP :- "+genrate_otp+"</p><p style='font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333333; margin-top:0'>Regards,<br>"+config.appName+"</p> </td> </tr><tr> <td  style='background:#000000; padding-bottom:60px;'><table style='width:100%' border='0' cellspacing='0' cellpadding='0' class='full-wid' align='center'><tr> <td>  <div style='margin:0 auto; text-align:center; padding:0 100px' class='foot-items'>  <p style='font-family:Arial, Helvetica, sans-serif; font-size:14px;margin-top:40px; line-height:20px; color:#ffffff;'>&#169; "+new Date().getFullYear()+" "+config.appName+"  |  All right Reserved</p><p style='font-family:Arial, Helvetica, sans-serif; font-size:12px;line-height:20px; margin-bottom:40px; color:#fff'> Disclaimers can be made up out of statements covering different legal aspects. Below are some sample disclaimer statements that can be used for each aspect independently.</p></div></td> </tr> </table></td></tr></table></td></tr></table> </body></html>"
            var fromName = config.appName
            var emailTo = res.docs[0].data().email
            var mailSubject = "Forgot password"

            this.mailsendfunction(emailTo, mailcontent, mailSubject, fromName)
            //-------for mail send end----------------
            resolve(myjosonretur);

          }).catch((err) => {
            let myjosonretur = { success: 'false', msg: Lang_chg.email_notregister }
            resolve(myjosonretur);
          })
              }
            else{
              let myjosonretur={success:'false',msg:Lang_chg.email_notregister}
                  resolve(myjosonretur);  
              }
              }).catch((error)=>{
                    console.log('error',error)
                    let myjosonretur={success:'false',msg:Lang_chg.email_notregister}
                    resolve(myjosonretur);
                    })
            })
          }
  forgotOTPverify=async(data)=>{
    return new Promise((resolve, reject) => {
      firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).get().then((res) => {
        console.log('res.size', res.size)
        if (res.size > 0) {
          firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).where('otp', '==', parseInt(data.otp)).get().then(async (res) => {
            console.log('ressdgasdgag', res)
            if (res.size > 0) {
              firestore().collection("user_master").doc('' + data.user_id + '').update({ otp_verify: 1}).then(async (res) => {
                let user_details = await this.getuserdetaile(data.user_id);
                let myjosonretur = { success: 'true', msg: Lang_chg.otp_verify_successfully, 'user_details': user_details }
                resolve(myjosonretur);
              }).catch((eror) => {
                let myjosonretur = { success: 'false', msg: Lang_chg.invalid_otp }
                resolve(myjosonretur)
              })

            }
            else {
              let myjosonretur = { success: 'false', msg: Lang_chg.invalid_otp }
              resolve(myjosonretur)
            }
          }).catch((error) => {
            console.log('error', error)
            let myjosonretur = { success: 'false', msg: Lang_chg.invalid_otp }
            resolve(myjosonretur);
          })

        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      })

    })
  } 

  reset_password = async (data) => {
    return new Promise((resolve, reject) => {
      firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).where('delete_flag', '==', 0).get().then(async (res) => {
        if (res.size > 0) {
          let active_status = await this.checkactivateuser(data.user_id)
          if (active_status == 'deactivate') {
            let myjosonretur = { success: 'false', msg: Lang_chg.msg_err_account, active_status: 0 }
            resolve(myjosonretur);
          }
          await firestore().collection("user_master").doc('' + data.user_id + '').update({ password: data.new_password }).then(async (res) => {
            let myjosonretur = { success: 'true', msg: Lang_chg.password_reset_successfully, }
            resolve(myjosonretur);
          }).catch((eror) => {
            let myjosonretur = { success: 'false', msg: Lang_chg.password_reset__not_successfully }
            resolve(myjosonretur);
          })

        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      })

    })
  }


  Resendotp = async (data) => {
    return new Promise((resolve, reject) => {
      var genrate_otp = Math.floor(1000 + Math.random() * 9000);
      firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).get().then((res1) => {
        console.log('res.size', res1.size)
        if (res1.size > 0) {
          firestore().collection("user_master").doc('' + data.user_id + '').update({ otp: genrate_otp }).then(async (res) => {
            console.log('ressdgasdgag', res)
            let user_details = await this.getuserdetaile(data.user_id);
            let myjosonretur = { success: 'true', msg: Lang_chg.otp_send_successfully, 'user_details': user_details }
            let title = 'Verification Code (Resent)';
            let message = "Your new OTP is: <b>" + genrate_otp + "</b> Do not share the OTP with anyone"
            let name = res1.docs[0].data().name
            let email = res1.docs[0].data().email
            await RNSmtpMailer.sendMail({
              mailhost: "mail.virtualfoodtours.com",
              port: "465",
              ssl: true, //optional.if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
              username: 'noreply@virtualfoodtours.com',
              password: 'iG0aZOf%Y)=z',
              fromName:'noreply@virtualfoodtours.com', // optional
              replyTo: 'noreply@virtualfoodtours.com', // optional
              recipients: res1.docs[0].data().email,
              //bcc: ["bccEmail1", "bccEmail2"], // optional
              subject: "Verification Code (Resent)",
              htmlBody: "<!DOCTYPE html><head><meta name='viewport' content='width=device-width, initial-scale=1' /><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>Welcome to " + config.appName + "</title></head><body style='margin: 0; padding: 0; background-color:#ECEFF1; font-size:13px; color:#444; font-family:Arial, Helvetica, sans-serif; padding-top:70px; padding-bottom:70px;'><table  cellspacing='0' cellpadding='0' align='center' width='768' class='outer-tbl' style='margin:0 auto;'><tr><td class='pad-l-r-b' style='padding:0 70px 40px'><table cellpadding='0' cellspacing='0' class='full-wid'></table><table cellpadding='0' cellspacing='0'  style='width:100%; background-color:#FFFFFF; border-radius:4px; box-shadow:0 0 20px #ccc'> <tr><td><table border='0' style='margin:0; width:100%' cellpadding='0' cellspacing='0'><tr style='background:#000000'><td class='logo' style='padding:40px 0 30px 0; text-align:center; border-bottom:1px solid #000000';><h1 style='color:#ffffff'>" + config.appName + "</h1></br><h1 style='color:#ffffff'>" + title + "</h1></td></tr><tr><td></td></tr><tr><td class='content' style='padding:40px 40px;'><p style='font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333333; margin-top:0'>Dear </p><p style='font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333333; margin-top:0'>" + message + "</p><p style='font-family:Arial, Helvetica, sans-serif; font-size:15px; color:#333333; margin-top:0'>Regards,<br>" + config.appName + "</p> </td> </tr><tr> <td  style='background:#000000; padding-bottom:60px;'><table style='width:100%' border='0' cellspacing='0' cellpadding='0' class='full-wid' align='center'><tr> <td>  <div style='margin:0 auto; text-align:center; padding:0 100px' class='foot-items'>  <p style='font-family:Arial, Helvetica, sans-serif; font-size:14px;margin-top:40px; line-height:20px; color:#ffffff'>&#169; " + new Date().getFullYear() + " " + config.appName + "  |  All right Reserved</p><p style='font-family:Arial, Helvetica, sans-serif; font-size:12px;line-height:20px; margin-bottom:40px; color:#ffffff'> Disclaimers can be made up out of statements covering different legal aspects. Below are some sample disclaimer statements that can be used for each aspect independently.</p></div></td> </tr> </table></td></tr></table></td></tr></table> </body></html>",
              attachmentPaths: [], // optional
              attachmentNames: [], // required in android, these are renames of original files. in ios filenames will be same as specified in path. In a ios-only application, no need to define it
            }).then(success => { console.log('success'); resolve(myjosonretur); }).catch(err => { console.log('mymailerror', err); resolve(myjosonretur); });
            //resolve(myjosonretur);
          }).catch((error) => {
            console.log('error', error)
            let myjosonretur = { success: 'false', msg: Lang_chg.otp_not_send }
            resolve(myjosonretur);
          })

        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      })

    })
  }

 

  uploadImageToStorage = (path,name) => {
    
    return new Promise((resolve, reject) => {
      let reference = storage().ref('images/' + name);
      let task = reference.putFile(path);
      console.log('uplode Image task',task)
      console.log('edit profile path', path)
    console.log('edit profile path_name',name)
      // console.log('ulode Image',reference ,task)
      task.then((res) => {
        console.log('uplode Image',res)
        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
          resolve(downloadURL)
        });
      }).catch((e) => {
        console.log('erron image',e);
        resolve('no')
      });

    })
  }

  changepassword = async (data) => {
    console.log('change password data.....',data)
    return new Promise((resolve, reject) => {
      firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).where('delete_flag', '==', 0).get().then(async (res) => {
        if (res.size > 0) {
          let active_status = await this.checkactivateuser(data.user_id)
          if (active_status == 'deactivate') {
            let myjosonretur = { success: 'false', msg: Lang_chg.msg_err_account, active_status: 0 }
            resolve(myjosonretur);
          }
          await firestore().collection("user_master").where('user_id', '==', '' + data.user_id + '').where('password', '==', '' + data.password + '').get().then(async (res) => {
          console.log('hjfgvdadra',res.size)
          console.log('mushfdsfgf',data)
            if (res.size > 0) {
          
              let myjosonretur = { success: 'false', msg: Lang_chg.password_not_same }
              resolve(myjosonretur);
            }
            else {
              await firestore().collection("user_master").doc('' + data.user_id + '').update({ password: data.new_password }).then(async (res) => {

                let user_details = await this.getuserdetaile(data.user_id)
                let myjosonretur = { success: 'true', msg: Lang_chg.password_reset_successfully, 'user_details': user_details }
                resolve(myjosonretur);
              }).catch((eror) => {
                let myjosonretur = { success: 'false', msg: Lang_chg.changepassword_update }
                resolve(myjosonretur);
              })
            }
          }).catch((eror) => {
            let myjosonretur = { success: 'false', msg: Lang_chg.changepassword_update_not }
            resolve(myjosonretur);
          })
        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      })

    })
  }

  broadcastnotification = async (data) => {
    return new Promise((resolve, reject) => {
      console.log('insert notificatuon data &&&&&',data.user_id)
     firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).where('delete_flag', '==', 0).get().then(async (res) => {
        if (res.size > 0) {
         
          let id_get=0;
          firestore().collection("broadcast_master").orderBy("broadcast_id","desc").limit(1).get().then(async(querySnapshot)=>{
          console.log('querySnapshot',querySnapshot.size)
    
          if(querySnapshot.size>0)
              {
                  console.log('hello_akash')
                  id_get=querySnapshot.docs[0].data().broadcast_id+1
              }
            else{
                  id_get=1
                }

                console.log('hello_akash id_get',id_get)
                if(id_get!=0)
                {
          
                  let imageuploading = 'NA'
                  if (data.image_identity == 'yes') {
                    imageuploading = await this.uploadImageToStorage(data.path, data.path_name)
                    if (imageuploading == 'no') {
                      let myjosonretur = { success: 'false', msg: Lang_chg.profile_not_update }
                      resolve(myjosonretur);
                    }
    
                  }
                   else{
                    imageuploading=data.path
                  }
    
          let myupdate = {
                    user_status:data.user_status,
                    title:data.title,
                    message:data.message,
                    image:imageuploading,
                    image_url:imageuploading,
                    reply_msg_id : 0,
	                  reply_status : 0,
	                  reply_msg :'NA',
                    createtime:new Date(),
                    delete_flag:0,
                    broadcast_id:id_get,
                    user_id:data.user_id,
                    updatetime:new Date(),
          }
          console.log('my home @@@@ datata',myupdate)
          await firestore().collection("broadcast_master").doc(''+id_get+'').set(myupdate).then(async (res) => {
           let notification_arr = []


            firestore().collection("user_master").where('plan_type', '==', parseInt(data.user_status)).get().then(async (doc) => {
              console.log(' get doc',doc);
              
              
              for (let i = 0; i < doc.docs.length; i++) {

              let other_user_id =doc.docs[i].data().user_id;

                      if(other_user_id != 1){

                      
                      this.insertplayer_id(data.user_id);
                    
                      //let user_details = await this.getuserdetaile(data.user_id)
                      
                      let mynotifacationdata = {
                        user_id_notication:data.user_id,
                        other_user_id_notication:other_user_id,
                        action: 'login',
                        action_id:data.user_id,
                        title: data.title,
                        title_2: data.title, 
                        title_3: data.title, 
                        title_4: data.title,
                        message: data.message,
                        message_2:data.message,
                        message_3: data.message,
                        message_4: data.message,
                      }
                      let notification_arr_get = await this.notificationinsert(mynotifacationdata, data.user_id, other_user_id);
                      console.log('notification_arr_get rrrrr',notification_arr_get);
                      if(notification_arr_get != 'NA'){
                      notification_arr.push(notification_arr_get);
                      }
                    }
              
                   
              }

               

              let myjosonretur = { success: 'true', msg: Lang_chg.data_set,id_get:id_get,imageuploading:imageuploading,'notification_arr':notification_arr}
              resolve(myjosonretur);
              
              
            })


            // let myjosonretur = { success: 'true', msg: Lang_chg.data_set,id_get:id_get,imageuploading:imageuploading,}
            // resolve(myjosonretur);
        

          }).catch((error) => {
            let myjosonretur = { success: 'false', msg: Lang_chg.data_not_set }
            console.log({error})
            resolve(myjosonretur);
        
          })
        }
        })
      
        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      })
})
    
  }
  

  getallbrodcastHistory = async (data) => {
    console.log('data get______',data )
    return new Promise((resolve, reject) => {
      firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).where('delete_flag', '==', 0).get().then(async (res) => {
        if (res.size > 0) {

        await firestore().collection("broadcast_master").where('delete_flag', '==', 0).where('user_status', '==', parseInt(data.user_status)).get().then(async (res) => {
          //await firestore().collection("broadcast_master").where('delete_flag','==',0).orderBy("broadcast_id","desc").limit(20).get().then(async(res)=>{
            console.log('res________________',res )
            let broadcast_arr = 'NA'
    
            if (res.size > 0) {
              broadcast_arr = [];
              for (let i = 0; i < res.docs.length; i++) {
                broadcast_arr[i] = res.docs[i].data()
                broadcast_id = res.docs[i].data().broadcast_id

                console.log("broadcast arr9999",broadcast_arr)
                console.log("broadcast iddddddd9999",broadcast_id)
                


              }
              broadcast_arr.sort(function(a, b) {
                var x = a.broadcast_id, y = b.broadcast_id;
                return x > y ? -1 : x < y ? 1 : 0;
            });
            }
            
            let myjosonretur = { success:'true',broadcast_arr:broadcast_arr }
            resolve(myjosonretur);
          }).catch((error) => {
            console.log('errorhomecityerro', error)
            let myjosonretur = { success: 'false', msg: Lang_chg.data_not_found }
            resolve(myjosonretur);
          })

        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      })

    })
  }

  getbrodcast_user_side = async (data) => {

    return new Promise((resolve, reject) => {
     
        if (1) {

          firestore().collection("broadcast_master").where('delete_flag', '==', 0).where('user_status', '==', parseInt(data.user_status)).get().then(async (res) => {


            let broadcast_arr = 'NA'
    
            if (res.size > 0) {
              broadcast_arr = [];
              for (let i = 0; i < res.docs.length; i++) {
                broadcast_arr[i] = res.docs[i].data()
                //console.log("broadcast arr",broadcast_arr)
              }
            }
            let myjosonretur = { success:'true',broadcast_arr:broadcast_arr }
            resolve(myjosonretur);
          }).catch((error) => {
            console.log('errorhomecityerro', error)
            let myjosonretur = { success: 'false', msg: Lang_chg.data_not_found }
            resolve(myjosonretur);
          })

        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      

    })
  }


  // replymsg = async (data) => {
  //   console.log('reply msg page', data)
  //   return new Promise((resolve, reject) => {
  //     firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).where('delete_flag', '==', 0).get().then(async (res) => {
  //       console.log('reply msg page res', res.size )
  //       if (res.size > 0) {

        
        
  //         let myupdate = {
  //                   user_status:data.user_status,
  //                   title:data.title,
  //                   message:data.message,
  //                   image:data.image,
  //                   image_url:data.image,
  //                   reply_msg_id :data.broadcast_id,
	//                   reply_status : data.reply_status,
	//                   reply_msg :data.reply_msg,
  //                   createtime:new Date(),
  //                   delete_flag:0,
  //                   broadcast_id:data.broadcast_id,
  //                   user_id:data.user_id,
  //                   updatetime:new Date(),
  //         }
  //         console.log('brodcast reply myupdate', myupdate)

  //         await firestore().collection("broadcast_master").doc('' + parseInt(data.broadcast_id) + '').update(myupdate).then(async (res) => {
  //           console.log('brodcast reply msg', res)


  //           this.insertplayer_id(data.user_id);
            
  //           let user_details = await this.getuserdetaile(data.user_id)
  //           let notification_arr = 'NA';
  //           let mynotifacationdata = {
  //             user_id_notication:data.user_id,
  //             action: 'login',
  //             action_id:data.user_id,
  //             title: 'Replied message',
  //             title_2: 'Replied message', 
  //             title_3:'Replied message', 
  //             title_4:'Replied message',
  //             message: data.reply_msg,
  //             message_2:data.reply_msg,
  //             message_3: data.reply_msg,
  //             message_4: data.reply_msg,
  //           }
  //           notification_arr = await this.notificationinsert(mynotifacationdata, data.user_id, data.user_id);
            
  //           let myjosonretur = { success: 'true', msg: Lang_chg.replied_sucessful,'notification_arr':notification_arr }
  //           resolve(myjosonretur);
  //         }).catch((eror) => {
  //           let myjosonretur = { success: 'false', msg: Lang_chg.profile_not_update }
  //           resolve(myjosonretur);
  //         })

  //       }
  //       else {
  //         let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
  //         resolve(myjosonretur);
  //       }
  //     })

  //   })
  // }
  

  Delete_brodcast_msg = async (data) => {
    return new Promise((resolve, reject) => {
      firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).where('delete_flag', '==', 0).get().then(async (res) => {
        if (res.size > 0) {
          console.log('brodcast delete msh res size', res.size)
          // let active_status = await this.checkactivateuser(data.user_id)
          // if (active_status == 'deactivate') {
          //   let myjosonretur = { success: 'false', msg: Lang_chg.msg_err_account, active_status: 0 }
          //   resolve(myjosonretur);
          // }
          // ;
           console.log('deleteetete=====',data)
           let myupdate = {
            delete_flag:1,
           
          }
          await firestore().collection("broadcast_master").doc('' + parseInt(data.broadcast_id) + '').update(myupdate).then(async (res) => {
            console.log('broadcast_master delete res', res)
           

            let myjosonretur = { success: 'true', msg: Lang_chg.msg_delete_success }
            resolve(myjosonretur);
          }).catch((eror) => {
            let myjosonretur = { success: 'false', msg: Lang_chg.msg_delete_unsuccess }
            resolve(myjosonretur);
          })

        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      })

    })
  }
  Delete_brodcast_reply_msg = async (data) => {
    return new Promise((resolve, reject) => {
      firestore().collection("user_master").where('user_id', '==', parseInt(data.user_id)).where('delete_flag', '==', 0).get().then(async (res) => {
        console.log('brodcast delete msh res size', res.size)
        if (res.size > 0) {
          
          // let active_status = await this.checkactivateuser(data.user_id)
          // if (active_status == 'deactivate') {
          //   let myjosonretur = { success: 'false', msg: Lang_chg.msg_err_account, active_status: 0 }
          //   resolve(myjosonretur);
          // }
          // ;
           console.log('deleteetete=====',data)
           let myupdate = {
            
            reply_status: data.reply_status,
            reply_msg:data.reply_msg,
           
          }
          await firestore().collection("broadcast_master").doc('' + parseInt(data.broadcast_id) + '').update(myupdate).then(async (res) => {
            console.log('broadcast_master delete res', res)
           

            let myjosonretur = { success: 'true', msg: Lang_chg.msg_delete_success }
            resolve(myjosonretur);
          }).catch((eror) => {
            let myjosonretur = { success: 'false', msg: Lang_chg.msg_delete_unsuccess }
            resolve(myjosonretur);
          })

        }
        else {
          let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
          resolve(myjosonretur);
        }
      })

    })
  }

  
  get_contant = async (data) => {

    return new Promise((resolve, reject) => {


          firestore().collection("content_master").where('delete_flag', '==', 0).get().then(async (res) => {

           
            let content_arr = 'NA'
    
            if (res.size > 0) {
              content_arr = [];
              for (let i = 0; i < res.docs.length; i++) {
                content_arr[i] = res.docs[i].data()
                console.log("content_arr",content_arr)
              }
            }
            let myjosonretur = { success:'true',content_arr:content_arr }
            resolve(myjosonretur);
          }).catch((error) => {
            console.log('errorhomecityerro', error)
            let myjosonretur = { success: 'false', msg: Lang_chg.data_not_found }
            resolve(myjosonretur);
          })

        // }
        // else {
        //   let myjosonretur = { success: 'false', msg: Lang_chg.user_not_exit }
        //   resolve(myjosonretur);
        // }
      

    })
  }

 

  //-------------------------------notification send code-----------------------------------------------
  notificationinsert=async(data,user_id,other_user_id)=>{
    return new Promise(async(resolve, reject) => {
    let user_id_notication = data.user_id_notication;
    let other_user_id_notication=data.other_user_id_notication;
    let action = data.action;
    let action_id = data.action_id;
    let title = data.title; //English
    let title_2 = data.title_2; //German
    let title_3 = data.title_3; //French
    let title_4 = data.title_4;//Spanish
    let message = data.message;
    let message_2 =  data.message_2;
    let message_3 = data.message_3;
    let message_4 = data.message_4;
    
   let  action_data={'user_id':user_id_notication,other_user_id:other_user_id_notication,'title_4':title_4,'action_id':action_id, 'action':action};
   var notification_arr 	=	[];
   let action_json		=	action_data.toString();
   let send_data= {user_id:user_id, 
   other_user_id:other_user_id, 
   action:action, 
   action_id:action_id, 
   action_json:action_json, 
   title:title, 
   title_2:title_2, 
   title_3:title_3,
   title_4:title_4,
   message:message,
   message_2:message_2,
  message_3:message_3,
  message_4:message_4,
  read_status:0, 
  delete_flag:0, 
  createtime:new Date(),
  updatetime:new Date()
  }
  let insert_status=await this.InsertNotification(send_data);
  console.log('insert_status',insert_status)
  if(insert_status=='yes')
   {
   // let notification_status=getNotificationStatus(other_user_id);
   // if(notification_status == 'yes')
   //   {   
    let  player_id =await	this.getUserPlayerId(other_user_id);
        console.log('player_id',player_id)
       if(player_id !='no'){
           notification_arr	=	{'player_id':player_id, 'title':[title,title_2,title_3], 'message':[message,message_2,message_3], 'action_json':action_data};
           resolve(notification_arr)
          }
    if(notification_arr.length<=0){
        notification_arr	=	'NA';
        resolve(notification_arr)
     }
    
     }
    })
  }
  
  InsertNotification=async(send_data)=>{
    return new Promise(async(resolve, reject) => {
    let id_get=0;
    firestore().collection("user_notification_message").orderBy("user_notification_id","desc").limit(1).get().then(async(querySnapshot)=>{
      console.log('notification_message_insert',querySnapshot.size)
      if(querySnapshot.size>0)
          { 
             console.log('hello_akash')
            id_get=querySnapshot.docs[0].data().user_notification_id+1
          }
      else{
             id_get=1
         }
         if(id_get!=0)
         {
          console.log('muskan12342',send_data)
          send_data.user_notification_id=id_get;
         await  firestore().collection("user_notification_message").doc(''+id_get+'').set(send_data).then(async(res)=>{
            console.log('succuseess',querySnapshot.size)
             resolve('yes')
            }).catch(()=>{
             resolve('no')
       })
      }
       })
    })
  }
  getUserPlayerId=async(other_user_id)=>{
    console.log('other_user_id',other_user_id)
  
    return new Promise(async(resolve, reject) => {
    await firestore().collection("user_notification").where('user_id','==',parseInt(other_user_id)).get().then(async(res)=>{
      console.log('ressixw',res.size)
          if(res.size>0)
          {
            console.log('player_id search method',res.docs[0].data())
              if(res.docs[0].data().player_id!='123456')
              {
                resolve(res.docs[0].data().player_id)
              }
              else{
                resolve('no')
              }
          }
          else{
              resolve('no')
          }
     
    }).catch(()=>{
          resolve('no')
    })
  })
  }
        


}
//--------------------------- Config Provider End -----------------------
export const Webfunction = new Webservicecontainer();
