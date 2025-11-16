import React from 'react';
import ProfileStaff from '../../ProfileStaff';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <header className='staff-header'>
      <h1>
        {title} {subtitle && <span>{subtitle}</span>}
      </h1>
      <div className='staff-header-actions'>
        <ProfileStaff />
      </div>
    </header>
  );
};

export default PageHeader;
