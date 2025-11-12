import { useNavigate } from 'react-router-dom'

const StaffSideBar = () => {
  const navigate = useNavigate()
  return (
    <>
      <aside>
        <div className='charging-sidebar'>
          <div className='charging-logo'>⚡ EV STAFF</div>
          <nav className='charging-menu'>
            <ul>
              <li onClick={() => navigate('/staff')}>About</li>
              <li onClick={() => navigate('/staff/location')}>Location</li>
              <li onClick={() => navigate('/staff/charging-process')}>Charging Process</li>
              <li onClick={() => navigate('/staff/invoice')}>Invoice</li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}
export default StaffSideBar;
