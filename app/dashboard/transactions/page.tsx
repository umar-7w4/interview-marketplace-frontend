"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserPayments } from "@/lib/paymentService";
import { Payment } from "@/types/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { RiMoneyDollarCircleFill, RiCalendarEventFill } from "react-icons/ri";

export default function TransactionsPage() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      if (!user) return;

      try {
        const token = JSON.parse(localStorage.getItem("user")!).idToken;
        const paymentData = await getUserPayments(token, user.userId);
        setPayments(paymentData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#15192e] text-white">
        Loading...
      </div>
    );
  }

  const totalEarnings = payments.reduce((sum, payment) => {
    return payment.paymentStatus === "PAID" ? sum + payment.amount : sum;
  }, 0);

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-[#15192e] to-[#0c0f1c] text-white">
      <h1 className="text-4xl font-bold text-center mb-8">
        Transaction History
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {}
        <Card className="bg-gradient-to-r from-emerald-950 text-white shadow-xl transform hover:scale-[1.02] transition-all">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RiMoneyDollarCircleFill className="text-green-400 text-2xl" />
              {user.role === "INTERVIEWER" ? "Total Earnings" : "Total Spent"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalEarnings}</p>
            <p className="text-sm text-gray-400">From completed transactions</p>
          </CardContent>
        </Card>

        {}
        <Card className="bg-gradient-to-r from-yellow-950 text-white shadow-xl transform hover:scale-[1.02] transition-all">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <RiCalendarEventFill className="text-blue-400 text-2xl" />
              Transactions Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{payments.length}</p>
            <p className="text-sm text-gray-400">
              Total number of transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="mt-10">
        <Table className="w-full bg-[#1e2239] text-white rounded-md overflow-hidden">
          <TableHead className="bg-[#2c304d]">
            <TableRow>
              <TableCell className="text-gray-200 font-semibold">
                Date
              </TableCell>
              <TableCell className="text-gray-200 font-semibold">
                Amount
              </TableCell>
              <TableCell className="text-gray-200 font-semibold">
                Status
              </TableCell>
              <TableCell className="text-gray-200 font-semibold">
                Payment Method
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <TableRow
                  key={payment.paymentId}
                  className="hover:bg-[#2c304d]/30"
                >
                  <TableCell className="py-3">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-3">${payment.amount}</TableCell>
                  <TableCell
                    className={`py-3 ${
                      payment.paymentStatus === "PAID"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {payment.paymentStatus}
                  </TableCell>
                  <TableCell className="py-3">
                    {payment.paymentMethod || "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-gray-400 py-4"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
