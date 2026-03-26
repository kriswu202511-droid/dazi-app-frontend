import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { getAuthToken } from '../../lib/session';

const ACTIVE = '#2F6B45';
const INACTIVE = '#8AA095';
const BAR_BG = '#FAFDFC';

export default function TabLayout() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const token = await getAuthToken();

      if (!active) {
        return;
      }

      if (!token) {
        router.replace('/login');
        return;
      }

      setChecking(false);
    })();

    return () => {
      active = false;
    };
  }, [router]);

  if (checking) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={ACTIVE} />
        <Text style={styles.loadingText}>{'\u6B63\u5728\u6253\u5F00\u642D\u5B50\u9996\u9875...'}</Text>
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: { height: 74, paddingTop: 8, paddingBottom: 12, backgroundColor: BAR_BG, borderTopWidth: 0 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      }}>
      <Tabs.Screen name="index" options={{ title: '\u642D\u5B50', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} /> }} />
      <Tabs.Screen name="discover" options={{ title: '\u793E\u533A', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'compass' : 'compass-outline'} size={22} color={color} /> }} />
      <Tabs.Screen name="publish" options={{ title: '+', tabBarIcon: ({ focused }) => <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={28} color={ACTIVE} />, tabBarLabelStyle: { fontSize: 16, fontWeight: '800', marginTop: -4 } }} />
      <Tabs.Screen name="chat" options={{ title: '\u6D88\u606F', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'chatbubble' : 'chatbubble-outline'} size={22} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: '\u6211\u7684', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} /> }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F7FBF8',
  },
  loadingText: {
    marginTop: 12,
    color: '#607166',
    fontSize: 14,
    fontWeight: '600',
  },
});
