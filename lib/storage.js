export function getFromStorage(key) {
  try {
    return localStorage.getItem(key) || "";
  } catch (e) {
    console.error("Error reading from localStorage:", e);
    return "";
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.error("Error saving to localStorage:", e);
    return false;
  }
}
