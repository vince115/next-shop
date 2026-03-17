"use client";

import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import LoginModal from "@/components/auth/LoginModal";

interface LoginModalContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextValue | undefined>(undefined);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <LoginModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <LoginModal isOpen={isOpen} onClose={closeModal} />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error("useLoginModal must be used within a LoginModalProvider");
  }
  return context;
}
