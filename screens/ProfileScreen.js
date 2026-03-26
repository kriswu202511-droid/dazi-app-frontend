import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { fetchProfile, logout } from '../lib/api';
import { getCachedUser } from '../lib/session';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=300&q=80';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorText, setErrorText] = useState('');

  const loadProfile = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }

    try {
      const cachedUser = await getCachedUser();

      if (cachedUser && !profile) {
        setProfile(cachedUser);
      }

      const latestUser = await fetchProfile();
      setProfile(latestUser);
      setErrorText('');
    } catch (error) {
      if (error?.status === 401) {
        await logout();
        router.replace('/login');
        return;
      }

      setErrorText(error?.message || '\u4E2A\u4EBA\u4FE1\u606F\u52A0\u8F7D\u5931\u8D25');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [profile, router]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
        setRefreshing(true);
        loadProfile({ silent: true });
      }} />}>
      <View style={styles.header}>
        <Image source={{ uri: profile?.avatar || DEFAULT_AVATAR }} style={styles.avatar} />
        <Text style={styles.name}>{profile?.nickname || '\u5C0F\u5C0F\u602A\u4E0B\u58EB'}</Text>
        <Text style={styles.bio}>{profile?.bio || '\u4E3A\u4E86\u7070\u5FC3\u661F\u7403\uFF01'}</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.coin_balance ?? 0}</Text>
            <Text style={styles.statLabel}>{'\u642D\u5E01'}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.city || '--'}</Text>
            <Text style={styles.statLabel}>{'\u57CE\u5E02'}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profile?.phone ? profile.phone.slice(-4) : '----'}</Text>
            <Text style={styles.statLabel}>{'\u624B\u673A\u5C3E\u53F7'}</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>{'\u6B63\u5728\u8BFB\u53D6\u4E2A\u4EBA\u4FE1\u606F...'}</Text>
        </View>
      ) : null}

      {!loading && errorText ? (
        <Pressable style={styles.errorCard} onPress={() => loadProfile()}>
          <Text style={styles.errorTitle}>{'\u4E2A\u4EBA\u4FE1\u606F\u52A0\u8F7D\u5931\u8D25'}</Text>
          <Text style={styles.errorText}>{errorText}</Text>
          <Text style={styles.errorAction}>{'\u70B9\u6211\u91CD\u8BD5'}</Text>
        </Pressable>
      ) : null}

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>{'\u8D26\u6237\u4FE1\u606F'}</Text>
        <View style={styles.menuItem}>
          <Text style={styles.menuIcon}>{'\uD83D\uDCF1'}</Text>
          <Text style={styles.menuText}>{profile?.phone || '\u6682\u672A\u7ED1\u5B9A\u624B\u673A'}</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuIcon}>{'\uD83C\uDFD9\uFE0F'}</Text>
          <Text style={styles.menuText}>{profile?.city || '\u6682\u672A\u8BBE\u7F6E\u57CE\u5E02'}</Text>
        </View>
        <View style={styles.menuItem}>
          <Text style={styles.menuIcon}>{'\uD83D\uDCB0'}</Text>
          <Text style={styles.menuText}>{`\u642D\u5E01\u4F59\u989D\uFF1A${profile?.coin_balance ?? 0}`}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>{'\u5FEB\u901F\u5165\u53E3'}</Text>
        <Pressable style={styles.menuItem} onPress={() => router.push('/(tabs)')}>
          <Text style={styles.menuIcon}>{'\uD83C\uDFE0'}</Text>
          <Text style={styles.menuText}>{'\u56DE\u5230\u642D\u5B50\u9996\u9875'}</Text>
          <Text style={styles.menuArrow}>{'\u203A'}</Text>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => router.push('/(tabs)/discover')}>
          <Text style={styles.menuIcon}>{'\uD83D\uDD0D'}</Text>
          <Text style={styles.menuText}>{'\u53BB\u53D1\u73B0\u66F4\u591A\u6D3B\u52A8'}</Text>
          <Text style={styles.menuArrow}>{'\u203A'}</Text>
        </Pressable>
        <Pressable style={styles.menuItem} onPress={() => router.push('/(tabs)/publish')}>
          <Text style={styles.menuIcon}>{'\uD83D\uDCCC'}</Text>
          <Text style={styles.menuText}>{'\u53D1\u8D77\u4E00\u573A\u65B0\u6D3B\u52A8'}</Text>
          <Text style={styles.menuArrow}>{'\u203A'}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>{'\u9000\u51FA\u767B\u5F55'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { backgroundColor: '#E6F4EA', alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 24 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#FFF', marginBottom: 16 },
  name: { fontSize: 24, fontWeight: '700', color: '#222', marginBottom: 8 },
  bio: { fontSize: 16, color: '#555', marginBottom: 24 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  statItem: { alignItems: 'center', maxWidth: '33%' },
  statNumber: { fontSize: 22, fontWeight: '700', color: '#2E7D32' },
  statLabel: { fontSize: 14, color: '#666', marginTop: 4 },
  loadingCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 20, alignItems: 'center', marginHorizontal: 16, marginBottom: 20 },
  loadingText: { marginTop: 10, color: '#607166', fontWeight: '600' },
  errorCard: { backgroundColor: '#FFF4F4', borderRadius: 20, padding: 18, marginHorizontal: 16, marginBottom: 20 },
  errorTitle: { fontSize: 17, fontWeight: '700', color: '#B03A3A', marginBottom: 8 },
  errorText: { color: '#8F5C5C', lineHeight: 22 },
  errorAction: { marginTop: 10, color: '#B03A3A', fontWeight: '700' },
  menuSection: { backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, marginHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12, marginTop: 8 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuIcon: { fontSize: 22, marginRight: 16, width: 30 },
  menuText: { flex: 1, fontSize: 17, color: '#444' },
  menuArrow: { fontSize: 24, color: '#999' },
  logoutButton: { backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 16, alignItems: 'center', marginHorizontal: 16, marginBottom: 40, marginTop: 10, borderWidth: 1, borderColor: '#FF6B6B' },
  logoutText: { color: '#FF6B6B', fontSize: 18, fontWeight: '600' },
});
