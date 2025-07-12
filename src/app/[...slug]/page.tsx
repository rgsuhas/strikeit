"use client";
import ToDoList from "../../components/ToDoList";
import { useParams } from "next/navigation";

export default function ListPage() {
  const params = useParams();
  const slug = params.slug as string[] | undefined;
  const listKey = slug?.join("/") || "home";
  return <ToDoList listKey={listKey} />;
} 