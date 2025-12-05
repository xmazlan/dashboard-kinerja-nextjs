import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type SearchItem = {
  id: string;
  label: string;
  category: string;
  path: string;
  keywords: string[];
};

function toLabel(fileName: string) {
  const base = fileName.replace(/\.[tj]sx?$/, "");
  return base
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractKeywords(filePath: string, relPath: string, category: string): string[] {
  const keywords = new Set<string>();
  keywords.add(category);
  relPath.split(/[\\/\-_]/).forEach((t) => t && keywords.add(t.toLowerCase()));
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const titleRegex = /title\s*=\s*"([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = titleRegex.exec(content))) {
      const t = m[1].trim();
      if (t) keywords.add(t.toLowerCase());
    }
    const hRegex = /<h\d[^>]*>([^<]+)<\/h\d>/g;
    while ((m = hRegex.exec(content))) {
      const t = m[1].trim();
      if (t) keywords.add(t.toLowerCase());
    }
  } catch {}
  return Array.from(keywords);
}

function walk(dir: string, baseDir: string, out: SearchItem[] = []): SearchItem[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, baseDir, out);
    } else if (/\.[tj]sx?$/.test(entry.name)) {
      const rel = path.relative(baseDir, full);
      const parts = rel.split(path.sep);
      const category = parts.length > 1 ? parts[0] : "root";
      const keywords = extractKeywords(full, rel, category);
      out.push({
        id: rel,
        label: toLabel(entry.name),
        category,
        path: rel,
        keywords,
      });
    }
  }
  return out;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const baseDir = path.join(process.cwd(), "components", "section", "roby", "data");
    const items = walk(baseDir, baseDir);
    const filtered = q
      ? items.filter(
          (it) =>
            it.label.toLowerCase().includes(q) ||
            it.category.toLowerCase().includes(q) ||
            it.path.toLowerCase().includes(q) ||
            it.keywords.some((kw) => kw.includes(q))
        )
      : items;
    return NextResponse.json({ items: filtered });
  } catch (e) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
