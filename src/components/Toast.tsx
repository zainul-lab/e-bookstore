import { createContext, useCallback, useContext, useRef, useState } from 'react';

interface ToastMessage {
  id: number;
  text: string;
}

const ToastContext = createContext<(text: string) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastStack({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);

  const showToast = useCallback((text: string) => {
    const id = ++nextId.current;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <ToastPortal toasts={toasts} />
    </ToastContext.Provider>
  );
}

function ToastPortal({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-stretch gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-toast rounded-2xl border border-pine/20 bg-pine/10 px-5 py-3 text-sm font-medium text-pine shadow-sm backdrop-blur-sm"
        >
          {toast.text}
        </div>
      ))}
    </div>
  );
}
