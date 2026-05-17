import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaFinanceiroRepository } from "@/infrastructure/repositories/PrismaFinanceiroRepository";
import { TransactionFilters } from "@/types/financeiro";
import { PaymentStatus, PaymentMethod } from "@prisma/client";

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
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : 20,
  };

  const repo = new PrismaFinanceiroRepository();
  try {
    const result = await repo.getTransactions(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Erro ao buscar transações" },
      { status: 500 }
    );
  }
}
