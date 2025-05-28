'use client';

import RouteTransition from '../components/RouteTransition';
import KPIComparisonTable, { KPI } from '../components/KPIComparisonTable';
import { ArrowTrendingUpIcon, UserGroupIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon, LightBulbIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const kpiCards = [
  {
    name: 'Monthly Active Users (MAU)',
    value: '15,230',
    target: '20,000',
    trend: 'up',
    change: '+12%',
    icon: UserGroupIcon,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    progress: 76.15, // 15230 / 20000 * 100
  },
  {
    name: 'Customer Churn Rate',
    value: '2.5%',
    target: '< 2%',
    trend: 'down',
    change: '-0.3%',
    icon: ArrowTrendingUpIcon, // Using trending up for reduction goal (good trend)
    iconTransform: 'transform rotate-180', // Visually show downward trend for churn
    color: 'text-green-400', // Green as lower churn is good
    bgColor: 'bg-green-500/10',
    progress: 80, // (1 - (2.5 / 2)) * 100, assuming 2% is 100% target achievement
  },
  {
    name: 'Average Revenue Per User (ARPU)',
    value: '$45.50',
    target: '$50.00',
    trend: 'up',
    change: '+5%',
    icon: CurrencyDollarIcon,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    progress: 91, // 45.50 / 50.00 * 100
  },
  {
    name: 'Net Promoter Score (NPS)',
    value: '55',
    target: '60',
    trend: 'up',
    change: '+3 pts',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    progress: 91.67, // 55 / 60 * 100
  },
  {
    name: 'Feature Adoption Rate',
    value: '65%',
    target: '75%',
    trend: 'up',
    change: '+8%',
    icon: LightBulbIcon,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    progress: 86.67, // 65 / 75 * 100
  },
  {
    name: 'System Uptime',
    value: '99.98%',
    target: '99.99%',
    trend: 'up',
    change: '+0.01%',
    icon: ShieldCheckIcon,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    progress: 99.89, // 99.98 / 99.99 * 100 (approx)
  },
];

// Data for the KPI comparison table
const kpiTableData: KPI[] = [
  {
    id: 'kpi-1',
    name: 'Monthly Active Users (MAU)',
    target: '20,000',
    actual: '15,230',
    variance: '-4,770',
    status: 'negative',
    numericValue: 15230
  },
  {
    id: 'kpi-2',
    name: 'Customer Churn Rate',
    target: '2.0%',
    actual: '2.5%',
    variance: '+0.5%',
    status: 'negative',
    numericValue: 2.5
  },
  {
    id: 'kpi-3',
    name: 'Average Revenue Per User (ARPU)',
    target: '$50.00',
    actual: '$45.50',
    variance: '-$4.50',
    status: 'negative',
    numericValue: 45.5
  },
  {
    id: 'kpi-4',
    name: 'Net Promoter Score (NPS)',
    target: '60',
    actual: '55',
    variance: '-5',
    status: 'neutral',
    numericValue: 55
  },
  {
    id: 'kpi-5',
    name: 'Feature Adoption Rate',
    target: '75%',
    actual: '65%',
    variance: '-10%',
    status: 'negative',
    numericValue: 65
  },
  {
    id: 'kpi-6',
    name: 'System Uptime',
    target: '99.99%',
    actual: '99.98%',
    variance: '-0.01%',
    status: 'neutral',
    numericValue: 99.98
  },
  {
    id: 'kpi-7',
    name: 'Customer Satisfaction Score',
    target: '4.5/5',
    actual: '4.7/5',
    variance: '+0.2',
    status: 'positive',
    numericValue: 4.7
  },
  {
    id: 'kpi-8',
    name: 'Conversion Rate',
    target: '3.5%',
    actual: '4.2%',
    variance: '+0.7%',
    status: 'positive',
    numericValue: 4.2
  },
  {
    id: 'kpi-9',
    name: 'Average Resolution Time',
    target: '< 24 hours',
    actual: '18 hours',
    variance: '-6 hours',
    status: 'positive',
    numericValue: 18
  }
];

const KPIsPage = () => {
  return (
    <RouteTransition>
      <div className="p-4 md:p-8 min-h-screen bg-background text-foreground">
        <h1 className="text-3xl font-bold mb-8 text-foreground">
          Key Performance Indicators
        </h1>
        
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {kpiCards.map((kpi, index) => (
            <div 
              key={index} 
              className="p-6 rounded-xl shadow-md bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">{kpi.name}</h2>
                <kpi.icon className={`h-7 w-7 text-primary ${kpi.iconTransform || ''}`} />
              </div>
              <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-sm text-muted-foreground mb-3">Target: {kpi.target}</p>
              <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                <div 
                  className={`h-2.5 rounded-full ${kpi.trend === 'up' ? 'bg-primary' : 'bg-destructive'}`}
                  style={{ width: `${kpi.progress}%` }}
                ></div>
              </div>
              <div className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-cap-accent-green' : 'text-destructive'}`}>
                {kpi.change} {kpi.trend === 'up' ? '▲' : '▼'} vs last period
              </div>
            </div>
          ))}
        </div>
        
        {/* KPI Comparison Table */}
        <div className="mb-10">
          <KPIComparisonTable 
            kpis={kpiTableData} 
            title="KPI Performance Analysis"
          />
        </div>
      </div>
    </RouteTransition>
  );
};

export default KPIsPage;