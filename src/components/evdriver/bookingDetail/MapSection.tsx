import React from 'react'
import mapImage from '../../../assets/vihiclebg.jpg'

/**
 * Component hiển thị map image
 */
export const MapSection: React.FC = () => {
  return (
    <div className='map-detail'>
      <img src={mapImage} alt='map' className='map-image' />
    </div>
  )
}
