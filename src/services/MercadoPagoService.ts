import { MercadoPagoConfig, Order, Payment } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: { timeout: 5000 }
})

const orderClient = new Order(client)
const paymentClient = new Payment(client)

export interface CreateOrderInput {
  external_reference: string
  total_amount: number
  payer_email: string
  payment_method_id: string
  token?: string
  installments?: number
}

export class MercadoPagoService {
  // Expor client para uso em outros lugares se necessário (ex: Webhook)
  public client = client

  /**
   * Cria uma Ordem de Pagamento (Checkout API Orders - v1/orders)
   * Recomendado para fluxos mais modernos e flexíveis.
   */
  async createOrder(input: CreateOrderInput) {
    try {
      const body = {
        type: 'online',
        processing_mode: 'automatic',
        external_reference: input.external_reference,
        total_amount: input.total_amount,
        payer: {
          email: input.payer_email
        },
        transactions: {
          payments: [
            {
              amount: String(input.total_amount),
              payment_method: {
                id: input.payment_method_id,
                type: input.payment_method_id === 'pix' ? 'ticket' : 'credit_card',
                token: input.token,
                installments: input.installments || 1
              }
            }
          ]
        }
      }

      const result = await orderClient.create({ body: body as any })
      return result
    } catch (error) {
      console.error('MercadoPago createOrder error:', error)
      throw error
    }
  }

  /**
   * Reembolsa uma ordem ou pagamento
   */
  async refundOrder(orderId: string, amount?: number) {
    try {
      const result = await orderClient.refund({
        id: orderId,
        body: amount ? { amount: String(amount) } as any : undefined
      })
      return result
    } catch (error) {
      console.error('MercadoPago refundOrder error:', error)
      throw error
    }
  }

  /**
   * Consulta uma ordem pelo ID
   */
  async getOrder(orderId: string) {
    try {
      const result = await orderClient.get({ id: orderId })
      return result
    } catch (error) {
      console.error('MercadoPago getOrder error:', error)
      throw error
    }
  }
}

export const mercadoPagoService = new MercadoPagoService()
