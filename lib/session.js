import AsyncStorage from '@react-native-async-storage/async-storage';

export const TOKEN_KEY = 'dazi_app_token';
export const USER_KEY = 'dazi_app_user';

export async function getAuthToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function saveAuthSession(token, user = null) {
  const tasks = [AsyncStorage.setItem(TOKEN_KEY, token)];

  if (user) {
    tasks.push(AsyncStorage.setItem(USER_KEY, JSON.stringify(user)));
  }

  await Promise.all(tasks);
}

export async function getCachedUser() {
  const raw = await AsyncStorage.getItem(USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveCachedUser(user) {
  if (!user) {
    await AsyncStorage.removeItem(USER_KEY);
    return;
  }

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearAuthSession() {
  await Promise.all([
    AsyncStorage.removeItem(TOKEN_KEY),
    AsyncStorage.removeItem(USER_KEY),
  ]);
}
