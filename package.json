import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  FlatList, Alert, SafeAreaView, StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const savedItems = await AsyncStorage.getItem('trung_items');
      const savedHistory = await AsyncStorage.getItem('trung_history');
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (e) { console.log("Lỗi tải"); }
  };

  const saveData = async (newItems, newHistory) => {
    try {
      await AsyncStorage.setItem('trung_items', JSON.stringify(newItems));
      await AsyncStorage.setItem('trung_history', JSON.stringify(newHistory));
    } catch (e) { console.log("Lỗi lưu"); }
  };

  const addItem = () => {
    if (!name || !price) {
      Alert.alert("Nhắc nhở", "Nhập tên và giá tiền đã anh iu!");
      return;
    }
    const updatedItems = [...items, { id: Date.now().toString(), name, price: parseInt(price) }];
    setItems(updatedItems);
    saveData(updatedItems, history);
    setName(''); setPrice('');
  };

  const checkout = () => {
    if (items.length === 0) return;
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const updatedHistory = [{ id: Date.now().toString(), date: new Date().toLocaleString('vi-VN'), total }, ...history];
    setHistory(updatedHistory);
    setItems([]);
    saveData([], updatedHistory);
    Alert.alert("Thành công", `Tổng tiền: ${total.toLocaleString()}đ\nĐã lưu vào lịch sử!`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TRUNG TRẦN <Text style={{color: '#3498db'}}>DESIGN</Text></Text>
        <TouchableOpacity style={styles.historyBtn} onPress={() => setShowHistory(!showHistory)}>
          <Text style={styles.historyBtnText}>{showHistory ? "QUAY LẠI" : "LỊCH SỬ"}</Text>
        </TouchableOpacity>
      </View>

      {!showHistory ? (
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.label}>Tên sản phẩm/dịch vụ</Text>
            <TextInput style={styles.input} placeholder="Ví dụ: In bạt Hiflex..." value={name} onChangeText={setName} />
            <Text style={styles.label}>Giá tiền (VNĐ)</Text>
            <TextInput style={styles.input} placeholder="0" value={price} keyboardType="numeric" onChangeText={setPrice} />
            <TouchableOpacity style={styles.mainBtn} onPress={addItem}>
              <Text style={styles.mainBtnText}>+ THÊM VÀO GIỎ</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>{item.price.toLocaleString()}đ</Text>
                </View>
                <TouchableOpacity onPress={() => {
                  const updated = items.filter(i => i.id !== item.id);
                  setItems(updated); saveData(updated, history);
                }}>
                  <Text style={styles.deleteText}>Xóa</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>TỔNG CỘNG:</Text>
              <Text style={styles.totalValue}>{items.reduce((sum, i) => sum + i.price, 0).toLocaleString()}đ</Text>
            </View>
            <TouchableOpacity style={styles.checkoutBtn} onPress={checkout}>
              <Text style={styles.mainBtnText}>THANH TOÁN</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.subTitle}>Lịch sử thanh toán</Text>
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
                <Text style={styles.historyDate}>{item.date}</Text>
                <Text style={styles.historyTotal}>{item.total.toLocaleString()}đ</Text>
              </View>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff', alignItems: 'center', elevation: 4 },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#2C3E50' },
  historyBtn: { backgroundColor: '#E8F4FD', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  historyBtnText: { color: '#3498db', fontWeight: 'bold', fontSize: 12 },
  content: { flex: 1, padding: 15 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 2 },
  label: { fontSize: 12, color: '#95A5A6', fontWeight: 'bold', marginBottom: 5 },
  input: { backgroundColor: '#F8F9FA', borderRadius: 10, padding: 12, marginBottom: 15, fontSize: 16, borderWidth: 1, borderColor: '#EDF2F7' },
  mainBtn: { backgroundColor: '#3498db', padding: 15, borderRadius: 12, alignItems: 'center' },
  mainBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center', borderLeftWidth: 5, borderLeftColor: '#3498db' },
  itemName: { fontSize: 15, fontWeight: 'bold', color: '#2C3E50' },
  itemPrice: { fontSize: 14, color: '#7F8C8D' },
  deleteText: { color: '#E74C3C', fontWeight: 'bold' },
  footer: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25, elevation: 10 },
  totalContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: 'bold', color: '#95A5A6' },
  totalValue: { fontSize: 24, fontWeight: '900', color: '#2C3E50' },
  checkoutBtn: { backgroundColor: '#2ECC71', padding: 15, borderRadius: 12, alignItems: 'center' },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#2C3E50' },
  historyCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 10, borderLeftWidth: 5, borderLeftColor: '#2ECC71' },
  historyDate: { fontSize: 12, color: '#95A5A6' },
  historyTotal: { fontSize: 18, fontWeight: 'bold', color: '#2C3E50', marginTop: 5 }
});
