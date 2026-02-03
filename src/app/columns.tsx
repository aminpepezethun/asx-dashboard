"use client"

import { ColumnDef } from "@tanstack/react-table"

export type DividendRecord = {
    code: string
    company: string
    ex_date: string
    pay_date: string
    amount: number
    franking: number
    yield: number
    price: number
    volume_4w: number
    total_value: number
}

export const columns: ColumnDef<DividendRecord>[] = [
    {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => <div className="font-mono font-bold">{row.getValue("code")}</div>,
    },
    {
        accessorKey: "company",
        header: "Company",
        cell: ({ row }) => <div className="truncate max-w-[200px]">{row.getValue("company")}</div>,
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right">Price</div>,
        // Shows exact decimal from BigQuery
        cell: ({ row }) => <div className="text-right tabular-nums">{row.getValue("price")}</div>,
    },
    {
        accessorKey: "ex_date",
        header: "Ex-Date",
    },
    {
        accessorKey: "pay_date",
        header: "Pay-Date",
    },
    {
        accessorKey: "amount",
        header: () => <div className="text-right">Div Amt (c)</div>,
        // Shows raw dividend amount without rounding
        cell: ({ row }) => <div className="text-right tabular-nums font-medium">{row.getValue("amount")}</div>,
    },
    {
        accessorKey: "franking",
        header: () => <div className="text-right">Franking %</div>,
        cell: ({ row }) => <div className="text-right tabular-nums">{row.getValue("franking")}</div>,
    },
    {
        accessorKey: "yield",
        header: () => <div className="text-right">Yield %</div>,
        cell: ({ row }) => <div className="text-right tabular-nums text-green-700">{row.getValue("yield")}</div>,
    },
    {
        accessorKey: "price",
        header: () => <div className="text-right">Price</div>,
        // Shows exact decimal from BigQuery
        cell: ({ row }) => <div className="text-right tabular-nums">{row.getValue("price")}</div>,
    },
    {
        accessorKey: "volume_4w",
        header: () => <div className="text-right">Vol (4w)</div>,
        cell: ({ row }) => <div className="text-right tabular-nums">{row.getValue("volume_4w")}</div>,
    },
    {
        accessorKey: "total_value",
        header: () => <div className="text-right">Total Value</div>,
        cell: ({ row }) => <div className="text-right tabular-nums font-semibold">{row.getValue("total_value")}</div>,
    },
]