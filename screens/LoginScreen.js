import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
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
import { sendLoginCode, loginWithCode } from '../lib/api';
import { getAuthToken } from '../lib/session';

const PRIMARY = '#E6F4EA';
const PRIMARY_DARK = '#2F6B45';
const PRIMARY_ACCENT = '#5E9F72';
const TEXT_MAIN = '#1E2A22';
const TEXT_MUTED = '#6B7D71';
const WHITE = '#FFFFFF';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [statusText, setStatusText] = useState('\u8F93\u5165\u624B\u673A\u53F7\u548C\u9A8C\u8BC1\u7801\u5C31\u80FD\u5F00\u59CB');
  const isPhoneValid = useMemo(() => /^1\d{10}$/.test(phone), [phone]);
  const isCodeValid = useMemo(() => /^\d{4,6}$/.test(code), [code]);
  const canSubmit = isPhoneValid && isCodeValid && !loggingIn;

  useEffect(() => {
    let active = true;

    (async () => {
      const token = await getAuthToken();

      if (!active) {
        return;
      }

      if (token) {
        router.replace('/(tabs)');
        return;
      }

      setCheckingSession(false);
    })();

    return () => {
      active = false;
    };
  }, [router]);

  const handleSendCode = async () => {
    if (!isPhoneValid || sendingCode) {
      return;
    }

    setSendingCode(true);

    try {
      const response = await sendLoginCode(phone);
      const message = response?.message || '\u9A8C\u8BC1\u7801\u53D1\u9001\u6210\u529F';

      setStatusText(`${message}\n\n\u5982\u679C\u5F53\u524D\u540E\u7AEF\u8FD8\u5728\u6D4B\u8BD5\u6A21\u5F0F\uFF0C\u9A8C\u8BC1\u7801\u4F1A\u5199\u5165\u670D\u52A1\u7AEF\u65E5\u5FD7\u3002`);
      Alert.alert('\u5DF2\u53D1\u9001', message);
    } catch (error) {
      const message = error?.message || '\u53D1\u9001\u9A8C\u8BC1\u7801\u5931\u8D25';
      setStatusText(message);
      Alert.alert('\u53D1\u9001\u5931\u8D25', message);
    } finally {
      setSendingCode(false);
    }
  };

  const handleLogin = async () => {
    if (!canSubmit) {
      return;
    }

    setLoggingIn(true);

    try {
      const result = await loginWithCode(phone, code);
      setStatusText('\u767B\u5F55\u6210\u529F\uFF0C\u6B63\u5728\u5E2E\u4F60\u6253\u5F00\u9996\u9875...');
      Alert.alert('\u767B\u5F55\u6210\u529F', `${result?.user?.nickname || '\u65B0\u642D\u5B50'}\uFF0C\u6B22\u8FCE\u56DE\u6765\u3002`);
      router.replace('/(tabs)');
    } catch (error) {
      const message = error?.message || '\u767B\u5F55\u5931\u8D25';
      setStatusText(message);
      Alert.alert('\u767B\u5F55\u5931\u8D25', message);
    } finally {
      setLoggingIn(false);
    }
  };

  if (checkingSession) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={PRIMARY} />
        <View style={styles.loadingWrap}>
          <Text style={styles.emoji}>{'\uD83C\uDF3F'}</Text>
          <Text style={styles.title}>{'\u6B63\u5728\u68C0\u67E5\u767B\u5F55\u72B6\u6001...'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={PRIMARY} />
      <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.heroCard}>
            <Text style={styles.emoji}>{'\uD83C\uDF3F'}</Text>
            <Text style={styles.title}>{'\u642D\u5B50\uFF0C\u8F7B\u8F7B\u677E\u677E\u5C31\u4F4D'}</Text>
            <Text style={styles.subtitle}>{'\u5DF2\u7ECF\u5BF9\u63A5\u540E\u7AEF\u771F\u5B9E\u63A5\u53E3\u4E86\u3002\u53D1\u9001\u9A8C\u8BC1\u7801\u540E\uFF0C\u7528\u9A8C\u8BC1\u7801\u767B\u5F55\u5C31\u80FD\u76F4\u63A5\u8FDB\u9996\u9875\u3002'}</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.headerRow}>
              <Text style={styles.headerTitle}>{'\u767B\u5F55 / \u6CE8\u518C'}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{'\u771F\u5B9E\u63A5\u53E3\u5DF2\u8FDE\u63A5'}</Text>
              </View>
            </View>

            <Text style={styles.label}>{'\u624B\u673A\u53F7'}</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              placeholder={'\u8BF7\u8F93\u5165 11 \u4F4D\u624B\u673A\u53F7'}
              placeholderTextColor={TEXT_MUTED}
              keyboardType="phone-pad"
              maxLength={11}
            />

            <Text style={styles.label}>{'\u9A8C\u8BC1\u7801'}</Text>
            <View style={styles.codeRow}>
              <TextInput
                value={code}
                onChangeText={setCode}
                style={[styles.input, styles.codeInput]}
                placeholder={'\u8BF7\u8F93\u5165\u9A8C\u8BC1\u7801'}
                placeholderTextColor={TEXT_MUTED}
                keyboardType="number-pad"
                maxLength={6}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.codeButton,
                  (!isPhoneValid || sendingCode) && styles.codeButtonDisabled,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleSendCode}
                disabled={!isPhoneValid || sendingCode}>
                <Text style={styles.codeButtonText}>{sendingCode ? '\u53D1\u9001\u4E2D...' : '\u83B7\u53D6\u9A8C\u8BC1\u7801'}</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                !canSubmit && styles.loginButtonDisabled,
                pressed && canSubmit && styles.buttonPressed,
              ]}
              disabled={!canSubmit}>
              <Text style={styles.loginButtonText}>
                {loggingIn ? '\u767B\u5F55\u4E2D...' : canSubmit ? '\u7ACB\u5373\u767B\u5F55 / \u6CE8\u518C' : '\u8BF7\u8F93\u5165\u5B8C\u6574\u4FE1\u606F'}
              </Text>
            </Pressable>

            <Text style={styles.statusText}>{statusText}</Text>
            <Text style={styles.footerHint}>{'\uD83C\uDF40 \u767B\u5F55\u5373\u8868\u793A\u540C\u610F\u5E73\u53F0\u670D\u52A1\u534F\u8BAE\u4E0E\u9690\u79C1\u653F\u7B56'}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: PRIMARY },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 22, paddingVertical: 28, justifyContent: 'center' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  heroCard: { backgroundColor: '#F3FBF5', borderRadius: 32, paddingHorizontal: 24, paddingVertical: 28, marginBottom: 18, shadowColor: '#A8C7B1', shadowOpacity: 0.18, shadowOffset: { width: 0, height: 10 }, shadowRadius: 24, elevation: 6 },
  emoji: { fontSize: 34, marginBottom: 12, textAlign: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: TEXT_MAIN, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 15, lineHeight: 24, color: TEXT_MUTED },
  formCard: { backgroundColor: WHITE, borderRadius: 32, paddingHorizontal: 20, paddingVertical: 24, shadowColor: '#B7D4C0', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 12 }, shadowRadius: 24, elevation: 7 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: TEXT_MAIN },
  badge: { backgroundColor: PRIMARY, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
  badgeText: { fontSize: 12, fontWeight: '700', color: PRIMARY_DARK },
  label: { fontSize: 14, fontWeight: '700', color: TEXT_MAIN, marginBottom: 10, marginTop: 6 },
  input: { backgroundColor: '#F8FCF9', borderRadius: 22, borderWidth: 1, borderColor: '#D4E8D9', paddingHorizontal: 18, paddingVertical: 16, fontSize: 16, color: TEXT_MAIN, marginBottom: 14 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  codeInput: { flex: 1, marginBottom: 0 },
  codeButton: { backgroundColor: PRIMARY, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 16, minWidth: 126, alignItems: 'center', justifyContent: 'center' },
  codeButtonDisabled: { backgroundColor: '#C7DDD0' },
  codeButtonText: { color: PRIMARY_DARK, fontWeight: '800', fontSize: 14 },
  loginButton: { marginTop: 18, backgroundColor: PRIMARY_ACCENT, borderRadius: 24, paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  loginButtonDisabled: { backgroundColor: '#AFCDB8' },
  loginButtonText: { color: WHITE, fontSize: 17, fontWeight: '800' },
  statusText: { marginTop: 16, fontSize: 13, lineHeight: 22, color: TEXT_MUTED },
  footerHint: { marginTop: 18, fontSize: 13, lineHeight: 20, color: TEXT_MUTED, textAlign: 'center' },
  buttonPressed: { opacity: 0.86, transform: [{ scale: 0.99 }] },
});
