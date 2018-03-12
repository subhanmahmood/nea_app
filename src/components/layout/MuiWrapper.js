import React from 'react';

//Material-UI imports
import {blue500} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

//User defined imports
import MainLayout from './MainLayout';

//Wrap MainLayout in MuiThemeProvider to ensure correct styling and component behaviour
class MuiWrapper extends React.Component {
	render(){
		return(
			<MuiThemeProvider>
				<MainLayout content={this.props.content}/>
			</MuiThemeProvider>
		)
	}
}

export default MuiWrapper;