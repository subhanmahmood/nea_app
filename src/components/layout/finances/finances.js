import React from 'react';
import superagent from 'superagent';

import FinanceTable from '../../container/finance/FinanceTable'

class Finances extends React.Component {
	constructor(props){
		super(props)
	}
	render(){
		return(
      <div className="container" style={{marginTop: 20}}>
				<h1 style={{fontWeight: 200}}>Finances</h1>
				<FinanceTable/>
			</div>
		)
	}
}

export default Finances;