import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Modal />, div);
  ReactDOM.unmountComponentAtNode(div);
});