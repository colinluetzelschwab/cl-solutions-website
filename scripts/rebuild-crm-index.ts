/**
 * Rebuild crm/{collection}/_index.json from the actual record blobs.
 *
 * Cause: crmCreate's read-modify-write cycle on _index.json is racy under
 * rapid sequential writes against Vercel Blob (list() can return a stale
 * URL pointing to a pre-write index version, which then gets overwritten
 * by a later write that didn't see the earlier entries).
 *
 * Fix here: enumerate record blobs, hydrate them, project to index entries,
 * write the index. Idempotent.
 */

import { list, put } from "@vercel/blob";
import { crmGet } from "../app/jarvis/lib/crm-store";
import type { Lead, Outreach } from "../app/jarvis/lib/crm-types";

async function rebuildLeads() {
  const { blobs } = await list({ prefix: "crm/leads/" });
  const recordBlobs = blobs.filter((b) => !b.pathname.endsWith("/_index.json"));
  console.log(`[leads] ${recordBlobs.length} record blob(s) found`);

  const idx: Array<{
    id: string;
    name: string;
    status: Lead["status"];
    priority: Lead["priority"];
    updatedAt: string;
  }> = [];

  for (const b of recordBlobs) {
    const id = b.pathname.replace("crm/leads/", "").replace(".json", "");
    const rec = await crmGet("leads", id);
    if (!rec) {
      console.log(`  [skip] ${id} hydration failed`);
      continue;
    }
    idx.push({
      id: rec.id,
      name: rec.businessName,
      status: rec.status,
      priority: rec.priority,
      updatedAt: rec.updatedAt,
    });
    console.log(`  [ok]   ${rec.id}  ${rec.businessName}  status=${rec.status}`);
  }

  await put("crm/leads/_index.json", JSON.stringify(idx), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
  console.log(`[leads] index written with ${idx.length} entries`);
}

async function rebuildOutreach() {
  const { blobs } = await list({ prefix: "crm/outreach/" });
  const recordBlobs = blobs.filter((b) => !b.pathname.endsWith("/_index.json"));
  console.log(`[outreach] ${recordBlobs.length} record blob(s) found`);

  const idx: Array<{
    id: string;
    leadId: string;
    subject: string;
    sentAt?: string;
    followUpAt?: string;
    replyStatus: Outreach["replyStatus"];
    updatedAt: string;
  }> = [];

  for (const b of recordBlobs) {
    const id = b.pathname.replace("crm/outreach/", "").replace(".json", "");
    const rec = await crmGet("outreach", id);
    if (!rec) {
      console.log(`  [skip] ${id} hydration failed`);
      continue;
    }
    idx.push({
      id: rec.id,
      leadId: rec.leadId,
      subject: rec.subject,
      sentAt: rec.sentAt,
      followUpAt: rec.followUpAt,
      replyStatus: rec.replyStatus,
      updatedAt: rec.updatedAt,
    });
    console.log(`  [ok]   ${rec.id}  → ${rec.leadId}  "${rec.subject}"`);
  }

  await put("crm/outreach/_index.json", JSON.stringify(idx), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
  console.log(`[outreach] index written with ${idx.length} entries`);
}

async function main() {
  await rebuildLeads();
  console.log();
  await rebuildOutreach();
  console.log("\ndone");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
