import React from 'react';
import superagent from 'superagent';
import FlatButton from 'material-ui/FlatButton';

import CustomerCard from '../../presentation/customers/CustomerCard';
import AddCustomerDialog from './addCustomerDialog';

class NoCustomers extends React.Component {
	render(){
		const styles = {
			container: {
				width: '100%',
				textAlign: 'center'
			},
			text: {
				fontSize: 20,
				color: '#e6e6e6'
			}
		}
		return(
			<div style={styles.container}>
				<p style={styles.text}>No customers yet</p>
			</div>
		)
	}
}

class CustomersList extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			list: [],
			customersExist: false
		}
	}
	addCustomer(customer){
		let updatedList = Object.assign([], this.state.list);
		updatedList.push(customer);
		this.setState({list: updatedList});
	}
	componentDidMount(){
		superagent.get('/api/customer')
		.end((err, res) => {
			if(err){
				alert('ERROR: ' + err);
			}
			const data = res.body.response;
			if(data[0] !== undefined){
				this.setState({customersExist:true,list: data})
			}
		})
	}
	deleteItem(){
		const id = 33;
		const list = this.state.list;
		for(let i = 0; i < list.length; i++){
			let customer = list[i]
			if(customer.id === id){
				list[i] = null;
			}
		}
		this.setState({list:list})
	}
	render(){
		const custItems = this.state.list.map((customer, i) => {
			return(<div className="col s12 m6" key={i}><CustomerCard customer={customer} /></div>)
		});

		var content;
		if(this.state.customersExist){
			content = custItems
		} else {
			content = <NoCustomers />
		}
		
		return(
			<div>	
				{content}		
				<AddCustomerDialog updateList={this.addCustomer.bind(this)}/>
			</div>
		);
	}

}

export default CustomersList;