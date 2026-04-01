import { storageState } from "@playwright/test";
import { STORAGE_STATE } from "../../playwright.config";

export const test = storageState({ storageState: STORAGE_STATE });
export { expect } from "@playwright/test";
