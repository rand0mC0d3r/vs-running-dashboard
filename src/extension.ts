import { exec } from "child_process";
import * as https from "https";
import * as vscode from "vscode";

function run(cmd: string): Promise<string> {
  return new Promise(resolve =>
    exec(cmd, { encoding: "utf8", maxBuffer: 10_000_000 }, (err, out) =>
      resolve(err ? "" : out.trim())
    )
  );
}

async function detectPorts() {
  let out = await run("ss -tulpn || netstat -tulpn 2>/dev/null || true");
  const lines = out.split("\n").slice(1);
  const ports: number[] = [];
  for (const l of lines) {
    const m = l.match(/[:](\d{1,5})/);
    if (m) {ports.push(Number(m[1]));}
  }
  return [...new Set(ports)];
}

async function getDockerPorts() {
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

async function probeTitle(port: number): Promise<{ url: string; match: string }> {
  const urls = [
    `http://127.0.0.1:${port}`,
    `https://127.0.0.1:${port}`
  ];
  const agent = new https.Agent({ rejectUnauthorized: false });
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

export async function activate(context: vscode.ExtensionContext) {
  console.log('Extension "discover-ui-ports" is now active!');
  const disposable = vscode.commands.registerCommand("discoverUI.run", async () => {
    vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "Scanning ports...", cancellable: false },
      async progress => {
        const ports = await detectPorts();
        progress.report({ message: `Found ${ports.length} open ports` });

        const dockers = await getDockerPorts();
        const results: any[] = [];

        for (const port of ports) {
          const { url, match } = await probeTitle(port);
          const docker = dockers.find(d => d.published.includes(port));
          results.push({
            port,
            url: url || "(no HTTP)",
            title: match || "(no HTTP)",
            docker: docker ? docker.name : ""
          });
        }

        // Build simple HTML table
        const html = `
          <html>
          <body style="font-family: sans-serif;">
          <h2>Discovered UI Ports</h2>
          <table border="1" cellspacing="0" cellpadding="4">
          <tr><th>Port</th><th>URL</th><th>Title</th><th>Docker Container</th></tr>
          ${results
            .map(
              r =>
                `<tr>
                    <td>${r.port}</td>
                    <td>
                      ${r.url}
                      <iframe

                        src="${r.url}"
                        allowfullscreen
                       width="600" height="400"></iframe>
                    </td>
                    <td>${r.title}</td>
                    <td>${r.docker}</td>
                  </tr>`
            )
            .join("\n")}
          </table>
          </body></html>`;

        const panel = vscode.window.createWebviewPanel(
          "discoverUI",
          "Discovered UI Ports",
          vscode.ViewColumn.Active,
          {}
        );
        panel.webview.html = html;
      }
    );
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
