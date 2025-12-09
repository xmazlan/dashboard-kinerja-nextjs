"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/animate-ui/components/radix/dialog";
import { Button } from "@/components/ui/button";

interface FormModalProps {
  className?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  content: React.ReactNode;
  formId?: string;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onCancel?: () => void;
}
export default function FormModal({
  className,
  isOpen,
  onOpenChange,
  content,
  title,
  description,
}: FormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
}
