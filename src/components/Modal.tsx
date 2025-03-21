"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state to true on client side
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // Close when clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Modal content
  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div
        ref={modalRef}
        className="relative z-[1000] mx-auto bg-white/95 rounded-2xl shadow-xl w-full max-w-md animate-popIn"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ) : null;

  // Return null if not open or not mounted
  if (!isOpen || !mounted) return null;

  // Use portal to render modal at document root
  return createPortal(
    modalContent,
    document.getElementById("modal-root") || document.body
  );
}
