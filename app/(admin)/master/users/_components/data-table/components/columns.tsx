"use client";

// ** Import 3rd Party Libs
import { ColumnDef } from "@tanstack/react-table";

// ** Import Components
import { DataTableColumnHeader } from "@/components/data-table/column-header";

// ** Import Utils
import { formatShortDate } from "@/lib/table-utils";

// ** Import UI Components
import { Checkbox } from "@/components/ui/checkbox";

interface PostRow {
  id: number;
  uuid: string | null;
  user_id: number | null;
  categori_id: number | null;
  name: string | null;
  slug: string | null;
  content: string | null;
  image: string | null;
  image_url: string | null;
  status: string | null;
  views: number | string;
  likes: number | string;
  dislikes: number | string;
  comments: number | string;
  shares: number | string;
  favorites: number | string;
  tags: string | null;
  categori: {
    id: number;
    uuid: string;
    user_id: number;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  } | null;
  created_at: string;
  updated_at: string;
}

// ** Import Table Row Actions
import { DataTableRowActions } from "./row-actions";

export const getColumns = (
  handleRowDeselection: ((rowId: string) => void) | null | undefined
): ColumnDef<PostRow>[] => {
  // Base columns without the select column
  const baseColumns: ColumnDef<PostRow>[] = [
    {
      accessorKey: "image_url",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => {
        const src = row.getValue("image_url") as string | null;
        return (
          <div className="flex items-center">
            {src ? (
              <img
                src={src}
                alt={String(row.getValue("name") || "")}
                className="h-10 w-16 rounded object-cover border"
              />
            ) : (
              <div className="h-10 w-16 rounded bg-muted border" />
            )}
          </div>
        );
      },
      size: 100,
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="font-medium truncate text-left">
          {row.getValue("name")}
        </div>
      ),
      size: 240,
    },
    {
      accessorKey: "content",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Content" />
      ),
      cell: ({ row }) => {
        return (
          <div className="max-w-full text-left truncate">
            {row.getValue("content")}
          </div>
        );
      },
      size: 320,
    },

    {
      accessorKey: "categori",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const cat = row.getValue("categori") as PostRow["categori"];
        const name = typeof cat === "object" && cat ? cat.name : "-";
        return <div className="truncate text-left">{name}</div>;
      },
      size: 180,
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left">{row.getValue("status")}</div>
      ),
      size: 120,
    },

    {
      accessorKey: "views",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Views" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left">{row.getValue("views")}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "likes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Likes" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left">{row.getValue("likes")}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "dislikes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Dislikes" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left">{row.getValue("dislikes")}</div>
      ),
      size: 110,
    },
    // {
    //   accessorKey: "comments",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Comments" />
    //   ),
    //   cell: ({ row }) => (
    //     <div className="truncate text-left">{row.getValue("comments")}</div>
    //   ),
    //   size: 120,
    // },
    // {
    //   accessorKey: "shares",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Shares" />
    //   ),
    //   cell: ({ row }) => (
    //     <div className="truncate text-left">{row.getValue("shares")}</div>
    //   ),
    //   size: 110,
    // },
    {
      accessorKey: "favorites",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Favorites" />
      ),
      cell: ({ row }) => (
        <div className="truncate text-left">{row.getValue("favorites")}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string;
        const formattedDate = formatShortDate(date);
        return (
          <div className="max-w-full text-left truncate">{formattedDate}</div>
        );
      },
      size: 140,
    },

    {
      id: "actions",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
      size: 100,
    },
  ];

  // Only include the select column if row selection is enabled
  if (handleRowDeselection !== null) {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <div className="pl-2 truncate">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
              className="translate-y-0.5 cursor-pointer"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="truncate">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                if (value) {
                  row.toggleSelected(true);
                } else {
                  row.toggleSelected(false);
                  // If we have a deselection handler, use it for better cross-page tracking
                  if (handleRowDeselection) {
                    handleRowDeselection(row.id);
                  }
                }
              }}
              aria-label="Select row"
              className="translate-y-0.5 cursor-pointer"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
      },
      ...baseColumns,
    ];
  }

  // Return only the base columns if row selection is disabled
  return baseColumns;
};
