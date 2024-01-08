import React from 'react';
import ReactDOM from 'react-dom';
import Pager from './Pager';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Pager />, div);
  ReactDOM.unmountComponentAtNode(div);
});