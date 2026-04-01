import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Navigation } from "react-router";
import { vi } from "vitest";
import SettingsPage from "~/routes/settings";
import {
  createRouteStubTest,
  renderRouteStub,
} from "tests/utils/createRouteStub";

// Mock react-router hooks
vi.mock("react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("react-router")>();
  return {
    ...actual,
    Form: ({ children, ...props }: any) => <form {...props}>{children}</form>,
    useNavigation: () => ({ state: "idle" } as Navigation),
    useOutletContext: () => ({
      user: {
        id: "123",
        email: "allan@example.com",
        first_name: "Allan",
        last_name: "Imire",
      },
      cvs: [],
    }),
  };
});

describe("Settings Page", () => {
  it("renders the settings heading", () => {
    const Stub = createRouteStubTest("/app/settings", SettingsPage);
    render(renderRouteStub(Stub, ["/app/settings"]));
    expect(screen.getByRole("heading", { name: /Settings/i })).toBeInTheDocument();
  });

  it("pre-fills user profile fields from context", () => {
    const Stub = createRouteStubTest("/app/settings", SettingsPage);
    render(renderRouteStub(Stub, ["/app/settings"]));
    expect(screen.getByLabelText(/First Name/i)).toHaveValue("Allan");
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue("Imire");
    expect(screen.getByRole("textbox", { name: /Email/i })).toHaveValue("allan@example.com");
  });

  it("shows newsletter preference checkbox checked by default", () => {
    const Stub = createRouteStubTest("/app/settings", SettingsPage);
    render(renderRouteStub(Stub, ["/app/settings"]));
    expect(screen.getByLabelText(/Receive job matching/i)).toBeChecked();
  });

  it("shows save changes button enabled by default", () => {
    const Stub = createRouteStubTest("/app/settings", SettingsPage);
    render(renderRouteStub(Stub, ["/app/settings"]));
    const submitButton = screen.getByTestId("settings-submit");
    expect(submitButton).toBeEnabled();
    expect(submitButton).toHaveTextContent(/Save Changes/i);
  });

  it("updates first name field when user types", async () => {
    const user = userEvent.setup();
    const Stub = createRouteStubTest("/app/settings", SettingsPage);
    render(renderRouteStub(Stub, ["/app/settings"]));
    const firstNameInput = screen.getByLabelText(/First Name/i);
    await user.clear(firstNameInput);
    await user.type(firstNameInput, "John");
    expect(firstNameInput).toHaveValue("John");
  });
});
