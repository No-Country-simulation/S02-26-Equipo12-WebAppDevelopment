import { useState } from "react";
import { useBoundStore } from "../../context";
import type { Product } from "../../interfaces/product.interface";

interface AddToCartButtonProps {
  product: Product;
}

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const [added, setAdded] = useState(false);
  const addItem = useBoundStore((state) => state.addItem);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (added) {
    return (
      <button className="add-to-cart added" disabled>
        <span className="material-icons">check</span>
        Added
      </button>
    );
  }

  return (
    <button className="add-to-cart" onClick={handleAdd}>
      <span className="material-icons">shopping_cart</span>
      Add
    </button>
  );
};
