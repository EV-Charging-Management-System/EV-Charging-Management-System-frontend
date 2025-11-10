import React from 'react'

interface SessionControlsProps {
  isCharging: boolean
  finished: boolean
  onStart: () => void
  onStop: () => void
}

/**
 * Component control buttons (Start/Stop/Finished)
 */
export const SessionControls: React.FC<SessionControlsProps> = ({ isCharging, finished, onStart, onStop }) => {
  return (
    <div className='charging-actions'>
      {!isCharging && !finished && (
        <button className='start-btn' onClick={onStart}>
          ⚡ Sạc
        </button>
      )}

      {isCharging && !finished && (
        <button className='stop-btn' onClick={onStop}>
          ⏹️ Dừng phiên sạc
        </button>
      )}

      {finished && <span className='finished-text'>✅ Đã sạc xong</span>}
    </div>
  )
}
