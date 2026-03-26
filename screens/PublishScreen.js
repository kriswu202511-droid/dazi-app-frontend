import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { publishActivity } from '../lib/api';
import { clearAuthSession } from '../lib/session';

const PRIMARY = '#E6F4EA';
const PRIMARY_SOFT = '#F5FBF7';
const PRIMARY_DARK = '#2F6B45';
const PRIMARY_ACCENT = '#68A17C';
const TEXT_MAIN = '#1E2A22';
const TEXT_MUTED = '#6B7D71';
const WHITE = '#FFFFFF';

const typeOptions = [
  '\u7F8E\u98DF',
  '\u8FD0\u52A8',
  '\u5B66\u4E60',
  '\u7535\u5F71',
  '\u65C5\u884C',
  '\u5C55\u89C8',
];

function ChoiceChip({ label, active, onPress }) {
  return (
    <Pressable style={[styles.choiceChip, active && styles.choiceChipActive]} onPress={onPress}>
      <Text style={[styles.choiceChipText, active && styles.choiceChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function PublishScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('\u7F8E\u98DF');
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('2026-03-28 19:30');
  const [location, setLocation] = useState('');
  const [limit, setLimit] = useState('4');
  const [remark, setRemark] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canPublish = useMemo(() => {
    return title.trim() && dateTime.trim() && location.trim() && limit.trim();
  }, [dateTime, limit, location, title]);

  const handlePublish = async () => {
    if (!canPublish || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await publishActivity({
        selectedType,
        title: title.trim(),
        dateTime: dateTime.trim(),
        location: location.trim(),
        limit: limit.trim(),
        remark: remark.trim(),
      });

      Alert.alert('\u53D1\u5E03\u6210\u529F', '\u65B0\u6D3B\u52A8\u5DF2\u7ECF\u63D0\u4EA4\u5230\u540E\u7AEF\uFF0C\u73B0\u5728\u56DE\u9996\u9875\u770B\u770B\u5427\u3002');
      setTitle('');
      setLocation('');
      setRemark('');
      setLimit('4');
      router.replace('/(tabs)');
    } catch (error) {
      if (error?.status === 401) {
        await clearAuthSession();
        router.replace('/login');
        return;
      }

      Alert.alert('\u53D1\u5E03\u5931\u8D25', error?.message || '\u521B\u5EFA\u6D3B\u52A8\u5931\u8D25');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={PRIMARY} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>{'\uD83D\uDCCC'}</Text>
          <Text style={styles.heroTitle}>{'\u53D1\u5E03\u4F60\u7684\u7EC4\u961F\u9080\u8BF7'}</Text>
          <Text style={styles.heroSubtitle}>{'\u53D1\u5E03\u9875\u73B0\u5728\u4F1A\u76F4\u63A5\u5411\u540E\u7AEF\u63D0\u4EA4\u6D3B\u52A8\u3002\u5730\u70B9\u5750\u6807\u6682\u65F6\u4F1A\u6309\u8F93\u5165\u7684\u57CE\u5E02\u5173\u952E\u8BCD\u81EA\u52A8\u5339\u914D\u9ED8\u8BA4\u503C\u3002'}</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>{'\u7EC4\u961F\u7C7B\u578B'}</Text>
          <View style={styles.chipWrap}>
            {typeOptions.map((item) => (
              <ChoiceChip key={item} label={item} active={selectedType === item} onPress={() => setSelectedType(item)} />
            ))}
          </View>

          <Text style={styles.sectionLabel}>{'\u6807\u9898'}</Text>
          <TextInput value={title} onChangeText={setTitle} style={styles.input} placeholder={'\u4F8B\u5982\uFF1A\u5468\u4E94\u665A\u4E00\u8D77\u5403\u70E4\u8089'} placeholderTextColor={TEXT_MUTED} />

          <Text style={styles.sectionLabel}>{'\u65F6\u95F4'}</Text>
          <TextInput value={dateTime} onChangeText={setDateTime} style={styles.input} placeholder={'YYYY-MM-DD HH:mm'} placeholderTextColor={TEXT_MUTED} />

          <Text style={styles.sectionLabel}>{'\u5730\u70B9'}</Text>
          <TextInput value={location} onChangeText={setLocation} style={styles.input} placeholder={'\u8BF7\u8F93\u5165\u805A\u5408\u5730\u70B9'} placeholderTextColor={TEXT_MUTED} />

          <Text style={styles.sectionLabel}>{'\u4EBA\u6570\u4E0A\u9650'}</Text>
          <TextInput value={limit} onChangeText={setLimit} style={styles.input} placeholder={'\u8BF7\u8F93\u5165\u4EBA\u6570'} placeholderTextColor={TEXT_MUTED} keyboardType="number-pad" />

          <Text style={styles.sectionLabel}>{'\u8865\u5145\u8BF4\u660E'}</Text>
          <TextInput
            value={remark}
            onChangeText={setRemark}
            style={[styles.input, styles.textarea]}
            placeholder={'\u6BD4\u5982\uFF1A\u60F3\u627E\u5B88\u65F6\u3001\u4E0D\u9E3D\u4EBA\u7684\u642D\u5B50'}
            placeholderTextColor={TEXT_MUTED}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>{'\u53D1\u5E03\u9884\u89C8'}</Text>
            <Text style={styles.previewLine}>{selectedType + '  |  ' + (title || '\u7B49\u4F60\u8D77\u4E2A\u597D\u6807\u9898')}</Text>
            <Text style={styles.previewLine}>{'\uD83D\uDCC5 ' + dateTime}</Text>
            <Text style={styles.previewLine}>{'\uD83D\uDCCD ' + (location || '\u5C1A\u672A\u9009\u62E9\u5730\u70B9')}</Text>
            <Text style={styles.previewLine}>{'\uD83D\uDC65 \u6700\u591A ' + limit + ' \u4EBA'}</Text>
            <Text style={styles.previewNote}>{'\u26A0\uFE0F \u73B0\u7248\u9ED8\u8BA4\u4E0D\u6263\u62BC\u91D1\uFF0C\u65B9\u4FBF\u5148\u5B8C\u6210\u524D\u540E\u7AEF\u8054\u8C03\u3002'}</Text>
          </View>

          <Pressable style={[styles.publishButton, (!canPublish || submitting) && styles.publishButtonDisabled]} onPress={handlePublish} disabled={!canPublish || submitting}>
            <Text style={styles.publishButtonText}>{submitting ? '\u63D0\u4EA4\u4E2D...' : canPublish ? '\u53D1\u5E03\u7EC4\u961F' : '\u518D\u8865\u5145\u4E00\u70B9\u4FE1\u606F'}</Text>
          </Pressable>
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
  formCard: { backgroundColor: WHITE, borderRadius: 28, padding: 20, shadowColor: '#BCD4C4', shadowOpacity: 0.16, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20, elevation: 4 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: TEXT_MAIN, marginBottom: 10, marginTop: 4 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  choiceChip: { backgroundColor: PRIMARY_SOFT, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  choiceChipActive: { backgroundColor: PRIMARY_ACCENT },
  choiceChipText: { color: PRIMARY_DARK, fontWeight: '700', fontSize: 14 },
  choiceChipTextActive: { color: WHITE },
  input: { backgroundColor: PRIMARY_SOFT, borderRadius: 20, borderWidth: 1, borderColor: '#D6E9DB', paddingHorizontal: 16, paddingVertical: 15, fontSize: 15, color: TEXT_MAIN, marginBottom: 14 },
  textarea: { minHeight: 110 },
  previewCard: { backgroundColor: '#F8FBF9', borderRadius: 22, padding: 16, marginTop: 6, marginBottom: 18 },
  previewTitle: { color: TEXT_MAIN, fontSize: 15, fontWeight: '800', marginBottom: 10 },
  previewLine: { color: TEXT_MUTED, fontSize: 14, lineHeight: 22, marginBottom: 4 },
  previewNote: { marginTop: 8, color: '#6E7D74', fontSize: 12, lineHeight: 18 },
  publishButton: { backgroundColor: PRIMARY_ACCENT, borderRadius: 22, paddingVertical: 17, alignItems: 'center' },
  publishButtonDisabled: { backgroundColor: '#B9CFBF' },
  publishButtonText: { color: WHITE, fontWeight: '800', fontSize: 16 },
});
