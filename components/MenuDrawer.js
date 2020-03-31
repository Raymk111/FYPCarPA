import React from 'react';
import {
	View, 
	Text,
	Image,
	ScrollView,
	Dimensions,
	StyleSheet,
	TouchableHighlight,
} from 'react-native';

import { Icon } from 'native-base'
import { Col, Row, Grid } from "react-native-easy-grid";

const WIDTH = Dimensions.get('window').width 
const HEIGHT = Dimensions.get('window').height 

export default class MenuDrawer extends React.Component {
	navLink(nav, text, iconName) {
		return(
			<TouchableHighlight style={{height: 50}} underlayColor='#999999' onPress={() => this.props.navigation.navigate(nav)}>
				<Row style={styles.link}>
                    <Col size={30}>
                        <Icon style={styles.iconStyle} name={iconName}/>
                    </Col>
                    <Col size={70}>
                        <Text style={styles.linkText}>{text}</Text>
                    </Col>
                </Row>
			</TouchableHighlight>
		);
	}

	render() {
		return(
			<View style={styles.container}>
				<ScrollView style={styles.scroller}>
					<View style={styles.topLinks}>
						<View style={styles.icon}>
							<View style={styles.imgView}>
                                <Image style={styles.img} source={require('../Images/Gear-512.png')}/>
							</View>
							<View style={styles.titleContainer}>
								<Text style={styles.title}>CarPA</Text>
							</View>
						</View>
					</View>
					<Grid height={200} style={styles.bottomLinks}>
						{this.navLink('customDash', 'Live Dash', 'speedometer')}
						{this.navLink('settings', 'Settings', 'settings')}
                        {this.navLink('defaultDash', 'Default Dash', 'speedometer')}
					</Grid>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	scroller: {
		flex: 1,
	},
	icon: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 25,
		borderBottomWidth: 1,
		borderBottomColor: '#777777',
	},
	titleContainer: {
		flex: 3,
		flexDirection: 'column',
		justifyContent: 'center',
	},
	title: {
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
        flexDirection: 'column',
		backgroundColor: '#ffffff',
		paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10
	},
	link: {
		flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around'
	},
    linkText: {
        marginTop: 10,
        textAlign: 'left',
        justifyContent: 'space-around',
		fontSize: 20
	},
    iconStyle:
    {
        fontSize:50
    }
})