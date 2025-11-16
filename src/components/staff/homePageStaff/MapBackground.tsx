import React from 'react';

const MapBackground: React.FC = () => {
  return (
    <iframe
      title='HomePage Staff Map'
      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.484!2d106.7009!3d10.776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f!2sTP.HCM!5e0!3m2!1sen!2s!4v1690000000000'
      className='staff-map'
      allowFullScreen
      loading='lazy'
    />
  );
};

export default MapBackground;
