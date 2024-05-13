import React, { Component } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider, AppConsumer } from './src/Provider/context/AppProvider';
import Stacknav from './src/Provider/Routenavigation';
import { firebaseprovider}  from './src/Provider/FirebaseProvider';
import firebase from './src/ChatProvider/Config1'
global.MapAddress='NA';
class App extends Component{
  componentDidMount(){
    firebaseprovider.getAllUsers()
  }

  render()
  {
  return (
  <NavigationContainer>
      <AppProvider {...this.props}>
         <AppConsumer>{funcs => {
           global.props = { ...funcs }
           return <Stacknav {...funcs} />
         }}
       </AppConsumer>
     </AppProvider>
  </NavigationContainer>

  );
}
}

export default App;