"use client";

// ** Import Date Table
import { DataTable } from "@/components/data-table/data-table";

// ** Import Table Config & Columns
import { getColumns } from "./components/columns";
import { useExportConfig } from "./utils/config";

import { usePostsData } from "./utils/data-fetching";

// ** Import Toolbar Options
import { ToolbarOptions } from "./components/toolbar-options";

export default function TabelData() {
  return (
    <DataTable<any, unknown>
      getColumns={getColumns}
      exportConfig={useExportConfig()}
      fetchDataFn={usePostsData}
      idField="id"
      pageSizeOptions={[10, 20, 30, 40, 50, 100, 150]}
      renderToolbarContent={({
        selectedRows,
        allSelectedIds,
        totalSelectedCount,
        resetSelection,
      }) => (
        <ToolbarOptions
          selectedUsers={selectedRows.map((row) => ({
            id: row.id,
            name: row.name,
          }))}
          allSelectedUserIds={allSelectedIds}
          totalSelectedCount={totalSelectedCount}
          resetSelection={resetSelection}
        />
      )}
      config={{
        enableRowSelection: true,
        enableClickRowSelect: false,
        enableKeyboardNavigation: true,
        enableSearch: true,
        enableDateFilter: true,
        enableColumnVisibility: true,
        enableColumnResizing: true,
        enableUrlState: true,
        size: "default",
        columnResizingTableId: "user-table",
        searchPlaceholder: "Search posts",
        defaultSortBy: "created_at",
        defaultSortOrder: "desc",
      }}
    />
  );
}
