import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaFinanceiroRepository } from "@/infrastructure/repositories/PrismaFinanceiroRepository";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || !["MANAGER", "ADMIN"].includes(session.user.role)) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { message: "Datas de início e fim são obrigatórias" },
      { status: 400 }
    );
  }

  const repo = new PrismaFinanceiroRepository();
  try {
    const summary = await repo.getSummary(new Date(startDate), new Date(endDate));
    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error fetching financial summary:", error);
    return NextResponse.json(
      { message: "Erro ao buscar resumo financeiro" },
      { status: 500 }
    );
  }
}
