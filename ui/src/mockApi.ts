import { BundleData, VSCodeAPI, VSCodeMessage } from './types';

// Mock bundle data for testing
let mockBundleData: BundleData | null = null;

// Load mock data from mock.json
async function loadMockData(): Promise<BundleData> {
  try {
    const response = await fetch('/mock.json');
    if (!response.ok) {
      throw new Error(`Failed to load mock data: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading mock data:', error);
    // Fallback mock data
    return [{"port":53,"url":"(no HTTP)","title":"(no HTTP)","docker":""},{"port":323,"url":"(no HTTP)","title":"(no HTTP)","docker":""},{"port":1,"url":"(no HTTP)","title":"(no HTTP)","docker":""},{"port":39355,"url":"(no HTTP)","title":"(no HTTP)","docker":""},{"port":60048,"url":"(no HTTP)","title":"(no HTTP)","docker":""},{"port":6930,"url":"(no HTTP)","title":"(no HTTP)","docker":""},{"port":6099,"url":"(no HTTP)","title":"(no HTTP)","docker":""},{"port":53860,"url":"(no HTTP)","title":"(no HTTP)","docker":""},{"port":5215,"url":"(no HTTP)","title":"(no HTTP)","docker":""}]
;
  }
}

// Mock VS Code API for development
export function createMockVSCodeApi(): VSCodeAPI {
  return {
    postMessage: (message: VSCodeMessage) => {
      console.log('Mock VSCode API - Sending message:', message);

      // Simulate responses
      setTimeout(() => {
        switch (message.command) {
          case 'ready':
            // Send initial data and theme
            window.dispatchEvent(new MessageEvent('message', {
              data: {
                command: 'updateTheme',
                data: { kind: 2 } // Dark theme
              }
            }));

            loadMockData().then(data => {
              mockBundleData = data;
              window.dispatchEvent(new MessageEvent('message', {
                data: {
                  command: 'updateData',
                  data: mockBundleData
                }
              }));
            }).catch(error => {
              window.dispatchEvent(new MessageEvent('message', {
                data: {
                  command: 'error',
                  data: error.message
                }
              }));
            });
            break;

          case 'refresh':
            // Reload mock data
            loadMockData().then(data => {
              mockBundleData = data;
              window.dispatchEvent(new MessageEvent('message', {
                data: {
                  command: 'updateData',
                  data: mockBundleData
                }
              }));
            });
            break;
        }
      }, 100); // Small delay to simulate async behavior
    },

    getState: () => {
      return { mockBundleData };
    },

    setState: (state: any) => {
      console.log('Mock VSCode API - Setting state:', state);
    }
  };
}

// Check if we're running in development mode (not in VS Code)
export function isDevelopmentMode(): boolean {
  return !window.acquireVsCodeApi || process.env.NODE_ENV === 'development';
}
