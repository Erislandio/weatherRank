import type { ActivityScore } from "@/types/weather";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActivityRanking } from "./ActivityRanking";

const mockActivities: ActivityScore[] = [
  {
    name: "Skiing",
    emoji: "🎿",
    score: 85,
    rank: 1,
    description: "Great conditions!",
    gradient: "from-blue-400 to-blue-600",
    bgGradient: "from-blue-900 to-blue-950",
  },
  {
    name: "Surfing",
    emoji: "🏄",
    score: 45,
    rank: 2,
    description: "Meh.",
    gradient: "from-teal-400 to-teal-600",
    bgGradient: "from-teal-900 to-teal-950",
  },
];

describe("ActivityRanking", () => {
  it("renders all activity cards", () => {
    render(<ActivityRanking activities={mockActivities} />);
    expect(screen.getByText("Skiing")).toBeInTheDocument();
    expect(screen.getByText("Surfing")).toBeInTheDocument();
  });

  it("displays the correct scores", () => {
    render(<ActivityRanking activities={mockActivities} />);
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
  });

  it("renders descriptions correctly", () => {
    render(<ActivityRanking activities={mockActivities} />);
    expect(screen.getByText("Great conditions!")).toBeInTheDocument();
    expect(screen.getByText("Meh.")).toBeInTheDocument();
  });
});
