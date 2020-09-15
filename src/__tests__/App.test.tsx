import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('renders as expected', () => {
  const wrapper = render(<App />);
  expect(wrapper).toMatchSnapshot();
});
