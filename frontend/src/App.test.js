import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders NFT Certificate Platform title', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const titleElement = screen.getByText(/NFT Certificate Platform/i);
  expect(titleElement).toBeInTheDocument();
}); 