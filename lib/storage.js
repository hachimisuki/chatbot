export function saveToStorage(key, value) {
  try {
    if (typeof window !== "undefined") {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
    return false;
  }
}

export function getFromStorage(key) {
  try {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return null;
  }
}

export function removeFromStorage(key) {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
    return false;
  }
}
