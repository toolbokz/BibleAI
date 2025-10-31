// src/hooks/index.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { Keyboard } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook to track keyboard visibility
export const useKeyboard = () => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener('keyboardWillShow', (e) => {
            setKeyboardVisible(true);
            setKeyboardHeight(e.endCoordinates.height);
        });

        const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
            setKeyboardVisible(false);
            setKeyboardHeight(0);
        });

        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, []);

    return { isKeyboardVisible, keyboardHeight };
};

// Hook to check network connectivity
export const useNetworkStatus = () => {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsConnected(state.isConnected);
            setIsInternetReachable(state.isInternetReachable);
        });

        return () => unsubscribe();
    }, []);

    return { isConnected, isInternetReachable };
};

// Hook for debouncing values
export const useDebounce = <T,>(value: T, delay: number): T => {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Hook for throttling function calls
export const useThrottle = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number
): T => {
    const lastRan = useRef(Date.now());

    return useCallback(
        ((...args) => {
            if (Date.now() - lastRan.current >= delay) {
                callback(...args);
                lastRan.current = Date.now();
            }
        }) as T,
        [callback, delay]
    );
};

// Hook for local state persistence
export const usePersistentState = <T,>(
    key: string,
    initialValue: T
): [T, (value: T) => void] => {
    const [state, setState] = useState<T>(initialValue);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadState = async () => {
            try {
                const stored = await AsyncStorage.getItem(key);
                if (stored) {
                    setState(JSON.parse(stored));
                }
            } catch (error) {
                console.error('Load State Error:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadState();
    }, [key]);

    const setValue = useCallback(
        (value: T) => {
            setState(value);
            AsyncStorage.setItem(key, JSON.stringify(value)).catch((error) =>
                console.error('Save State Error:', error)
            );
        },
        [key]
    );

    return [state, setValue];
};

// Hook for async data fetching
export const useAsync = <T,>(
    asyncFunction: () => Promise<T>,
    immediate = true
) => {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>(
        'idle'
    );
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const execute = useCallback(async () => {
        setStatus('pending');
        setData(null);
        setError(null);

        try {
            const response = await asyncFunction();
            setData(response);
            setStatus('success');
        } catch (error) {
            setError(error as Error);
            setStatus('error');
        }
    }, [asyncFunction]);

    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);

    return { execute, status, data, error };
};

// Hook for component mount/unmount tracking
export const useIsMounted = () => {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    return useCallback(() => isMounted.current, []);
};

// Hook for previous value
export const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
};

// Hook for interval
export const useInterval = (callback: () => void, delay: number | null) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) return;

        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
    }, [delay]);
};

// Hook for timeout
export const useTimeout = (callback: () => void, delay: number | null) => {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) return;

        const id = setTimeout(() => savedCallback.current(), delay);
        return () => clearTimeout(id);
    }, [delay]);
};

// Hook for toggle
export const useToggle = (initialValue = false): [boolean, () => void] => {
    const [value, setValue] = useState(initialValue);
    const toggle = useCallback(() => setValue((v) => !v), []);
    return [value, toggle];
};