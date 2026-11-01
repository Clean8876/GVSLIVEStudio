"use client";
import { useEffect, useState, type FormEvent } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
export default function TestConnection() {
  const [text, setText] = useState("");
  const [items, setItems] = useState<{ id: string; text: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => onSnapshot(collection(db, "connection_tests"), (snapshot) => {
    setItems(snapshot.docs.map((item) => ({ id: item.id, text: String(item.data().text ?? "") })));
    setLoading(false);
  }, (error) => { setMessage(error.message); setLoading(false); }), []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    setSaving(true); setMessage("");
    try { await addDoc(collection(db, "connection_tests"), { text: text.trim() }); setText(""); setMessage("Saved successfully."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Could not save."); }
    finally { setSaving(false); }
  }
  return <main className="mx-auto max-w-xl space-y-4 p-8"><h1 className="text-2xl font-bold">Test Firestore connection</h1><form onSubmit={submit} className="flex gap-2"><label htmlFor="test-text" className="sr-only">Test message</label><input id="test-text" className="min-w-0 flex-1 rounded border p-2" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter a message"/><button className="rounded bg-blue-900 px-4 text-white disabled:opacity-50" disabled={saving}>{saving ? "Saving…" : "Save"}</button></form>{message && <p role="status">{message}</p>}{loading ? <p>Loading…</p> : <ul className="list-inside list-disc">{items.map((item) => <li key={item.id}>{item.text}</li>)}</ul>}</main>;
}
