import React from 'react';
import superagent from 'superagent';

//Material-UI imports
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';

//User defined inputs
import validationHelpers from '.././../../helpers/helpers';

//Create array of validation methods to be called when input value changes
//Create array of errors in each function with criteria specific to the 
//value and check if they are all true and return a boolean.
const validationMethods = {
	name: function(value){        
		let errors = new Array();
		errors = {
			presenceCheck: validationHelpers.presenceCheck(value),
			containsAlphaNumeric: validationHelpers.checkAlphaNumeric(value)
		}
		return validationHelpers.checkAllTrue(errors)
	},
	description: function(value){        
		let errors = new Array();
		errors = {
			presenceCheck: validationHelpers.presenceCheck(value),
			containsAlphaNumeric: validationHelpers.checkAlphaNumeric(value)
		}
		return validationHelpers.checkAllTrue(errors)
	},
	cost_per_unit: function(value){        
		let errors = new Array();
		errors = {
			presenceCheck: validationHelpers.presenceCheck(value),
			containsNumbersOnly: validationHelpers.checkNumericString(value)
		}
		return validationHelpers.checkAllTrue(errors)
	}
}

class AddPart extends React.Component {
	constructor(props){
		super(props);
		//Initialize component state
		this.state = {
			open: false,            
			snackbarOpen: false,
			snackbarMessage: '',
			value: 0,
			part: {
				name: '',
				description: '',
				cost_per_unit: '',
				category: 'Conservatory'
			},
			errors: {
				name: false,
				description: false,
				cost_per_unit: false
			},
			categories: [
				"Conservatory",
				"Locks",
				"Doors",
				"Windows",
				"Roofing"
			]
		}
		//Bind methods to component
		this.handleChange = this.handleChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);        
		this.openSnackbar = this.openSnackbar.bind(this);
		this.closeSnackbar = this.closeSnackbar.bind(this);
	}
	handleOpen(){
		//Open dialog
		this.setState({open: true})
	}
	handleClose(){
		//Close dialog
		this.setState({open: false})
  }
	resetPart(){
		//Reset errors and part values in state
		this.setState({
			part: {
				name: '',
				description: '',
				cost_per_unit: '',
				category: 'Conservatory'
			},
			errors: {
				name: false,
				description: false,
				cost_per_unit: false
			} 
		});
	}
	openSnackbar(){
		this.setState({snackbarOpen: true});
	}
	closeSnackbar(){
		this.setState({snackbarOpen: false});
	}
	handleChange(event){
		const name = event.target.name;
		const value = event.target.value;
		//Get correct validation method
		let validation = validationMethods[name];
		//Test value and get error
		const error = !validation(value.toLowerCase())
		//Update errors
		let updatedErrors = Object.assign({}, this.state.errors);
		updatedErrors[name] = error;
		this.setState({errors: updatedErrors})
		//Update part data
		let updatedPart = Object.assign({}, this.state.part)
		updatedPart[name] = value
		this.setState({part: updatedPart})
		console.log(this.state.part)
	}
	handleSubmit(){
		const part = this.state.part
		//Remove id part from part array to prevent clash on server-side
		delete this.state.part['idpart']
		console.log(part)
		//Check that there are no errors
		if(!validationHelpers.checkAllFalse(this.state.errors)){
			//API request to add part to db
			superagent.post('/api/part')
			.set('Content-Type', 'application/json')
			.send(part)
			.end((err, res) => {
				if(err){
					alert('ERROR: ' + err)
				}
				if(res.body.status === 200){
					//Get id of inserted record
					const insertId = res.body.response.insertId;
					//Call method to add part to parent component's state
					this.props.addPart(part, insertId);
					this.setState({snackbarMessage: 'Added part successfully!'}, this.openSnackbar);
					this.handleClose();
				} else {
					//Show error message in snackbar
					this.setState({snackbarMessage: 'There seems to have been an error'}, this.openSnackbar)
				}
			})
		} else {
			//Show error message in snackbar
			this.setState({snackbarMessage: 'Oops! You seem to have some errors in your form'}, this.openSnackbar)
		}  
	}
	handleSelectChange(event, value, index){
		//Update state when SelectField changes
		const category = this.state.categories[index];
		let updatedPart = Object.assign({}, this.state.part);
		updatedPart.category = category;
		this.setState({value: value, part: updatedPart});
	}
	render(){
		const errors = this.state.errors;
		const actions = [
			<FlatButton 
				key={1}
				label="Submit"
				type="submit"
				onClick={this.handleSubmit}
				primary={true} />,
			<FlatButton 
				key={2}
				label="Cancel"
				primary={true}
				onClick={this.handleClose} />
		]
		const styles = {
			dialog : {
                maxWidth: 'none',
                width: '50%'
			},
			input: {
				width: '100%'
			},
			addButton: {
				position: 'absolute',
				right: 24,
				bottom: 24
			},
			actions: {
				container: { 
					textAlign: 'right', 
					padding: 8, 
					margin: '24px -24px -24px -24px' 
				}
			}
		}
		return(
			<div>
				<Snackbar
					open={this.state.snackbarOpen}
					message={this.state.snackbarMessage}
					autoHideDuration={4000}
					onRequestClose={this.closeSnackbar}/>
				<Dialog
					title="Add Part"
					modal={true}
					open={this.state.open}
					contentStyle={styles.dialog}
					onRequestClose={this.handleClose.bind(this)}
					autoScrollBodyContent={true}>
					<div className="row">
						<div className="col s12">
							<TextField 
								style={{width: '100%'}}
								inputStyle={{width: '100%'}}
								errorText={errors.name ? 'Make sure that this field is not empty' : ''} 
								type="text"
								name="name"
								onChange={this.handleChange}
								hintText="Part Name"/>
						</div>
					</div>
					<div className="row">
						<div className="col s12">
							<TextField 
								style={{width: '100%'}}
								inputStyle={{width: '100%'}}
								errorText={errors.description ? 'Make sure that this field is not empty' : ''} 
								multiLine={true}
								rows={2}
								rowsMax={6}
								type="text"
								name="description"
								onChange={this.handleChange}
								hintText="Part Description"/>
						</div>
					</div>
					<div className="row">
						<div className="col s12">
							<TextField 
								style={{width: '100%'}}
								inputStyle={{width: '100%'}}
								errorText={errors.cost_per_unit ? 'Make sure that this field is not empty and only contains numbers' : ''} 
								type="number"
								name="cost_per_unit"
								onChange={this.handleChange}
								hintText="Cost Per Unit"/>
						</div>
					</div>
					<div className="row">
						<div className="col s12">
							<SelectField
								floatingLabelText="Category"
								value={this.state.value}
								onChange={this.handleSelectChange}>
								{this.state.categories.map((category, i) => {
									return <MenuItem key={i} value={i} primaryText={category}/>
								})}
							</SelectField>
						</div>
					</div>
					<div style={{ textAlign: 'right', padding: 8, margin: '24px -24px -24px -24px' }}>
						{actions}
					</div>
				</Dialog>
				<FloatingActionButton style={styles.addButton} onClick={this.handleOpen.bind(this)}>
					<FontIcon className="material-icons">add</FontIcon>
				</FloatingActionButton>	
			</div>
		)
	}
}

export default AddPart;