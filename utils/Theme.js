import {StyleSheet} from 'react-native';

const Themes = StyleSheet.create(
    {
        navBar:
        {
            height: 60,
            backgroundColor: '#222222'
        },
        navBarTitle:
        {
            textAlign:'center',
            marginTop: 5,
            marginRight: 30,
            fontSize: 20,
            flex: 1,
            color:'#ffffff'
        },
        navBarRightButton:
        {
            marginRight: 10,
            padding: 10,
            alignSelf: 'center',
            fontSize: 20,
            color: '#ffffff'
        }
});

  
 export { Themes };