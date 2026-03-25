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

const seedMessages = [
  {
    id: 1,
    mine: false,
    content: '\u4F60\u597D\u5440\uFF0C\u4ECA\u665A\u5403\u706B\u9505\u7684\u5C0F\u961F\u8FD8\u5DEE\u4E00\u4E2A\u4EBA\uFF0C\u4F60\u8981\u6765\u5417\uFF1F',
    time: '18:32',
  },
  {
    id: 2,
    mine: true,
    content: '\u53EF\u4EE5\u5440\uFF01\u6211\u8FD9\u8FB9 19 \u70B9\u5DE6\u53F3\u80FD\u5230\uFF0C\u5730\u70B9\u662F\u5728\u5546\u573A\u95E8\u53E3\u5417\uFF1F',
    time: '18:34',
  },
  {
    id: 3,
    mine: false,
    content: '\u5BF9\uFF0C\u6211\u53D1\u4F60\u4E00\u4E2A\u5B9A\u4F4D\uFF0C\u6211\u4EEC\u5230\u4E86\u53EF\u4EE5\u76F4\u63A5\u8FDB\u5E97\u3002',
    time: '18:35',
  },
];

function MessageBubble({ mine, content, time }) {
  return (
    <View style={[styles.messageRow, mine && styles.messageRowMine]}>
      <View style={[styles.messageBubble, mine ? styles.messageBubbleMine : styles.messageBubbleOther]}>
        <Text style={[styles.messageText, mine && styles.messageTextMine]}>{content}</Text>
        <Text style={[styles.messageTime, mine && styles.messageTimeMine]}>{time}</Text>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const [draft, setDraft] = useState('');
  const [messages] = useState(seedMessages);
  const canSend = useMemo(() => draft.trim().length > 0, [draft]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={PRIMARY} />
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{'\u706B\u9505\u642D\u5B50\u5C0F\u7FA4'}</Text>
          <Text style={styles.headerSubtitle}>{'\u4ECA\u665A 19:30 \u51C6\u65F6\u96C6\u5408'}</Text>
        </View>
        <View style={styles.onlineBadge}>
          <Text style={styles.onlineBadgeText}>{'\u5728\u7EBF'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.messagesContent} showsVerticalScrollIndicator={false}>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            {
              '\u804A\u5929\u91CC\u53EF\u4EE5\u5FEB\u901F\u53D1\u9001\u4F4D\u7F6E\u548C\u56FE\u7247\uFF0C\u65B9\u4FBF\u642D\u5B50\u4EEC\u66F4\u5FEB\u78B0\u5934\u3002'
            }
          </Text>
        </View>

        {messages.map((item) => (
          <MessageBubble key={item.id} mine={item.mine} content={item.content} time={item.time} />
        ))}
      </ScrollView>

      <View style={styles.composerWrap}>
        <View style={styles.actionRow}>
          <Pressable style={styles.iconButton}>
            <Text style={styles.iconButtonText}>{'\uD83D\uDCCD'}</Text>
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Text style={styles.iconButtonText}>{'\uD83D\uDDBC\uFE0F'}</Text>
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            style={styles.input}
            placeholder={'\u8F93\u5165\u6D88\u606F...'}
            placeholderTextColor={TEXT_MUTED}
          />
          <Pressable style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}>
            <Text style={styles.sendButtonText}>{'\u53D1\u9001'}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY },
  header: {
    margin: 18,
    marginBottom: 10,
    backgroundColor: WHITE,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#BCD4C4',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  headerTitle: { color: TEXT_MAIN, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  headerSubtitle: { color: TEXT_MUTED, fontSize: 13, fontWeight: '600' },
  onlineBadge: {
    backgroundColor: PRIMARY_SOFT,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  onlineBadgeText: { color: PRIMARY_DARK, fontSize: 13, fontWeight: '800' },
  messagesContent: { paddingHorizontal: 18, paddingBottom: 16 },
  tipCard: {
    backgroundColor: PRIMARY_SOFT,
    borderRadius: 20,
    padding: 14,
    marginBottom: 14,
  },
  tipText: { color: TEXT_MUTED, fontSize: 13, lineHeight: 20 },
  messageRow: { marginBottom: 12, flexDirection: 'row' },
  messageRowMine: { justifyContent: 'flex-end' },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  messageBubbleOther: {
    backgroundColor: WHITE,
    borderTopLeftRadius: 8,
  },
  messageBubbleMine: {
    backgroundColor: PRIMARY_ACCENT,
    borderTopRightRadius: 8,
  },
  messageText: { color: TEXT_MAIN, fontSize: 15, lineHeight: 22 },
  messageTextMine: { color: WHITE },
  messageTime: { color: TEXT_MUTED, fontSize: 11, marginTop: 8, fontWeight: '600' },
  messageTimeMine: { color: '#E8F6EC', textAlign: 'right' },
  composerWrap: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 26,
    padding: 10,
    gap: 10,
    shadowColor: '#BCD4C4',
    shadowOpacity: 0.16,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: PRIMARY_SOFT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: { fontSize: 18 },
  input: {
    flex: 1,
    backgroundColor: PRIMARY_SOFT,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: TEXT_MAIN,
    fontSize: 15,
  },
  sendButton: {
    backgroundColor: PRIMARY_ACCENT,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sendButtonDisabled: { backgroundColor: '#B9CFBF' },
  sendButtonText: { color: WHITE, fontWeight: '800', fontSize: 14 },
});
