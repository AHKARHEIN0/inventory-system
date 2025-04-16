import { useEffect, useState } from "react";
import { InventoryItem } from "../types";
import { api } from "../api";
import AddItemForm from "./AddItemForm";


const InventoryList = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    api.get("/inventory/")
      .then(res => setItems(res.data))
      .catch(err => console.error("Error fetching inventory", err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/inventory/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
  
      {/* Add Item Form */}
      <AddItemForm
        onItemAdded={() => {
          api.get("/inventory/")
            .then(res => setItems(res.data))
            .catch(err => console.error("Error fetching inventory", err));
          setEditingItem(null);
        }}
        editItem={editingItem}
      />

  
      {/* Inventory Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Category</th>
            <th className="p-2">Supplier</th>
            <th className="p-2">Notes</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.name}</td>
              <td className="p-2">{item.quantity}</td>
              <td className="p-2">{item.category}</td>
              <td className="p-2">{item.supplier}</td>
              <td className="p-2">{item.notes}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id!)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );  
};

export default InventoryList;
