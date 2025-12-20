/**
 * Debounces a function to be executed after a specified wait time.
 * Ensures type‑safety and supports both sync and async functions.
 */
export interface IDebouncedFunction<TArgs extends unknown[] = unknown[]> {
  (...args: TArgs): void;
  isDebouncing: boolean;
  isRunning: boolean;
  cancel: () => void;
}

export function debounce<TArgs extends unknown[] = unknown[]>(
    func: (...args: TArgs) => void | Promise<void>,
    time: number,
): IDebouncedFunction<TArgs> {
    let timeout: number | undefined;

    const debouncedFunction = ((...args: TArgs) => {
        if (debouncedFunction.isDebouncing) {
            clearTimeout(timeout);
        }
        debouncedFunction.isDebouncing = true;
        debouncedFunction.isRunning = false;

        timeout = window.setTimeout(() => {
            debouncedFunction.isRunning = true;
            // Normalize to a promise to handle both sync and async funcs without returning a promise
            void Promise.resolve(func(...args)).finally(() => {
                debouncedFunction.isRunning = false;
                debouncedFunction.isDebouncing = false;
            });
        }, time);
    }) as IDebouncedFunction<TArgs>;

    debouncedFunction.isDebouncing = false;
    debouncedFunction.isRunning = false;
    debouncedFunction.cancel = () => {
        if (debouncedFunction.isDebouncing) {
            clearTimeout(timeout);
            debouncedFunction.isDebouncing = false;
            debouncedFunction.isRunning = false;
        }
    };

    return debouncedFunction;
}
