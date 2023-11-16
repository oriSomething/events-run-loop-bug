//#region Imports
import * as React from "react";
import { Feedback } from "./feedback.js";
//#endregion

export function Test() {
	const [callCount, setCallCount] = React.useState(0);

	const callback = React.useCallback(function () {
		setCallCount((callCount) => callCount + 1);
	}, []);

	return (
		<div data-callbackcalls={callCount}>
			<form>
				<input />
				<Feedback callback={callback}>
					<fieldset>
						<legend>Something</legend>
						<div>
							<label htmlFor="test-radio-1">1</label>
							<input
								type="radio"
								data-testid="input 1"
								id="test-1"
								name="tested"
								value="1"
							/>

							<label htmlFor="test-radio-2">2</label>
							<input
								type="radio"
								data-testid="input 2"
								id="test-2"
								name="tested"
								value="2"
							/>
						</div>
					</fieldset>
				</Feedback>
				<input />
			</form>
		</div>
	);
}
