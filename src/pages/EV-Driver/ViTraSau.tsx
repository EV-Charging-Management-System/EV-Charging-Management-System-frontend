import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../css/ViTraSau.css'
import Footer from '../../pages/layouts/footer'

type Transaction = {
  id: string
  date: string
  month: string
  station: string
  address?: string
  port?: string
  power?: string
  code?: string
  durationMinutes?: number
  kwh?: number
  amount: number
  paid: boolean
}

type ViTraSauData = {
  currentMonth: number
  transactions: Transaction[]
}

const STORAGE_KEY = 'viTraSau'

const loadViTraSau = (): ViTraSauData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { currentMonth: 0, transactions: [] }
    const parsed = JSON.parse(raw) as ViTraSauData
    return {
      currentMonth: typeof parsed.currentMonth === 'number' ? parsed.currentMonth : 0,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : []
    }
  } catch (e) {
    console.error('Error parsing viTraSau', e)
    return { currentMonth: 0, transactions: [] }
  }
}

const saveViTraSau = (data: ViTraSauData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const formatMonthLabel = (monthStr: string) => (monthStr ? `Month ${monthStr}` : '')

const getCurrentMonthString = (d = new Date()) => {
  const m = d.getMonth() + 1
  const y = d.getFullYear()
  return `${m.toString().padStart(2, '0')}/${y}`
}

const getPrevMonthString = (d = new Date()) => {
  const dt = new Date(d.getFullYear(), d.getMonth() - 1, 1)
  const m = dt.getMonth() + 1
  const y = dt.getFullYear()
  return `${m.toString().padStart(2, '0')}/${y}`
}

const ViTraSau: React.FC = () => {
  const navigate = useNavigate()

  const [currentMonth, setCurrentMonth] = React.useState<number>(0)
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [showInvoices, setShowInvoices] = React.useState<boolean>(false)

  React.useEffect(() => {
    const data = loadViTraSau()
    setCurrentMonth(data.currentMonth || 0)
    const sorted = [...(data.transactions || [])].sort((a, b) => (a.date < b.date ? 1 : -1))
    setTransactions(sorted)
  }, [])

  const currentMonthKey = getCurrentMonthString()
  const prevMonthKey = getPrevMonthString()

  const paidByMonth = transactions.reduce<Record<string, number>>((acc, t) => {
    if (t.paid) acc[t.month] = (acc[t.month] || 0) + t.amount
    return acc
  }, {})

  const lastMonthAmount = paidByMonth[prevMonthKey] || 0
  const sumPaid = Object.values(paidByMonth).reduce((s, v) => s + v, 0)
  const averagePerMonth =
    Object.keys(paidByMonth).length > 0 ? Math.round(sumPaid / Object.keys(paidByMonth).length) : 0
  const totalAll = sumPaid + (currentMonth || 0)

  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, t) => {
    acc[t.month] = acc[t.month] || []
    acc[t.month].push(t)
    return acc
  }, {})

  const handlePayNow = () => {
    if (!currentMonth || currentMonth <= 0) {
      alert('No balance to pay.')
      return
    }
    if (!window.confirm(`Are you sure you want to pay ${currentMonth.toLocaleString()} VND for month ${currentMonthKey}?`))
      return

    const data = loadViTraSau()
    data.transactions = data.transactions.map((t) =>
      t.month === currentMonthKey && !t.paid ? { ...t, paid: true } : t
    )
    data.currentMonth = 0
    saveViTraSau(data)
    setCurrentMonth(0)
    setTransactions([...data.transactions].sort((a, b) => (a.date < b.date ? 1 : -1)))
    alert('Payment successful!')
  }

  return (
    <div className='vi-tra-sau-container'>
      <button className='back-btn' onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className='vi-tra-sau-card'>
        <div className='vi-tra-sau-info'>
          <h2>Hello!</h2>
          <p>
            Welcome to the <b>Pay Later Wallet</b> service – manage charging sessions and payments in detail. Here you
            can track your current balance, paid transactions, unpaid transactions and spending overview
            conveniently and visually.
          </p>
          <p>
            Payment will be made on <b>the 30th of each month</b>. View transaction history by clicking the button below.
          </p>
        </div>

        <div className='vi-tra-sau-wallet'>
          <h3>This Month Balance</h3>
          <h1 className='wallet-amount'>{(currentMonth || 0).toLocaleString()} VND</h1>

          <div className='summary-grid'>
            <div className='summary-item'>
              <span>This Month Transactions</span>
              <strong>{(currentMonth || 0).toLocaleString()} VND</strong>
            </div>
            <div className='summary-item'>
              <span>Last Month ({formatMonthLabel(prevMonthKey)})</span>
              <strong>{lastMonthAmount.toLocaleString()} VND</strong>
            </div>
            <div className='summary-item'>
              <span>Average per Month</span>
              <strong>{averagePerMonth.toLocaleString()} VND</strong>
            </div>
          </div>

          <div className='total-box'>
            <span>Total: </span>
            <strong>{totalAll.toLocaleString()} VND</strong>
          </div>

          <button className='pay-btn' onClick={handlePayNow}>
            Pay Now
          </button>

          <button className='pay-btn-1' onClick={() => setShowInvoices(!showInvoices)}>
            {showInvoices ? 'Hide invoices' : 'View details'}
          </button>

          {showInvoices && (
            <div className='invoice-section'>
              <h4>Invoices & Transaction History</h4>
              {transactions.length === 0 ? (
                <div className='no-transactions'>No transactions yet. Previous history will be displayed here.</div>
              ) : (
                Object.keys(grouped)
                  .sort((a, b) => (a < b ? 1 : -1))
                  .map((monthKey) => (
                    <div key={monthKey} className='month-group'>
                      <div
                        className='month-header'
                        style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}
                      >
                        <div>{formatMonthLabel(monthKey)}</div>
                        <div>Total: {grouped[monthKey].reduce((s, t) => s + t.amount, 0).toLocaleString()} VND</div>
                      </div>
                      <table className='transactions-table'>
                        <thead>
                          <tr>
                            <th>Date & Time</th>
                            <th>Station / Address</th>
                            <th>Code</th>
                            <th>Duration</th>
                            <th>KWh</th>
                            <th>Amount</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grouped[monthKey].map((t) => (
                            <tr key={t.id} className={t.paid ? 'paid' : 'unpaid'}>
                              <td>{new Date(t.date).toLocaleString()}</td>
                              <td>
                                <div className='station-name'>{t.station}</div>
                                <div className='station-address'>{t.address}</div>
                              </td>
                              <td>{t.code}</td>
                              <td>{t.durationMinutes ? `${t.durationMinutes} min` : '-'}</td>
                              <td>{t.kwh ?? '-'} kWh</td>
                              <td>{t.amount.toLocaleString()} VND</td>
                              <td>
                                <span className={t.paid ? 'status paid-badge' : 'status unpaid-badge'}>
                                  {t.paid ? 'Paid' : 'Unpaid'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))
              )}
            </div>
          )}

          <Footer />
        </div>
      </div>
    </div>
  )
}

export default ViTraSau
