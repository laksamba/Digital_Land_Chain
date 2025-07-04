
import { History } from "lucide-react"

interface Transaction {
  id: string
  type: string
  landPlot: string
  date: string
  status: string
  amount?: string
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "Purchase",
    landPlot: "PLT-2024-001",
    date: "2024-01-15",
    status: "Completed",
    amount: "₹25,00,000",
  },
  {
    id: "2",
    type: "Transfer Request",
    landPlot: "PLT-2024-002",
    date: "2024-03-10",
    status: "Pending",
  },
  {
    id: "3",
    type: "Certificate Download",
    landPlot: "PLT-2024-001",
    date: "2024-03-05",
    status: "Completed",
  },
]

export function TransactionHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Transaction History</h2>
        <p className="text-gray-600">View your past land transactions and transfers</p>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    <History className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.type}</p>
                    <p className="text-sm text-gray-500">
                      {transaction.landPlot} • {transaction.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      transaction.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                  {transaction.amount && <p className="text-sm font-medium mt-1 text-gray-900">{transaction.amount}</p>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
