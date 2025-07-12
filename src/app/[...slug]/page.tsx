"use client";
import ToDoList from "../../components/ToDoList";

type Props = {
  params: {
    slug?: string[];
  };
};

export default function ListPage({ params }: Props) {
  const listKey = params.slug?.join("/") || "home";
  return <ToDoList listKey={listKey} />;
} 