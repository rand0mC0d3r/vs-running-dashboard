import React from 'react';

interface AppPanelProps {
  title: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  titleChildren?: React.ReactNode;
}

export const AppPanel: React.FC<AppPanelProps> = ({
  title,
  style,
  children,
  titleChildren,
}) => {

  return (
    <div className="app-panel" style={{ flex: '1 1 auto', ...style }}>
      <div className="app-panel-header" style={{ minHeight: '24px'}}>
        <h3 style={{ lineHeight: 0 }}>{title}</h3>
        {titleChildren}
      </div>
      <div className="app-panel-content">
        {children}
      </div>
    </div>
  );
};
