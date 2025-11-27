import React from 'react';
import { Button } from 'react-bootstrap';
import { FaSyncAlt } from 'react-icons/fa';
import type { Session } from './types';
import SessionCard from './SessionCard';

interface WaitingListProps {
  sessions: Session[];
  onStartCharging: (session: Session) => void;
  onRefresh: () => void;
}

const WaitingList: React.FC<WaitingListProps> = ({ sessions, onStartCharging, onRefresh }) => {
  return (
    <>
      <h2 className="charging-title d-flex justify-content-between align-items-center">
        Upcoming Charging Sessions
        <Button 
          variant="outline-success" 
          size="sm" 
          onClick={onRefresh} 
          title="Refresh list"
        >
          <FaSyncAlt />
        </Button>
      </h2>

      <div className="waiting-list">
        {sessions.length === 0 ? (
          <p className="text-center text-muted">No charging sessions yet</p>
        ) : (
          sessions.map(session => (
            <SessionCard 
              key={session.SessionId} 
              session={session} 
              onStartCharging={onStartCharging} 
            />
          ))
        )}
      </div>
    </>
  );
};

export default WaitingList;
