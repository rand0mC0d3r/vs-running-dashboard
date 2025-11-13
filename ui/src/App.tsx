import './App.css';
import { AppsView } from './components/AppsView';
import { Header } from './components/Header';
import { useVSCodeApi } from './hooks/useVSCodeApi';

function App() {
  const { bundleData = [], theme, error, vscodeApi } = useVSCodeApi();

  return (
    <div className={`app theme-${theme.kind === 1 ? 'light' : 'dark'}`}>
      {bundleData && <Header
        appsData={bundleData}
        onRefresh={() => vscodeApi.postMessage({ command: 'refresh' })}
      />}

      <div className="content">
        {error ? (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        ) : bundleData ? (
          <div className="main-layout">

            <AppsView appsData={bundleData} />

          </div>
        ) : (
          <div className="loading">
            No bundle data available. Please open a file or refresh.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
