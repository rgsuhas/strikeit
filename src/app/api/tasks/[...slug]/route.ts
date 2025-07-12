import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function readDb(): Promise<Record<string, Task[]>> {
  try {
    const data = await redis.get<Record<string, Task[]>>("tasks");
    return data || {};
  } catch (error) {
    console.error("Redis read error:", error);
    return {};
  }
}

async function writeDb(data: Record<string, Task[]>) {
  try {
    await redis.set("tasks", data);
  } catch (error) {
    console.error("Redis write error:", error);
    throw new Error("Failed to save data");
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const key = slug.join("/");
  const db = await readDb();
  const tasks: Task[] = db[key] || [];
  return NextResponse.json(tasks);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const key = slug.join("/");
  const { text } = await request.json();
  const newTask: Task = { id: Date.now().toString(), text, completed: false };

  const db = await readDb();
  const tasks: Task[] = db[key] || [];
  tasks.push(newTask);
  db[key] = tasks;
  await writeDb(db);

  return NextResponse.json(newTask);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const key = slug.join("/");
  const { id, text, completed } = await request.json();

  const db = await readDb();
  let tasks: Task[] = db[key] || [];
  tasks = tasks
    .map((task) => {
      if (task.id === id) {
        return {
          ...task,
          ...(text !== undefined && { text }),
          ...(completed !== undefined && { completed }),
        };
      }
      return task;
    })
    .filter((task) => !task.completed);
  db[key] = tasks;
  await writeDb(db);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const key = slug.join("/");
  const { id } = await request.json();

  const db = await readDb();
  let tasks: Task[] = db[key] || [];
  tasks = tasks.filter((task) => task.id !== id);
  db[key] = tasks;
  await writeDb(db);

  return NextResponse.json({ success: true });
}
