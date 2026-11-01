import { randomUUID } from "node:crypto";
import { collection, doc, getDoc, getDocs, query, runTransaction, updateDoc, where, type Firestore } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { StreamEvent, ValidatedEventInput, ValidatedEventPatch } from "../types/event.types";
function asEvent(data: object, id: string): StreamEvent {
  return { ...data, id, hasImage: true } as StreamEvent;
}
function sort(items: StreamEvent[]) {
  return items.sort((a, b) => a.startsAt.localeCompare(b.startsAt) || a.createdAt.localeCompare(b.createdAt));
}
export class EventRepository {
  private events;
  constructor(database: Firestore = db, private ownerId?: string) {
    this.events = collection(database, "events");
    this.database = database;
  }
  private database: Firestore;
  async listAll(): Promise<StreamEvent[]> {
    const snapshot = await getDocs(query(this.events, where("ownerId", "==", this.ownerId)));
    return sort(snapshot.docs.map((item) => asEvent(item.data(), item.id)));
  }
  async listPublic(): Promise<StreamEvent[]> {
    const snapshot = await getDocs(query(this.events, where("isVisible", "==", true)));
    return sort(snapshot.docs.map((item) => asEvent(item.data(), item.id)));
  }
  async getById(id: string): Promise<StreamEvent | null> {
    const item = await getDoc(doc(this.events, id));
    return item.exists() && (!this.ownerId || item.data().ownerId === this.ownerId) ? asEvent(item.data(), item.id) : null;
  }
  async getBySlug(slug: string): Promise<StreamEvent | null> {
    const items = await this.listPublic();
    return items.find((item) => item.slug === slug) ?? null;
  }
  async getPublicBySlug(slug: string): Promise<StreamEvent | null> {
    const event = await this.getBySlug(slug);
    return event?.isVisible ? event : null;
  }
  async create(data: ValidatedEventInput, requestKey?: string): Promise<StreamEvent> {
    const id = requestKey ? `request-${requestKey}` : randomUUID();
    const ref = doc(this.events, id);
    const base = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "event";
    const now = new Date().toISOString();
    const event: StreamEvent & { ownerId?: string } = { ...data, ownerId: this.ownerId, id, slug: `${base}-${randomUUID()}`, createdAt: now, updatedAt: now };
    return runTransaction(this.database, async (transaction) => {
      const existing = await transaction.get(ref);
      if (existing.exists()) {
        if (existing.data().ownerId !== this.ownerId) throw new Error("Event belongs to another user.");
        return asEvent(existing.data(), existing.id);
      }
      transaction.set(ref, event);
      return { ...event, hasImage: true };
    });
  }
  async update(id: string, patch: ValidatedEventPatch): Promise<StreamEvent | null> {
    const existing = await this.getById(id);
    if (!existing) return null;
    const updated = { ...patch, updatedAt: new Date().toISOString() };
    await updateDoc(doc(this.events, id), updated);
    return { ...existing, ...updated };
  }
}
const repository = new EventRepository();
export function getEventRepository() { return repository; }
