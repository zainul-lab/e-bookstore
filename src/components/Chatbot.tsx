import { useState, type FormEvent } from "react";
import { useAppSelector } from "../store/hooks";
import {
  selectBooks,
  selectCartItems,
  selectCartSummary,
  selectCurrentUser,
} from "../store";
import type { Book, User } from "../types/store";

type Message = {
  id: number;
  text: string;
  from: "bot" | "user";
};

const quickPrompts = [
  "Help me find a book",
  "Where is my basket?",
  "How does checkout work?",
];

type AssistantContext = {
  books: Book[];
  cartItems: ReturnType<typeof selectCartItems>;
  cartSummary: ReturnType<typeof selectCartSummary>;
  currentUser: User;
};

const ignoredWords = new Set([
  "a",
  "an",
  "and",
  "book",
  "books",
  "can",
  "do",
  "for",
  "find",
  "give",
  "i",
  "in",
  "is",
  "me",
  "of",
  "please",
  "recommend",
  "show",
  "some",
  "the",
  "to",
  "what",
  "which",
  "with",
  "you",
]);

function formatBook(book: Book) {
  return `${book.title} by ${book.author} ($${book.price.toFixed(2)}, ${book.rating}/5)`;
}

function findBooks(message: string, books: Book[]) {
  const words = message
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !ignoredWords.has(word));

  return books
    .map((book) => {
      const searchableText = [
        book.title,
        book.author,
        book.brand,
        book.category,
        book.shortDescription,
        book.description,
        ...book.tags,
        ...book.formats,
      ]
        .join(" ")
        .toLowerCase();
      const score = words.reduce(
        (total, word) => total + (searchableText.includes(word) ? 1 : 0),
        0,
      );

      return { book, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 3)
    .map(({ book }) => book);
}

function getReply(message: string, context: AssistantContext) {
  const normalizedMessage = message.toLowerCase();
  const matchedBooks = findBooks(message, context.books);

  if (
    normalizedMessage.includes("basket") ||
    normalizedMessage.includes("cart")
  ) {
    if (context.cartItems.length === 0) {
      return "Your basket is empty right now. Browse the catalogue and select Add to basket on any book you would like to keep.";
    }

    const itemNames = context.cartItems
      .map((item) => `${item.quantity} x ${item.book.title}`)
      .join(", ");
    return `Your basket has ${context.cartSummary.itemCount} ${context.cartSummary.itemCount === 1 ? "item" : "items"}: ${itemNames}. The current total is $${context.cartSummary.total.toFixed(2)}.`;
  }

  if (
    normalizedMessage.includes("order") ||
    normalizedMessage.includes("purchase") ||
    normalizedMessage.includes("delivery") ||
    normalizedMessage.includes("shipping") ||
    normalizedMessage.includes("arrive")
  ) {
    const latestOrder = context.currentUser.orderHistory[0];
    if (!latestOrder) {
      return "You do not have any orders yet. Once you complete checkout, your order will appear in your account history.";
    }

    return `Your latest order is ${latestOrder.status.toLowerCase()}. It contains ${latestOrder.items.length} ${latestOrder.items.length === 1 ? "book" : "books"} and was placed on ${new Date(latestOrder.placedAt).toLocaleDateString()}.`;
  }

  if (
    normalizedMessage.includes("point") ||
    normalizedMessage.includes("account") ||
    normalizedMessage.includes("profile")
  ) {
    return `${context.currentUser.name}, you currently have ${context.currentUser.giftPoints} gift points. You have ${context.currentUser.addresses.length} saved address${context.currentUser.addresses.length === 1 ? "" : "es"}.`;
  }

  if (
    normalizedMessage.includes("checkout") ||
    normalizedMessage.includes("payment")
  ) {
    return "Checkout uses your saved delivery address first, then lets you choose a payment option. Review the order total before submitting payment, and you will see confirmation immediately afterward.";
  }

  if (
    normalizedMessage.includes("cheap") ||
    normalizedMessage.includes("cheapest") ||
    normalizedMessage.includes("low price")
  ) {
    const cheapestBooks = [...context.books]
      .sort((left, right) => left.price - right.price)
      .slice(0, 3);
    return `The lowest-priced books currently available are ${cheapestBooks.map(formatBook).join("; ")}.`;
  }

  if (matchedBooks.length > 0) {
    return `I found these matches in the catalogue: ${matchedBooks.map(formatBook).join("; ")}.`;
  }

  return "I can search the live catalogue by title, author, category, topic, format, price, and rating. I can also check your basket, orders, gift points, or checkout status. What would you like to know?";
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const books = useAppSelector(selectBooks);
  const cartItems = useAppSelector(selectCartItems);
  const cartSummary = useAppSelector(selectCartSummary);
  const currentUser = useAppSelector(selectCurrentUser);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: "Hello! I am your bookstore guide. What can I help you with?",
    },
  ]);

  function sendMessage(message: string) {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setMessages((currentMessages) => [
      ...currentMessages,
      { id: Date.now(), from: "user", text: trimmedMessage },
      {
        id: Date.now() + 1,
        from: "bot",
        text: getReply(trimmedMessage, {
          books,
          cartItems,
          cartSummary,
          currentUser,
        }),
      },
    ]);
    setDraft("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(draft);
  }

  return (
    <aside
      className="fixed bottom-4 right-4 z-20 flex flex-col items-end sm:bottom-6 sm:right-6"
      aria-label="Bookstore assistant"
    >
      {isOpen && (
        <section
          className="mb-3 flex h-[min(32rem,calc(100dvh-7rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-brand/15 bg-[#fffdf9] shadow-[0_20px_60px_rgba(36,24,19,0.2)]"
          aria-label="Chat with bookstore assistant"
        >
          <header className="flex items-start justify-between bg-brand px-5 py-4 text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#f4d5ac]">
                Bookstore guide
              </p>
              <h2 className="mt-1 font-serif text-xl font-semibold">
                How can I help?
              </h2>
            </div>
            <button
              type="button"
              aria-label="Close bookstore assistant"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>

          <div
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
            aria-live="polite"
          >
            {messages.map((message) => (
              <p
                key={message.id}
                className={`max-w-[88%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.from === "user"
                    ? "ml-auto rounded-br-sm bg-accent text-white"
                    : "rounded-bl-sm bg-parchment text-ink"
                }`}
              >
                {message.text}
              </p>
            ))}
          </div>

          <div className="border-t border-brand/10 px-4 py-3">
            <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="shrink-0 rounded-full border border-brand/15 bg-white px-3 py-1.5 text-xs text-brand transition hover:border-accent/50 hover:bg-parchment focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label htmlFor="chatbot-message" className="sr-only">
                Ask the bookstore assistant
              </label>
              <input
                id="chatbot-message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask a question..."
                className="min-w-0 flex-1 rounded-xl border border-brand/15 bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-brand/50 focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!draft.trim()}
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        aria-label={
          isOpen ? "Close bookstore assistant" : "Open bookstore assistant"
        }
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_8px_24px_rgba(124,79,47,0.3)] transition hover:scale-105 hover:bg-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:h-16 sm:w-16"
      >
        {isOpen ? (
          <svg
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg
            aria-hidden="true"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.7 8.7 0 0 1-3.1-.6L4 20l1.6-3.8A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
            <path d="M8 11h.01M12 11h.01M16 11h.01" />
          </svg>
        )}
      </button>
    </aside>
  );
}
