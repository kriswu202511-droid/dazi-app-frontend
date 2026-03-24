import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from 'react-native';

const categories = [
  { id: 1, name: '饭搭子', icon: '🍚' },
  { id: 2, name: '学习', icon: '📚' },
  { id: 3, name: '运动', icon: '⚽' },
  { id: 4, name: '游戏', icon: '🎮' },
  { id: 5, name: '健身', icon: '💪' },
  { id: 6, name: '电影', icon: '🎬' },
  { id: 7, name: '旅行', icon: '✈️' },
  { id: 8, name: '其他', icon: '🔮' },
];

const recommendedDazis = [
  { id: 1, title: '今晚一起吃饭', user: '小明', distance: '1.2km', tags: ['饭搭子', '火锅'] },
  { id: 2, title: '周末爬山组队', user: '小红', distance: '3.5km', tags: ['运动', '户外'] },
  { id: 3, title: '学习打卡监督', user: '学霸', distance: '2.1km', tags: ['学习', '自律'] },
  { id: 4, title: '开黑王者荣耀', user: '大神', distance: '0.8km', tags: ['游戏', '手游'] },
  { id: 5, title: '健身房伙伴', user: '肌肉哥', distance: '1.5km', tags: ['健身', '增肌'] },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* 顶部搜索框 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索搭子或活动..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>搜索</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 8个分类入口 */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>热门分类</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.categoryItem}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryName}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 推荐搭子卡片流 */}
        <View style={styles.recommendSection}>
          <Text style={styles.sectionTitle}>推荐搭子</Text>
          {recommendedDazis.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDistance}>{item.distance}</Text>
              </View>
              <Text style={styles.cardUser}>@{item.user}</Text>
              <View style={styles.tagContainer}>
                {item.tags.map((tag, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.joinButton}>
                <Text style={styles.joinButtonText}>立即加入</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E6F4EA',
    marginRight: 12,
  },
  searchButton: {
    backgroundColor: '#E6F4EA',
    borderRadius: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
  categorySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#555',
  },
  recommendSection: {
    marginBottom: 40,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    flex: 1,
  },
  cardDistance: {
    fontSize: 14,
    color: '#888',
  },
  cardUser: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#E6F4EA',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#2E7D32',
    fontSize: 12,
  },
  joinButton: {
    backgroundColor: '#E6F4EA',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
});