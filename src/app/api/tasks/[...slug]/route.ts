import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

async function readDb(): Promise<Record<string, Task[]>> {
  try {
    const data = await kv.get<Record<string, Task[]>>("tasks");
    return data || {};
  } catch {
    // If KV doesn't exist, return empty object
    return {};
  }
}

async function writeDb(data: Record<string, Task[]>) {
  await kv.set("tasks", data);
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
