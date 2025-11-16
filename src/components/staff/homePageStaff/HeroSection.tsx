import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className='staff-hero'>
      <div className='hero-content'>
        <h1 className='hi-staff-text'>Hi Staff</h1>
        <p>
          This system is built to support EV charging station management. Staff can monitor stations, track
          transactions, check charging sessions and verify user activities.
        </p>
        <Button 
          variant="success" 
          size="lg"
          className='start-charge-btn' 
          onClick={() => navigate('/staff/location')}
        >
          Bắt đầu sạc
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
