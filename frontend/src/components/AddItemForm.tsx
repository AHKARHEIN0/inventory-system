import { useState } from "react";
import { InventoryItem } from "../types";
import { api } from "../api";

const initialForm: InventoryItem = {
  name: "",
  quantity: 0,
  supplier: "",
  category: "",
  notes: ""
};

const AddItemForm = ({ onItemAdded }: { onItemAdded: () => void }) => {
  const [formData, setFormData] = useState<InventoryItem>(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "quantity" ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("Submitting:", formData);  // ✅ DEBUG LOG
  
    try {
      await api.post("/inventory/", formData);  // ✅ sends POST to backend
      setFormData(initialForm);                 // reset the form
      onItemAdded();                            // notify parent to refresh list
    } catch (err) {
      console.error("POST failed", err);        // ✅ ERROR LOG
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow-md rounded mb-6">
      <h2 className="text-lg font-semibold mb-4">Add New Item</h2>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="name" placeholder="Item Name" className="border p-2" value={formData.name} onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="Quantity" className="border p-2" value={formData.quantity} onChange={handleChange} />
        <input type="text" name="supplier" placeholder="Supplier" className="border p-2" value={formData.supplier} onChange={handleChange} />
        <input type="text" name="category" placeholder="Category" className="border p-2" value={formData.category} onChange={handleChange} />
        <textarea name="notes" placeholder="Notes" className="border p-2 col-span-2" value={formData.notes} onChange={handleChange} />
      </div>
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Add Item
      </button>
    </form>
  );
};

export default AddItemForm;
