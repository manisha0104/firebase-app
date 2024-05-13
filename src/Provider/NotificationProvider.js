import React, { Component } from 'react';
import OneSignal from 'react-native-onesignal';
import { config } from './configProvider';
class NotificationProvider {
  notification_arr(notification_arr) {
    console.log('notification_arr', notification_arr)
    for (let i = 0; i < notification_arr.length; i++) {
      let message = notification_arr[i].message
      let player_id = notification_arr[i].player_id
      let action_json = notification_arr[i].action_json
      let title = notification_arr[i].title
      this.notificationfunction(message, action_json, player_id, title)
    }
  }

  notificationfunction(massege, action_json, playerid, title) {
    console.log('innotif')
    console.log('player_id', playerid)
    console.log('action_json', action_json)
    console.log('massege', massege[config.language])
    console.log('title', title[config.language])
    console.log(massege[config.language])
    console.log(title[config.language])
    let contents = { 'en': massege[config.language] };
    let data = { 'action_json': action_json };
    let playerIds = [playerid];
    var other = {
      headings: { en: title[config.language] },
      group: 10,
      priority: 10,
    };

    var collapse_id = data.action_id;
    var dataPost = {
      "app_id": config.onesignalappid,
      "contents": { "en": massege[config.language] },
      "headings": { "en": title[config.language] },
      //"included_segments":["All"],
      "include_player_ids": [playerid],
      "data": { "action_json": data },
      "ios_badgeType": 'Increase',
      "ios_badgeCount": 1,
      "priority": 10,
      "collapse_id": collapse_id,
      // "send_after":time
    };
    console.log('dataPost', dataPost);
    fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + config.oneSignalAuthorization,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataPost)
    }).then((response) => response.json())
      .then((obj) => {

        // global.props.hideLoader();
        console.log("success123", obj);
      })
      .catch((error) => {

        console.log('error123', error)
        // global.props.hideLoader();
        reject(error);
      });
  }






  //----------for schedule message start ---------------//
  //---------------for schedule notification start ------------//

  notification_arr_schedule(notification_arr) {

    for (let i = 0; i < notification_arr.length; i++) {
      let message = notification_arr[i].message
      let player_id = notification_arr[i].player_id
      let action_json = notification_arr[i].action_json
      let title = notification_arr[i].title
      let time = notification_arr[i].time
      this.notificationfunctionSchedule(message, action_json, player_id, title, time)
    }
  }


  notificationfunctionSchedule(message, jsonData, player_id_arr, title, time) {
    console.log('notificationfunctionSchedule');

    var collapse_id = jsonData.action_id;
    var dataPost = {
      "app_id": config.onesignalappid,
      "contents": { "en": message[config.language] },
      "headings": { "en": title[config.language] },
      "include_player_ids": [player_id_arr],
      "data": { "action_json": jsonData },
      "ios_badgeType": 'Increase',
      "ios_badgeCount": 1,
      "priority": 10,
      "collapse_id": collapse_id,
      "send_after": time
    };
    console.log('dataPost', dataPost);
    fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + config.oneSignalAuthorization,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataPost)
    }).then((response) => response.json())
      .then((obj) => {

        // global.props.hideLoader();
        console.log("success", obj);
      })
      .catch((error) => {

        console.log('error', error)
        // global.props.hideLoader();
        reject(error);
      });
  }
  //----------for schedule message end---------------//

//-------------for chat notification start -----------------------//

  Chatnotificationfunction(massege, action_json, playerid, title) {
    console.log('innotif')
    console.log('player_id', playerid)
    console.log('action_json', action_json)
    console.log('massege', massege)
    console.log('title', title)
    console.log(massege)
    console.log(title)
    let contents = { 'en': massege };
    let data =  action_json ;
    let playerIds = [playerid];
    var other = {
      headings: { en: title },
      group: 10,
      priority: 10,
    };

    var collapse_id = data.action_id;
    var dataPost = {
      "app_id": config.onesignalappid,
      "contents": { "en": massege },
      "headings": { "en": title },
      "include_player_ids": [playerid],
      "data": { "action_json": data },
      "ios_badgeType": 'Increase',
      "ios_badgeCount": 1,
      "priority": 10,
      "collapse_id": collapse_id,
      // "send_after":time
    };
    console.log('dataPost', dataPost);
    fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + config.oneSignalAuthorization,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': 0,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataPost)
    }).then((response) => response.json())
      .then((obj) => {

        // global.props.hideLoader();
        console.log("success123", obj);
      })
      .catch((error) => {

        console.log('error123', error)
        // global.props.hideLoader();
        reject(error);
      });
    }
    //-------------for chat notification end -----------------------//
}
export const notification = new NotificationProvider();
