import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('ConversaIQ Design Tokens Verification (Task 1.2)', () => {
  it('renders the ConversaIQ Design System heading and Task 1.2 badge', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /ConversaIQ Design System/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Task 1.2/i)).toBeInTheDocument();
  });

  it('renders all four design token showcase sections', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /1\. Semantic Color Tokens/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /2\. Typography Hierarchy/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /3\. Rounded Cards & Restrained Elevations/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /4\. Component States, Badges & Buttons/i })).toBeInTheDocument();
  });

  it('renders the primary teal and secondary blue accent tokens', () => {
    render(<App />);
    expect(screen.getByText(/Teal Accent \(#0D9488\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Blue Accent \(#2563EB\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Canvas \(#F8FAFC\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Navy \(#0B1D33\)/i)).toBeInTheDocument();
  });

  it('toggles light and dark mode classes when clicking theme button', () => {
    render(<App />);
    const toggleButton = screen.getByRole('button', { name: /Toggle light\/dark theme/i });
    expect(toggleButton).toHaveTextContent(/Dark Mode/i);

    // Click to activate Dark Mode
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent(/Light Mode/i);
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    // Click to return to Light Mode
    fireEvent.click(toggleButton);
    expect(toggleButton).toHaveTextContent(/Dark Mode/i);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
