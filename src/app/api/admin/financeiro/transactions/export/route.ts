import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaFinanceiroRepository } from "@/infrastructure/repositories/PrismaFinanceiroRepository";
import { TransactionFilters } from "@/types/financeiro";
import { PaymentStatus, PaymentMethod } from "@prisma/client";
import { format } from "date-fns";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  
  const filters: TransactionFilters = {
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    status: searchParams.get("status")?.split(",") as PaymentStatus[],
    method: searchParams.get("method")?.split(",") as PaymentMethod[],
    search: searchParams.get("search") || undefined,
    minAmount: searchParams.get("minAmount") ? Number(searchParams.get("minAmount")) : undefined,
    maxAmount: searchParams.get("maxAmount") ? Number(searchParams.get("maxAmount")) : undefined,
    page: 1,
    pageSize: 10000, // Large number for export
  };

  const repo = new PrismaFinanceiroRepository();
  try {
    const result = await repo.getTransactions(filters);
    
    // Create CSV content
    const header = "ID,Data,Hora,Cliente,E-mail,Telefone,Quadra,Metodo,Valor,Status,Gateway ID,Estorno,Motivo Estorno\n";
    const rows = result.data.map(t => {
      const date = format(new Date(t.paidAt || t.createdAt), "dd/MM/yyyy");
      const time = format(new Date(t.paidAt || t.createdAt), "HH:mm");
      const methodLabel = t.method === PaymentMethod.PIX ? "PIX" : t.method === PaymentMethod.CREDIT_CARD ? "Credito" : "Debito";
      
      return [
        t.id,
        date,
        time,
        `"${t.booking.user.name}"`,
        t.booking.user.email,
        t.booking.user.phone || "",
        `"${t.booking.court.name}"`,
        methodLabel,
        t.amount.toFixed(2),
        t.status,
        t.gatewayId || "",
        t.refundAmount ? t.refundAmount.toFixed(2) : "0.00",
        `"${t.refundReason || ""}"`
      ].join(",");
    }).join("\n");

    const csvContent = header + rows;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="financeiro_${filters.startDate || "export"}_${filters.endDate || ""}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting transactions:", error);
    return NextResponse.json(
      { message: "Erro ao exportar transações" },
      { status: 500 }
    );
  }
}
