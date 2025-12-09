"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { SectionHero } from "@/components/layout/section-hero";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { useSession } from "next-auth/react";
import ListDataUsers from "./list-data";
import axios from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useMasterUsersList } from "@/hooks/query/use-master-users-list";

export default function VPageUsers() {
  const { data: usersList, isLoading } = useMasterUsersList();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const headers: Record<string, string> = React.useMemo(() => {
    const h: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    const token = session?.data?.token;
    if (token) h.Authorization = `Bearer ${token}`;
    return h;
  }, [session?.data?.token]);

  const invalidate = React.useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["master-users-list", session?.data?.token],
    });
  }, [queryClient, session?.data?.token]);

  interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    opd?: string | null;
    opd_nama?: string | null;
    created_at?: string;
    updated_at?: string;
  }

  const handleCreate = async (data: {
    name: string;
    email: string;
    role: string;
    opd_id: string;
    password: string;
    password_confirmation: string;
  }) => {
    const url = `/api/v1/master/user`;
    await axios.post(url, data, { headers });
    invalidate();
  };

  const handleUpdate = async (
    id: number,
    data: {
      name: string;
      email: string;
      role: string;
      opd_id: string;
      password?: string;
      password_confirmation?: string;
    }
  ) => {
    const url = `/api/v1/master/user/${id}`;
    await axios.patch(url, data, { headers });
    invalidate();
  };

  const handleDelete = async (id: number) => {
    const url = `/api/v1/master/user/${id}`;
    await axios.delete(url, { headers });
    invalidate();
  };
  return (
    <section className="relative ">
      <div className="mx-auto w-full max-w-6xl px-6 py-6">
        <div className="mb-6">
          <SectionHero
            title={`Master Pengguna`}
            right={
              <>
                <div className="hidden sm:flex items-center gap-2 rounded-md border bg-background px-3 py-2">
                  <NumberTicker
                    value={
                      Array.isArray(usersList?.data)
                        ? (usersList!.data as UserItem[]).length
                        : 0
                    }
                  />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Total data
                    </div>
                  </div>
                </div>
              </>
            }
          />
        </div>
        <div className="mb-6 grid grid-cols-1 gap-3">
          <Card className="p-4">
            <ListDataUsers
              items={
                Array.isArray(usersList?.data)
                  ? (usersList!.data! as UserItem[])
                  : []
              }
              loading={isLoading}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
