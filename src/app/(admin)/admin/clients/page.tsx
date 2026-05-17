'use client'

import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Users, CalendarDays, Phone, Mail } from 'lucide-react'
import { Badge } from '@/views/components/ui/Badge'
import { cn } from '@/core/utils/helpers'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Ativos' },
  { value: 'INACTIVE', label: 'Inativos' },
  { value: 'BANNED', label: 'Banidos' },
]

const statusVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  ACTIVE: 'success',
  INACTIVE: 'warning',
  BANNED: 'danger',
}

const statusLabel: Record<string, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  BANNED: 'Banido',
}

interface Client {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  createdAt: string
  totalBookings: number
  lastBookingAt: string | null
}

interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export default function ClientsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const fetchClients = useCallback(async () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    params.set('page', String(page))
    const res = await fetch(`/api/admin/clients?${params}`)
    if (!res.ok) throw new Error('Erro ao carregar clientes')
    return res.json() as Promise<{ clients: Client[]; pagination: Pagination }>
  }, [search, status, page])

  const { data, isLoading } = useQuery({
    queryKey: ['admin-clients', search, status, page],
    queryFn: fetchClients,
  })

  const clients = data?.clients ?? []
  const pagination = data?.pagination

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleStatus = (value: string) => {
    setStatus(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-2xl text-on-surface font-bold">Clientes</h1>
          <p className="font-headline text-xs text-on-surface-variant uppercase tracking-widest">
            {pagination ? `${pagination.total} cadastrados` : '—'}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 flex-1 min-w-56">
          <Search className="w-4 h-4 text-outline flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="bg-transparent border-none p-0 focus:ring-0 font-sans text-sm text-on-surface placeholder:text-outline-variant outline-none flex-1"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatus(opt.value)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-xl font-headline text-xs font-bold transition-all',
                status === opt.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-container text-on-surface-variant hover:bg-secondary-container'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 sun-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container/50">
                <th className="text-left px-6 py-4 font-headline text-xs text-on-surface-variant uppercase tracking-widest">Cliente</th>
                <th className="text-left px-6 py-4 font-headline text-xs text-on-surface-variant uppercase tracking-widest hidden md:table-cell">Contato</th>
                <th className="text-left px-6 py-4 font-headline text-xs text-on-surface-variant uppercase tracking-widest">Status</th>
                <th className="text-left px-6 py-4 font-headline text-xs text-on-surface-variant uppercase tracking-widest hidden lg:table-cell">Agendamentos</th>
                <th className="text-left px-6 py-4 font-headline text-xs text-on-surface-variant uppercase tracking-widest hidden lg:table-cell">Cadastro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-container animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-32 bg-surface-container animate-pulse rounded" />
                          <div className="h-2.5 w-44 bg-surface-container animate-pulse rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="h-3 w-28 bg-surface-container animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 w-16 bg-surface-container animate-pulse rounded-full" />
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="h-3 w-10 bg-surface-container animate-pulse rounded" />
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="h-3 w-24 bg-surface-container animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <Users className="w-10 h-10 text-outline mx-auto mb-3" />
                    <p className="font-headline text-sm text-on-surface-variant font-bold">Nenhum cliente encontrado</p>
                    {search && (
                      <p className="font-headline text-xs text-outline mt-1">Tente buscar por outro termo</p>
                    )}
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                          <span className="font-headline text-primary font-bold text-sm">
                            {client.name[0]?.toUpperCase() ?? '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-headline text-sm text-on-surface font-bold">{client.name}</p>
                          <p className="font-sans text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {client.phone ? (
                        <p className="font-sans text-sm text-on-surface flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-outline" />
                          {client.phone}
                        </p>
                      ) : (
                        <span className="font-sans text-xs text-outline-variant">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[client.status] ?? 'default'}>
                        {statusLabel[client.status] ?? client.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-outline" />
                        <span className="font-headline text-sm text-on-surface font-bold">
                          {client.totalBookings}
                        </span>
                        {client.lastBookingAt && (
                          <span className="font-sans text-xs text-on-surface-variant">
                            · último {format(new Date(client.lastBookingAt), "dd/MM/yy", { locale: ptBR })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="font-sans text-xs text-on-surface-variant">
                        {format(new Date(client.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-outline-variant/20">
            <p className="font-headline text-xs text-on-surface-variant">
              Página {pagination.page} de {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl border border-outline-variant/30 font-headline text-sm font-bold disabled:opacity-40 hover:bg-surface-container transition-all"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 rounded-xl border border-outline-variant/30 font-headline text-sm font-bold disabled:opacity-40 hover:bg-surface-container transition-all"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
