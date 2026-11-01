import type {FeaturedContent,StreamEvent} from "../types/home.types";
export {formatEventDate,formatEventTime} from "../../events/lib/dates";
export function getFeaturedContent(events:readonly StreamEvent[],now=Date.now()):FeaturedContent {
 const visible=events.filter(event=>event.isVisible);
 const started=visible.filter(event=>Date.parse(event.startsAt)<=now).sort((a,b)=>Date.parse(b.startsAt)-Date.parse(a.startsAt)||b.createdAt.localeCompare(a.createdAt))[0];
 if(started)return {kind:"watch",event:started};
 const next=visible.filter(event=>Date.parse(event.startsAt)>now).sort((a,b)=>Date.parse(a.startsAt)-Date.parse(b.startsAt))[0];
 return next?{kind:"upcoming",event:next}:{kind:"empty"};
}
export const faqs=[
 {question:"Do I need an account to watch?",answer:"No. Open an event and press play. You can watch directly on the event page without creating an account."},
 {question:"Can I watch on my phone?",answer:"Yes. You can watch on a phone, tablet or computer using a modern browser and an internet connection."},
 {question:"What if an event has not started or has ended?",answer:"YouTube shows the waiting screen, broadcast or available recording inside the event page. If there are no public events, you can contact Girish about the next celebration."},
 {question:"How can I arrange streaming for my event?",answer:"Call Girish on +91 9663336789 or +91 9739336789 to discuss your occasion, date and streaming requirements."},
] as const;
