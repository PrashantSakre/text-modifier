# Text Modifier

A simple, flexible, event-driven text modifier. This package allows you to prepend or append text to an existing string based on a specified event. You can define custom options such as regular expressions to match specific text, and set the placement of the text (start or end).

## Features

- Prepend or append text to a given value based on event triggers.
- Regex support to conditionally modify text based on a pattern.
- Flexible API for subscribing and triggering text modifications.

## Installation

You can install the package via `npm` or `yarn`:

```bash
npm install text-modifier
```
or
```bash
yarn add text-modifier
```
jsDeliver:
```html
<script src="https://cdn.jsdelivr.net/npm/text-modifier@latest/dist/index.min.js"></script>
```
## Usage
### 1. Importing the package

First, import the package into your project.

```js
import { TextModifier } from 'text-modifier';
```
### 2. Creating an instance

You can create an instance of TextModifier to start using it.

```js
const textModifier = new TextModifier();
```

### 3. Subscribing to events

Use the subscribeToEvent method to subscribe to an event and define the options for how you want to modify the text.

```js
// Example: Prepend "Hello " to any value that matches the regex
const { unsubscribe } = textModifier.subscribeToEvent('textChange', {
  placement: 'start',
  appendText: 'Hello ',
  regex: /.+/,  // Matches any non-empty string
});
```

### 4. Triggering the event

You can trigger the event and modify the text by calling triggerEvent.

```js
// Example: Trigger the event and modify the text
const result = textModifier.triggerEvent('textChange', 'World');
console.log(result[0]);  // Output: "Hello World"
```

### 5. Unsubscribing from events

When you're done, you can unsubscribe from the event using the unsubscribe function.

```js
unsubscribe();
```

## Full Example:

```js
import { TextModifier } from 'text-modifier';

// Create an instance
const textModifier = new TextModifier();

// Subscribe to an event
const { unsubscribe } = textModifier.subscribeToEvent('textChange', {
  placement: 'start',
  appendText: 'Hello ',
  regex: /.+/,
});

// Trigger the event
const result = textModifier.triggerEvent('textChange', 'World');
console.log(result[0]);  // Output: "Hello World"

// Unsubscribe when done
unsubscribe();
```

## API Reference
### `TextModifier`

> subscribeToEvent(eventName: string, options: Partial<TextModifierOptions>)

  -  Subscribes to an event and specifies the options for modifying the text.
  -  Parameters:
      -  `eventName`: The name of the event to subscribe to (string).
      -  `options`: An object containing the following optional properties:
          -  `placement` (string): Can be `'start'` or `'end'`. Defines where to add the appendText. Default is `'end'`.
          -  `appendText` (string): The text to append or prepend.
          -  `regex` (RegExp): A regular expression to match the text for modification.
  -  Returns: An object with an unsubscribe function to remove the subscription.

> triggerEvent(eventName: string, value: string): (string | undefined)[]

  -  Triggers the event and modifies the text based on the subscribed options.
    Parameters:
      -  `eventName`: The name of the event to trigger.
      -  `value`: The string to modify.
  -  Returns: An array of strings or undefined for each modification made by the subscribed handlers.

### `unsubscribe()`

  -  Removes the subscription for the event.

## Example Scenarios

### 1. Appending Text

To append a string like "http://localhost:8000/" to the value:

```js
const { unsubscribe } = textModifier.subscribeToEvent('link', {
  placement: 'end',
  appendText: 'http://localhost:8000/',
  regex: /^ABC-\d{4}$/,
});

const result = textModifier.triggerEvent('link', 'ABC-1234');
console.log(result[0]);  // Output: "http://localhost:8000/ABC-1234"
unsubscribe();
```

### 2. Prepending Text

To prepend a string like "Hello " to the value:

```js
const { unsubscribe } = textModifier.subscribeToEvent('greet', {
  placement: 'start',
  appendText: 'Hello ',
  regex: /.+/,
});

const result = textModifier.triggerEvent('greet', 'World');
console.log(result[0]);  // Output: "Hello World"
unsubscribe();
```

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/PrashantSakre/text-modifier/blob/main/LICENSE "License") file for details.
