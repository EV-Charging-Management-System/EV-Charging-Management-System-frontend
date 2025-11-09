import React from 'react'

interface BatteryProgressProps {
  battery: number
}

/**
 * Component progress bar hiển thị mức pin
 */
export const BatteryProgress: React.FC<BatteryProgressProps> = ({ battery }) => {
  return (
    <div className='charge-progress'>
      <div className='progress-bar'>
        <div className='progress-fill' style={{ width: `${battery}%` }} />
      </div>
      <span className='battery-level'>{battery}%</span>
    </div>
  )
}
