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
import { Button } from "../ui/button";

interface FormModalProps {
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
  isOpen,
  onOpenChange,
  content,
  title,
  description,
  formId,
  submitLabel,
  cancelLabel,
  loading,
  onCancel,
}: FormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {content}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onCancel} disabled={!!loading}>
              {cancelLabel ? cancelLabel : "Batal"}
            </Button>
          </DialogClose>
          <Button type="submit" form={formId} disabled={!!loading}>
            {submitLabel ? submitLabel : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
