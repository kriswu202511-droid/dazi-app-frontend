import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Image source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }} style={styles.avatar} />
        <Text style={styles.name}>{'\u5C0F\u5C0F\u602A\u4E0B\u58EB'}</Text>
        <Text style={styles.bio}>{'\u4E3A\u4E86\u7070\u5FC3\u661F\u7403\uFF01'}</Text>
        <View style={styles.stats}>
          <View style={styles.statItem}><Text style={styles.statNumber}>42</Text><Text style={styles.statLabel}>{'\u642D\u5B50'}</Text></View>
          <View style={styles.statItem}><Text style={styles.statNumber}>128</Text><Text style={styles.statLabel}>{'\u79EF\u5206'}</Text></View>
          <View style={styles.statItem}><Text style={styles.statNumber}>18</Text><Text style={styles.statLabel}>{'\u6210\u5C31'}</Text></View>
        </View>
      </View>
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>{'\u6211\u7684\u6D3B\u52A8'}</Text>
        <Pressable style={styles.menuItem}><Text style={styles.menuIcon}>{'\uD83D\uDCE2'}</Text><Text style={styles.menuText}>{'\u6211\u7684\u53D1\u5E03'}</Text><Text style={styles.menuArrow}>{'\u203A'}</Text></Pressable>
        <Pressable style={styles.menuItem}><Text style={styles.menuIcon}>{'\uD83D\uDC65'}</Text><Text style={styles.menuText}>{'\u6211\u53C2\u4E0E\u7684'}</Text><Text style={styles.menuArrow}>{'\u203A'}</Text></Pressable>
        <Pressable style={styles.menuItem} onPress={() => router.push('/(tabs)/chat')}><Text style={styles.menuIcon}>{'\uD83D\uDCAC'}</Text><Text style={styles.menuText}>{'\u6211\u7684\u6D88\u606F'}</Text><Text style={styles.menuArrow}>{'\u203A'}</Text></Pressable>
        <Pressable style={styles.menuItem}><Text style={styles.menuIcon}>{'\u2B50'}</Text><Text style={styles.menuText}>{'\u6211\u7684\u6536\u85CF'}</Text><Text style={styles.menuArrow}>{'\u203A'}</Text></Pressable>
      </View>
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>{'\u8D26\u6237\u4E0E\u8BBE\u7F6E'}</Text>
        <Pressable style={styles.menuItem}><Text style={styles.menuIcon}>{'\u2699\uFE0F'}</Text><Text style={styles.menuText}>{'\u8BBE\u7F6E'}</Text><Text style={styles.menuArrow}>{'\u203A'}</Text></Pressable>
        <Pressable style={styles.menuItem}><Text style={styles.menuIcon}>{'\uD83D\uDEE1\uFE0F'}</Text><Text style={styles.menuText}>{'\u9690\u79C1\u4E0E\u5B89\u5168'}</Text><Text style={styles.menuArrow}>{'\u203A'}</Text></Pressable>
        <Pressable style={styles.menuItem}><Text style={styles.menuIcon}>{'\uD83D\uDCB3'}</Text><Text style={styles.menuText}>{'\u642D\u5E01\u94B1\u5305'}</Text><Text style={styles.menuArrow}>{'\u203A'}</Text></Pressable>
        <Pressable style={styles.menuItem}><Text style={styles.menuIcon}>{'\uD83D\uDCDE'}</Text><Text style={styles.menuText}>{'\u8054\u7CFB\u5BA2\u670D'}</Text><Text style={styles.menuArrow}>{'\u203A'}</Text></Pressable>
      </View>
      <Pressable style={styles.logoutButton} onPress={() => router.replace('/login')}><Text style={styles.logoutText}>{'\u9000\u51FA\u767B\u5F55'}</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' }, header: { backgroundColor: '#E6F4EA', alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, marginBottom: 24 }, avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#FFF', marginBottom: 16 }, name: { fontSize: 24, fontWeight: '700', color: '#222', marginBottom: 8 }, bio: { fontSize: 16, color: '#555', marginBottom: 24 }, stats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' }, statItem: { alignItems: 'center' }, statNumber: { fontSize: 22, fontWeight: '700', color: '#2E7D32' }, statLabel: { fontSize: 14, color: '#666', marginTop: 4 }, menuSection: { backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, marginHorizontal: 16, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }, sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12, marginTop: 8 }, menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' }, menuIcon: { fontSize: 22, marginRight: 16, width: 30 }, menuText: { flex: 1, fontSize: 17, color: '#444' }, menuArrow: { fontSize: 24, color: '#999' }, logoutButton: { backgroundColor: '#FFF', borderRadius: 20, paddingVertical: 16, alignItems: 'center', marginHorizontal: 16, marginBottom: 40, marginTop: 10, borderWidth: 1, borderColor: '#FF6B6B' }, logoutText: { color: '#FF6B6B', fontSize: 18, fontWeight: '600' },
});
