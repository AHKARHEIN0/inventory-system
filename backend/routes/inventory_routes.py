from flask import Blueprint, request, jsonify
from models.inventory import InventoryItem, db

inventory_bp = Blueprint('inventory', __name__, url_prefix='/api/inventory')


@inventory_bp.route('/', methods=['GET'])
def get_all_items():
    items = InventoryItem.query.all()
    return jsonify([item.to_dict() for item in items])


@inventory_bp.route('/', methods=['POST'])
def create_item():
    data = request.json
    new_item = InventoryItem(
        name=data['name'],
        quantity=data.get('quantity', 0),
        supplier=data.get('supplier', ''),
        category=data.get('category', ''),
        notes=data.get('notes', '')
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201


@inventory_bp.route('/<int:item_id>', methods=['PUT'])
def update_item(item_id):
    item = InventoryItem.query.get_or_404(item_id)
    data = request.json

    item.name = data.get('name', item.name)
    item.quantity = data.get('quantity', item.quantity)
    item.supplier = data.get('supplier', item.supplier)
    item.category = data.get('category', item.category)
    item.notes = data.get('notes', item.notes)

    db.session.commit()
    return jsonify(item.to_dict())


@inventory_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    item = InventoryItem.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted'})
