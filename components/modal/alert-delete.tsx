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

interface AlertDeleteProps {
  isOpen: boolean;
  refetch?: () => void;
  onOpenChange: (open: boolean) => void;
  data: any;
  isDeleting: boolean;
  handleDelete: (data: any) => void;
  title: string;
}
export default function AlertDelete({
  isOpen,
  refetch,
  onOpenChange,
  data,
  isDeleting,
  handleDelete,
  title,
}: AlertDeleteProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {`Are you sure you want to delete ${title}?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleDelete(data);
              refetch?.();
            }}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
