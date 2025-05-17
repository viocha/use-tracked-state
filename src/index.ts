import {useCallback, useRef, useState} from 'react';

// Type for state updater: can be a value or a function returning a value
type Updater<T> = T | ((prev: T) => T);

interface TrackedState<T> {
	// The current value of the state
	val: T;

	// Set the state with a value or a function which accepts the snap value
	set(val: Updater<T>): void;

	// The latest value of the state
	latest: T;

	// Set the latest value of the state with a value or a function which accepts the latest value
	setLatest(val: Updater<T>): void;
}

export function useTrackedState<T>(initialValue: T): TrackedState<T> {
	const [value, setValue] = useState<T>(initialValue); // React state for snapshot
	const latestRef = useRef<T>(initialValue); // Ref to always hold latest value

	const setSnap = useCallback((updater: Updater<T>) => {
		const fn = typeof updater === 'function' ?
				updater as (v: T) => T :
				() => updater;
		const next = fn(value);
		setValue(next);
		latestRef.current = next;
	}, []);

	const setLatest = useCallback((updater: Updater<T>) => {
		const fn = typeof updater === 'function' ?
				updater as (v: T) => T :
				() => updater;
		const next = fn(latestRef.current);
		setValue(next);
		latestRef.current = next;
	}, []);

	return {
		get val() {
			return value;
		},
		set val(val: T) {
			setSnap(val);
		},
		set(val: Updater<T>) {
			setSnap(val);
		},
		get latest() {
			return latestRef.current;
		},
		set latest(val: T) {
			setLatest(val);
		},
		setLatest(val: Updater<T>) {
			setLatest(val);
		},
	};
}

