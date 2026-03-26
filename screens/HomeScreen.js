import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { mockActivities } from '../data/mockActivities';

const categories = [
  { id: 1, name: '\u996D\u642D\u5B50', icon: '\uD83C\uDF5A' },
  { id: 2, name: '\u5B66\u4E60', icon: '\uD83D\uDCDA' },
  { id: 3, name: '\u8FD0\u52A8', icon: '\u26BD' },
  { id: 4, name: '\u6E38\u620F', icon: '\uD83C\uDFAE' },
  { id: 5, name: '\u5065\u8EAB', icon: '\uD83D\uDCAA' },
  { id: 6, name: '\u7535\u5F71', icon: '\uD83C\uDFAC' },
  { id: 7, name: '\u65C5\u884C', icon: '\u2708\uFE0F' },
  { id: 8, name: '\u5176\u4ED6', icon: '\uD83D\uDD2E' },
];

export default function HomeScreen() {
  const router = useRouter();
  const openActivity = (id) => router.push({ pathname: '/activity/[id]', params: { id } });

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <Text style={styles.heroTitle}>{'\u4ECA\u5929\u60F3\u548C\u8C01\u4E00\u8D77\u51FA\u53D1\uFF1F'}</Text>
        <Text style={styles.heroSubtitle}>{'\u4ECE\u996D\u642D\u5B50\u5230\u591C\u8DD1\u642D\u5B50\uFF0C\u8F7B\u8F7B\u6ED1\u4E00\u6ED1\u5C31\u80FD\u627E\u5230\u540C\u9891\u7684\u4EBA\u3002'}</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder={'\u641C\u7D22\u642D\u5B50\u6216\u6D3B\u52A8...'} placeholderTextColor="#88958C" />
        <Pressable style={styles.searchButton}><Text style={styles.searchButtonText}>{'\u641C\u7D22'}</Text></Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>{'\u70ED\u95E8\u5206\u7C7B'}</Text>
          <View style={styles.categoryGrid}>{categories.map((cat) => <Pressable key={cat.id} style={styles.categoryItem}><Text style={styles.categoryIcon}>{cat.icon}</Text><Text style={styles.categoryName}>{cat.name}</Text></Pressable>)}</View>
        </View>
        <View style={styles.recommendSection}>
          <Text style={styles.sectionTitle}>{'\u63A8\u8350\u6D3B\u52A8'}</Text>
          {mockActivities.map((item) => (
            <Pressable key={item.id} style={styles.card} onPress={() => openActivity(item.id)}>
              <View style={styles.cardHeader}><View style={styles.cardBadge}><Text style={styles.cardBadgeText}>{item.distance}</Text></View><Text style={styles.cardTime}>{item.time}</Text></View>
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardUser}>{'@' + item.host}</Text>
              <Text style={styles.cardSummary}>{item.summary}</Text>
              <View style={styles.tagContainer}>{item.tags.map((tag) => <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}</View>
              <Pressable style={styles.joinButton} onPress={() => openActivity(item.id)}><Text style={styles.joinButtonText}>{'\u67E5\u770B\u6D3B\u52A8\u8BE6\u60C5'}</Text></Pressable>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7FBF8', paddingHorizontal: 16, paddingTop: 16 }, heroCard: { backgroundColor: '#E6F4EA', borderRadius: 26, paddingHorizontal: 18, paddingVertical: 18, marginBottom: 18 }, heroTitle: { fontSize: 26, fontWeight: '800', color: '#203027', marginBottom: 8 }, heroSubtitle: { fontSize: 14, lineHeight: 22, color: '#607166' }, searchContainer: { flexDirection: 'row', marginBottom: 24 }, searchInput: { flex: 1, backgroundColor: '#FFF', borderRadius: 25, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, borderWidth: 1, borderColor: '#E6F4EA', marginRight: 12 }, searchButton: { backgroundColor: '#E6F4EA', borderRadius: 25, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }, searchButtonText: { color: '#2E7D32', fontSize: 16, fontWeight: '600' }, categorySection: { marginBottom: 24 }, sectionTitle: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 16 }, categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }, categoryItem: { width: '22%', alignItems: 'center', marginBottom: 16, backgroundColor: '#FFFFFF', borderRadius: 18, paddingVertical: 14 }, categoryIcon: { fontSize: 32, marginBottom: 8 }, categoryName: { fontSize: 14, color: '#555' }, recommendSection: { marginBottom: 40 }, card: { backgroundColor: '#FFF', borderRadius: 24, padding: 18, marginBottom: 16, shadowColor: '#A7BFB0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }, cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }, cardBadge: { backgroundColor: '#EFF8F1', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 }, cardBadgeText: { color: '#3F7350', fontSize: 12, fontWeight: '700' }, cardTime: { fontSize: 13, color: '#7D8C83' }, cardEmoji: { fontSize: 28, marginBottom: 8 }, cardTitle: { fontSize: 19, fontWeight: '700', color: '#222', marginBottom: 6 }, cardUser: { fontSize: 14, color: '#5F7267', marginBottom: 8 }, cardSummary: { fontSize: 14, lineHeight: 22, color: '#5C6D63', marginBottom: 12 }, tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }, tag: { backgroundColor: '#E6F4EA', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8, marginBottom: 8 }, tagText: { color: '#2E7D32', fontSize: 12 }, joinButton: { backgroundColor: '#E6F4EA', borderRadius: 20, paddingVertical: 12, alignItems: 'center' }, joinButtonText: { color: '#2E7D32', fontSize: 16, fontWeight: '700' },
});
