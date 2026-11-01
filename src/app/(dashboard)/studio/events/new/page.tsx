import { EventForm } from "@/features/events/components/EventForm";
export const metadata = { title: "Add event" };
export default function Page() {
  return (
    <main id="main-content">
      <EventForm />
    </main>
  );
}
