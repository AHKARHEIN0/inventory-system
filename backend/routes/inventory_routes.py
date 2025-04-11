from flask import Blueprint

inventory_bp = Blueprint('inventory', __name__, url_prefix="/api/inventory")

@inventory_bp.route("/", methods=["GET"])
def get_inventory():
    return {"message": "Inventory list will go here"}
