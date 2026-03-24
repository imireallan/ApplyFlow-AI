import { render, screen } from "@testing-library/react";
import { type ReactNode } from "react";
import type { Navigation } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { UploadForm } from "~/components/UploadForm";

// Mock react-router Form using async importOriginal pattern
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
  };
});

const mockSubmit = vi.fn();

const mockIdleNavigation: Navigation = {
  state: "idle",
  formData: new globalThis.FormData(),
  formMethod: undefined,
  formAction: undefined,
  formEncType: undefined,
} as any;

const mockSubmittingNavigation: Navigation = (() => {
  const formData = new globalThis.FormData();
  formData.append("intent", "upload-cv");
  return {
    state: "submitting",
    formData,
    formMethod: "post" as const,
    formAction: "/upload",
    formEncType: "multipart/form-data" as const,
  } as any;
})();

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <div>{children}</div>
);

describe("UploadForm", () => {
  it("renders upload form correctly", () => {
    render(<UploadForm submit={mockSubmit} navigation={mockIdleNavigation} />, {
      wrapper: TestWrapper,
    });
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
  });

  it("shows error message from props", () => {
    render(
      <UploadForm
        error="Upload failed"
        submit={mockSubmit}
        navigation={mockIdleNavigation}
      />,
      { wrapper: TestWrapper },
    );
    expect(screen.getByText("Upload failed")).toBeInTheDocument();
  });

  it("disables upload button without file", () => {
    render(<UploadForm submit={mockSubmit} navigation={mockIdleNavigation} />, {
      wrapper: TestWrapper,
    });
    const submitButton = screen.getByRole("button", { name: /upload/i });
    expect(submitButton).toBeDisabled();
  });

  it("shows processing overlay when submitting", () => {
    render(
      <UploadForm submit={mockSubmit} navigation={mockSubmittingNavigation} />,
      { wrapper: TestWrapper },
    );
    expect(screen.getByText(/Processing your resume/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Analyzing.../i }),
    ).toBeInTheDocument();
  });
});
