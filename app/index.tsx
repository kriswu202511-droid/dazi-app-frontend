import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuthToken } from '../lib/session';

const PRIMARY = '#E6F4EA';
const TEXT_MAIN = '#1E2A22';
const TEXT_MUTED = '#6B7D71';

export default function IndexPage() {
  const router = useRouter();
  const [message, setMessage] = useState('\u6B63\u5728\u68C0\u67E5\u767B\u5F55\u72B6\u6001...');

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const token = await getAuthToken();

        if (!active) {
          return;
        }

        setMessage(token ? '\u6B63\u5728\u56DE\u5230\u4F60\u7684\u9996\u9875...' : '\u6B63\u5728\u524D\u5F80\u767B\u5F55\u9875...');
        router.replace(token ? '/(tabs)' : '/login');
      } catch {
        if (!active) {
          return;
        }

        router.replace('/login');
      }
    })();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={PRIMARY} />
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#2F6B45" />
        <Text style={styles.title}>{'\u642D\u5B50 App'}</Text>
        <Text style={styles.subtitle}>{message}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: '800',
    color: TEXT_MAIN,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    color: TEXT_MUTED,
  },
});
