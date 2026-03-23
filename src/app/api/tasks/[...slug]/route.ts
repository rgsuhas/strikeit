import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "../../../../lib/supabase";

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const listKey = slug.join("/");
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("list_key", listKey)
    .order("position", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? []);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const listKey = slug.join("/");
  const { text } = await request.json() as { text: string };
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from("tasks")
    .select("position")
    .eq("list_key", listKey)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = existing && existing.length > 0 ? existing[0].position + 1 : 0;

  const { data, error } = await supabase
    .from("tasks")
    .insert({ list_key: listKey, text, completed: false, position: nextPosition })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const listKey = slug.join("/");
  const body = await request.json() as { id: string; text?: string; completed?: boolean };
  const { id, text, completed } = body;
  const supabase = getSupabaseAdmin();

  const updates: { text?: string; completed?: boolean } = {};
  if (text !== undefined) updates.text = text;
  if (completed !== undefined) updates.completed = completed;

  const { error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .eq("list_key", listKey);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const listKey = slug.join("/");
  const { orderedIds } = await request.json() as { orderedIds: string[] };
  const supabase = getSupabaseAdmin();

  const updates = orderedIds.map((id, index) => ({ id, list_key: listKey, position: index }));
  const { error } = await supabase.from("tasks").upsert(updates, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const listKey = slug.join("/");
  const body = await request.json() as { id?: string; reset?: boolean };
  const { id, reset } = body;
  const supabase = getSupabaseAdmin();

  if (reset) {
    const { error } = await supabase.from("tasks").delete().eq("list_key", listKey);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else if (id) {
    const { error } = await supabase.from("tasks").delete().eq("id", id).eq("list_key", listKey);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
