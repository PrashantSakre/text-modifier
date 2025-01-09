export type EventOptions = {
	placement?: "start" | "end";
	appendText?: string;
	regex: RegExp;
};

export class textHandler {
	private eventMap: Record<string, Map<string, EventOptions>> = {};
	private defaultOptions: EventOptions = {
		placement: "end",
		regex: /./, // Default regex for matching all text
	};

	subscribeToEvent(eventName: string, option: Partial<EventOptions>) {
		const options: EventOptions = { ...this.defaultOptions, ...option };

		if (!(eventName in this.eventMap)) {
			this.eventMap[eventName] = new Map();
		}

		// Use stringification of options to ensure uniqueness
		const optionsKey = JSON.stringify(options);
		const unsubscribe = () => {
			this.eventMap[eventName].delete(optionsKey);
		};

		this.eventMap[eventName].set(optionsKey, options);

		return { unsubscribe };
	}

	modifyText(options: EventOptions, value: string): string | undefined {
		if (value.match(options.regex)) {
			const appendText = options.appendText ?? ""; // Handle missing appendText gracefully
			if (options.placement === "start") {
				return appendText + value;
			}
			if (options.placement === "end") {
				return value + appendText;
			}
		}
		return undefined;
	}

	triggerEvent(eventName: string, value: string): (string | undefined)[] {
		const res: (string | undefined)[] = [];
		const optionsMap = this.eventMap[eventName];

		if (optionsMap) {
			for (const [optionsKey, options] of optionsMap) {
				res.push(this.modifyText(options, value));
			}
		}

		return res;
	}
}
