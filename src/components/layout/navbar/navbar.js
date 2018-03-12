import React from 'react';

//Material-UI imports
import FlatButton from 'material-ui/FlatButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Badge from 'material-ui/Badge';
import {blue500} from 'material-ui/styles/colors';

/*
OBJECTIVE
3.0 - Allow the user to navigate through 
the pages with the use of a navigation bar. 
When a user clicks on a link, they will 
be taken to the relevant page. The pages 
that the user can access are:
3.1 - Dashboard
3.2 - Jobs
3.3 - Customers
3.4 - Finances
3.5 - Schedule 
3.6 - Profile
*/

class Navbar extends React.Component {
	constructor(props){
		super(props);
		//Initialize component state with array of link names and links
		this.state = {
		  list: [
				{
					linkName: 'Dashboard',
					link: '/'
				}, {
					linkName: 'Customers',
					link: '/customers'
				},
				{
					linkName: 'Appointments',
					link: '/appointments'
				}, 
				{
					linkName: 'Jobs',
					link: '/jobs'
				}, {
					linkName: 'Parts',
					link: '/parts'
				}, {
					linkName: 'Finances',
					link: '/finances'
				}, {
					linkName: 'Logout',
					link: '/logout'
				}
			],
			open: false
		}
		//Bind methods to component
		this.handleDrawerClose = this.handleDrawerClose.bind(this);
		this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
	}
	handleDrawerToggle(){
		//Open side drawer
		this.setState({open: !this.state.open})
	}	
	handleDrawerClose(){
		//Close side drawer
		this.setState({open: false})
	}
	render(){
		const styles = {
			button: {
				color: 'white'
			}
		}
		//Iterate over state to get array of links for the navbar
		const navItems = 
		<div className="hide-on-small-only">
		{
			this.state.list.map((link, i) => {
				return(				
					<FlatButton key={i} label={link.linkName} href={link.link} style={styles.button} />
				)
			})
		}
		</div> 
		const MenuItems = this.state.list.map((link, i) => {
			return(
				<a href={link.link} key={i} style={{textDecoration: 'none'}}>
					<MenuItem primaryText={link.linkName} />
				</a>
			)
		})
		return (
			<div>
				<AppBar title="TA Home Improvements" onLeftIconButtonTouchTap={this.handleDrawerToggle} iconElementRight={navItems} iconStyleRight={{marginTop:15}}/>
				<Drawer docked={false} 
						open={this.state.open}
						onRequestChange={(open) => this.setState({open})}>
						{MenuItems}
		        </Drawer>
			</div>
		)
	}
}

export default Navbar;