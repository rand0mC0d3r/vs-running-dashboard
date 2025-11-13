import { exec } from "child_process";
import * as https from "https";

export function run(cmd: string): Promise<string> {
  return new Promise(resolve =>
    exec(cmd, { encoding: "utf8", maxBuffer: 10_000_000 }, (err, out) =>
      resolve(err ? "" : out.trim())
    )
  );
}

export async function detectPorts() {
  let out = await run("ss -tulpn || netstat -tulpn 2>/dev/null || true");
  const lines = out.split("\n").slice(1);
  const ports: number[] = [];
  for (const l of lines) {
    const m = l.match(/[:](\d{1,5})/);
    if (m) {ports.push(Number(m[1]));}
  }
  return [...new Set(ports)];
}

export async function getDockerPorts() {
  const out = await run(`docker ps --format "{{.Names}}|{{.Ports}}"`);
  return out
    .split("\n")
    .filter(Boolean)
    .map(line => {
      const [name, ports] = line.split("|");
      const published = Array.from(line.matchAll(/:(\d+)->/g)).map(m => Number(m[1]));
      return { name, published };
    });
}

export async function probeTitle(port: number): Promise<{ url: string; match: string }> {
  const urls = [
    `http://127.0.0.1:${port}`,
    `https://127.0.0.1:${port}`
  ];
  const agent = new https.Agent({ rejectUnauthorized: false }) as any;
  for (const url of urls) {
    try {
      const res = await fetch(url, { agent, redirect: "follow", signal: AbortSignal.timeout(3000) });
      const text = await res.text();
      const match = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (match) {return { url, match: match[1].trim() };}
    } catch (_) {}
  }
  return { url: "", match: "" };
}
