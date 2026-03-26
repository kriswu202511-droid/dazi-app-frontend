import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchActivities } from '../lib/api';
import { clearAuthSession } from '../lib/session';

const PRIMARY = '#E6F4EA';
const PRIMARY_SOFT = '#F5FBF7';
const PRIMARY_DARK = '#2F6B45';
const PRIMARY_ACCENT = '#68A17C';
const TEXT_MAIN = '#1E2A22';
const TEXT_MUTED = '#6B7D71';
const WHITE = '#FFFFFF';

const typeOptions = ['\u5168\u90E8', '\u996D\u642D\u5B50', '\u8FD0\u52A8', '\u5B66\u4E60', '\u6E38\u620F'];
const distanceOptions = ['1km', '3km', '5km', '10km'];
const timeOptions = ['\u4ECA\u5929', '\u660E\u5929', '\u672C\u5468', '\u968F\u65F6'];

function FilterChip({ label, active, onPress }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function DiscoverScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedType, setSelectedType] = useState(params.type || typeOptions[0]);
  const [selectedDistance, setSelectedDistance] = useState(distanceOptions[1]);
  const [selectedTime, setSelectedTime] = useState(timeOptions[0]);
  const [keyword, setKeyword] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  const filters = useMemo(() => ({
    keyword,
    type: selectedType,
    maxDistance: selectedDistance.replace('km', ''),
    selectedTime,
    limit: 20,
  }), [keyword, selectedDistance, selectedTime, selectedType]);

  const loadActivities = useCallback(async () => {
    setLoading(true);

    try {
      const result = await fetchActivities(filters);
      setActivities(result);
      setErrorText('');
    } catch (error) {
      if (error?.status === 401) {
        await clearAuthSession();
        router.replace('/login');
        return;
      }

      setErrorText(error?.message || '\u53D1\u73B0\u9875\u52A0\u8F7D\u5931\u8D25');
    } finally {
      setLoading(false);
    }
  }, [filters, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadActivities();
    }, keyword ? 350 : 0);

    return () => clearTimeout(timer);
  }, [keyword, loadActivities, selectedDistance, selectedTime, selectedType]);

  const openActivity = (activity) => {
    router.push({
      pathname: '/activity/[id]',
      params: {
        id: activity.id,
        activity: JSON.stringify(activity),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={PRIMARY} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>{'\uD83D\uDD0D'}</Text>
          <Text style={styles.heroTitle}>{'\u53D1\u73B0\u540C\u9891\u7684\u642D\u5B50'}</Text>
          <Text style={styles.heroSubtitle}>{'\u53D1\u73B0\u9875\u5DF2\u7ECF\u5BF9\u63A5\u540E\u7AEF\u7B5B\u9009\u63A5\u53E3\uFF0C\u6362\u7C7B\u578B\u3001\u8DDD\u79BB\u548C\u65F6\u95F4\u5C31\u4F1A\u7ACB\u523B\u5237\u65B0\u3002'}</Text>
        </View>

        <View style={styles.filterCard}>
          <TextInput
            value={keyword}
            onChangeText={setKeyword}
            style={styles.searchInput}
            placeholder={'\u641C\u7D22\u6D3B\u52A8\u6807\u9898\u6216\u5730\u70B9'}
            placeholderTextColor={TEXT_MUTED}
          />

          <Text style={styles.sectionLabel}>{'\u7C7B\u578B'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {typeOptions.map((item) => (
              <FilterChip key={item} label={item} active={selectedType === item} onPress={() => setSelectedType(item)} />
            ))}
          </ScrollView>

          <Text style={styles.sectionLabel}>{'\u8DDD\u79BB'}</Text>
          <View style={styles.inlineRow}>
            {distanceOptions.map((item) => (
              <FilterChip key={item} label={item} active={selectedDistance === item} onPress={() => setSelectedDistance(item)} />
            ))}
          </View>

          <Text style={styles.sectionLabel}>{'\u65F6\u95F4'}</Text>
          <View style={styles.inlineRow}>
            {timeOptions.map((item) => (
              <FilterChip key={item} label={item} active={selectedTime === item} onPress={() => setSelectedTime(item)} />
            ))}
          </View>
        </View>

        <View style={styles.listSection}>
          <Text style={styles.listTitle}>{'\u6D3B\u52A8\u5361\u7247\u5217\u8868'}</Text>

          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={PRIMARY_DARK} />
              <Text style={styles.loadingText}>{'\u6B63\u5728\u540C\u6B65\u540E\u7AEF\u6D3B\u52A8...'}</Text>
            </View>
          ) : null}

          {!loading && errorText ? (
            <Pressable style={styles.errorCard} onPress={loadActivities}>
              <Text style={styles.errorTitle}>{'\u67E5\u8BE2\u5931\u8D25'}</Text>
              <Text style={styles.errorText}>{errorText}</Text>
              <Text style={styles.errorAction}>{'\u70B9\u6211\u91CD\u8BD5'}</Text>
            </Pressable>
          ) : null}

          {!loading && !errorText && activities.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>{'\uD83E\uDD8B'}</Text>
              <Text style={styles.emptyTitle}>{'\u6682\u65F6\u6CA1\u6709\u7B26\u5408\u6761\u4EF6\u7684\u6D3B\u52A8'}</Text>
              <Text style={styles.emptySubtitle}>{'\u53EF\u4EE5\u8BD5\u8BD5\u653E\u5BBD\u8DDD\u79BB\u6216\u6362\u4E00\u4E2A\u5173\u952E\u8BCD\u3002'}</Text>
            </View>
          ) : null}

          {!loading &&
            !errorText &&
            activities.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{item.tags[0]}</Text>
                  </View>
                  <Text style={styles.cardDistance}>{item.distance}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.emoji + ' ' + item.title}</Text>
                <Text style={styles.cardMeta}>{item.location}</Text>
                <View style={styles.metaGrid}>
                  <Text style={styles.metaPill}>{'\u23F0 ' + item.time}</Text>
                  <Text style={styles.metaPill}>{'\uD83D\uDC65 ' + item.people}</Text>
                </View>
                <View style={styles.tagRow}>
                  {item.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
                <Pressable style={styles.primaryButton} onPress={() => openActivity(item)}>
                  <Text style={styles.primaryButtonText}>{'\u7ACB\u5373\u770B\u770B\u8BE6\u60C5'}</Text>
                </Pressable>
              </View>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY },
  content: { padding: 20, paddingBottom: 36 },
  heroCard: { backgroundColor: PRIMARY_SOFT, borderRadius: 30, padding: 24, marginBottom: 18 },
  heroEmoji: { fontSize: 30, marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: TEXT_MAIN, marginBottom: 10 },
  heroSubtitle: { fontSize: 15, lineHeight: 24, color: TEXT_MUTED },
  filterCard: { backgroundColor: WHITE, borderRadius: 28, padding: 18, marginBottom: 20, shadowColor: '#BCD4C4', shadowOpacity: 0.16, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 4 },
  searchInput: { backgroundColor: PRIMARY_SOFT, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#D6E9DB', fontSize: 15, color: TEXT_MAIN, marginBottom: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: TEXT_MAIN, marginBottom: 10 },
  chipRow: { paddingBottom: 10, gap: 10 },
  inlineRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: PRIMARY_SOFT },
  chipActive: { backgroundColor: PRIMARY_ACCENT },
  chipText: { color: PRIMARY_DARK, fontSize: 14, fontWeight: '700' },
  chipTextActive: { color: WHITE },
  listSection: { gap: 14 },
  listTitle: { fontSize: 20, fontWeight: '800', color: TEXT_MAIN, marginBottom: 2 },
  loadingCard: { backgroundColor: WHITE, borderRadius: 24, padding: 24, alignItems: 'center' },
  loadingText: { marginTop: 12, color: TEXT_MUTED, fontWeight: '600' },
  errorCard: { backgroundColor: '#FFF4F4', borderRadius: 24, padding: 18 },
  errorTitle: { fontSize: 17, fontWeight: '700', color: '#B03A3A', marginBottom: 8 },
  errorText: { color: '#8F5C5C', lineHeight: 22 },
  errorAction: { marginTop: 10, color: '#B03A3A', fontWeight: '700' },
  emptyCard: { backgroundColor: WHITE, borderRadius: 24, padding: 24, alignItems: 'center' },
  emptyEmoji: { fontSize: 34, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: TEXT_MAIN, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, lineHeight: 22, color: TEXT_MUTED, textAlign: 'center' },
  card: { backgroundColor: WHITE, borderRadius: 28, padding: 18, shadowColor: '#BCD4C4', shadowOpacity: 0.16, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 4 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  typeBadge: { backgroundColor: PRIMARY, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  typeBadgeText: { color: PRIMARY_DARK, fontSize: 13, fontWeight: '700' },
  cardDistance: { color: TEXT_MUTED, fontSize: 13, fontWeight: '600' },
  cardTitle: { fontSize: 21, lineHeight: 28, fontWeight: '800', color: TEXT_MAIN, marginBottom: 8 },
  cardMeta: { color: TEXT_MUTED, fontSize: 14, marginBottom: 12 },
  metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  metaPill: { backgroundColor: PRIMARY_SOFT, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, color: PRIMARY_DARK, fontWeight: '700' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tag: { backgroundColor: '#F8FBF9', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  tagText: { color: TEXT_MUTED, fontSize: 12, fontWeight: '600' },
  primaryButton: { backgroundColor: PRIMARY_ACCENT, borderRadius: 20, alignItems: 'center', paddingVertical: 15 },
  primaryButtonText: { color: WHITE, fontSize: 15, fontWeight: '800' },
});
