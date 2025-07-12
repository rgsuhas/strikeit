import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db", "tasks.json");
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000; // 1 minute
const ipHits: Record<string, { count: number; start: number }> = {};

type Task = { id: string; text: string; completed: boolean };
type Store = Record<string, Task[]>;

function getListKey(slug: string[] | undefined) {
  return (slug && slug.length > 0 ? slug.join("/") : "home");
}

function getIP(req: NextRequest) {
  return req.headers.get("x-forwarded-for") || "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  if (!ipHits[ip] || now - ipHits[ip].start > RATE_WINDOW) {
    ipHits[ip] = { count: 1, start: now };
    return false;
  }
  if (ipHits[ip].count >= RATE_LIMIT) {
    return true;
  }
  ipHits[ip].count++;
  return false;
}

async function readStore(): Promise<Store> {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data || "{}") as Store;
  } catch {
    return {};
  }
}

async function writeStore(store: Store) {
  await fs.writeFile(DB_PATH, JSON.stringify(store, null, 2), "utf8");
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, { params }: any) {
  const ip = getIP(req);
  if (checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const key = getListKey(params?.slug);
  const store = await readStore();
  return NextResponse.json(store[key] || []);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export async function POST(req: NextRequest, { params }: any) {
  const ip = getIP(req);
  if (checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const key = getListKey(params?.slug);
  const { text } = await req.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }
  const store = await readStore();
  const newTask = { id: Date.now().toString(), text, completed: false };
  store[key] = [...(store[key] || []), newTask];
  await writeStore(store);
  return NextResponse.json(newTask);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, { params }: any) {
  const ip = getIP(req);
  if (checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const key = getListKey(params?.slug);
  const { id, text, completed } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const store = await readStore();
  store[key] = (store[key] || []).map(t =>
    t.id === id ? { ...t, text: text ?? t.text, completed: completed ?? t.completed } : t
  );
  await writeStore(store);
  return NextResponse.json({ success: true });
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, { params }: any) {
  const ip = getIP(req);
  if (checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const key = getListKey(params?.slug);
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const store = await readStore();
  store[key] = (store[key] || []).filter(t => t.id !== id);
  await writeStore(store);
  return NextResponse.json({ success: true });
}