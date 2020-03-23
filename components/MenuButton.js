import React from 'react'
import { StyleSheet } from 'react-native'
import { Icon } from 'native-base'

export default class MenuButton extends React.Component {
	render() {
		return(
			<Icon name="menu" style={{ marginLeft: 5, fontSize: 24, color:'#aaaaaa'}}
				onPress={() => this.props.navigation.toggleDrawer()}
			/>
		)
	}
}

const styles = StyleSheet.create({
	menuIcon: {
        flex:1,
        color:'#ffffff',
        marginRight: 5
	}
})