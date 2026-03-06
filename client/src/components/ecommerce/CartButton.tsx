import { useState, useEffect } from "react";
import { useBoundStore } from "../../context";
import CloseIcon from "../ui/Icons/close.svg?raw";
import DeleteIcon from "../ui/Icons/delete.svg?raw";
import ShoppingCartIcon from "../ui/Icons/shopping-cart.svg?raw";
import ShoppingBagIcon from "../ui/Icons/shopping-bag.svg?raw";
import "./CartButton.css";

export const CartButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const items = useBoundStore((state) => state.items);
  const removeItem = useBoundStore((state) => state.removeItem);
  const updateQuantity = useBoundStore((state) => state.updateQuantity);
  const clearCart = useBoundStore((state) => state.clearCart);

  useEffect(() => {
    const handleCartUpdate = () => {
      setIsOpen((prev) => prev);
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => window.removeEventListener("cart-updated", handleCartUpdate);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return (
    <div className="cart-container">
      <button
        className="cart-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Shopping cart"
      >
        <span
          className="cart-icon"
          dangerouslySetInnerHTML={{ __html: ShoppingBagIcon }}
        />
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>

      {isOpen && (
        <>
          <div className="cart-overlay" onClick={() => setIsOpen(false)} />
          <div className="cart-dropdown">
            <div className="cart-header">
              <h3>Shopping Cart</h3>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <span dangerouslySetInnerHTML={{ __html: CloseIcon }} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="cart-empty">
                <span
                  className="cart-empty-icon"
                  dangerouslySetInnerHTML={{ __html: ShoppingCartIcon }}
                />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {items.map((item) => (
                    <div key={item.product.id} className="cart-item">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-info">
                        <h4 className="cart-item-name">{item.product.name}</h4>
                        <p className="cart-item-price">
                          ${Number(item.product.price).toFixed(2)}
                        </p>
                        <div className="cart-item-quantity">
                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeItem(item.product.id)}
                        aria-label="Remove item"
                      >
                        <span
                          dangerouslySetInnerHTML={{ __html: DeleteIcon }}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <span className="total-price">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <button className="checkout-btn">Checkout</button>
                  <button className="clear-btn" onClick={clearCart}>
                    Clear Cart
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
