import React from 'react';
import ProfileStaff from '../../ProfileStaff';

interface PageHeaderProps {
  title: string;
  subtitle: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="charging-header">
      <h1>{title} {subtitle}</h1>
      <ProfileStaff />
    </header>
  );
};

export default PageHeader;
