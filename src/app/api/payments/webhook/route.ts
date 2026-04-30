import { NextResponse } from 'next/server'
import { prisma } from '@/infrastructure/database/prisma'
import { mercadoPagoService } from '@/services/MercadoPagoService'
import { Payment } from 'mercadopago'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-signature')
    const requestId = req.headers.get('x-request-id')
    const bodyText = await req.text()
    const body = JSON.parse(bodyText)

    const { type, data } = body
    const resourceId = data?.id

    // Ignora IDs de simulação para evitar timeout ao consultar API do MP (que retornaria 404)
    if (resourceId === '123456' || resourceId === 123456) {
      console.log('MercadoPago Webhook: Simulação detectada (ID 123456)')
      return NextResponse.json({ ok: true, message: 'Simulação recebida com sucesso' })
    }

    // Validação de Assinatura (Opcional mas recomendado)
    if (process.env.MERCADOPAGO_WEBHOOK_SECRET && signature) {
      const [tsPart, v1Part] = signature.split(',')
      const ts = tsPart.split('=')[1]
      const v1 = v1Part.split('=')[1]
      
      const manifest = `id:${resourceId};request-id:${requestId};ts:${ts};`
      const hmac = crypto.createHmac('sha256', process.env.MERCADOPAGO_WEBHOOK_SECRET)
      hmac.update(manifest)
      const digest = hmac.digest('hex')
      
      if (digest !== v1) {
        console.error('MercadoPago Webhook: Assinatura Inválida')
        // return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
      }
    }

    if (type === 'payment' || type === 'order') {
      if (!resourceId) return NextResponse.json({ ok: true })

      // Busca dados frescos da API para evitar fraudes ou payloads antigos
      let mpData: any
      if (type === 'payment') {
        const paymentClient = new Payment(mercadoPagoService.client)
        mpData = await paymentClient.get({ id: String(resourceId) })
      } else {
        mpData = await mercadoPagoService.getOrder(String(resourceId))
      }

      const externalReference = mpData.external_reference
      if (!externalReference) return NextResponse.json({ ok: true })

      const payment = await prisma.payment.findFirst({ 
        where: { bookingId: externalReference } 
      })
      if (!payment) return NextResponse.json({ ok: true })

      const status = mpData.status

      if (['approved', 'processed', 'accredited'].includes(status)) {
        await prisma.$transaction([
          prisma.payment.update({
            where: { id: payment.id },
            data: { 
              status: 'APPROVED', 
              paidAt: new Date(), 
              gatewayStatus: status,
              gatewayId: String(resourceId)
            },
          }),
          prisma.booking.update({
            where: { id: payment.bookingId },
            data: { status: 'CONFIRMED' },
          }),
        ])
      } else if (['rejected', 'cancelled', 'expired'].includes(status)) {
        const newStatus = status === 'rejected' ? 'REJECTED' : 
                         status === 'expired' ? 'EXPIRED' : 'CANCELLED'
        
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: newStatus as any, gatewayStatus: status },
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ ok: true }) // Sempre retorna 200 para o MP parar de tentar
  }
}
