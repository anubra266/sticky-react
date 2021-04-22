import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Sticky } from '../src';

describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Sticky />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
