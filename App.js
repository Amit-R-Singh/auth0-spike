import React, { useState } from 'react'
import { StyleSheet, Text, View, Button, Alert, TextInput, Modal } from 'react-native';
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({ domain: USE_FROM_AUTH0_DASHBOARD, clientId: USE_FROM_AUTH0_DASHBOARD });

export default function App() {
  const [logginIn, setLogginIn] = useState(false);
  const [isLoggedIn, setLogginInStatus] = useState(false);
  const [userPhoneNumber, setUserPhoneNumber] = useState(null);
  const [codeRequestSent, setCodeRequestStatus] = useState(false);
  const [userCode, setUserCode] = useState(null);
  const [idToken, setIdToken] = useState({});
  const [accessToken, setAccessToken] = useState({});
  

  const getLoginCode = () => {
    setLogginIn(true);
    auth0.auth
      .passwordlessWithSMS({
        phoneNumber: userPhoneNumber,
      })
      .then(() => {
        // this.setState({codeRequestSent: true});
        setCodeRequestStatus(true);
      })
      .catch(console.error);
  }

  const loginUser = () => {
    auth0.auth
      .loginWithSMS({
        phoneNumber: userPhoneNumber,
        code: userCode,
      })
      .then(response => {
        console.log(response);
        setAccessToken(response.accessToken);
        setIdToken(response.idToken);
        setLogginInStatus(true);
      })
      .catch(err =>{
        console.log("error", err)
      });
  }

  const logout = () => {
    console.log("user got logged out")
  }
  
  return (
      <View style = { styles.container }>
          
      {!codeRequestSent ? (
        <>
          <TextInput
            placeholder="Enter Phone"
            onChangeText={text => setUserPhoneNumber(text)}
          />
          <Button
            title={logginIn ? 'Processing...' : 'Get Code'}
            onPress={getLoginCode}
          />
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter Code"
            value={userCode}
            onChangeText={text => setUserCode(text)}
          />
          <Button title="Login" onPress={loginUser} />
          <View>
            <Modal transparent={true} visible={isLoggedIn}>
              <View>
                <View>
                  <Text> Login Successful 👍🏼🎉</Text>
                  <Text> Here are your details:</Text>
                  <Text> Access Token: {' ' + accessToken}</Text>
                  <Text>
                    Id Token:
                    {' ' + idToken.length > 25
                      ? `${idToken.substring(0, 25)}...`
                      : idToken}
                  </Text>
                  <Button title="Logout" onPress={logout} />
                </View>
              </View>
            </Modal>
          </View>
        </>
      )}
  
  
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
