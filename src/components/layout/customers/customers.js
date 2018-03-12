import React from 'react';
import CustomersTable from '../../container/customer/CustomerTable';
import CustomerList from '../../container/customer/CustomerList';

class Customers extends React.Component {
	constructor(props){
		super(props)
	}
	render(){
		return(
			<div className="container" style={{marginTop: 20}}>
				<div className="row">
					<div className="col s12">
						<CustomersTable/>
						<CustomerList/>
						<br/>
					</div>
				</div>
			</div>
		)
	}
}

export default Customers;