import { useNavigate } from 'react-router-dom'

const StaffSideBar = () => {
  const navigate = useNavigate()
  return (
    <>
      <aside className='charging-sidebar-hover'>
        <div className='charging-sidebar'>
          <div className='charging-logo'>⚡ EV STAFF</div>
          <nav className='charging-menu'>
            <ul>
              <li onClick={() => navigate('/staff')}>About</li>
              <li onClick={() => navigate('/staff/location')}>Location</li>
              <li onClick={() => navigate('/staff/sessions')}>Sessions</li>
              <li className='active'>Charging Process</li>
              <li onClick={() => navigate('/staff/invoice')}>Invoice</li>
              <li onClick={() => navigate('/staff/report')}>Report To Admin</li>
              <li onClick={() => navigate('/staff/settings')}>Settings</li>
            </ul>
          </nav>
          <button className='logout-btn' onClick={() => navigate('/')}>
            ← Exit
          </button>
        </div>
      </aside>
    </>
  )
}
export default StaffSideBar;
