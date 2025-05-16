# useTrackedState Hook

A custom React hook for managing state with two synchronized accessors: one for the current React state (snapshot) and one for the latest value (updated synchronously via a ref). Useful for scenarios where you need both immediate updates and React's rendering cycle state.

## Installation

```bash
npm install use-tracked-state
```

## Usage

Import and use the `useTrackedState` hook in your React component:

```tsx
import {useTrackedState} from 'use-tracked-state';

function MyComponent() {
	const [current, latest] = useTrackedState(0);

	const handleClick = () => {
		latest.set((prev) => prev + 1); // Updates latest immediately
		latest.val++; // Supports direct mutation
		console.log(latest.val); // Reflects the latest value
		console.log(current.val); // Reflects the React state (may lag until render)
	};

	return (
			<div>
				<p>State: {current.val}</p>
				<button onClick={handleClick}>Increment</button>
			</div>
	);
}
```

## API

### `useTrackedState<T>(initialValue: T): [Accessor<T>, Accessor<T>]`

- **Parameters**:
  - `initialValue`: The initial state value.
- **Returns**:
  - A tuple of two `Accessor<T>` objects:
    - `current`: Tracks the React state (updated during render cycles).
    - `latest`: Tracks the latest value (updated immediately via a ref).

### `Accessor<T>`

An object with the following properties:

- `val`: Getter for the current or latest value.
- `set`: Setter that accepts a new value or an updater function (`T | ((prev: T) => T)`).

## Notes

- Use `current` for rendering or when React's state management is required.
- Use `latest` for updates based on latest values or when you need immediate access to the latest value.

## License

MIT
