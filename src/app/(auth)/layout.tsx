export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C0975] via-[#1a1a8c] to-[#0C0975] flex items-center justify-center p-4">
      {children}
    </div>
  )
}
