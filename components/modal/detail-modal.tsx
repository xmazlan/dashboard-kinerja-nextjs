import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
  type DialogContentProps,
} from "@/components/animate-ui/components/radix/dialog";
import { Eye } from "lucide-react";
export function ModalDetail({
  trigger,
  triggerLabel = "Detail",
  title,
  description,
  maxWidthClass = "sm:max-w-8xl w-[95vw]",
  maxHeightClass = "max-h-[80vh]",
  contentModal,
}: {
  trigger?: React.ReactNode;
  triggerLabel?: string;
  title?: string;
  description?: string;
  defaultValue?: string;
  maxWidthClass?: string;
  maxHeightClass?: string;
  contentModal?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="default">
            <Eye className=" h-4 w-4" />
            {triggerLabel}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className={`${maxWidthClass} ${maxHeightClass} overflow-hidden p-0`}
      >
        <DialogHeader className="px-6 pt-4">
          {title ? <DialogTitle>{title}</DialogTitle> : null}
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <div className="px-6 pb-4 overflow-y-auto overflow-x-auto">
          {contentModal}
        </div>
        {/* <DialogFooter className="px-6 pb-4">
          <DialogClose asChild>
            <Button variant="outline">Tutup</Button>
          </DialogClose>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
