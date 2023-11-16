//#region Imports
import type { Browser, Page } from "@playwright/test";
import { test, expect } from "@playwright/experimental-ct-react";
import { Test } from "./feedback.e2e-tests.js";
//#endregion

//#region helpers
export function advanceInputRadio(browser: Browser, page: Page): Promise<void> {
	if (browser.browserType().name() === "firefox") {
		return page.keyboard.press("Tab");
	} else {
		return page.keyboard.press("ArrowDown");
	}
}

export function advanceFocusByTab(browser: Browser, page: Page): Promise<void> {
	if (browser.browserType().name() === "webkit") {
		return page.keyboard.press("Alt+Tab");
	} else {
		return page.keyboard.press("Tab");
	}
}
//#endregion

test.use({
	viewport: { width: 1024, height: 786 },
});

test("The test that fails in Firefox", async function ({
	mount,
	browser,
	page,
}) {
	const component = await mount(<Test />);

	await test.step("Pass in all browsers", async function () {
		await component.getByTestId("input 1").focus();
		await advanceInputRadio(browser, page);
		await expect(component.getByTestId("input 2")).toBeFocused();
		await expect(component).toHaveAttribute("data-callbackcalls", "0");
	});

	await test.step("Fail on Firefox without ReactDOM.flushSync() - probably because wrong position of events in the micro task queue", async function () {
		await advanceFocusByTab(browser, page);
		await expect(component).toHaveAttribute("data-callbackcalls", "1");
	});
});
