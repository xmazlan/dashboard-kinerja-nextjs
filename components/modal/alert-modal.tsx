"use client";
import React from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  type AlertDialogContentProps,
} from "@/components/animate-ui/components/radix/alert-dialog";

interface AlertModalProps {
  isOpen: boolean;
  refetch?: () => void;
  onOpenChange: (open: boolean) => void;
  data?: any;
  isDeleting?: boolean;
  handleDelete: (data: any) => void | Promise<void>;
  title: string;
  description?: string;
  cancelLabel?: string;
  actionLabel?: string;
  actionClassName?: string;
}
export default function AlertModal({
  isOpen,
  refetch,
  onOpenChange,
  data,
  isDeleting,
  handleDelete,
  title,
  description,
  cancelLabel,
  actionLabel,
  actionClassName,
}: AlertModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description ?? `Are you sure you want to ${title}?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!isDeleting}>
              {cancelLabel ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete(data);
                refetch?.();
              }}
              disabled={!!isDeleting}
              className={
                actionClassName ?? "bg-destructive hover:bg-destructive/90"
              }
            >
              {actionLabel ?? (isDeleting ? "Deleting..." : "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
