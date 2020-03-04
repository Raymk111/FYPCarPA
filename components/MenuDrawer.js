import React from 'react';
import {
	View, 
	Text,
	Image,
	ScrollView,
	Platform,
	Dimensions,
	StyleSheet,
	TouchableHighlight,
} from 'react-native';

import { Icon } from 'native-base'

const WIDTH = Dimensions.get('window').width 
const HEIGHT = Dimensions.get('window').height 

export default class MenuDrawer extends React.Component {
	navLink(nav, text, iconName) {
		return(
			<TouchableHighlight style={{height: 50}} underlayColor='#999999' onPress={() => this.props.navigation.navigate(nav)}>
				<View style={styles.link}><Icon style={{fontSize:50}} name={iconName}/><Text style={styles.linkText}>{text}</Text></View>
			</TouchableHighlight>
		);
	}

	render() {
		return(
			<View style={styles.container}>
				<ScrollView style={styles.scroller}>
					<View style={styles.topLinks}>
						<View style={styles.profile}>
							<View style={styles.imgView}>
                                <Image style={styles.img} source={require('../Images/Gear-512.png')}/>
							</View>
							<View style={styles.profileText}>
								<Text style={styles.name}>CarPA</Text>
							</View>
						</View>
					</View>
					<View style={styles.bottomLinks}>
						{this.navLink('statsDash', 'Live Dash', 'speedometer')}
						{this.navLink('settings', 'Settings', 'settings')}
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#333333',
	},
	scroller: {
		flex: 1,
	},
	profile: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 25,
		borderBottomWidth: 1,
		borderBottomColor: '#777777',
	},
	profileText: {
		flex: 3,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	name: {
		fontSize: 32,
		paddingBottom: 5,
		color: '#ffffff',
		textAlign: 'left',
	},
	imgView: {
		flex: 1,
		paddingLeft: 20,
		paddingRight: 20,
	},
	img: {
		height: 80,
		width: 80,
		borderRadius: 50,
	},
	topLinks:{
		height: 160,
		backgroundColor: '#000000',
	},
	bottomLinks: {
		flex: 1,
		backgroundColor: '#ffffff',
		paddingTop: 10,
		paddingBottom: 450,
	},
	link: {
		flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        alignSelf: 'stretch',
	},
    linkText: {
		fontSize: 20,
        marginLeft: 20,
        marginTop: 10
	}
})