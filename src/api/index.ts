import axios from "axios";
import type { User } from "../context/AuthContext";

const API_URL = "http://localhost:3000";

export interface Product {
  id: string | number;
  name: string;
  price: number;
  stock: number;
}

export const login = async (
  username: string,
  password: string,
): Promise<User | null> => {
  try {
    const response = await axios.get<User[]>(`${API_URL}/users`, {
      params: { name: username, password },
    });
    const user = response.data[0];
    return user || null;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch products error:", error);
    return [];
  }
};

export const updateProduct = async (
  product: Product,
): Promise<Product | null> => {
  try {
    const response = await axios.put<Product>(
      `${API_URL}/products/${product.id}`,
      product,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update product error:", error);
    return null;
  }
};

export const deleteProduct = async (productId: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_URL}/products/${productId}`);
    return true;
  } catch (error) {
    console.error("Failed to delete product error:", error);
    return false;
  }
};
