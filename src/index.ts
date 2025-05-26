export type EventOptions = {
  placement?: "start" | "end";
  appendText?: string;
  regex: RegExp;
};

/**
 * A simple, flexible, event-driven text modifier. 
 * This package allows you to prepend or append text to 
 * an existing string based on a specified event. 
 * You can define custom options such as regular expressions 
 * to match specific text, and set the placement of the text (start or end).
  ```js
  import { TextModifier } from 'text-modifier';

  const textModifier = new TextModifier();

  // Prepend "Hello " to any value that matches the regex
  const { unsubscribe } = textModifier.subscribeToEvent('textChange', {
    placement: 'start',
    appendText: 'Hello ',
    regex: /.+/,  // Matches any non-empty string
  });

  // Trigger the event and modify the text
  const result = textModifier.triggerEvent('textChange', 'World');
  console.log(result[0]);  // Output: "Hello World"
  ```
 */
export class textModifier {
  private eventMap: Record<string, Map<string, EventOptions>> = {};
  private defaultOptions: EventOptions = {
    placement: "end",
    regex: /./, // Default regex for matching all text
  };

  /**
   * Subscribes to a specific event and returns an unsubscribe function.
   *
   * @param eventName - Name of the event to subscribe to.
   * @param option - Partial options object to customize the event behavior.
   * @returns An object with an `unsubscribe` method to detach the event listener.
   */
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

  /**
   * Modifies the input text based on the given options.
   *
   * @param options - Options specifying how to modify the text.
   * @param value - The input text to be modified.
   * @returns Modified text or undefined if no modification is needed.
   */
  private modifyText(options: EventOptions, value: string): string | undefined {
    if (value.match(options.regex)) {
      const appendText = options.appendText ?? ""; // Handle missing appendText gracefully
      if (options.placement === "start") {
        return appendText + value;
      }
      if (options.placement === "end") {
        return value + appendText;
      }
    }
    return value;
  }

  /**
   * Trigger event handler for a specific event name and returns the results.
   *
   * @param eventName - Name of the event to trigger.
   * @param value - The input text that will be passed to event handlers.
   * @returns Array of modified texts or undefined if no modification is needed.
   */
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
