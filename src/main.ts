import * as errors from "./errors";

interface GetOptions {
	/**
	 * If `true`, will destroy the entry after calling this function (even if an error occured).
	 */
	destroy?: boolean;
	/**
	 * If `true`, will destroy the entry only if an error occured.
	 */
	destroyOnError?: boolean;
}

/**
 * Get an element from the local storage.
 * @param key Entry's name.
 * @param options Getter's options.
 * @returns
 * - `Object` - Entry's content if it exists and its content as been parsed.
 * - `undefined` - If the entry doesn't exists.
 * @throw
 * - `MissingKey`      - If `key` is not provided.
 * - `CannotParseJson` - If the entry's value cannot be parsed as JSON.
 * @example
 * // { test: { something: true } }
 * get("test"); // { something: true }
 * @example
 * // { test: { something: true } }
 * get("something"); // undefined
 * @example
 * // { test: 1 }
 * get("test"); // 1
 */
function get(key: string, options?: GetOptions): Object | undefined | never {
	if (!key) throw new errors.MissingKey();

	const content = localStorage.getItem(key);

	if (options?.destroy) localStorage.removeItem(key);

	try {
		return content ? JSON.parse(content) : undefined;
	} catch {
		if (options?.destroyOnError) localStorage.removeItem(key);
		throw new errors.CannotParseJson(content);
	}
}

/**
 * Set an element to the local storage.
 * @param key Entry's name.
 * @param value Content to set in the localstorage.
 * @throw
 * - `MissingKey`          - If `key` is not provided.
 * - `MissingContent`      - If `value` is not provided.
 * - `CannotStringifyJson` - If `value` cannot be strigified as JSON.
 * @example
 * // { test: { something: true } }
 * set("test", true);
 * // { test: true }
 * @example
 * // { test: { something: true } }
 * set("something", { hi: "everyone" });
 * // { test: { something: true }, hi: "everyone" }
 */
function set(key: string, value: Object): void | never {
	if (!key) throw new errors.MissingKey();
	if (!value) throw new errors.MissingContent();

	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {
		throw new errors.CannotStringifyJson(value);
	}
}

/**
 * Check if an entry exists in the local storage.
 * @param key Entry's name.
 * @returns `boolean` - `true` if the entry exists, `false` otherwise.
 * @throw `MissingKey` - If `key` is not provided.
 * @example
 * // { test: "hi" }
 * exists("test"); // true
 * @example
 * // { test: "hi" }
 * exists("something"); // false
 */
function exists(key: string): boolean | never {
	if (!key) throw new errors.MissingKey();

	return localStorage.getItem(key) !== null;
}

/**
 * Remove an entry from the local storage.
 * @param key Entry's name.
 * @returns `boolean` - `true` if the entry has been removed by the function's call, `false` otherwise.
 * @throw `MissingKey` - If `key` is not provided.
 * @example
 * // { test: "hi", something: "everyone" }
 * exists("test"); // true
 * // { something: "everyone" }
 * @example
 * // { test: "hi" }
 * exists("something"); // false
 * // { test: "hi" }
 */
function destroy(key: string): boolean | never {
	if (!key) throw new errors.MissingKey();

	const existingEntry = exists(key);
	localStorage.removeItem(key);

	return existingEntry;
}

/**
 * Clear all entries from the local storage.
 * @returns `boolean` - `true` if the entries have been removed by the function's call, `false` otherwise.
 * @example
 * // { test: "hi", something: "everyone" }
 * clear(); // true
 * // {  }
 * @example
 * // {  }
 * clear(); // false
 * // {  }
 */
function clear(): boolean {
	const existingEntries = localStorage.length > 0;

	localStorage.clear();
	return existingEntries;
}

export { get, set, exists, destroy, clear, GetOptions, errors };
