
const API = "https://api.erlc.gg";
const KEY = process.env.ERLC_SERVER_KEY;
const DRY_RUN = true;

const MESSAGE =
  "Welcome to Florida Horizon Roleplay! Join our Roblox community group, Florida Horizon Roleplay WL, for updates and announcements. Enjoy your stay!";

const seen = new Set();
let initialized = false;

async function checkJoins() {
  if (!KEY) {
    console.error("Missing ERLC_SERVER_KEY");
    return;
  }

  try {
    const response = await fetch(
      `${API}/v1/server/joinlogs`,
      { headers: { "Server-Key": KEY } }
    );

    if (!response.ok) {
      console.log("API status:", response.status);
      return;
    }

    const logs = await response.json();

    if (!Array.isArray(logs)) {
      console.log("Unexpected join-log response");
      return;
    }

    for (const log of logs) {
      const id = JSON.stringify(log);
      if (seen.has(id)) continue;
      seen.add(id);

      if (!initialized) continue;

      // Only process entries explicitly marked as joins.
      if (log.Join !== true && log.join !== true) continue;

      const player = log.Player || log.player;
      if (!player) continue;

      console.log(
        `[DRY RUN] Welcome ${player}: ${MESSAGE}`
      );
    }

    initialized = true;
    if (seen.size > 1000) seen.clear();
  } catch (error) {
    console.error("Join check failed:", error.message);
  }
}

console.log("Florida Horizon Welcome Bot starting");
console.log("Dry-run mode:", DRY_RUN);

await checkJoins();
setInterval(checkJoins, 60000);
