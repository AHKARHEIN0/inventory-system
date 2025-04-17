import { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';
import { useRouter } from "expo-router";


export default function AddItemTab() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    quantity: '',
    category: '',
    supplier: '',
    notes: ''
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    console.log("Button tapped!");
    const payload = {
      name: form.name,
      quantity: Number(form.quantity),
      category: form.category,
      supplier: form.supplier,
      notes: form.notes,
    };
  
    console.log("Payload being sent:", payload);
  
    try {
      const res = await fetch("https://inventory-system-gg85.onrender.com/api/inventory/", {
        method: "POST",  // ✅ THIS LINE IS IMPORTANT
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
  
      const text = await res.text();  // ✅ Show backend response
      console.log("✅ POST response status:", res.status);
      console.log("✅ POST response body:", text);
  
      if (res.ok) {
        Alert.alert("✅ Success", "Item added successfully!");
        setForm({ name: "", quantity: "", category: "", supplier: "", notes: "" });
        router.replace("/"); // 👈 Navigate to Home tab
      } else {
        Alert.alert("❌ Failed", `Status ${res.status}: ${text}`);
      }
    } catch (err: any) {
      console.error("❌ POST failed:", err.message || err);
      Alert.alert("❌ Error", err.message || "Network error");
    }
  };
  
  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Add New Item
      </Text>

      {['name', 'quantity', 'category', 'supplier', 'notes'].map((field) => (
        <TextInput
        key={field}
        placeholder={field[0].toUpperCase() + field.slice(1)}
        value={(form as any)[field]}
        onChangeText={(text) => {
          console.log(`🔁 Changed ${field}:`, text);  // add this
          handleChange(field, text);
        }}
        keyboardType={field === 'quantity' ? 'numeric' : 'default'}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          marginBottom: 16,
          fontSize: 16
        }}
      />
      
      ))}

      <Button title="Add Item" onPress={handleSubmit} />
    </ScrollView>
  );
}
