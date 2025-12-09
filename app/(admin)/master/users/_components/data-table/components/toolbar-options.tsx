"use client";

import * as React from "react";

// ** Import Icons
import { TrashIcon } from "lucide-react";

// ** Import UI Components
import { Button } from "@/components/ui/button";

// ** Import Actions

interface ToolbarOptionsProps {
  // Current page selected users with name data
  selectedUsers: { id: number; name: string }[];
  // All selected user IDs across all pages (for operations that only need IDs)
  allSelectedUserIds?: (string | number)[];
  // Total count of selected items across all pages
  totalSelectedCount: number;
  resetSelection: () => void;
}

export const ToolbarOptions = ({
  selectedUsers,
  allSelectedUserIds = [],
  totalSelectedCount,
  resetSelection,
}: ToolbarOptionsProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Use total selected count if available, otherwise fall back to current page selection
  const selectionCount = totalSelectedCount || selectedUsers.length;

  // Determine which IDs to use for operations - prefer all selected IDs if available
  const selectedIds =
    allSelectedUserIds.length > 0
      ? allSelectedUserIds
      : selectedUsers.map((user) => user.id);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="default" onClick={() => {}}>
        <TrashIcon className="mr-2 size-4" aria-hidden="true" />
        Delete ({selectionCount})
      </Button>
      {selectionCount > 0 && (
        <>
          <Button variant="outline" size="default" onClick={() => {}}>
            <TrashIcon className="mr-2 size-4" aria-hidden="true" />
            Delete ({selectionCount})
          </Button>
        </>
      )}
    </div>
  );
};
