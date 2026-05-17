import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaFinanceiroRepository } from "@/infrastructure/repositories/PrismaFinanceiroRepository";
import { Granularity } from "@/types/financeiro";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const granularity = (searchParams.get("granularity") || "day") as Granularity;

  if (!startDate || !endDate) {
    return NextResponse.json(
      { message: "Datas de início e fim são obrigatórias" },
      { status: 400 }
    );
  }

  const repo = new PrismaFinanceiroRepository();
  try {
    const data = await repo.getByPeriod(
      new Date(startDate),
      new Date(endDate),
      granularity
    );
    return NextResponse.json({ granularity, data });
  } catch (error) {
    console.error("Error fetching financial data by period:", error);
    return NextResponse.json(
      { message: "Erro ao buscar dados por período" },
      { status: 500 }
    );
  }
}
