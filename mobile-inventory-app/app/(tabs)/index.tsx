import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

export default function InventoryScreen() {
  const [items, setItems] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetch("https://inventory-system-gg85.onrender.com/api/inventory/")
        .then((res) => res.json())
        .then((data) => setItems(data))
        .catch((err) => console.error("API Error:", err));
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Inventory</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Category: {item.category}</Text>
            <Text>Supplier: {item.supplier}</Text>
            {item.notes ? <Text>Notes: {item.notes}</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 60, flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  card: { marginBottom: 16, padding: 12, borderWidth: 1, borderRadius: 8, borderColor: "#ddd" },
  name: { fontSize: 18, fontWeight: "bold" },
});
