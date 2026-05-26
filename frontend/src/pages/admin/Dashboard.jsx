import { Users, FileText, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', applications: 40 },
  { name: 'Feb', applications: 30 },
  { name: 'Mar', applications: 20 },
  { name: 'Apr', applications: 27 },
  { name: 'May', applications: 18 },
  { name: 'Jun', applications: 23 },
  { name: 'Jul', applications: 34 },
];

const facultiesData = [
  { name: 'Computer Sci', value: 400 },
  { name: 'Law', value: 300 },
  { name: 'Economics', value: 300 },
  { name: 'Medicine', value: 200 },
];

const StatCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-sm font-bold flex items-center gap-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp size={16} className={trend < 0 ? 'rotate-180' : ''} />
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-slate-800 mt-1">{value}</p>
  </motion.div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value="1,248" 
          icon={FileText} 
          trend={12} 
          colorClass="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Pending Review" 
          value="142" 
          icon={Users} 
          trend={-5} 
          colorClass="bg-yellow-50 text-yellow-600" 
        />
        <StatCard 
          title="Approved" 
          value="986" 
          icon={CheckCircle} 
          trend={8} 
          colorClass="bg-green-50 text-green-600" 
        />
        <StatCard 
          title="Rejected" 
          value="120" 
          icon={XCircle} 
          trend={2} 
          colorClass="bg-red-50 text-red-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Applications Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d3b66" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0d3b66" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="applications" stroke="#0d3b66" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">By Faculty</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultiesData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} width={90} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#f4d35e" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
