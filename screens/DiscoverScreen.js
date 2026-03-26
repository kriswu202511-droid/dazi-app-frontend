import React, { useMemo, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { mockActivities } from '../data/mockActivities';

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
  return <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}><Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text></Pressable>;
}

export default function DiscoverScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState(typeOptions[0]);
  const [selectedDistance, setSelectedDistance] = useState(distanceOptions[1]);
  const [selectedTime, setSelectedTime] = useState(timeOptions[0]);
  const [keyword, setKeyword] = useState('');

  const filteredActivities = useMemo(() => mockActivities.filter((item) => {
    const typeMatch = selectedType === typeOptions[0] || item.tags.includes(selectedType);
    const keywordMatch = !keyword || item.title.includes(keyword) || item.location.includes(keyword);
    return typeMatch && keywordMatch;
  }), [keyword, selectedType]);

  const openActivity = (id) => router.push({ pathname: '/activity/[id]', params: { id } });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={PRIMARY} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>{'\uD83D\uDD0D'}</Text>
          <Text style={styles.heroTitle}>{'\u53D1\u73B0\u540C\u9891\u7684\u642D\u5B50'}</Text>
          <Text style={styles.heroSubtitle}>{'\u628A\u7C7B\u578B\u3001\u8DDD\u79BB\u548C\u65F6\u95F4\u8FC7\u6EE4\u597D\uFF0C\u5C31\u80FD\u5FEB\u901F\u6311\u5230\u4ECA\u5929\u60F3\u4E00\u8D77\u51FA\u53D1\u7684\u4EBA\u3002'}</Text>
        </View>
        <View style={styles.filterCard}>
          <TextInput value={keyword} onChangeText={setKeyword} style={styles.searchInput} placeholder={'\u641C\u7D22\u6D3B\u52A8\u6807\u9898\u6216\u5730\u70B9'} placeholderTextColor={TEXT_MUTED} />
          <Text style={styles.sectionLabel}>{'\u7C7B\u578B'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>{typeOptions.map((item) => <FilterChip key={item} label={item} active={selectedType === item} onPress={() => setSelectedType(item)} />)}</ScrollView>
          <Text style={styles.sectionLabel}>{'\u8DDD\u79BB'}</Text>
          <View style={styles.inlineRow}>{distanceOptions.map((item) => <FilterChip key={item} label={item} active={selectedDistance === item} onPress={() => setSelectedDistance(item)} />)}</View>
          <Text style={styles.sectionLabel}>{'\u65F6\u95F4'}</Text>
          <View style={styles.inlineRow}>{timeOptions.map((item) => <FilterChip key={item} label={item} active={selectedTime === item} onPress={() => setSelectedTime(item)} />)}</View>
        </View>
        <View style={styles.listSection}>
          <Text style={styles.listTitle}>{'\u6D3B\u52A8\u5361\u7247\u5217\u8868'}</Text>
          {filteredActivities.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTopRow}><View style={styles.typeBadge}><Text style={styles.typeBadgeText}>{item.tags[0]}</Text></View><Text style={styles.cardDistance}>{item.distance}</Text></View>
              <Text style={styles.cardTitle}>{item.emoji + ' ' + item.title}</Text>
              <Text style={styles.cardMeta}>{item.location}</Text>
              <View style={styles.metaGrid}><Text style={styles.metaPill}>{'\u23F0 ' + item.time}</Text><Text style={styles.metaPill}>{'\uD83D\uDC65 ' + item.people}</Text></View>
              <View style={styles.tagRow}>{item.tags.map((tag) => <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}</View>
              <Pressable style={styles.primaryButton} onPress={() => openActivity(item.id)}><Text style={styles.primaryButtonText}>{'\u7ACB\u5373\u770B\u770B\u8BE6\u60C5'}</Text></Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY }, content: { padding: 20, paddingBottom: 36 }, heroCard: { backgroundColor: PRIMARY_SOFT, borderRadius: 30, padding: 24, marginBottom: 18 }, heroEmoji: { fontSize: 30, marginBottom: 12 }, heroTitle: { fontSize: 28, fontWeight: '800', color: TEXT_MAIN, marginBottom: 10 }, heroSubtitle: { fontSize: 15, lineHeight: 24, color: TEXT_MUTED }, filterCard: { backgroundColor: WHITE, borderRadius: 28, padding: 18, marginBottom: 20, shadowColor: '#BCD4C4', shadowOpacity: 0.16, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 4 }, searchInput: { backgroundColor: PRIMARY_SOFT, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: '#D6E9DB', fontSize: 15, color: TEXT_MAIN, marginBottom: 16 }, sectionLabel: { fontSize: 14, fontWeight: '700', color: TEXT_MAIN, marginBottom: 10 }, chipRow: { paddingBottom: 10, gap: 10 }, inlineRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }, chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: PRIMARY_SOFT }, chipActive: { backgroundColor: PRIMARY_ACCENT }, chipText: { color: PRIMARY_DARK, fontSize: 14, fontWeight: '700' }, chipTextActive: { color: WHITE }, listSection: { gap: 14 }, listTitle: { fontSize: 20, fontWeight: '800', color: TEXT_MAIN, marginBottom: 2 }, card: { backgroundColor: WHITE, borderRadius: 28, padding: 18, shadowColor: '#BCD4C4', shadowOpacity: 0.16, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 4 }, cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, typeBadge: { backgroundColor: PRIMARY, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 }, typeBadgeText: { color: PRIMARY_DARK, fontSize: 13, fontWeight: '700' }, cardDistance: { color: TEXT_MUTED, fontSize: 13, fontWeight: '600' }, cardTitle: { fontSize: 21, lineHeight: 28, fontWeight: '800', color: TEXT_MAIN, marginBottom: 8 }, cardMeta: { color: TEXT_MUTED, fontSize: 14, marginBottom: 12 }, metaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 }, metaPill: { backgroundColor: PRIMARY_SOFT, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, color: PRIMARY_DARK, fontWeight: '700' }, tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }, tag: { backgroundColor: '#F8FBF9', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 }, tagText: { color: TEXT_MUTED, fontSize: 12, fontWeight: '600' }, primaryButton: { backgroundColor: PRIMARY_ACCENT, borderRadius: 20, alignItems: 'center', paddingVertical: 15 }, primaryButtonText: { color: WHITE, fontSize: 15, fontWeight: '800' },
});
