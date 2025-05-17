# useTrackedState Hook

A custom React hook for managing state with two synchronized accessors: one for the current React state (snapshot) and one for the latest value. 
## Installation

```bash
npm install use-tracked-state
```

## Usage

```tsx
import {useTrackedState} from 'use-tracked-state';

function MyComponent() {
	const count = useTrackedState(0);

	const incrementWithSnapshot = () => { // +1
		count.set(v=> v + 1); 
		count.val++; 
	};
	const incrementWithLatest = () => {  // +2
		count.setLatest(v=> v + 1); 
		count.latest++; 
	};

	return (
			<div>
				<p>State: {count.val}</p>
				<button onClick={incrementWithSnapshot}>incrementWithSnapshot</button>
				<button onClick={incrementWithLatest}>incrementWithLatest</button>
			</div>
	);
}
```

## License

MIT
