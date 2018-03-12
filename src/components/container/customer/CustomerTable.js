import React from 'react';
import superagent from 'superagent';

//Material-UI imports
import AppBar from 'material-ui/AppBar';
import CircularProgress from 'material-ui/CircularProgress';
import Dialog from 'material-ui/Dialog'
import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

//User defined imports
import AddCustomerDialog from './addCustomerDialog';
import helpers from '../../../helpers/helpers'
/*
OBJECTIVE
6.0 - Display a list of all the customers 
on the customers page. When the user clicks 
on a customer they will be taken to a page 
where they can edit the details of the 
customer or delete them from the database. 
There will also be a button that will take 
the user to a page where they can add new 
customers.
*/

class CustomersTable extends React.Component {
    constructor(props){
        super(props)
        //Initialize component state
        this.state = {
					customers: new Array(),
					listCustomers: new Array(),
					customer: {
							first_name: "",
							last_name: "",
							address_line_1: "",
							email: "",
							postcode: "",
							phone_number: ""
					},
					open: false,
					valueSort: 1
				}
				//Bind methods to component
        this.onCellClick = this.onCellClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.findCustomer = this.findCustomer.bind(this);
    }
    componentDidMount(){
			/*Perform API request to get array of customers from server and 
			add to component state*/
			superagent.get('/api/customer')
			.end((err, res) => {
					if(err){
							alert('ERROR: ' + err)
					}
					const customers = res.body.response;
					this.setState({customers: customers, listCustomers: customers})
			})
    }
    addCustomer(customer, id){
			//Get id of next customer
			const nextId = id;
			customer.idcustomer = nextId
			//Add customer to component state
			let updatedCustomers = Object.assign([], this.state.customers);
			updatedCustomers.push(customer);
			this.setState({customers: updatedCustomers});
    }
    onCellClick(rowNumber, columnId){
			//Open dialog when table cell is clicked
			const customer = this.state.listCustomers[rowNumber];
			this.setState({customer: customer});
			this.handleOpen()
    }
    handleOpen(){
			//Open dialog
      this.setState({open:true})
    }
    handleClose(){
			//Close dialog
      this.setState({open:false})
    }
    handleSortChange(event, value){
			//Update component state when SelectField is changed
			this.setState({valueSort: value});
			this.sortCustomers()
    }
    findCustomer(event){
			const value = event.target.value;
			/*/Filter customers array by returning values where the customer name does not contain the user value 
			substring*/
			const newCustomers = this.state.customers.filter((customer, i) => {
					return (customer.first_name + " " + customer.last_name).toLowerCase().indexOf(value) !== -1; 
			});
			this.setState({listCustomers: newCustomers })
    }
    sortCustomers(){
        let customers = this.state.customers;
        if(this.state.valueSort === 1){					
        	//Sort ascending
					const newCustomers = helpers.mergeSort(customers, 'asc', ['first_name', 'last_name'])
					this.setState({customers: newCustomers});
        }else if(this.state.valueSort === 2){
					//Sort descending
					const newCustomers = helpers.mergeSort(customers, 'desc', ['first_name', 'last_name'])
					this.setState({customers: newCustomers});
        }
        this.setState({listCustomers: customers})
    }
    render(){
        const styles = {
            iconStyles: {
                marginTop: 10,
                marginLeft: 4,
                fontSize: 14
            }
        }
        const TableRows = this.state.listCustomers.map((customer, i) => {
            return(
                <TableRow 
                    key={i}
                    hoverable={true}>
                    <TableRowColumn>{customer.idcustomer}</TableRowColumn>
                    <TableRowColumn>{`${customer.first_name} ${customer.last_name}`}</TableRowColumn>
                    <TableRowColumn>{customer.address_line_1}</TableRowColumn>
                    <TableRowColumn>{customer.postcode}</TableRowColumn>
                    <TableRowColumn>{customer.phone_number}</TableRowColumn>
                    <TableRowColumn>{customer.email}</TableRowColumn>
                </TableRow>)
        });
        const actions = [
            <FlatButton
              label="Close"
              primary={true}
              onClick={this.handleClose}
            />,
            <FlatButton
              label="Edit Customer"              
              href={`/customers/${this.state.customer.idcustomer}/edit`}
              primary={true}
              onClick={this.handleClose}
            />,
          ];
        return(
            <div className="hide-on-small-only">    
                <Dialog
                    title="Customer"            
                    modal={true}
                    actions={actions}
                    open={this.state.open}
                    onRequestClose={this.handleClose}>
                    {this.state.customer.first_name + " " + this.state.customer.last_name}
                    <br/>
                    {this.state.customer.address_line_1}
                    <br/>
                    {this.state.customer.postcode}
                    <br/>
                    {this.state.customer.phone_number}
                    <br/>
                    {this.state.customer.email}
                </Dialog>
                <Toolbar>
                    <ToolbarGroup firstChild={true} style={{width: '100%'}}>
                        <TextField 
                            style={{marginLeft: 15, width: '100%'}} 
                            inputStyle={{width:'100%'}}
                            hintText="Search for a customer..."
                            onChange={this.findCustomer}/>
                            <RaisedButton primary={true} label="search"/>
                    </ToolbarGroup>
                    <ToolbarGroup lastChild={true}>          
                        <ToolbarTitle text="Select Sort" />
                        <IconMenu
                            onChange={this.handleSortChange}
                            value={this.state.valueSort}
                            iconButtonElement={
                                <IconButton touch={true}>
                                    <NavigationExpandMoreIcon />
                                </IconButton>
                            }>
                            <MenuItem value={1} primaryText="Ascending" />
                            <MenuItem value={2} primaryText="Descending" />
                        </IconMenu>
                    </ToolbarGroup>
                </Toolbar>
                {this.state.customers.length === 0 ? 
                    <div style={{textAlign: 'center'}}>
                    <CircularProgress/>
                    </div>
                    : 
                    <Table 
                        onCellClick={this.onCellClick}>
                        <TableHeader 
                            displaySelectAll={false}
                            adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>ID</TableHeaderColumn>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>Address</TableHeaderColumn>
                                <TableHeaderColumn>Postcode</TableHeaderColumn>
                                <TableHeaderColumn>Phone Number</TableHeaderColumn>
                                <TableHeaderColumn>Email</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody 
                            displayRowCheckbox={false}>
                        {TableRows}
                        </TableBody>
                    </Table>
                }
                
                <AddCustomerDialog updateList={this.addCustomer.bind(this)}/>
            </div>
        )
    }
}

export default CustomersTable;