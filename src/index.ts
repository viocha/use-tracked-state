import {useCallback, useRef, useState} from 'react';

// Type for state updater: can be a value or a function returning a value
type Updater<T> = T | ((prev: T) => T);

// Accessor interface: provides value and setter
interface Accessor<T> {
	val: T;
	set: (val: Updater<T>) => void;
}

/**
 * useTrackedState is a custom React hook for tracking value with two accessors:
 * one for the current state and one for the latest state.
 * @param initialValue The initial value for the state.
 * @returns An array containing two accessors. Note: The latest state is a reference to
 * 					the most recent value, it's not reactive.
 *  - The first accessor provides the current state and a setter based on it.
 *  - The second accessor provides the latest state and a setter based on it.
 *
 */
export function useTrackedState<T>(initialValue: T): [Accessor<T>, Accessor<T>] {
	const [snap, setSnap] = useState<T>(initialValue); // React state for snapshot
	const latestRef = useRef<T>(initialValue); // Ref to always hold latest value

	// Setter for state, uses current snap as base, updates latestRef too
	const setCur = useCallback((updater: Updater<T>) => {
		const fn = typeof updater === 'function' ?
				updater as (prev: T) => T :
				() => updater;
		const next = fn(snap);
		setSnap(next);
		latestRef.current = next;
	}, []);

	// Setter for latestRef and state, always uses latestRef.current as base
	const setLatest = useCallback((updater: Updater<T>) => {
		const fn = typeof updater === 'function' ?
				updater as (prev: T) => T :
				() => updater;
		const next = fn(latestRef.current);
		setSnap(next);
		latestRef.current = next;
	}, []);

	const cur = createAccessor(() => snap, setCur); // Accessor for current state
	const latest = createAccessor(() => latestRef.current, setLatest); // Accessor for latest value

	return [cur, latest];


	// Helper to create accessor object with getter/setter
	function createAccessor(getter: () => T, setter: (val: Updater<T>) => void): Accessor<T> {
		return {
			get val() {
				return getter();
			},
			set val(val: T) {
				setter(val);
			},
			set: setter,
		};
	}
}

