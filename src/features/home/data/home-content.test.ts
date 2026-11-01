import assert from "node:assert/strict";
import test from "node:test";
import {getFeaturedContent} from "./home-content";
import {formatEventTime} from "../../events/lib/dates";
import type {StreamEvent} from "../../events/types/event.types";
const now=Date.parse("2026-11-01T10:00:00Z");
const event:StreamEvent={id:"event-a",slug:"event-a",title:"Celebration",description:"",youtubeId:"abcdefghijk",startsAt:"2026-12-12T05:00:00Z",isVisible:true,createdAt:"2026-10-01T00:00:00Z",updatedAt:"2026-10-01T00:00:00Z"};
test("empty and all-hidden lists show no public event",()=>{assert.deepEqual(getFeaturedContent([],now),{kind:"empty"});assert.deepEqual(getFeaturedContent([{...event,isVisible:false}],now),{kind:"empty"});});
test("the latest started visible event is featured with a neutral watch label",()=>{const older={...event,id:"older",startsAt:"2026-10-01T00:00:00Z"};const latest={...event,id:"latest",startsAt:"2026-11-01T09:00:00Z"};assert.deepEqual(getFeaturedContent([event,older,latest],now),{kind:"watch",event:latest});});
test("an older event stays watchable while visibility remains on",()=>{const old={...event,startsAt:"2020-01-01T00:00:00Z"};assert.deepEqual(getFeaturedContent([old],now),{kind:"watch",event:old});});
test("without a started event show the earliest upcoming event",()=>{const later={...event,id:"later",startsAt:"2026-12-25T00:00:00Z"};assert.deepEqual(getFeaturedContent([later,event],now),{kind:"upcoming",event});});
test("hidden started events cannot take priority over a visible upcoming event",()=>{assert.deepEqual(getFeaturedContent([{...event,id:"hidden",isVisible:false,startsAt:"2026-10-01T00:00:00Z"},event],now),{kind:"upcoming",event});});
test("selecting a featured event does not reorder the input",()=>{const events=[event,{...event,id:"earlier",startsAt:"2026-11-02T00:00:00Z"}];getFeaturedContent(events,now);assert.equal(events[0].id,event.id);});
test("times are displayed in India Standard Time",()=>{assert.match(formatEventTime("2026-12-12T05:00:00Z"),/10:30.*IST/);});

