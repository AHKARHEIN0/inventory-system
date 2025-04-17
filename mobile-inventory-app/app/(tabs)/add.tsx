import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useState } from 'react';

export default function AddScreen() {
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: '',
    supplier: '',
    notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://inventory-system-gg85.onrender.com/api/inventory/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
        }),
      });
  
      const data = await response.json(); // 🔍 inspect backend response
  
      if (response.ok) {
        Alert.alert('Success', 'Item added!');
        setFormData({ name: '', quantity: '', category: '', supplier: '', notes: '' });
      } else {
        console.log('Server response:', data);
        Alert.alert('Error', data?.message || 'Failed to add item.');
      }
    } catch (err) {
      console.log('Network error:', err);
      Alert.alert('Error', 'Something went wrong.');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Item</Text>
      {['name', 'quantity', 'category', 'supplier', 'notes'].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={formData[field as keyof typeof formData]}
          onChangeText={(text) => handleChange(field, text)}
          keyboardType={field === 'quantity' ? 'numeric' : 'default'}
        />
      ))}
      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
});
