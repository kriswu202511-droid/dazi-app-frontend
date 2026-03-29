import { clearAuthSession, getAuthToken, saveCachedUser, saveAuthSession } from './session';

const BASE_URLS = ['https://47.102.219.206'];

const EMOJI_BY_TYPE = {
  '\u996D\u642D\u5B50': '\ud83c\udf5a',
  '\u7F8E\u98DF': '\ud83c\udf5c',
  '\u5B66\u4E60': '\ud83d\udcda',
  '\u8FD0\u52A8': '\u26bd',
  '\u5065\u8EAB': '\ud83d\udcaa',
  '\u6E38\u620F': '\ud83c\udfae',
  '\u7535\u5F71': '\ud83c\udfac',
  '\u65C5\u884C': '\u2708\ufe0f',
  '\u5C55\u89C8': '\ud83d\uddbc\ufe0f',
  '\u6237\u5916': '\u26f0\ufe0f',
};

const CITY_COORDINATES = [
  { keyword: '\u5317\u4EAC', lat: 39.9042, lng: 116.4074 },
  { keyword: '\u4E0A\u6D77', lat: 31.2304, lng: 121.4737 },
  { keyword: '\u5E7F\u5DDE', lat: 23.1291, lng: 113.2644 },
  { keyword: '\u6DF1\u5733', lat: 22.5431, lng: 114.0579 },
  { keyword: '\u6210\u90FD', lat: 30.5728, lng: 104.0668 },
  { keyword: '\u676D\u5DDE', lat: 30.2741, lng: 120.1551 },
  { keyword: '\u5357\u660C', lat: 28.6820, lng: 115.8579 },
  { keyword: '\u6B66\u6C49', lat: 30.5928, lng: 114.3055 },
  { keyword: '\u897F\u5B89', lat: 34.3416, lng: 108.9398 },
  { keyword: '\u91CD\u5E86', lat: 29.5630, lng: 106.5516 },
];

function normalizeQuery(query = {}) {
  return Object.entries(query).reduce((result, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      result[key] = value;
    }
    return result;
  }, {});
}

function buildUrl(baseUrl, path, query) {
  const url = new URL(path, baseUrl);
  const normalizedQuery = normalizeQuery(query);

  Object.entries(normalizedQuery).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function createError(message, status, payload = null) {
  const error = new Error(message);
  error.status = status;
  error.payload = payload;
  return error;
}

async function requestJson(path, options = {}) {
  const {
    method = 'GET',
    body,
    query,
    token,
  } = options;

  let lastError = null;

  for (const baseUrl of BASE_URLS) {
    try {
      const response = await fetch(buildUrl(baseUrl, path, query), {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const payload = await parseResponse(response);

      if (!response.ok) {
        throw createError(
          payload?.message || payload?.error || '\u8BF7\u6C42\u5931\u8D25',
          response.status,
          payload,
        );
      }

      return payload;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('\u7F51\u7EDC\u8FDE\u63A5\u5931\u8D25');
}

async function requestWithFallback(candidates, options = {}) {
  let lastError = null;

  for (const candidate of candidates) {
    try {
      return await requestJson(candidate.path, {
        ...options,
        method: candidate.method || options.method,
        query: candidate.query || options.query,
        body: candidate.body || options.body,
        token: candidate.token || options.token,
      });
    } catch (error) {
      lastError = error;
      const shouldContinue = [404, 405].includes(error.status);

      if (!shouldContinue) {
        throw error;
      }
    }
  }

  throw lastError || new Error('\u8BF7\u6C42\u5931\u8D25');
}

function toDateString(value) {
  if (!value) {
    return '\u65F6\u95F4\u5F85\u5B9A';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  return `${month}\u6708${day}\u65E5 ${hours}:${minutes}`;
}

function toDistanceLabel(distanceKm) {
  const value = Number(distanceKm);

  if (!Number.isFinite(value) || value <= 0) {
    return '\u9644\u8FD1';
  }

  if (value < 1) {
    return `${Math.round(value * 1000)}m`;
  }

  return `${value.toFixed(1)}km`;
}

function toTagNames(tags, item) {
  if (Array.isArray(tags) && tags.length > 0) {
    return tags
      .map((tag) => {
        if (typeof tag === 'string') {
          return tag;
        }

        if (tag?.name) {
          return tag.name;
        }

        return null;
      })
      .filter(Boolean);
  }

  if (typeof item.activity_type === 'string' && item.activity_type.trim()) {
    return [item.activity_type];
  }

  return [];
}

function pickEmoji(item, tags) {
  const candidates = [item.activity_type, ...tags];

  for (const candidate of candidates) {
    if (EMOJI_BY_TYPE[candidate]) {
      return EMOJI_BY_TYPE[candidate];
    }
  }

  return '\ud83c\udf3f';
}

export function normalizeActivity(item, index = 0) {
  const tags = toTagNames(item.tags, item);
  const currentParticipants = Number(item.current_participants || 1);
  const maxParticipants = Number(item.max_participants || 1);
  const host = item.creator_nickname || item.nickname || '\u65B0\u642D\u5B50';
  const location = item.location_name || item.location || '\u5730\u70B9\u5F85\u5B9A';
  const summary = item.description || '\u4E00\u573A\u8F7B\u677E\u7684\u7EC4\u961F\u9080\u7EA6\u6B63\u5728\u7B49\u4F60\u52A0\u5165\u3002';
  const activityId = item.id || item.activity_id || index + 1;
  const coinDeposit = Number(item.coin_deposit || 0);

  return {
    id: String(activityId),
    emoji: pickEmoji(item, tags),
    title: item.title || '\u4E00\u8D77\u51FA\u53D1',
    host,
    distance: toDistanceLabel(item.distance_km),
    time: toDateString(item.start_time),
    location,
    people: `${currentParticipants}/${maxParticipants}`,
    fee: coinDeposit > 0 ? `${coinDeposit} \u642D\u5E01\u62BC\u91D1` : '\u514D\u62BC\u91D1',
    tags: tags.length > 0 ? tags : ['\u65B0\u6D3B\u52A8'],
    summary,
    raw: item,
  };
}

function normalizeActivityList(payload) {
  const list =
    payload?.data?.activities ||
    payload?.data?.recommendations ||
    payload?.data?.list ||
    [];

  if (!Array.isArray(list)) {
    return [];
  }

  return list.map((item, index) => normalizeActivity(item, index));
}

function normalizeUser(payload) {
  return payload?.data?.user || payload?.user || null;
}

function getTimeKeywordFilter(selectedTime) {
  switch (selectedTime) {
    case '\u4ECA\u5929':
      return 'today';
    case '\u660E\u5929':
      return 'tomorrow';
    case '\u672C\u5468':
      return 'week';
    default:
      return null;
  }
}

function matchesTimeFilter(activity, selectedTime) {
  const timeFilter = getTimeKeywordFilter(selectedTime);

  if (!timeFilter || !activity.raw?.start_time) {
    return true;
  }

  const start = new Date(activity.raw.start_time);

  if (Number.isNaN(start.getTime())) {
    return true;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday);
  startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
  const startOfNextDay = new Date(startOfTomorrow);
  startOfNextDay.setDate(startOfNextDay.getDate() + 1);
  const startOfNextWeek = new Date(startOfToday);
  startOfNextWeek.setDate(startOfToday.getDate() + 7);

  if (timeFilter === 'today') {
    return start >= startOfToday && start < startOfTomorrow;
  }

  if (timeFilter === 'tomorrow') {
    return start >= startOfTomorrow && start < startOfNextDay;
  }

  if (timeFilter === 'week') {
    return start >= startOfToday && start < startOfNextWeek;
  }

  return true;
}

function guessCoordinates(locationName) {
  const normalized = String(locationName || '').trim();

  for (const city of CITY_COORDINATES) {
    if (normalized.includes(city.keyword)) {
      return { lat: city.lat, lng: city.lng };
    }
  }

  return { lat: 39.9042, lng: 116.4074 };
}

export async function sendLoginCode(phone) {
  return requestWithFallback([
    { path: '/api/v1/auth/send-code', method: 'POST' },
    { path: '/api/v1/auth/send-verification', method: 'POST' },
  ], {
    body: { phone },
  });
}

export async function loginWithCode(phone, code) {
  const payload = await requestWithFallback([
    { path: '/api/v1/auth/login', method: 'POST' },
    { path: '/api/v1/auth/verify-login', method: 'POST' },
  ], {
    body: { phone, code },
  });

  const user = normalizeUser(payload);
  const token = payload?.data?.token || payload?.token;

  if (!token) {
    throw new Error('\u767B\u5F55\u6210\u529F\u4F46\u672A\u8FD4\u56DE Token');
  }

  await saveAuthSession(token, user);

  return { token, user };
}

export async function fetchProfile() {
  const token = await getAuthToken();

  if (!token) {
    throw createError('\u8BF7\u5148\u767B\u5F55', 401);
  }

  try {
    const payload = await requestWithFallback([
      { path: '/api/v1/auth/profile', method: 'GET' },
      { path: '/api/v1/auth/me', method: 'GET' },
    ], { token });

    const user = normalizeUser(payload);

    if (user) {
      await saveCachedUser(user);
    }

    return user;
  } catch (error) {
    if (error.status === 401) {
      await clearAuthSession();
    }

    throw error;
  }
}

export async function fetchActivities(filters = {}) {
  const token = await getAuthToken();

  if (!token) {
    throw createError('\u8BF7\u5148\u767B\u5F55', 401);
  }

  const query = {
    keyword: filters.keyword,
    activity_type:
      filters.type && filters.type !== '\u5168\u90E8' ? filters.type : undefined,
    max_distance: filters.maxDistance,
    limit: filters.limit || 20,
  };

  try {
    const payload = await requestWithFallback([
      { path: '/api/v1/match/search', method: 'GET', query },
      { path: '/api/v1/match/activities', method: 'GET', query: { limit: query.limit } },
    ], { token });

    let activities = normalizeActivityList(payload);

    if (filters.selectedTime) {
      activities = activities.filter((item) => matchesTimeFilter(item, filters.selectedTime));
    }

    return activities;
  } catch (error) {
    if (error.status === 401) {
      await clearAuthSession();
    }

    throw error;
  }
}

export async function publishActivity(formData) {
  const token = await getAuthToken();

  if (!token) {
    throw createError('\u8BF7\u5148\u767B\u5F55', 401);
  }

  const coordinates = guessCoordinates(formData.location);
  const payloadBody = {
    activity_type: formData.selectedType,
    title: formData.title,
    description: formData.remark || `${formData.selectedType}\u7EC4\u961F\u9080\u8BF7`,
    start_time: formData.dateTime,
    location_name: formData.location,
    location_lat: coordinates.lat,
    location_lng: coordinates.lng,
    max_participants: Number(formData.limit || 4),
    coin_deposit: 0,
    tags: [formData.selectedType].filter(Boolean),
  };

  try {
    return await requestWithFallback([
      { path: '/api/v1/match/activities', method: 'POST' },
      { path: '/api/v1/match/activity', method: 'POST' },
    ], {
      token,
      body: payloadBody,
    });
  } catch (error) {
    if (error.status === 401) {
      await clearAuthSession();
    }

    throw error;
  }
}

export async function logout() {
  await clearAuthSession();
}
