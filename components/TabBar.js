import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated 
} from 'react-native';

const tabs = [
  { key: 'home', label: '搭子', icon: '👥' },
  { key: 'community', label: '社区', icon: '🌍' },
  { key: 'publish', label: '发布', icon: '+' },
  { key: 'message', label: '消息', icon: '💬' },
  { key: 'profile', label: '我的', icon: '👤' },
];

export default function TabBar({ activeTab, onTabPress }) {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = (tabKey) => {
    // Q弹动画：先缩小再恢复
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    onTabPress(tabKey);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const isPublish = tab.key === 'publish';

        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isPublish && styles.publishTab]}
            onPress={() => handlePress(tab.key)}
            activeOpacity={0.7}
          >
            {isPublish ? (
              <Animated.View 
                style={[
                  styles.publishButton,
                  { transform: [{ scale: isActive ? scaleAnim : 1 }] }
                ]}
              >
                <Text style={styles.publishIcon}>{tab.icon}</Text>
              </Animated.View>
            ) : (
              <>
                <Text style={[styles.tabIcon, isActive && styles.activeIcon]}>
                  {tab.icon}
                </Text>
                <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>
                  {tab.label}
                </Text>
              </>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    height: 70,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#888',
  },
  tabLabel: {
    fontSize: 12,
    color: '#888',
  },
  activeIcon: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  activeLabel: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  publishTab: {
    justifyContent: 'flex-start',
    marginTop: -20,
  },
  publishButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  publishIcon: {
    fontSize: 28,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});