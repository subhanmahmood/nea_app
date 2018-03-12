import React from 'react';

import PartList from '../../container/parts/PartList';

class Parts extends React.Component {
	render(){
		return(
			<div className="container" style={{marginTop: 20}}>
				<div className="row">
					<div className="col s12">
						<PartList />	
						<br/>
					</div>
				</div>
			</div>
		)
	}
}

export default Parts;