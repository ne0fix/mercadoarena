import { Loader } from '@/views/components/ui/Loader'

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface/50 backdrop-blur-sm z-[100]">
      <Loader size="lg" />
    </div>
  )
}
