import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { getActivityById } from '../../data/mockActivities';

const PRIMARY = '#E6F4EA';
const PRIMARY_SOFT = '#F5FBF7';
const PRIMARY_ACCENT = '#68A17C';
const TEXT_MAIN = '#1E2A22';
const TEXT_MUTED = '#6B7D71';
const WHITE = '#FFFFFF';

export default function ActivityDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const activity = getActivityById(params.id);

  if (!activity) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={PRIMARY} />
        <View style={styles.fallbackWrap}>
          <Text style={styles.fallbackTitle}>{'\u6D3B\u52A8\u4E0D\u5B58\u5728'}</Text>
          <Pressable style={styles.primaryButton} onPress={() => router.back()}>
            <Text style={styles.primaryButtonText}>{'\u8FD4\u56DE\u4E0A\u4E00\u9875'}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={PRIMARY} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>{'\u2039 \u8FD4\u56DE'}</Text>
          </Pressable>
        </View>
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>{activity.emoji}</Text>
          <Text style={styles.heroTitle}>{activity.title}</Text>
          <Text style={styles.heroSubtitle}>{activity.summary}</Text>
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{'\u6D3B\u52A8\u4FE1\u606F'}</Text>
          <Text style={styles.infoLine}>{'\u53D1\u8D77\u4EBA\uFF1A' + activity.host}</Text>
          <Text style={styles.infoLine}>{'\u65F6\u95F4\uFF1A' + activity.time}</Text>
          <Text style={styles.infoLine}>{'\u5730\u70B9\uFF1A' + activity.location}</Text>
          <Text style={styles.infoLine}>{'\u4EBA\u6570\uFF1A' + activity.people}</Text>
          <Text style={styles.infoLine}>{'\u8D39\u7528\uFF1A' + activity.fee}</Text>
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{'\u6D3B\u52A8\u6807\u7B7E'}</Text>
          <View style={styles.tagRow}>
            {activity.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{'\u53C2\u52A0\u63D0\u793A'}</Text>
          <Text style={styles.infoLine}>{'1. \u6309\u7EA6\u5B9A\u65F6\u95F4\u5230\u573A\uFF0C\u4E34\u65F6\u6709\u4E8B\u8BF7\u53CA\u65F6\u8BF4\u660E\u3002'}</Text>
          <Text style={styles.infoLine}>{'2. \u53EF\u5148\u5728\u6D88\u606F\u9875\u6C9F\u901A\u96C6\u5408\u70B9\u548C\u8054\u7CFB\u65B9\u5F0F\u3002'}</Text>
          <Text style={styles.infoLine}>{'3. \u76EE\u524D\u540E\u7AEF\u57FA\u7840\u5730\u5740\uFF1Ahttp://47.102.219.206'}</Text>
        </View>
        <Pressable style={styles.primaryButton} onPress={() => router.push('/(tabs)/chat')}>
          <Text style={styles.primaryButtonText}>{'\u7ACB\u5373\u52A0\u5165\u5E76\u53BB\u804A\u5929'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY },
  content: { padding: 20, paddingBottom: 36 },
  headerRow: { marginBottom: 12 },
  backButton: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  backButtonText: { color: TEXT_MAIN, fontSize: 14, fontWeight: '700' },
  heroCard: { backgroundColor: PRIMARY_SOFT, borderRadius: 30, padding: 24, marginBottom: 18 },
  heroEmoji: { fontSize: 34, marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: TEXT_MAIN, marginBottom: 10 },
  heroSubtitle: { fontSize: 15, lineHeight: 24, color: TEXT_MUTED },
  sectionCard: { backgroundColor: WHITE, borderRadius: 26, padding: 18, marginBottom: 16, shadowColor: '#BCD4C4', shadowOpacity: 0.16, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: TEXT_MAIN, marginBottom: 12 },
  infoLine: { fontSize: 15, lineHeight: 24, color: TEXT_MUTED, marginBottom: 6 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { backgroundColor: PRIMARY, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  tagText: { color: '#2F6B45', fontSize: 13, fontWeight: '700' },
  primaryButton: { backgroundColor: PRIMARY_ACCENT, borderRadius: 22, paddingVertical: 17, alignItems: 'center', marginTop: 8 },
  primaryButtonText: { color: WHITE, fontWeight: '800', fontSize: 16 },
  fallbackWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  fallbackTitle: { fontSize: 24, fontWeight: '800', color: TEXT_MAIN, marginBottom: 18 },
});
