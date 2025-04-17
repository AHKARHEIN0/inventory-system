import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeTab() {
  const router = useRouter();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      fetch("https://inventory-system-gg85.onrender.com/api/inventory")
        .then((res) => res.json())
        .then((data) => {
          setInventory(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("API Error:", err);
          setLoading(false);
        });
    }, [])
  );

  const confirmDelete = (id: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(id),
        },
      ]
    );
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`https://inventory-system-gg85.onrender.com/api/inventory/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        console.log(`🗑️ Deleted item ${id}`);
        setLoading(true);
        const updated = await fetch("https://inventory-system-gg85.onrender.com/api/inventory").then((r) => r.json());
        setInventory(updated);
        setLoading(false);
      } else {
        console.error("❌ Delete failed:", await res.text());
      }
    } catch (err) {
      console.error("🔥 Network error deleting item:", err);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        Inventory List
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        inventory.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              router.push({
                pathname: '/edit/[id]',
                params: {
                  id: String(item.id),
                  name: item.name,
                  quantity: item.quantity.toString(),
                  category: item.category,
                  supplier: item.supplier,
                  notes: item.notes,
                },
              })
            }
            activeOpacity={0.9}
          >
            <View
              style={{
                backgroundColor: '#f2f2f2',
                padding: 16,
                borderRadius: 10,
                marginBottom: 12,
                position: 'relative',
              }}
            >
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  confirmDelete(item.id);
                }}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  padding: 6,
                  zIndex: 1,
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#ff3b30" />
              </TouchableOpacity>

              <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Category: {item.category}</Text>
              <Text>Supplier: {item.supplier}</Text>
              <Text>Notes: {item.notes}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
