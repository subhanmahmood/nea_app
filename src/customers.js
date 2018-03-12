import React from 'react';
import ReactDOM from 'react-dom';

import Customers from './components/layout/customers/customers';
import MuiWrapper from './components/layout/MuiWrapper';

ReactDOM.render(<MuiWrapper content={<Customers />} />, document.getElementById('root'))