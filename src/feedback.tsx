//#region Imports
import * as React from "react";
import * as ReactDOM from "react-dom";
//#endregion

function isElementBetweenTwoElements(
	element: HTMLElement,
	before: HTMLElement,
	after: HTMLElement,
): boolean {
	let next = before.nextSibling;

	while (next != null && next !== after) {
		if (next.contains(element)) {
			return true;
		}

		next = next.nextSibling;
	}

	return false;
}

function isRelatedTargetContainedBy(
	relatedTarget: HTMLElement | EventTarget | null,
	beforeElement: HTMLTemplateElement,
	afterElement: HTMLTemplateElement,
): boolean {
	return (
		relatedTarget != null &&
		"tagName" in relatedTarget &&
		isElementBetweenTwoElements(relatedTarget, beforeElement, afterElement)
	);
}
//#endregion

export interface Props {
	callback: () => unknown;
	children?: React.ReactNode;
}

export function Feedback({ callback: callback, children }: Props) {
	const beforeRef = React.useRef<HTMLTemplateElement>(null);
	const afterRef = React.useRef<HTMLTemplateElement>(null);
	const [state, setState] = React.useState<"before" | "focus" | "after">(
		"before",
	);

	React.useEffect(() => {
		if (state === "after") return;

		const beforeElement = beforeRef.current!;
		const afterElement = afterRef.current!;
		const parent = beforeElement.parentElement!;

		function isRelatedTargetContained(
			relatedTarget: HTMLElement | EventTarget | null,
		): boolean {
			return isRelatedTargetContainedBy(
				relatedTarget,
				beforeElement,
				afterElement,
			);
		}

		function handleFocus(event: FocusEvent) {
			if (state === "before" && isRelatedTargetContained(event.target)) {
				setState("focus");
			} else if (state === "focus" && !isRelatedTargetContained(event.target)) {
				setState("after");
				callback();
			}
		}

		function handleBlur(event: FocusEvent) {
			if (state === "focus") {
				if (
					event.relatedTarget == null ||
					!isRelatedTargetContained(event.relatedTarget)
				) {
					// Uncomment ReactDOM.flushSync() to make test pass in Firefox
					// 🔽 🔽 🔽 🔽 🔽 🔽
					// ReactDOM.flushSync(() => {
					setState("after");
					callback();
					// });
				}
			}
		}

		parent.addEventListener("focus", handleFocus, true);
		parent.addEventListener("blur", handleBlur, true);

		return () => {
			parent.removeEventListener("focus", handleFocus, true);
			parent.removeEventListener("blur", handleBlur, true);
		};
	}, [state, callback]);

	return (
		<>
			<template ref={beforeRef} />
			{children}
			<template ref={afterRef} />
		</>
	);
}
