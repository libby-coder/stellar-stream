import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { StreamsTable } from "./StreamsTable";
import { Stream } from "../types/stream";

const noop = vi.fn().mockResolvedValue(undefined);

const mockStreams: Stream[] = [
  {
    id: "1",
    sender: "G_SENDER123456789012345678901234567890123456789012345678901",
    recipient: "G_RECIPIENT123456789012345678901234567890123456789012345",
    assetCode: "USDC",
    totalAmount: 100,
    durationSeconds: 3600,
    startAt: 1670000000,
    createdAt: 1670000000,
    progress: {
      status: "active",
      ratePerSecond: 0.01,
      elapsedSeconds: 100,
      vestedAmount: 20,
      remainingAmount: 80,
      percentComplete: 20,
    },
  },
];

const defaultProps = {
  streams: mockStreams,
  filters: {},
  onFiltersChange: vi.fn(),
  onCancel: noop,
  onPause: noop,
  onResume: noop,
  onEditStartTime: vi.fn(),
};

describe("StreamsTable column visibility", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("hides optional column by default and shows it when toggled", () => {
    render(<StreamsTable {...defaultProps} />);

    expect(screen.queryByRole("columnheader", { name: "Asset" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Toggle table columns" }));
    fireEvent.click(screen.getByLabelText("Asset"));

    expect(screen.getByRole("columnheader", { name: "Asset" })).toBeInTheDocument();
    expect(screen.getByText("USDC")).toBeInTheDocument();
  });

  it("persists column visibility to localStorage", () => {
    const { unmount } = render(<StreamsTable {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: "Toggle table columns" }));
    fireEvent.click(screen.getByLabelText("Asset"));

    const stored = JSON.parse(localStorage.getItem("stream-table-columns") ?? "{}");
    expect(stored.assetCode).toBe(true);

    unmount();
    render(<StreamsTable {...defaultProps} />);

    expect(screen.getByRole("columnheader", { name: "Asset" })).toBeInTheDocument();
  });
});
