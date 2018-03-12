import React from 'react';
import Navbar from './navbar/navbar';

class MainLayout extends React.Component {
	//Render Navbar with content
	render(){
		return(
			<div>
				<Navbar/>
				{this.props.content}
			</div>
		)
	}
}

export default MainLayout;