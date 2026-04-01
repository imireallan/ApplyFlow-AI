import { expect, test } from "@playwright/test";

test.describe("Upload Page @auth", () => {
  test("visits upload page and can interact with the form", async ({ page }) => {
    await page.goto("/app/upload");

    await expect(page.getByText(/Upload Your Resume/i)).toBeVisible();

    const fileInput = page.getByTestId("file-input");
    await expect(fileInput).toBeVisible();

    // Upload button is disabled with no file
    const uploadButton = page
      .getByRole("button", { name: /Upload Resume/i })
      .first();
    await expect(uploadButton).toBeDisabled();

    // Set files programmatically
    const mockFile = {
      name: "test.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-mock-content"),
    };
    await fileInput.setInputFiles(mockFile);

    // Verify file was selected — the UI must reflect "test.pdf"
    await expect(page.getByText("test.pdf")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(/Ready for scanning/i)).toBeVisible({
      timeout: 5000,
    });

    // Click submit to trigger the form action
    // The backend call will fail (no real API), but we verify the
    // UI transitions to the processing state
    await uploadButton.click();

    // Wait for "Analyzing..." button to prove form was submitted
    await expect(
      page.getByRole("button", { name: /Analyzing/i })
    ).toBeVisible({ timeout: 5000 });
  });

  test("shows disabled upload button without a file", async ({ page }) => {
    await page.goto("/app/upload");
    await page.waitForURL(/upload/);

    const uploadButton = page
      .getByRole("button", { name: /Upload Resume/i })
      .first();

    await expect(uploadButton).toBeDisabled();
  });
});
