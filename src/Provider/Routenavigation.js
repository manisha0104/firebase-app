import React, { Component } from 'react'
import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';

// dont change auth page start---
import Splash from '../Provider/Splash'
import Login from '../Auth/login';
import OtpVerification from '../Auth/OtpVerification'
import Forgotpassword from '../Auth/Forgotpassword';
import Contentpage from '../Auth/Contentpage';
import Setting from '../Auth/Settings';
import Contactus from '../Auth/Contactus';
import Changepassword from '../Auth/Changepassword';
import DeleteAccount from '../Auth/DeleteAccount';
import ForgotOTPVerify from '../Auth/ForgotOtpVerify'
import CreatePassword from '../Auth/CreatePassword'
import Signup from '../Auth/Signup';
import Faq from '../Auth/Faq';
import Notification from '../Auth/Notification';


//-------for chat section start ------------
import Chat from '../ChatProvider/Chat'
import Inbox from '../ChatProvider/Inbox'
import ViewImage from '../ChatProvider/ViewImage'
import ChatReport from '../ChatProvider/ChatReport'

//------- for booking chat 
import ChatBooking from '../ChatProvider/ChatBooking'
import InboxBooking from '../ChatProvider/InboxBooking'
//-------for chat section end ------------


// import Editprofile from '../Auth/Editprofile';

import Home from '../Home';
// dont change auth page end---
const Stack = createStackNavigator();


const Stacknav = (navigation) => {
  return (
    <Stack.Navigator
      initialRouteName={'Splash'}
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}
    >
      <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} options={{ headerShown: false, }} />
      <Stack.Screen name="Forgotpassword" component={Forgotpassword} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotOTPVerify" component={ForgotOTPVerify} options={{ headerShown: false }} />
      <Stack.Screen name="CreatePassword" component={CreatePassword} options={{ headerShown: false,gestureEnabled:false }} />
      <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
      <Stack.Screen name="Contentpage" component={Contentpage} options={{ headerShown: false }} />
      <Stack.Screen name="Contactus" component={Contactus} options={{ headerShown: false }} />
      <Stack.Screen name="Changepassword" component={Changepassword} options={{ headerShown: false }} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccount} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="Faq" component={Faq} options={{ headerShown: false }} />
      <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false }} />
      {/* for chat start  */}
      <Stack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
      <Stack.Screen name="ViewImage" component={ViewImage} options={{ headerShown: false }} />
      <Stack.Screen name="ChatReport" component={ChatReport} options={{ headerShown: false }} />
      <Stack.Screen name="Inbox" component={Inbox} options={{ headerShown: false }} />
      <Stack.Screen name="ChatBooking" component={ChatBooking} options={{ headerShown: false }} />
      <Stack.Screen name="InboxBooking" component={InboxBooking} options={{ headerShown: false }} />
      {/* for chat end  */}
    </Stack.Navigator>
  );
}
export default Stacknav