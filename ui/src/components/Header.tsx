import React from 'react';
import { isDevelopmentMode } from '../mockApi';
import { AppData } from '../types';
import { MiniToolbar } from './Header/MiniToolbar';

interface HeaderProps {
  appsData: AppData;
  onRefresh: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  appsData,
  onRefresh,
}) => {

  const visualizationItems = [

    {
        action: onRefresh,
        disabled: false,
        isVisible: false,
        label: 'Refresh',
        name: 'refresh',
        title: 'Refresh bundle data',
    }
  ]

  return (
    <div className="header">
      <div className="header-title">
        {isDevelopmentMode() && (
          <span className="dev-indicator">DEV</span>
        )}
        <div className="toolbar-section">
          <span className="toolbar-label">Bundle files:</span>
          <span className="toolbar-value">{appsData?.length}</span>
        </div>

      </div>

      <div className="toolbar">
        <MiniToolbar items={visualizationItems} />
      </div>
    </div>
  );
};
