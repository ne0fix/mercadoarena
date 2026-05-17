'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/views/components/ui/Button'
import { User, Mail, Phone, Lock, EyeOff, Eye, ArrowRight, ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { registerAction } from './actions'

interface Field {
  label: string
  placeholder: string
  type: string
  value: string
  onChange: (v: string) => void
  icon: React.ReactNode
  required?: boolean
  extra?: React.ReactNode
}

function InputField({ label, placeholder, type, value, onChange, icon, required, extra }: Field) {
  return (
    <div className="relative group">
      <label className="absolute -top-2 left-3 px-1 bg-surface-container-lowest font-headline text-[10px] font-bold text-outline z-10">
        {label}{required && ' *'}
      </label>
      <div className="flex items-center border border-outline-variant rounded-xl px-3 py-2.5 focus-within:border-primary transition-all">
        <span className="text-outline mr-2 w-4 h-4 flex-shrink-0">{icon}</span>
        <input
          className="w-full bg-transparent border-none p-0 focus:ring-0 text-on-surface font-sans text-sm outline-none"
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        />
        {extra}
      </div>
    </div>
  )
}

export default function CadastroPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }
    startTransition(async () => {
      const err = await registerAction(name, email, phone, password, confirmPassword)
      if (err) setError(err)
    })
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-4 bg-surface">
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/30"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 mb-3 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
            <Image alt="Logo" src="/logo.svg" width={56} height={56} className="w-full h-full object-cover" />
          </div>
          <h1 className="font-headline text-xl text-primary font-bold">Criar conta</h1>
          <p className="font-headline text-xs text-on-surface-variant mt-0.5">Arena Beach Serra</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nome */}
          <InputField
            label="Nome completo"
            placeholder="João Silva"
            type="text"
            value={name}
            onChange={setName}
            icon={<User className="w-4 h-4" />}
            required
          />

          {/* Email */}
          <InputField
            label="E-mail"
            placeholder="seuemail@exemplo.com"
            type="email"
            value={email}
            onChange={setEmail}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          {/* Telefone */}
          <InputField
            label="Telefone (opcional)"
            placeholder="(11) 99999-9999"
            type="tel"
            value={phone}
            onChange={setPhone}
            icon={<Phone className="w-4 h-4" />}
          />

          {/* Senha */}
          <div className="relative group">
            <label className="absolute -top-2 left-3 px-1 bg-surface-container-lowest font-headline text-[10px] font-bold text-outline z-10">
              Senha *
            </label>
            <div className="flex items-center border border-outline-variant rounded-xl px-3 py-2.5 focus-within:border-primary transition-all">
              <Lock className="text-outline mr-2 w-4 h-4 flex-shrink-0" />
              <input
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-on-surface font-sans text-sm outline-none"
                placeholder="Mín. 8 caracteres"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <button type="button" onClick={() => setShowPwd((v) => !v)} className="text-outline ml-1 flex-shrink-0">
                {showPwd ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar Senha */}
          <div className="relative group">
            <label className="absolute -top-2 left-3 px-1 bg-surface-container-lowest font-headline text-[10px] font-bold text-outline z-10">
              Confirmar senha *
            </label>
            <div className="flex items-center border border-outline-variant rounded-xl px-3 py-2.5 focus-within:border-primary transition-all">
              <Lock className="text-outline mr-2 w-4 h-4 flex-shrink-0" />
              <input
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-on-surface font-sans text-sm outline-none"
                placeholder="Repita a senha"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-outline ml-1 flex-shrink-0">
                {showConfirm ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 font-headline text-[10px] font-bold bg-red-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-sm"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            isLoading={isPending}
          >
            Criar conta
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t border-outline-variant/30 text-center">
          <p className="text-on-surface-variant text-xs">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </motion.main>

      <Link
        href="/login"
        className="mt-6 flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-headline text-[10px] font-bold uppercase tracking-wider">
          Voltar ao login
        </span>
      </Link>
    </div>
  )
}
