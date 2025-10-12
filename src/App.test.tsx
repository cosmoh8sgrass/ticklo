import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Ticklo header', () => {
  render(<App />);
  expect(screen.getByText(/Ticklo/i)).toBeInTheDocument();
});

test('renders sidebar Inbox button', () => {
  render(<App />);
  expect(screen.getByText(/Inbox/i)).toBeInTheDocument();
});
