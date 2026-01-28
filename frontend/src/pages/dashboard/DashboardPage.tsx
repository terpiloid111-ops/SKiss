import React from 'react'
import { useAppSelector } from '../../store'
import Card from '../../components/shared/UI/Card'
import { DollarSign, Users, Gift, TrendingUp } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth)

  const stats = [
    {
      title: 'Total Balance',
      value: formatCurrency(user?.balance || 0),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20',
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(0),
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20',
    },
    {
      title: 'Referrals',
      value: '0',
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/20',
    },
    {
      title: 'Pending Rewards',
      value: formatCurrency(0),
      icon: Gift,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.username}!
        </h1>
        <p className="text-dark-400">Here's what's happening with your account today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-dark-400">
            <p>No recent activity</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors text-left">
              Start Earning
            </button>
            <button className="w-full px-4 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors text-left">
              View Referral Link
            </button>
            <button className="w-full px-4 py-3 bg-dark-800 hover:bg-dark-700 text-white rounded-lg transition-colors text-left">
              Withdraw Funds
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage
