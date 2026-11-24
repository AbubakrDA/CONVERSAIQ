import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('ConversaIQ App Scaffold Verification', () => {
  it('renders the ConversaIQ brand heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /ConversaIQ/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });

  it('renders the Task 1.1 scaffold verification status card', () => {
    render(<App />);
    expect(screen.getByText(/Phase 1 — Task 1.1 Scaffolded/i)).toBeInTheDocument();
  });

  it('verifies the design baseline indicators', () => {
    render(<App />);
    expect(screen.getByText(/Light Canvas • Rounded Cards • Navy & Teal/i)).toBeInTheDocument();
  });
});
