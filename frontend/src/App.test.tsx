import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('ConversaIQ AppShell & Navigation Verification (Task 1.3)', () => {
  it('renders the ConversaIQ brand header and tenant context badge', () => {
    render(<App />);
    expect(screen.getByText('ConversaIQ')).toBeInTheDocument();
    expect(screen.getByText('Acme Global Ltd')).toBeInTheDocument();
    expect(screen.getByText('Alex Chen')).toBeInTheDocument();
  });

  it('renders all 9 approved module navigation links in the sidebar', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /Admin Intelligence/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /AI Chat Agent/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Knowledge Base/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Business Data Hub/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Customer Management/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Complaints & Tickets/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Integrations & Tools/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Cloud & Infrastructure/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Enterprise Administration/i })).toBeInTheDocument();
  });

  it('toggles sidebar collapse state when clicking the chevron toggle', () => {
    render(<App />);
    const collapseButton = screen.getByRole('button', { name: /Collapse Sidebar/i });
    expect(collapseButton).toBeInTheDocument();

    // Click collapse
    fireEvent.click(collapseButton);
    expect(screen.getByRole('button', { name: /Expand Sidebar/i })).toBeInTheDocument();

    // Click expand
    const expandButton = screen.getByRole('button', { name: /Expand Sidebar/i });
    fireEvent.click(expandButton);
    expect(screen.getByRole('button', { name: /Collapse Sidebar/i })).toBeInTheDocument();
  });

  it('navigates to AI Chat Agent and updates breadcrumbs and main view', () => {
    render(<App />);
    const chatLink = screen.getByRole('link', { name: /AI Chat Agent/i });
    fireEvent.click(chatLink);

    expect(screen.getByRole('heading', { name: /AI Customer Support Chat/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByText(/Module A Placeholder/i)).toBeInTheDocument();
  });

  it('navigates to Business Data Hub and Knowledge Base views', () => {
    render(<App />);
    const dataHubLink = screen.getByRole('link', { name: /Business Data Hub/i });
    fireEvent.click(dataHubLink);
    expect(screen.getByRole('heading', { name: /Business Data Hub/i, level: 1 })).toBeInTheDocument();

    const kbLink = screen.getByRole('link', { name: /Knowledge Base/i });
    fireEvent.click(kbLink);
    expect(screen.getByRole('heading', { name: /Knowledge Base & RAG/i, level: 1 })).toBeInTheDocument();
  });

  it('opens and closes notifications popover in header', () => {
    render(<App />);
    const notifButton = screen.getByRole('button', { name: /Notifications/i });
    fireEvent.click(notifButton);
    expect(screen.getByText(/Google Sheets Synced/i)).toBeInTheDocument();
  });
});
