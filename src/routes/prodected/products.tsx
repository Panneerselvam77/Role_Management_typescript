import { useEffect, useState } from "react";
import {
  deleteProduct,
  fetchProducts,
  type Product,
  updateProduct,
} from "../../api";
import { useAuth } from "../../context/AuthContext";

const ProductsPage = () => {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const canEdit = hasPermission("EDIT_PRODUCT");
  const canDelete = hasPermission("DELETE_PRODUCT");

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };

    void loadProducts();
  }, []);

  const beginEdit = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setError("");
  };

  const saveChanges = async () => {
    if (!editingId) {
      return;
    }

    setIsSaving(true);
    const updated = await updateProduct({ id: editingId, name, price, stock });
    setIsSaving(false);

    if (!updated) {
      setError("Unable to save product. Try again.");
      return;
    }

    setProducts((current) =>
      current.map((product) =>
        product.id === updated.id ? updated : product,
      ),
    );
    cancelEdit();
  };

  const removeProduct = async (productId: string | number) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    const deleted = await deleteProduct(String(productId));
    if (!deleted) {
      setError("Failed to delete product.");
      return;
    }

    setProducts((current) => current.filter((product) => product.id !== productId));
  };

  return (
    <section className="page-card">
      <h1>Products</h1>
      <p>Manage products based on your role permissions.</p>

      {error && <div className="form-error">{error}</div>}

      <div className="product-status">
        <span>{canEdit ? "Editable" : "Read-only"}</span>
        <span>{canDelete ? "Deletable" : "Delete blocked"}</span>
      </div>

      {!products.length ? (
        <div className="empty-state">Loading products…</div>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={String(product.id)}>
                <td>
                  {editingId === product.id ? (
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {editingId === product.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(event) => setPrice(Number(event.target.value))}
                    />
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
                </td>
                <td>
                  {editingId === product.id ? (
                    <input
                      type="number"
                      value={stock}
                      onChange={(event) => setStock(Number(event.target.value))}
                    />
                  ) : (
                    product.stock
                  )}
                </td>
                <td className="action-cell">
                  {editingId === product.id ? (
                    <>
                      <button type="button" onClick={saveChanges} disabled={!canEdit || isSaving}>
                        Save
                      </button>
                      <button type="button" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={() => beginEdit(product)} disabled={!canEdit}>
                        Edit
                      </button>
                      <button type="button" onClick={() => removeProduct(product.id)} disabled={!canDelete}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default ProductsPage;
