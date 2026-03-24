import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { redirect } from "react-router";

import {
  createMultiRouteStub,
  createRouteStubTest,
  renderRouteStub,
} from "tests/utils/createRouteStub";
import CVSearch from "~/routes/search";
import UploadPage from "~/routes/upload";

const user = userEvent.setup();

describe("Upload Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders upload form", () => {
    const Stub = createRouteStubTest("/upload", UploadPage);

    render(renderRouteStub(Stub, ["/upload"]));
    const heading = screen.getByRole("heading");

    expect(heading).toBeInTheDocument();
  });

  it("submits form when file is uploaded", async () => {
    const actionMock = vi.fn(async () => null);

    const Stub = createRouteStubTest("/upload", UploadPage, {
      action: actionMock,
    });

    render(renderRouteStub(Stub, ["/upload"]));

    const file = new File(["dummy"], "cv.pdf", {
      type: "application/pdf",
    });

    const fileInput = screen.getByTestId("file-input");

    await user.upload(fileInput, file);
    await user.click(screen.getByRole("button", { name: /upload/i }));

    await waitFor(() => {
      expect(actionMock).toHaveBeenCalled();
    });
  });

  it("redirects on successful upload", async () => {
    const Stub = createMultiRouteStub([
      {
        path: "/upload",
        Component: UploadPage,
        action: async () => {
          return redirect("/app/search");
        },
      },
      {
        path: "/app/search",
        Component: CVSearch,
      },
    ]);

    render(renderRouteStub(Stub, ["/upload"]));

    const file = new File(["dummy"], "cv.pdf", {
      type: "application/pdf",
    });

    const fileInput = screen.getByTestId("file-input");

    await user.upload(fileInput, file);
    await user.click(screen.getByRole("button", { name: /upload/i }));

    const button = screen.getByRole("button");

    await waitFor(() => {
      expect(button).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(button).toHaveTextContent("Analyze My Fit");
    });
  });

  it("handles API error gracefully", async () => {
    const ERROR_MESSAGE = "API Error: Server unavailable";

    const Stub = createRouteStubTest("/upload", UploadPage, {
      action: async () => {
        return { error: ERROR_MESSAGE };
      },
    });

    render(renderRouteStub(Stub, ["/upload"]));

    await user.click(screen.getByRole("button", { name: /upload/i }));

    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
    });
  });
});
