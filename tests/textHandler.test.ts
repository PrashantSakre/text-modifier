import { textHandler } from "../src";

describe("textHandler", () => {
	let textEmit: textHandler;

	beforeEach(() => {
		textEmit = new textHandler();
	});

	test("should subscribe and unsubscribe an event", () => {
		const eventName = "textChange";
		const handler = jest.fn();

		// Subscribe to an event
		const { unsubscribe } = textEmit.subscribeToEvent(eventName, {
			placement: "start",
			appendText: "Hello ",
			regex: /.+/,
		});

		// Trigger the event
		textEmit.triggerEvent(eventName, "World");

		// Validate that the handler was called
		expect(handler).not.toHaveBeenCalled(); // We aren't using `handler`, we should be testing the result of `run`.

		// Validate result directly
		const result = textEmit.triggerEvent(eventName, "World")[0];
		expect(result).toBe("Hello World");

		// Unsubscribe from the event
		unsubscribe();

		// Trigger the event again after unsubscribe
		const resultAfterUnsub = textEmit.triggerEvent(eventName, "World")[0];

		// Ensure the handler is not called after unsubscribe
		expect(resultAfterUnsub).toBeUndefined();
	});

	test("should prepend text correctly", () => {
		const eventName = "textChange";

		// Subscribe with placement "start" to prepend text
		const { unsubscribe } = textEmit.subscribeToEvent(eventName, {
			placement: "start",
			appendText: "Hello ",
			regex: /.+/,
		});

		// Run the event and check the result
		const result = textEmit.triggerEvent(eventName, "World")[0];

		// Expect the "Hello " to be prepended
		expect(result).toBe("Hello World");

		unsubscribe(); // Unsubscribe after the test
	});

	test("should append text correctly", () => {
		const eventName = "textChange";

		// Subscribe with placement "end" to append text
		const { unsubscribe } = textEmit.subscribeToEvent(eventName, {
			placement: "end",
			appendText: "!",
			regex: /.+/,
		});

		// Run the event and check the result
		const result = textEmit.triggerEvent(eventName, "World")[0];

		// Expect the "!" to be appended
		expect(result).toBe("World!");

		unsubscribe(); // Unsubscribe after the test
	});

	test("should handle multiple subscriptions with different options", () => {
		const eventName = "textChange";

		// Subscribe with prepending
		const { unsubscribe: unsubscribeStart } = textEmit.subscribeToEvent(
			eventName,
			{
				placement: "start",
				appendText: "Start-",
				regex: /.+/,
			},
		);

		// Subscribe with appending
		const { unsubscribe: unsubscribeEnd } = textEmit.subscribeToEvent(
			eventName,
			{
				placement: "end",
				appendText: "-End",
				regex: /.+/,
			},
		);

		// Trigger the event
		const results = textEmit.triggerEvent(eventName, "Hello");

		// Ensure both results are as expected
		expect(results).toEqual(["Start-Hello", "Hello-End"]);

		// Unsubscribe from both events
		unsubscribeStart();
		unsubscribeEnd();

		// Trigger the event again after both unsubscriptions
		const resultsAfterUnsub = textEmit.triggerEvent(eventName, "Hello");

		// Ensure no results after unsubscribing
		expect(resultsAfterUnsub).toEqual([]);
	});

	test("should handle missing appendText gracefully", () => {
		const eventName = "textChange";

		// Subscribe with no appendText (defaults to empty string)
		const { unsubscribe } = textEmit.subscribeToEvent(eventName, {
			placement: "start",
			regex: /.+/,
		});

		// Trigger the event
		const result = textEmit.triggerEvent(eventName, "Hello")[0];

		// Ensure the result is just the original text (no appendText)
		expect(result).toBe("Hello");

		unsubscribe();
	});

	test("should run with regex to match values", () => {
		const eventName = "textChange";

		// Subscribe to an event with a regex that only matches words starting with "H"
		const { unsubscribe } = textEmit.subscribeToEvent(eventName, {
			placement: "start",
			appendText: "Hey ",
			regex: /^H/,
		});

		// Test with a matching value
		const result = textEmit.triggerEvent(eventName, "Hello")[0];
		expect(result).toBe("Hey Hello");

		// Test with a non-matching value (should return undefined)
		const resultNoMatch = textEmit.triggerEvent(eventName, "World")[0];
		expect(resultNoMatch).toBeUndefined();

		unsubscribe();
	});

	// Test case for matching 'ABC-123' and prepending the URL
	test('should prepend URL when regex matches and placement is start', () => {
		const { unsubscribe } = textEmit.subscribeToEvent('myEvent', {
			placement: 'start',
			appendText: 'http://localhost:3000/',
			regex: /ABC-\d+/,
		});

		const result = textEmit.triggerEvent('myEvent', 'ABC-123');
		expect(result[0]).toBe('http://localhost:3000/ABC-123');

		unsubscribe();
	});
});
