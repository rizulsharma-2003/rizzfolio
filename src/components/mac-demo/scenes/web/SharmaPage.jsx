import { useEffect } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'motion/react'
import {
  ChevronDown,
  CreditCard,
  Factory,
  FileText,
  IceCreamCone,
  IndianRupee,
  LayoutDashboard,
  Package,
  PanelLeftClose,
  Receipt,
  Search,
  Settings,
  TrendingUp,
  TriangleAlert,
  User,
  Users,
  Warehouse,
} from 'lucide-react'

const NAV = [
  [LayoutDashboard, 'Dashboard'],
  [Users, 'Vendors'],
  [Package, 'Products'],
  [FileText, 'Create Bill'],
  [Receipt, 'Billing History'],
  [Warehouse, 'Stock'],
  [Factory, 'Production'],
  [Settings, 'Users'],
]
const KPIS = [
  { label: 'Sales Today', value: 12450, rupee: true, icon: IndianRupee, tone: ['#ecfdf5', '#059669'] },
  { label: 'Production Today', value: 650, suffix: ' units', icon: Package, tone: ['#f0f9ff', '#0284c7'] },
  { label: 'Total Vendors', value: 24, icon: Users, tone: ['#f5f3ff', '#7c3aed'] },
  { label: 'Total Products', value: 18, icon: IceCreamCone, tone: ['#fffbeb', '#d97706'] },
  { label: 'Low Stock Alerts', value: 3, icon: TriangleAlert, tone: ['#fef2f2', '#dc2626'] },
  { label: 'Pending Vendor Payments', value: 38200, rupee: true, icon: CreditCard, tone: ['#fff7ed', '#ea580c'] },
]
const SALES = [
  ['Sat', 2810],
  ['Sun', 4042],
  ['Mon', 2240],
  ['Tue', 2675],
  ['Wed', 3120],
  ['Thu', 2930],
  ['Fri', 3560],
]
const BEST = [
  ['Strawberry Stick', 100],
  ['Vanilla Cone', 86],
  ['Chocolate Cup', 74],
  ['Mango Family Pack', 52],
]

export default function SharmaPage() {
  return (
    <div className="absolute inset-0 flex bg-[#f8fafc] text-[#1e293b]" style={{ fontFamily: '-apple-system, Inter, sans-serif' }}>
      <aside className="flex w-[14cqw] shrink-0 flex-col bg-[#0f172a] px-[0.8cqw] py-[1cqw]">
        <div className="flex items-center justify-between px-[0.4cqw]">
          <p className="text-[1.1cqw] font-bold text-[#38bdf8]">Sharma Ice-Cream</p>
          <PanelLeftClose className="size-[0.9cqw] text-slate-500" />
        </div>
        <nav className="mt-[1.4cqw] space-y-[0.25cqw] text-[0.75cqw]">
          {NAV.map(([Icon, label], i) => (
            <p
              key={label}
              className={`flex items-center gap-[0.6cqw] rounded-[0.5cqw] px-[0.6cqw] py-[0.45cqw] ${i === 0 ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400'}`}
            >
              <Icon className="size-[0.95cqw]" /> {label}
            </p>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[3.2cqw] shrink-0 items-center border-b border-slate-200 bg-white/95 px-[1.3cqw]">
          <span className="flex w-[16cqw] items-center gap-[0.5cqw] rounded-[0.5cqw] bg-slate-50 px-[0.7cqw] py-[0.4cqw] text-[0.7cqw] text-slate-400 ring-1 ring-slate-200">
            <Search className="size-[0.8cqw]" /> Search...
          </span>
          <span className="ml-auto flex items-center gap-[0.5cqw] text-[0.72cqw] text-slate-700">
            <span className="grid size-[1.6cqw] place-items-center rounded-full bg-sky-100">
              <User className="size-[0.85cqw] text-sky-600" />
            </span>
            Admin
            <ChevronDown className="size-[0.75cqw] text-slate-400" />
          </span>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden px-[1.5cqw] py-[1.2cqw]">
          <p className="text-[1.5cqw] font-bold text-slate-800">Dashboard</p>
          <p className="text-[0.75cqw] text-slate-500">Overview of your ice cream factory</p>

          <div className="mt-[1cqw] grid grid-cols-3 gap-[0.9cqw]">
            {KPIS.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                className="flex items-start justify-between rounded-[1cqw] border border-slate-200/80 bg-white p-[1cqw] shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05, duration: 0.45 }}
              >
                <div>
                  <p className="text-[0.7cqw] text-slate-500">{kpi.label}</p>
                  <p className="mt-[0.3cqw] text-[1.35cqw] font-bold text-slate-800 tabular-nums">
                    <CountUp value={kpi.value} rupee={kpi.rupee} delay={0.2 + i * 0.05} />
                    {kpi.suffix && <span className="text-[0.75cqw] font-medium text-slate-400">{kpi.suffix}</span>}
                  </p>
                </div>
                <span className="grid size-[2.1cqw] place-items-center rounded-[0.6cqw]" style={{ background: kpi.tone[0] }}>
                  <kpi.icon className="size-[1.05cqw]" style={{ color: kpi.tone[1] }} />
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-[0.9cqw] grid grid-cols-2 gap-[0.9cqw]">
            <motion.div className="rounded-[1cqw] border border-slate-200/80 bg-white p-[1cqw] shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <p className="flex items-center gap-[0.4cqw] text-[0.8cqw] font-semibold text-slate-800">
                <TrendingUp className="size-[0.9cqw] text-sky-600" /> Daily Sales (Last 7 Days)
              </p>
              <div className="mt-[0.8cqw] flex h-[8.5cqw] items-end gap-[0.7cqw]">
                {SALES.map(([day, amount], i) => (
                  <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-[0.3cqw]">
                    <motion.span
                      className="w-full rounded-t-[0.3cqw] bg-sky-500"
                      initial={{ height: '0%' }}
                      animate={{ height: `${(amount / 4042) * 85}%` }}
                      transition={{ duration: 0.5, delay: 0.7 + i * 0.07, ease: 'easeOut' }}
                    />
                    <span className="text-[0.55cqw] text-slate-400">{day}</span>
                  </div>
                ))}
              </div>
              <p className="mt-[0.4cqw] text-[0.58cqw] text-slate-400">Max: ₹4,042</p>
            </motion.div>

            <motion.div className="rounded-[1cqw] border border-slate-200/80 bg-white p-[1cqw] shadow-sm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <p className="flex items-center gap-[0.4cqw] text-[0.8cqw] font-semibold text-slate-800">
                <IceCreamCone className="size-[0.9cqw] text-amber-600" /> Best Selling Flavors
              </p>
              <div className="mt-[0.8cqw] space-y-[0.75cqw]">
                {BEST.map(([name, units], i) => (
                  <div key={name}>
                    <div className="flex justify-between text-[0.66cqw]">
                      <span className="text-slate-700">{name}</span>
                      <span className="text-slate-400">{units} units</span>
                    </div>
                    <div className="mt-[0.25cqw] h-[0.4cqw] overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className="h-full rounded-full bg-amber-400"
                        initial={{ width: '0%' }}
                        animate={{ width: `${units}%` }}
                        transition={{ duration: 0.6, delay: 0.85 + i * 0.05, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

function CountUp({ value, rupee, delay }) {
  const mv = useMotionValue(0)
  const text = useTransform(mv, (v) => `${rupee ? '₹' : ''}${Math.round(v).toLocaleString('en-IN')}`)
  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [mv, value, delay])
  return <motion.span>{text}</motion.span>
}
