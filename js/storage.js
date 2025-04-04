/**
 * storage.js - Utility module for local storage operations
 * Provides functions to save and retrieve data from localStorage with error handling
 */

/**
 * Save data to localStorage
 * @param {string} key - The key to store the data under
 * @param {any} data - The data to store (will be JSON stringified)
 * @returns {boolean} - True if successful, false if failed
 */
export function saveToLocalStorage(key, data) {
    try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
        return true;
    } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
        return false;
    }
}

/**
 * Retrieve data from localStorage
 * @param {string} key - The key to retrieve data from
 * @param {any} defaultValue - Default value to return if key doesn't exist or there's an error
 * @returns {any} - The retrieved data or defaultValue if not found/error
 */
export function getFromLocalStorage(key, defaultValue = null) {
    try {
        const serializedData = localStorage.getItem(key);
        if (serializedData === null) {
            return defaultValue;
        }
        return JSON.parse(serializedData);
    } catch (error) {
        console.error(`Error retrieving from localStorage (${key}):`, error);
        return defaultValue;
    }
}

/**
 * Remove data from localStorage
 * @param {string} key - The key to remove
 * @returns {boolean} - True if successful, false if failed
 */
export function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(`Error removing from localStorage (${key}):`, error);
        return false;
    }
}

/**
 * Clear all data from localStorage
 * @returns {boolean} - True if successful, false if failed
 */
export function clearLocalStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

/**
 * Check if a key exists in localStorage
 * @param {string} key - The key to check
 * @returns {boolean} - True if key exists, false otherwise
 */
export function existsInLocalStorage(key) {
    return localStorage.getItem(key) !== null;
}

/**
 * Get the size of localStorage in bytes
 * @returns {number} - Size in bytes
 */
export function getLocalStorageSize() {
    let totalSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        totalSize += (key.length + value.length) * 2; // UTF-16 uses 2 bytes per character
    }
    return totalSize;
}
