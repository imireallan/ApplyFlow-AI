// import { expect, test } from "@playwright/test";

// test.describe("Upload Page", () => {
//   test.skip("visits upload page and uploads file", async ({ page }) => {
//     await page.goto("/upload");

//     await expect(page).toHaveTitle(/Upload/);

//     // Check form is present
//     await expect(page.getByText(/upload your resume/i)).toBeVisible();

//     // Mock file upload (requires MSW or API mocking for full test)
//     const mockFile = {
//       name: "test.pdf",
//       mimeType: "application/pdf",
//       buffer: Buffer.from("test content"),
//     };

//     // Upload file
//     const fileInput = page.getByTestId("file-input");
//     await fileInput.setInputFiles(mockFile);

//     await page.getByRole("button", { name: /upload/i }).click();

//     // Wait for redirect to search
//     await page.waitForURL(/.*search.*/);
//     await expect(page).toHaveURL(/search/);
//   });

//   test.skip("shows error on invalid file", async ({ page }) => {
//     await page.goto("/upload");

//     await page.getByRole("button", { name: /upload/i }).click();

//     await expect(page.getByText(/please select/i)).toBeVisible();
//   });
// });
