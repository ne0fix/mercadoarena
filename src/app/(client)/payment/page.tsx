'use client'

import { Suspense } from 'react'
import Script from 'next/script'
import { QrCode, CreditCard, Lock, Copy, Check } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import { Button } from '@/views/components/ui/Button'
import { usePaymentViewModel } from '@/viewmodels/client/usePaymentViewModel'

function PaymentContent() {
  const vm = usePaymentViewModel()

  return (
    <main className="px-6 pb-24 md:pb-12 max-w-2xl mx-auto">
      <Script 
        src="https://sdk.mercadopago.com/js/v2" 
        strategy="beforeInteractive"
      />
      
      <section className="mb-8">
        <h2 className="font-headline text-3xl text-primary font-bold mb-1">Pagamento</h2>
        <p className="text-on-surface-variant text-sm">
          Selecione sua forma de pagamento preferida para confirmar sua reserva.
        </p>
      </section>

      <div className="flex gap-3 mb-6">
        {(['PIX', 'CREDIT_CARD'] as const).map((m) => (
          <button
            key={m}
            onClick={() => vm.setMethod(m)}
            className={`flex-1 py-4 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
              vm.method === m
                ? 'bg-primary text-white sun-shadow'
                : 'bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary'
            }`}
          >
            {vm.method === m && <Check className="w-4 h-4" />}
            {m === 'PIX' ? <QrCode className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
            <span className="font-headline font-bold">{m === 'PIX' ? 'Pix' : 'Cartão'}</span>
          </button>
        ))}
      </div>

      {vm.method === 'PIX' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 sun-shadow space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl">
                <QrCode className="text-primary w-6 h-6" />
              </div>
              <h3 className="font-headline text-xl text-on-surface font-bold">Pagar com Pix</h3>
            </div>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
              Aprovação imediata
            </span>
          </div>

          {vm.pixQrCode ? (
            <div className="bg-surface-container rounded-2xl p-6 text-center border border-dashed border-outline-variant flex flex-col items-center">
              {vm.pixQrCodeBase64 && (
                <div className="bg-white p-4 rounded-2xl mb-6 sun-shadow">
                  <Image 
                    src={`data:image/png;base64,${vm.pixQrCodeBase64}`}
                    alt="QR Code Pix"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
              )}
              <p className="font-headline text-[10px] text-on-surface-variant mb-2 uppercase font-bold tracking-widest">
                Código Pix
              </p>
              <code className="block w-full font-headline text-xs text-primary bg-white/80 py-3 px-4 rounded-xl mb-4 break-all font-bold">
                {vm.pixQrCode}
              </code>
              <Button
                variant="secondary"
                className="w-full mb-3"
                leftIcon={vm.copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                onClick={vm.copyPix}
              >
                {vm.copied ? 'Copiado!' : 'Copiar Código Pix'}
              </Button>
              <Button className="w-full" onClick={vm.simulatePixPayment}>
                Simulei o pagamento (dev)
              </Button>
            </div>
          ) : (
            <Button className="w-full h-14" isLoading={vm.isPending} onClick={() => vm.confirmPayment()}>
              Gerar QR Code Pix
            </Button>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 sun-shadow"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-xl">
              <CreditCard className="text-primary w-6 h-6" />
            </div>
            <h3 className="font-headline text-xl text-on-surface font-bold">Cartão de Crédito</h3>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              const fd = new FormData(e.currentTarget)
              vm.confirmPayment({
                cardNumber: fd.get('cardNumber') as string,
                cardHolder: fd.get('cardHolder') as string,
                expiry: fd.get('expiry') as string,
                cvv: fd.get('cvv') as string,
              })
            }}
          >
            {[
              { name: 'cardNumber', label: 'Número do Cartão', placeholder: '0000 0000 0000 0000' },
              { name: 'cardHolder', label: 'Nome no Cartão', placeholder: 'JOÃO A. SILVA' },
            ].map((f) => (
              <div key={f.name}>
                <label className="block font-headline text-[10px] text-on-surface-variant mb-1 ml-1 font-bold uppercase">
                  {f.label}
                </label>
                <input
                  name={f.name}
                  required
                  placeholder={f.placeholder}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans transition-all"
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-headline text-[10px] text-on-surface-variant mb-1 ml-1 font-bold uppercase">
                  Validade
                </label>
                <input
                  name="expiry"
                  required
                  placeholder="MM/AA"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans transition-all"
                />
              </div>
              <div>
                <label className="block font-headline text-[10px] text-on-surface-variant mb-1 ml-1 font-bold uppercase">
                  CVV
                </label>
                <input
                  name="cvv"
                  required
                  placeholder="123"
                  maxLength={4}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans transition-all"
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-14 mt-4" isLoading={vm.isPending}>
              Finalizar Pagamento
            </Button>
          </form>
        </motion.div>
      )}

      <div className="flex items-center gap-2 p-4 text-on-surface-variant bg-surface-container-high/50 rounded-2xl mt-6">
        <Lock className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Seu pagamento está em um ambiente seguro e criptografado.
        </span>
      </div>
    </main>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Carregando...</div>}>
      <PaymentContent />
    </Suspense>
  )
}
