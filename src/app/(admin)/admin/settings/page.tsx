import { PrismaCourtRepository } from '@/infrastructure/repositories/PrismaCourtRepository'
import { CourtSettingsClient } from './CourtSettingsClient'

export const revalidate = 0

export default async function SettingsPage() {
  const repo = new PrismaCourtRepository()
  const courts = await repo.findAll({ isActive: undefined })
  return <CourtSettingsClient initialCourts={courts} />
}
