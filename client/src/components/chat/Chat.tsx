import "./Chat.css";

import { Robot } from "../ui/Icons/Robot";
import { Send } from "../ui/Icons/Send";
import { useRef, useState } from "react";
import { getRecommendations } from "../../services/product.service";

type Message = {
  id: string;
  role: "bot" | "user";
  content: string; // Guardaremos el JSON string aquí
};

type Props = {
  onClose?: () => void;
};

export interface MessageResponse {
  data: Data;
  error: null;
}

export interface Data {
  message: string;
  products: Product[];
}

export interface Product {
  productId: string;
  name: string;
  description: string;
  image: string;
  recommendedSize: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "bot",
    content:
      "¡Hola! Soy tu asistente de tallas. Estoy aquí para ayudarte a encontrar el ajuste perfecto y recomendarte los mejores productos según tus medidas. ¿En qué puedo apoyarte hoy?",
  },
];

function Chat({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedMessage,
    };

    setMessages((prev) => [...prev, newMessage]);

    const raw = localStorage.getItem("equifit-storage");

    if (!raw) {
      alert("User not retrieved");
      window.location.href = "/login";
      return;
    }

    const { state } = JSON.parse(raw);

    if (!state.user?.id) {
      alert("User is not logged");
      window.location.href = "/login";
      return;
    }

    const HORSE_ID = "63441272-3479-4117-8d35-7faf6e782fd3";

    getRecommendations(state.user.id, HORSE_ID, trimmedMessage)
      .then((data) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          role: "bot",
          content: JSON.stringify(data), // Guardamos la data como string
        };

        setMessages((prev) => [...prev, newMessage]);
      })
      .catch(() => {
        const newMessage: Message = {
          id: Date.now().toString(),
          role: "bot",
          content: "No se encontraron productos para tus medidas",
        };

        setMessages((prev) => [...prev, newMessage]);
      });

    setInputValue("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <aside className="chat">
      <header>
        <div className="avatar">
          <Robot />
        </div>

        <div className="info">
          <h1>FitBot AI</h1>
          <span>Sizing Assistant - Online</span>
        </div>

        {onClose && (
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close chat"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </header>

      <div className="messages">
        {messages.map((message) => {
          const messageClass = `message ${message.role}`;

          let parsedData: MessageResponse | null = null;
          try {
            if (message.content.startsWith('{"data"')) {
              parsedData = JSON.parse(message.content);
            }
          } catch (e) {
            parsedData = null;
          }

          return (
            <div key={message.id} className={messageClass}>
              <div className="bubble">
                {parsedData ? (
                  <div className="recommendation-container">
                    <p>{parsedData.data.message}</p>
                    <div className="products-list">
                      {parsedData.data.products.map((product) => (
                        <a
                          href={`/product/${product.productId}`}
                          key={product.productId}
                          className="product-card-chat"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="product-img"
                          />
                          <div className="product-info">
                            <strong>{product.name}</strong>
                            <p className="size-badge">
                              Talla recomendada: {product.recommendedSize}
                            </p>
                            <small>
                              {product.description.substring(0, 100)}...
                            </small>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          );
        })}
      </div>

      <footer>
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSendMessage} aria-label="Send message">
            <Send />
          </button>
        </div>
      </footer>
    </aside>
  );
}

export default Chat;
