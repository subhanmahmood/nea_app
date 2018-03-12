import React from 'react';
import ReactDOM from 'react-dom';

import Finances from './components/layout/finances/finances';
import MuiWrapper from './components/layout/MuiWrapper';

ReactDOM.render(<MuiWrapper content={<Finances />} />, document.getElementById('root'))
  