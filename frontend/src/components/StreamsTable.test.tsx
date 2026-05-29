import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { StreamsTable } from './StreamsTable';
import { Stream } from '../types/stream';

const mockStreams: Stream[] = [
  {
    id: '1',
    sender: 'G_SENDER',
    recipient: 'G_RECIPIENT123',
    assetCode: 'USDC',
    totalAmount: 100,
    durationSeconds: 3600,
    startAt: 1670000000,
    createdAt: 1670000000,
    progress: {
      status: 'active',
      ratePerSecond: 0.01,
      elapsedSeconds: 100,
      vestedAmount: 20,
      remainingAmount: 80,
      percentComplete: 20,
    },
  },
  {
    id: '2',
    sender: 'G_SENDER',
    recipient: 'G_RECIPIENT123',
    assetCode: 'USDC',
    totalAmount: 100,
    durationSeconds: 3600,
    startAt: 1770000000,
    createdAt: 1670000000,
    progress: {
      status: 'scheduled',
      ratePerSecond: 0.01,
      elapsedSeconds: 0,
      vestedAmount: 0,
      remainingAmount: 100,
      percentComplete: 0,
    },
  },
  {
    id: '3',
    sender: 'G_SENDER',
    recipient: 'G_RECIPIENT123',
    assetCode: 'USDC',
    totalAmount: 100,
    durationSeconds: 3600,
    startAt: 1670000000,
    createdAt: 1670000000,
    progress: {
      status: 'completed',
      ratePerSecond: 0.01,
      elapsedSeconds: 3600,
      vestedAmount: 100,
      remainingAmount: 0,
      percentComplete: 100,
    },
  },
  {
    id: '4',
    sender: 'G_SENDER',
    recipient: 'G_RECIPIENT123',
    assetCode: 'USDC',
    totalAmount: 100,
    durationSeconds: 3600,
    startAt: 1670000000,
    createdAt: 1670000000,
    progress: {
      status: 'canceled',
      ratePerSecond: 0.01,
      elapsedSeconds: 500,
      vestedAmount: 10,
      remainingAmount: 90,
      percentComplete: 10,
    },
  },
];

const defaultProps = {
  streams: mockStreams,
  filters: {},
  onFiltersChange: vi.fn(),
  onCancel: vi.fn().mockResolvedValue(undefined),
  onPause: vi.fn().mockResolvedValue(undefined),
  onResume: vi.fn().mockResolvedValue(undefined),
  onOpenStream: vi.fn(),
  onEditStartTime: vi.fn(),
  onCreateStream: vi.fn(),
};

describe('StreamsTable Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders table data when streams are passed', () => {
    render(<StreamsTable {...defaultProps} />);

    expect(screen.getAllByText(/active/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/scheduled/i).length).toBeGreaterThan(0);
  });

  it('renders correct status badges for all statuses', () => {
    render(<StreamsTable {...defaultProps} />);

    expect(screen.getByText('active')).toHaveClass('badge-active');
    expect(screen.getByText('scheduled')).toHaveClass('badge-scheduled');
    expect(screen.getByText('completed')).toHaveClass('badge-completed');
    expect(screen.getByText('canceled')).toHaveClass('badge-canceled');
  });

  it('calls onCancel when cancel button is clicked on an active stream', () => {
    const onCancel = vi.fn().mockResolvedValue(undefined);
    render(<StreamsTable {...defaultProps} onCancel={onCancel} />);

    const cancelButtons = screen.getAllByLabelText(/cancel stream/i);
    fireEvent.click(cancelButtons[0]);
    expect(onCancel).toHaveBeenCalledWith('1');
  });

  it('disables cancel button for completed or canceled streams', () => {
    render(<StreamsTable {...defaultProps} />);

    const cancelButtons = screen.getAllByLabelText(/cancel stream/i);
    expect(cancelButtons[2]).toBeDisabled();
    expect(cancelButtons[3]).toBeDisabled();
  });

  it('renders a helpful message for empty streams array', () => {
    render(<StreamsTable {...defaultProps} streams={[]} totalStreamCount={0} onCreateStream={defaultProps.onCreateStream} />);

    expect(screen.getByText(/no streams yet/i)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create stream/i })).toBeInTheDocument();
  });
});
