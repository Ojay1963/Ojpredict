import { Target, TrendingUp, CheckCircle } from "lucide-react"

interface Props {
  won: number
  total: number
  accuracy: number
}

export function StatsBar({ won, total, accuracy }: Props) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          <Stat icon={<CheckCircle className="w-5 h-5 text-green-500" />} label="Tips Won" value={won.toLocaleString()} />
          <Stat icon={<Target className="w-5 h-5 text-[#0C0975]" />} label="Total Tips" value={total.toLocaleString()} />
          <Stat icon={<TrendingUp className="w-5 h-5 text-[#F4A500]" />} label="Accuracy Rate" value={`${accuracy}%`} />
        </div>
      </div>
    </div>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      {icon}
      <div>
        <p className="text-lg font-black text-[#0C0975]">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  )
}
