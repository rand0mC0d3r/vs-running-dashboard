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
}

export function deactivate() {}
