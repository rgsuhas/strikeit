import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Initialize Redis
const redis = Redis.fromEnv();

const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000; // 1 minute
const ipHits: Record<string, { count: number; start: number }> = {};

type Task = { id: string; text: string; completed: boolean };

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

async function readStore(listKey: string): Promise<Task[]> {
  const data = await redis.get<string>(`list:${listKey}`);
  if (!data) return [];
  try {
    return JSON.parse(data) as Task[];
  } catch {
    return [];
  }
}

async function writeStore(listKey: string, tasks: Task[]) {
  await redis.set(`list:${listKey}`, JSON.stringify(tasks));
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, { params }: any) {
  const ip = getIP(req);
  if (checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const listKey = getListKey(params?.slug);
  const tasks = await readStore(listKey);
  return NextResponse.json(tasks);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export async function POST(req: NextRequest, { params }: any) {
  const ip = getIP(req);
  if (checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const listKey = getListKey(params?.slug);
  const { text } = await req.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }
  const tasks = await readStore(listKey);
  const newTask = { id: Date.now().toString(), text, completed: false };
  const updated = [...tasks, newTask];
  await writeStore(listKey, updated);
  return NextResponse.json(newTask);
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export async function PUT(req: NextRequest, { params }: any) {
  const ip = getIP(req);
  if (checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const listKey = getListKey(params?.slug);
  const { id, text, completed } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const tasks = await readStore(listKey);
  const updated = tasks.map(t =>
    t.id === id ? { ...t, text: text ?? t.text, completed: completed ?? t.completed } : t
  );
  await writeStore(listKey, updated);
  return NextResponse.json({ success: true });
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
export async function DELETE(req: NextRequest, { params }: any) {
  const ip = getIP(req);
  if (checkRateLimit(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  const listKey = getListKey(params?.slug);
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const tasks = await readStore(listKey);
  const updated = tasks.filter(t => t.id !== id);
  await writeStore(listKey, updated);
  return NextResponse.json({ success: true });
}