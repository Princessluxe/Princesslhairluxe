// Replacement for Claude's built-in `window.storage` API (get/set/delete/list),
// implemented with the browser's localStorage so the site's admin panel,
// discount codes, and order storage keep working once deployed outside Claude.
//
// IMPORTANT LIMITATION: localStorage is per-browser, per-device. It is NOT a
// real shared database. That means:
//   - An order a customer places on their phone will NOT show up in your
//     admin panel if you're viewing it on your laptop.
//   - Discount codes generated on one device won't be visible/redeemable
//     from another device.
//   - Clearing browser data/cache wipes everything.
//
// This is fine for local testing, demos, or single-device use, but for a
// real multi-device storefront you'll eventually want a real backend
// (e.g. Firebase, Supabase, or a small custom API). Ask Claude for help
// wiring one up if/when you're ready for that step — the rest of the site's
// code won't need to change, only this file.

const PREFIX = "phl";

function storageKey(key, shared) {
  return `${PREFIX}:${shared ? "shared" : "private"}:${key}`;
}

async function get(key, shared = false) {
  try {
    const raw = localStorage.getItem(storageKey(key, shared));
    if (raw === null) return null;
    return { key, value: raw, shared: !!shared };
  } catch (e) {
    return null;
  }
}

async function set(key, value, shared = false) {
  try {
    localStorage.setItem(storageKey(key, shared), value);
    return { key, value, shared: !!shared };
  } catch (e) {
    return null;
  }
}

async function del(key, shared = false) {
  try {
    localStorage.removeItem(storageKey(key, shared));
    return { key, deleted: true, shared: !!shared };
  } catch (e) {
    return null;
  }
}

async function list(prefix = "", shared = false) {
  try {
    const fullPrefix = storageKey(prefix, shared);
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(fullPrefix)) {
        keys.push(k.slice(`${PREFIX}:${shared ? "shared" : "private"}:`.length));
      }
    }
    return { keys, prefix, shared: !!shared };
  } catch (e) {
    return { keys: [], prefix, shared: !!shared };
  }
}

export function installStorageShim() {
  if (typeof window !== "undefined" && !window.storage) {
    window.storage = { get, set, delete: del, list };
  }
}
