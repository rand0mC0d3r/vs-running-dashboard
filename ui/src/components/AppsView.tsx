import React from 'react';
import { AppData } from '../types';
import { AppPanel } from './General/AppPanel';
import { ResizablePanel } from './General/ResizablePanel';

interface AppsViewProps {
  appsData: AppData;
}

export const AppsView: React.FC<AppsViewProps> = ({
  appsData,
}) => {

  return <ResizablePanel title="Running Applications">
    <div style={{
      display: 'grid',
      gridTemplateRows: `repeat(${Math.round(Math.sqrt(appsData.length)) + 0}, 1fr)`,
      gridTemplateColumns: `repeat(${Math.round(Math.sqrt(appsData.length)) + 0}, 1fr)`,
      height: '100%',
      justifyContent: 'space-between',
      // flexDirection: 'row',
      // flexWrap: 'wrap',
      gap: '24px',
      padding: '8px'
    }}>
      {appsData.map(dataItem => <AppPanel title={`${dataItem.title} ${dataItem.url} (${dataItem.port})`} key={dataItem.port} >
        {dataItem.url.length > 0 && <iframe src={dataItem.url} title={dataItem.title} style={{ width: '100%', height: '100%', border: 0, padding: 0 }} />}
      </AppPanel>)}
    </div>
  </ResizablePanel>
};
