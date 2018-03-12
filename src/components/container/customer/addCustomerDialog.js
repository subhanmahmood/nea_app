import React from 'react';
import superagent from 'superagent';

//Material-UI imports
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
var faker = require('faker')

//User defined imports
import validationHelpers from '../../../helpers/validationHelpers';

//Array of validation. Each item is a function which validates a TextField
/*Each function has an array of errors containing criteria that input must 
fulfill and returns true if all the errors are true*/
const validationMethods = {
	first_name: function(value){
		let errors = new Array();
		errors = {
			presenceCheck: validationHelpers.presenceCheck(value),
			containsAlpha: validationHelpers.checkAlphaString(value),
		}
		return validationHelpers.checkAllTrue(errors)
	},
	last_name: function(value){
		let errors = new Array();
		errors = {
			presenceCheck: validationHelpers.presenceCheck(value),
			containsAlpha: validationHelpers.checkAlphaString(value),
		}
		return validationHelpers.checkAllTrue(errors)
	},
	address_line_1: function(value){		
		let errors = new Array();
		errors = {
			presenceCheck: validationHelpers.presenceCheck(value),
			containsAlphaNumeric: validationHelpers.checkAlphaNumeric(value),
		}
		return validationHelpers.checkAllTrue(errors)
	},
	address_line_2: function(value){
		
		let errors = new Array();
		errors = {
			containsAlphaNumeric: validationHelpers.checkAlphaNumeric(value),
		}
		return validationHelpers.checkAllTrue(errors)
	},
	address_line_3: function(value){		
		let errors = new Array();
		errors = {
			containsAlphaNumeric: validationHelpers.checkAlphaNumeric(value),
		}
		return validationHelpers.checkAllTrue(errors)
	},
	postcode: function(value){
		let errors = new Array();
		const regex = /\b((?:(?:gir)|(?:[a-pr-uwyz])(?:(?:[0-9](?:[a-hjkpstuw]|[0-9])?)|(?:[a-hk-y][0-9](?:[0-9]|[abehmnprv-y])?)))) ?([0-9][abd-hjlnp-uw-z]{2})\b/
		errors = {
			presenceCheck: validationHelpers.presenceCheck(value),
			inRange: validationHelpers.rangeCheck(value, 5, 8),
			containsAlphaNumeric:  validationHelpers.checkAlphaNumeric(value),
			formatCheck: validationHelpers.checkRegExp(value, regex)
		}
		return validationHelpers.checkAllTrue(errors)
	},
	phone_number: function(value){
		let errors = new Array();
		errors = {
			presenceCheck: validationHelpers.presenceCheck(value),
			inRange: validationHelpers.rangeCheck(value, 10, 10),
			containsNumbersOnly: validationHelpers.checkNumericString(value)
		}
		return validationHelpers.checkAllTrue(errors);
	},
	email: function(value){
		let errors = new Array();
		const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		errors = {
			presenceCheck: validationHelpers.presenceCheck(value),
			regexCheck: validationHelpers.checkRegExp(value, regex)
		}
		return validationHelpers.checkAllTrue(errors);
	}
}

/*
OBJECTIVE
7.0 - Allow the user to add new customers.
7.1 - Once the user has clicked on the 
add button on the main jobs page, they 
will be taken to a new page which contains 
a form. The user will be able to input 
information about a job including the job 
type, a description of the job, any parts 
required and an estimate for the number of 
labour hours.
7.2 - Once the user has input all the details 
and clicks the submit button, the data will 
be inserted into the MySQL database.
*/

class AddCustomerDialog extends React.Component {
	constructor(props){
		super(props);
		//Initialize state
		this.state = {
			open: false,
			snackbarOpen: false,
			snackbarMessage: '',
			customer: {},
			errors: {
				first_name: false,
				last_name: false,
				address_line_1: false,
				address_line_2: true,
				address_line_3: true,
				postcode: false,
				phone_number: false,
				email: false
			}
		}
		//Bind methods to component
		this.handleChange = this.handleChange.bind(this);
		this.handleClose = this.handleClose.bind(this)
		this.generateCustomers = this.generateCustomers.bind(this);
	}
	handleOpenSnackbar(){
		//Open snackbar
		this.setState({snackbarOpen: true});
	}
	handleOpen(){
		//Open dialog
		this.setState({open: true})
	}
	handleClose(){
		//Close dialog
		this.setState({open: false})
	}
	handleRequestClose() {
		//Close snackbar
		this.setState({snackbarOpen: false});
	}
	handleChange(event){
		//Get name and value of TextField
		const name = event.target.name;
		const value = event.target.value;

		//Get correct validation function from validationMethods
		let validation = validationMethods[name];
		//Get value of error and update state
		const error = validation(value.toLowerCase())
		let updatedErrors = Object.assign({}, this.state.errors);
		updatedErrors[name] = error;
		this.setState({errors: updatedErrors})
		//Update customer in state
		let updatedCustomer = Object.assign({}, this.state.customer);
		updatedCustomer[name] = value;
		this.setState({customer: updatedCustomer});
	}
	handleSubmit(event){
		//Prevent default action on form submit
		event.preventDefault();
		var data = this.state.customer;
		/*Check that there are no errors by checking that all values in 
		errors array are true*/
		if(validationHelpers.checkAllTrue(this.state.errors)){
			//Send data to server via API request
			superagent.post('/api/customer')
			.set('Content-Type', 'application/json')
			.send(this.state.customer)
			.end((err, res) => {
				if(err){
					alert('ERROR: ' + err)
				}
				if(res.body.status === 200){
					//Update parent component's state on success
					this.props.updateList(data)
					//Close dialog
					this.handleClose();
				}
			})
		}
	}
	generateCustomers(){
		//Generate customer details using faker package
		const customer = {
			first_name: faker.name.firstName(),
			last_name: faker.name.lastName(),
			address_line_1: faker.address.streetAddress(),
			address_line_2: '',
			address_line_3: '',
			postcode: faker.address.zipCode(),
			phone_number: faker.phone.phoneNumber(),
			email: faker.internet.email()
		}
		//Send data to server via API request
		superagent.post('/api/customer')
		.set('Content-Type', 'application/json')
		.send(customer)
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err)
			}
			console.log(res.body)
			if(res.body.status === 200){
				console.log(res.body.response)
				this.props.updateList(customer, res.body.response.insertId);
				this.handleClose()
			}
		})
	}
	render(){
		const errors = this.state.errors;
		const actions = [
			<FlatButton 
				
				key={1}
				label="Submit"
				type="submit"
				onClick={this.handleClose.bind(this)}
				primary={true} />,
			<FlatButton 
				key={2}
				label="Cancel"
				primary={true}
				onClick={this.handleClose.bind(this)} />,
			<FlatButton
				key={3}
				label="Generate"
				primary={true}
				onClick={this.generateCustomers}/>
		]
		const styles = {
			dialog : {
				maxWidth: 'none'
			},
			input: {
				width: '100%'
			},
			addButton: {
				position: 'fixed',
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
					autoHideDuration={1000}
					onRequestClose={this.handleRequestClose.bind(this)}
				/>
				<Dialog
		          title="Add Customer"
		          modal={true}
		          open={this.state.open}
		          contentStyle={styles.dialog}
				  onRequestClose={this.handleClose.bind(this)}
				  autoScrollBodyContent={true}
				>
					<form onSubmit={this.handleSubmit.bind(this)}>
						<TextField 
							onChange={this.handleChange} 
							style={styles.input} 
							errorText={!errors.first_name ? 'Make sure this field is not empty, and does not contain any special characters or numbers' : ''} 
							hintText="First name" 
							name="first_name"/>
						<TextField 
							onChange={this.handleChange} 
							style={styles.input} 
							errorText={!errors.last_name ? 'Make sure this field is not empty, and does not contain any special characters or numbers' : ''} 
							hintText="Last name" 
							name="last_name"/>
						<TextField 
							onChange={this.handleChange} 
							style={styles.input} 
							errorText={!errors.address_line_1 ? 'Make sure this field is not empty and does not contain any special characters' : ''} 
							hintText="Address Line 1" 
							name="address_line_1"/>
						<TextField 
							onChange={this.handleChange} 
							style={styles.input} 
							errorText={!errors.address_line_2 ? 'Make sure this field is not empty and does not contain any special characters' : ''} 
							hintText="Address Line 2" 
							name="address_line_2"/>
						<TextField 
							onChange={this.handleChange} 
							style={styles.input} 
							errorText={!errors.address_line_3 ? 'Make sure this field is not empty and does not contain any special characters' : ''} 
							hintText="Address Line 3" 
							name="address_line_3"/>
						<TextField 
							onChange={this.handleChange} 
							style={styles.input} 
							errorText={!errors.postcode ? 'Make sure that this field is not empty, only contains letters and is between 5 and 7 characters' : ''} 
							hintText="Postcode" name="postcode"/>
						<TextField 
							onChange={this.handleChange} 
							style={styles.input} 
							errorText={!errors.phone_number ? 'Make sure that this field is not empty, only contains numbers and is exactly 10 characters long' : ''} 
							hintText="Phone number" name="phone_number"/>
						<TextField 
							onChange={this.handleChange} 
							style={styles.input} 
							errorText={!errors.email ? 'Make sure this field is not empty and your email is in the correct format' : ''} 
							hintText="Email" name="email"/>
						<div style={{ textAlign: 'right', padding: 8, margin: '24px -24px -24px -24px' }}>
							{actions}
						</div>
					</form>
				</Dialog>
				<FloatingActionButton style={styles.addButton} onClick={this.handleOpen.bind(this)}>
					<FontIcon className="material-icons">add</FontIcon>
				</FloatingActionButton>	
			</div>
		)
	}
}

export default AddCustomerDialog;