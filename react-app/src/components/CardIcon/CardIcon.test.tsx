import React from 'react';
import ReactDOM from 'react-dom';
import CardIcon from './CardIcon';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CardIcon />, div);
  ReactDOM.unmountComponentAtNode(div);
});