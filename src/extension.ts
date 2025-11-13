import * as vscode from "vscode";
import { BundleVisualizerProvider } from './webview';

export async function activate(context: vscode.ExtensionContext) {

  const provider = new BundleVisualizerProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.commands.registerCommand('bundleVisualizer.show', () => provider.show()),
    vscode.commands.registerCommand('bundleVisualizer.refresh', () => provider.refresh()),
    { dispose: () => provider.dispose() },
  );

  provider.show();

  // const disposable = vscode.commands.registerCommand("discoverUI.run", async () => {
  //   vscode.window.withProgress(
  //     { location: vscode.ProgressLocation.Notification, title: "Scanning ports...", cancellable: false },
  //     async progress => {
  //       const ports = await detectPorts();
  //       progress.report({ message: `Found ${ports.length} open ports` });

  //       const dockers = await getDockerPorts();
  //       const results: any[] = [];

  //       for (const port of ports) {
  //         const { url, match } = await probeTitle(port);
  //         const docker = dockers.find(d => d.published.includes(port));
  //         results.push({
  //           port,
  //           url: url || "(no HTTP)",
  //           title: match || "(no HTTP)",
  //           docker: docker ? docker.name : ""
  //         });
  //       }

  //       // Build simple HTML table
  //       const html = `
  //         <!DOCTYPE html>
  //         <html>
  //         <head>
  //           <meta charset="UTF-8">
  //           <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src http: https:; style-src 'unsafe-inline'; script-src 'unsafe-inline';">
  //         </head>
  //         <body style="font-family: sans-serif;">
  //         <h2>Discovered UI Ports</h2>
  //         <table border="1" cellspacing="0" cellpadding="4">
  //         <tr><th>Port</th><th>URL</th><th>Title</th><th>Docker Container</th></tr>
  //         ${results
  //           .map(
  //             r =>
  //               `<tr>
  //                   <td>${r.port}</td>
  //                   <td>
  //                     ${r.url}
  //                     <iframe
  //                       allow="clipboard-read; clipboard-write, fullscreen; web-share, camera; microphone, payment, ambient-light-sensor; accelerometer; gyroscope; magnetometer; display-capture"
  //                       src="${r.url}"
  //                       allowfullscreen
  //                      width="600" height="400"></iframe>
  //                   </td>
  //                   <td>${r.title}</td>
  //                   <td>${r.docker}</td>
  //                 </tr>`
  //           )
  //           .join("\n")}
  //         </table>
  //         </body></html>`;

  //       const panel = vscode.window.createWebviewPanel(
  //         "discoverUI",
  //         "Discovered UI Ports",
  //         vscode.ViewColumn.Active,
  //         {
  //           enableScripts: true,
  //           enableForms: true,
  //           retainContextWhenHidden: true
  //         }
  //       );
  //       panel.webview.html = html;
  //     }
  //   );
  // });

  // context.subscriptions.push(disposable);
}

export function deactivate() {}
