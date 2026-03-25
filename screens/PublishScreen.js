import React, { useMemo, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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
  const [selectedType, setSelectedType] = useState('\u7F8E\u98DF');
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('2026-03-28 19:30');
  const [location, setLocation] = useState('');
  const [limit, setLimit] = useState('4');
  const [remark, setRemark] = useState('');

  const canPublish = useMemo(() => {
    return title.trim() && dateTime.trim() && location.trim() && limit.trim();
  }, [dateTime, limit, location, title]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={PRIMARY} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={styles.heroEmoji}>{'\uD83D\uDCCC'}</Text>
          <Text style={styles.heroTitle}>{'\u53D1\u5E03\u4F60\u7684\u7EC4\u961F\u9080\u8BF7'}</Text>
          <Text style={styles.heroSubtitle}>
            {
              '\u628A\u7C7B\u578B\u3001\u65F6\u95F4\u548C\u5730\u70B9\u5199\u6E05\u695A\uFF0C\u5408\u62CD\u7684\u642D\u5B50\u5F88\u5FEB\u5C31\u4F1A\u627E\u5230\u4F60\u3002'
            }
          </Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>{'\u7EC4\u961F\u7C7B\u578B'}</Text>
          <View style={styles.chipWrap}>
            {typeOptions.map((item) => (
              <ChoiceChip
                key={item}
                label={item}
                active={selectedType === item}
                onPress={() => setSelectedType(item)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>{'\u6807\u9898'}</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder={'\u4F8B\u5982\uFF1A\u5468\u4E94\u665A\u4E00\u8D77\u5403\u70E4\u8089'}
            placeholderTextColor={TEXT_MUTED}
          />

          <Text style={styles.sectionLabel}>{'\u65F6\u95F4'}</Text>
          <TextInput
            value={dateTime}
            onChangeText={setDateTime}
            style={styles.input}
            placeholder={'YYYY-MM-DD HH:mm'}
            placeholderTextColor={TEXT_MUTED}
          />

          <Text style={styles.sectionLabel}>{'\u5730\u70B9'}</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            placeholder={'\u8BF7\u8F93\u5165\u805A\u5408\u5730\u70B9'}
            placeholderTextColor={TEXT_MUTED}
          />

          <Text style={styles.sectionLabel}>{'\u4EBA\u6570\u4E0A\u9650'}</Text>
          <TextInput
            value={limit}
            onChangeText={setLimit}
            style={styles.input}
            placeholder={'\u8BF7\u8F93\u5165\u4EBA\u6570'}
            placeholderTextColor={TEXT_MUTED}
            keyboardType="number-pad"
          />

          <Text style={styles.sectionLabel}>{'\u8865\u5145\u8BF4\u660E'}</Text>
          <TextInput
            value={remark}
            onChangeText={setRemark}
            style={[styles.input, styles.textarea]}
            placeholder={'\u6BD4\u5982\uFF1A\u60F3\u627E\u597D\u804A\u5929\u3001\u5B88\u65F6\u3001\u4E0D\u9E3D\u4EBA\u7684\u642D\u5B50'}
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
          </View>

          <Pressable style={[styles.publishButton, !canPublish && styles.publishButtonDisabled]}>
            <Text style={styles.publishButtonText}>
              {canPublish ? '\u53D1\u5E03\u7EC4\u961F' : '\u518D\u8865\u5145\u4E00\u70B9\u4FE1\u606F'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY },
  content: { padding: 20, paddingBottom: 36 },
  heroCard: {
    backgroundColor: PRIMARY_SOFT,
    borderRadius: 30,
    padding: 24,
    marginBottom: 18,
  },
  heroEmoji: { fontSize: 30, marginBottom: 12 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: TEXT_MAIN, marginBottom: 10 },
  heroSubtitle: { fontSize: 15, lineHeight: 24, color: TEXT_MUTED },
  formCard: {
    backgroundColor: WHITE,
    borderRadius: 28,
    padding: 20,
    shadowColor: '#BCD4C4',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: TEXT_MAIN, marginBottom: 10, marginTop: 4 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  choiceChip: {
    backgroundColor: PRIMARY_SOFT,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  choiceChipActive: { backgroundColor: PRIMARY_ACCENT },
  choiceChipText: { color: PRIMARY_DARK, fontWeight: '700', fontSize: 14 },
  choiceChipTextActive: { color: WHITE },
  input: {
    backgroundColor: PRIMARY_SOFT,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D6E9DB',
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    color: TEXT_MAIN,
    marginBottom: 14,
  },
  textarea: { minHeight: 110 },
  previewCard: {
    backgroundColor: '#F8FBF9',
    borderRadius: 22,
    padding: 16,
    marginTop: 6,
    marginBottom: 18,
  },
  previewTitle: { color: TEXT_MAIN, fontSize: 15, fontWeight: '800', marginBottom: 10 },
  previewLine: { color: TEXT_MUTED, fontSize: 14, lineHeight: 22, marginBottom: 4 },
  publishButton: {
    backgroundColor: PRIMARY_ACCENT,
    borderRadius: 22,
    paddingVertical: 17,
    alignItems: 'center',
  },
  publishButtonDisabled: { backgroundColor: '#B9CFBF' },
  publishButtonText: { color: WHITE, fontWeight: '800', fontSize: 16 },
});
