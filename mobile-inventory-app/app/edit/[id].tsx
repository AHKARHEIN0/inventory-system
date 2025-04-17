import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from 'react-native';

export default function EditItem() {
  const router = useRouter();

  const { id, name, quantity, category, supplier, notes } =
    useLocalSearchParams();

  const [form, setForm] = useState({
    name: '',
    quantity: '',
    category: '',
    supplier: '',
    notes: '',
  });

  useEffect(() => {
    if (name && quantity && category && supplier && notes) {
      setForm({
        name: String(name),
        quantity: String(quantity),
        category: String(category),
        supplier: String(supplier),
        notes: String(notes),
      });
    }
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      quantity: Number(form.quantity),
      category: form.category,
      supplier: form.supplier,
      notes: form.notes,
    };

    try {
      const res = await fetch(
        `https://inventory-system-gg85.onrender.com/api/inventory/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        Alert.alert('✅ Success', 'Item updated successfully!');
        router.replace('/'); // go back to home
      } else {
        const error = await res.text();
        Alert.alert('❌ Failed', error);
      }
    } catch (err: any) {
      Alert.alert('❌ Error', err.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Edit Item
      </Text>

      {['name', 'quantity', 'category', 'supplier', 'notes'].map((field) => (
        <TextInput
          key={field}
          placeholder={field[0].toUpperCase() + field.slice(1)}
          value={(form as any)[field]}
          onChangeText={(text) => handleChange(field, text)}
          keyboardType={field === 'quantity' ? 'numeric' : 'default'}
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            fontSize: 16,
          }}
        />
      ))}

      <Button title="Save Changes" onPress={handleSubmit} />
    </ScrollView>
  );
}
