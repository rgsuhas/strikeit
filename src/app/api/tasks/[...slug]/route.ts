import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dbPath = path.resolve(process.cwd(), "db/tasks.json");

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

async function readDb(): Promise<Record<string, Task[]>> {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, return empty object
    return {};
  }
}

async function writeDb(data: Record<string, Task[]>) {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}

interface RouteContext {
  params: { slug: string[]; };
}

export async function GET(req: NextRequest, context: RouteContext) {
  const key = context.params.slug.join("/");
  const db = await readDb();
  const tasks: Task[] = db[key] || [];
  return NextResponse.json(tasks);
}

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  const key = context.params.slug.join("/");
  const { text } = await req.json();
  const newTask: Task = { id: Date.now().toString(), text, completed: false };

  const db = await readDb();
  const tasks: Task[] = db[key] || [];
  tasks.push(newTask);
  db[key] = tasks;
  await writeDb(db);

  return NextResponse.json(newTask);
}

export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  const key = context.params.slug.join("/");
  const { id, text, completed } = await req.json();

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
  req: NextRequest,
  context: RouteContext
) {
  const key = context.params.slug.join("/");
  const { id } = await req.json();

  const db = await readDb();
  let tasks: Task[] = db[key] || [];
  tasks = tasks.filter((task) => task.id !== id);
  db[key] = tasks;
  await writeDb(db);

  return NextResponse.json({ success: true });
}