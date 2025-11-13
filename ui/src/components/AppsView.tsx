import React from 'react';
import { AppData } from '../types';
import { ResizablePanel } from './General/ResizablePanel';

interface AppsViewProps {
  appsData: AppData;
}

export const AppsView: React.FC<AppsViewProps> = ({
  appsData,
}) => {

  return <ResizablePanel title="Asset Structure">
    <div style={{ display: 'flex', height: '100%', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', padding: '8px' }}>
      {appsData.map(dataItem => <div key={dataItem.port} style={{ display: 'flex', flex: '0 1 33%'}}>
        <div>{dataItem.port}</div>
        <div>{dataItem.url}</div>
        <div>{dataItem.title}</div>
        <div><iframe src={'https://de.wikipedia.org/wiki/Brennhaare_bei_Vogelspinnen#Bombardierspinne'} title={dataItem.title} style={{ width: '100%', height: '100%' }} /></div>
      </div>)}
    </div>
  </ResizablePanel>
};
