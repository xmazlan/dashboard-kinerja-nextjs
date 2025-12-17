"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { type DialogProps } from "@radix-ui/react-dialog";
import { IconArrowRight } from "@tabler/icons-react";
import { CornerDownLeftIcon, Loader2, X } from "lucide-react";
import { useDocsSearch } from "fumadocs-core/search/client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { menuConfig } from "@/config/site";

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [items, setItems] = React.useState<
    Array<{
      id: string;
      label: string;
      category: string;
      path: string;
      keywords: string[];
    }>
  >([]);
  const [navItems] = React.useState(menuConfig);
  type SectionConfig = {
    id: string;
    label: string;
    components: Array<{ key: string; label: string; keywords?: string[] }>;
  };
  const [sectionComponents, setSectionComponents] = React.useState<
    Array<{
      key: string;
      label: string;
      sectionLabel: string;
      keywords?: string[];
    }>
  >([]);

  const {
    search: docsSearch,
    setSearch: setDocsSearch,
    query,
  } = useDocsSearch({
    type: "fetch",
  });

  const searchTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);
  const configLoadedRef = React.useRef(false);
  const RECENT_COOKIE = "recent_searches";
  const [recentSearches, setRecentSearches] = React.useState<
    Array<{ label: string; href: string }>
  >([]);

  const getCookie = React.useCallback((name: string) => {
    if (typeof document === "undefined") return "";
    const match = document.cookie.match(
      new RegExp(
        "(^|; )" +
          name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return match ? decodeURIComponent(match[2]) : "";
  }, []);

  const setCookie = React.useCallback(
    (name: string, value: string, maxAge: number) => {
      if (typeof document === "undefined") return;
      document.cookie = `${name}=${encodeURIComponent(
        value
      )}; path=/; max-age=${maxAge}`;
    },
    []
  );

  const addRecent = React.useCallback(
    (label: string, href: string) => {
      const list = [
        { label, href },
        ...recentSearches.filter((r) => r.href !== href && r.label !== label),
      ];
      const next = list.slice(0, 5);
      setRecentSearches(next);
      try {
        setCookie(RECENT_COOKIE, JSON.stringify(next), 60 * 60 * 24 * 30);
      } catch {}
    },
    [recentSearches, setCookie]
  );

  React.useEffect(() => {
    try {
      const raw = getCookie(RECENT_COOKIE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRecentSearches(parsed);
      }
    } catch {}
  }, [getCookie]);

  const fetchItems = React.useCallback(async (q: string) => {
    const minDuration = 300;
    const loadingStart = Date.now();
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search-data?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setItems(Array.isArray(json.items) ? json.items : []);
    } catch {
      setItems([]);
    } finally {
      const elapsed = Date.now() - loadingStart;
      const remain = Math.max(minDuration - elapsed, 0);
      if (remain > 0) {
        setTimeout(() => setIsLoading(false), remain);
      } else {
        setIsLoading(false);
      }
    }
  }, []);

  const fetchSectionConfig = React.useCallback(async () => {
    if (configLoadedRef.current) return;
    try {
      const res = await fetch(`/data-search.json`);
      const json = (await res.json()) as { sections?: SectionConfig[] };
      const sections = Array.isArray(json.sections) ? json.sections : [];
      const flat = sections.flatMap((s) =>
        (Array.isArray(s.components) ? s.components : []).map((c) => ({
          key: c.key,
          label: c.label,
          sectionLabel: s.label,
          keywords: c.keywords,
        }))
      );
      setSectionComponents(flat);
      configLoadedRef.current = true;
    } catch {
      setSectionComponents([]);
    }
  }, []);

  const handleSearchChange = React.useCallback(
    (value: string) => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      setSearch(value);
      searchTimeoutRef.current = setTimeout(() => {
        fetchItems(value);
      }, 300);
    },
    [fetchItems]
  );

  const handleResetSearch = React.useCallback(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setSearch("");
    setItems([]);
    setDocsSearch("");
    setIsLoading(false);
    try {
      router.push(`/dashboard`);
    } catch {}
  }, [setDocsSearch, router]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }
        e.preventDefault();
        setOpen((open) => !open);
        fetchSectionConfig();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [fetchSectionConfig]);

  React.useEffect(() => {
    if (open) fetchSectionConfig();
  }, [open, fetchSectionConfig]);

  React.useEffect(() => {
    fetchSectionConfig();
  }, [fetchSectionConfig]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "bg-surface text-foreground dark:bg-card relative h-8 w-full justify-start pl-3 font-medium shadow-none sm:pr-12 md:w-48 lg:w-56 xl:w-64"
          )}
          onClick={() => setOpen(true)}
          {...props}
        >
          {search?.trim() ? (
            <span className="inline-flex max-w-[60%] truncate">{search}</span>
          ) : (
            <>
              <span className="hidden lg:inline-flex text-white">Cari...</span>
              <span className="inline-flex lg:hidden">Search...</span>
            </>
          )}
          {(search?.trim() ||
            searchParams.get("component") ||
            searchParams.get("category")) && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleResetSearch();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleResetSearch();
                }
              }}
              className="ml-2 inline-flex items-center rounded px-1.5 py-0.5 text-xs bg-muted text-muted-foreground hover:bg-muted/80"
            >
              <X className="size-3" />
            </span>
          )}
          <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
            <KbdGroup>
              <Kbd className="border">⌘</Kbd>
              <Kbd className="border">K</Kbd>
            </KbdGroup>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-border bg-card text-foreground"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search documentation...</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <Command
          className="**:data-[slot=command-input-wrapper]:bg-input/50 **:data-[slot=command-input-wrapper]:border-input rounded-none bg-transparent **:data-[slot=command-input]:h-9! **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-9! **:data-[slot=command-input-wrapper]:rounded-md **:data-[slot=command-input-wrapper]:border"
          filter={(value, s, keywords) => {
            handleSearchChange(s);
            setDocsSearch(s);
            const extendValue = value + " " + (keywords?.join(" ") || "");
            return extendValue.toLowerCase().includes(s.toLowerCase()) ? 1 : 0;
          }}
        >
          <div className="relative">
            <CommandInput placeholder="Cari data atau halaman..." />
            {isLoading && (
              <div className="pointer-events-none absolute top-1/2 right-3 z-10 flex -translate-y-1/2 items-center justify-center">
                <Loader2 className="text-muted-foreground size-4 animate-spin" />
              </div>
            )}
          </div>
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="text-muted-foreground py-12 text-center text-sm">
              {isLoading ? "Mencari..." : "Tidak ada hasil."}
            </CommandEmpty>
            {navItems && navItems.length > 0 && (
              <CommandGroup
                heading="Pages"
                className="p-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
              >
                {navItems.map((item) => (
                  <CommandMenuItem
                    key={item.href}
                    value={`Navigation ${item.label}`}
                    keywords={["nav", "navigation", item.label.toLowerCase()]}
                    onSelect={() => {
                      setOpen(false);
                      setSearch(item.label);
                      addRecent(item.label, item.href);
                      router.push(item.href);
                    }}
                  >
                    <IconArrowRight />
                    {item.label}
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}
            {recentSearches.length > 0 && (
              <CommandGroup
                heading="Recent"
                className="p-0! **:[[cmdk-group-heading]]:p-3!"
              >
                {recentSearches.map((rs, i) => (
                  <CommandMenuItem
                    key={`${rs.href}-${i}`}
                    value={`Recent ${rs.label}`}
                    keywords={["recent", rs.label]}
                    onSelect={() => {
                      setOpen(false);
                      setSearch(rs.label);
                      router.push(rs.href);
                    }}
                  >
                    <IconArrowRight />
                    {rs.label}
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}
            {/* {items.length > 0 && (
              <CommandGroup
                heading="Data"
                className="p-0! **:[[cmdk-group-heading]]:p-3!"
              >
                {items.map((it) => (
                  <CommandMenuItem
                    key={it.id}
                    value={`${it.label} ${it.category}`}
                    keywords={
                      it.keywords?.length
                        ? it.keywords
                        : [it.label, it.category, it.path]
                    }
                    onSelect={() => {
                      setOpen(false);
                      setSearch(it.label);
                      const category = it.category.toLowerCase();
                      const url = `/dashboard?component=${encodeURIComponent(
                        category
                      )}`;
                      addRecent(it.label, url);
                      router.push(url);
                    }}
                  >
                    <div className="aspect-square size-4 rounded-sm border border-dashed" />
                    {it.label}
                    <span className="text-muted-foreground ml-auto font-mono text-xs font-normal tabular-nums">
                      {it.category}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )} */}
            {sectionComponents.length > 0 && (
              <CommandGroup
                heading="Sections"
                className="p-0! **:[[cmdk-group-heading]]:p-3!"
              >
                {sectionComponents.map((it) => (
                  <CommandMenuItem
                    key={`${it.sectionLabel}-${it.key}`}
                    value={`${it.sectionLabel} ${it.label}`}
                    keywords={["section", it.sectionLabel, it.label, it.key]}
                    onSelect={() => {
                      setOpen(false);
                      setSearch(`${it.sectionLabel}: ${it.label}`);
                      router.push(
                        `/dashboard?component=${encodeURIComponent(it.key)}`
                      );
                      addRecent(
                        `${it.sectionLabel}: ${it.label}`,
                        `/dashboard?component=${encodeURIComponent(it.key)}`
                      );
                    }}
                  >
                    <IconArrowRight />
                    {it.sectionLabel}: {it.label}
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}
            {query.data &&
              Array.isArray(query.data) &&
              query.data.length > 0 && (
                <CommandGroup
                  heading="Docs"
                  className="p-0! **:[[cmdk-group-heading]]:p-3!"
                >
                  {query.data
                    .filter(
                      (item, index, self) =>
                        !(
                          item.type === "text" &&
                          item.content.trim().split(/\s+/).length <= 1
                        ) &&
                        index ===
                          self.findIndex((t) => t.content === item.content)
                    )
                    .map((item) => (
                      <CommandMenuItem
                        key={item.id}
                        value={`${item.content} ${item.type}`}
                        keywords={[item.content]}
                        onSelect={() => {
                          router.push(item.url);
                          setOpen(false);
                          setSearch(item.content);
                          addRecent(item.content, item.url);
                        }}
                      >
                        <div className="line-clamp-1 text-sm">
                          {item.content}
                        </div>
                      </CommandMenuItem>
                    ))}
                </CommandGroup>
              )}
          </CommandList>
        </Command>
        <div className="text-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-xl border-t border-border bg-muted px-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeftIcon />
            </CommandMenuKbd>{" "}
            Buka
          </div>
          <Separator orientation="vertical" className="h-4!" />
          <div className="flex items-center gap-1">
            <CommandMenuKbd>⌘</CommandMenuKbd>
            <CommandMenuKbd>K</CommandMenuKbd>
            Search
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CommandMenuItem({
  children,
  className,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  "data-selected"?: string;
  "aria-selected"?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <CommandItem
      ref={ref}
      className={cn(
        "data-[selected=true]:border-input data-[selected=true]:bg-input/50 h-9 rounded-md border border-transparent px-3! font-medium",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  );
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  );
}

export {};
