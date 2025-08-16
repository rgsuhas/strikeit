import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskUpdate {
  id: string;
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

export async function PUT(request: NextRequest) {
  const { listKey, updates } = await request.json();

  if (!listKey || !updates || !Array.isArray(updates)) {
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 });
  }

  const db = await readDb();
  let tasks: Task[] = db[listKey] || [];
  
  // Apply all updates
  tasks = tasks.map((task) => {
    const update = updates.find((u: TaskUpdate) => u.id === task.id);
    return update ? { ...task, completed: update.completed } : task;
  });
  
  db[listKey] = tasks;
  await writeDb(db);

  return NextResponse.json({ success: true });
}
