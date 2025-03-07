"use client"

// This is a mock implementation of Firebase services
// Replace with actual Firebase implementation when ready

import { useEffect, useState } from "react"

// Types
export interface Customer {
  id: string
  profileNumber: string
  name: string
  phone: string
  address: string
  notes?: string
  createdAt: Date
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  totalAmount: number
  receivedAmount: number
  pendingAmount: number
  status: "active" | "closed"
  notes?: string
  createdAt: Date
}

export interface Transaction {
  id: string
  orderId: string
  customerId: string
  amount: number
  type: "incoming" | "outgoing"
  notes?: string
  createdAt: Date
}

// Mock data
const customers: Customer[] = [
  {
    id: "c1",
    profileNumber: "001",
    name: "John Doe",
    phone: "123-456-7890",
    address: "123 Main St, City",
    notes: "Regular customer",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "c2",
    profileNumber: "002",
    name: "Jane Smith",
    phone: "987-654-3210",
    address: "456 Oak Ave, Town",
    createdAt: new Date("2023-02-20"),
  },
  {
    id: "c3",
    profileNumber: "003",
    name: "Robert Johnson",
    phone: "555-123-4567",
    address: "789 Pine Rd, Village",
    notes: "Prefers email communication",
    createdAt: new Date("2023-03-10"),
  },
]

const orders: Order[] = [
  {
    id: "o1",
    customerId: "c1",
    customerName: "John Doe",
    totalAmount: 1500,
    receivedAmount: 1000,
    pendingAmount: 500,
    status: "active",
    notes: "Partial payment received",
    createdAt: new Date("2023-04-05"),
  },
  {
    id: "o2",
    customerId: "c2",
    customerName: "Jane Smith",
    totalAmount: 2000,
    receivedAmount: 2000,
    pendingAmount: 0,
    status: "closed",
    createdAt: new Date("2023-04-10"),
  },
  {
    id: "o3",
    customerId: "c3",
    customerName: "Robert Johnson",
    totalAmount: 3000,
    receivedAmount: 1500,
    pendingAmount: 1500,
    status: "active",
    notes: "50% paid upfront",
    createdAt: new Date("2023-04-15"),
  },
  {
    id: "o4",
    customerId: "c1",
    customerName: "John Doe",
    totalAmount: 800,
    receivedAmount: 0,
    pendingAmount: 800,
    status: "active",
    createdAt: new Date("2023-04-20"),
  },
]

let transactions: Transaction[] = [
  {
    id: "t1",
    orderId: "o1",
    customerId: "c1",
    amount: 1000,
    type: "incoming",
    notes: "Initial payment",
    createdAt: new Date("2023-04-05"),
  },
  {
    id: "t2",
    orderId: "o2",
    customerId: "c2",
    amount: 2000,
    type: "incoming",
    notes: "Full payment",
    createdAt: new Date("2023-04-10"),
  },
  {
    id: "t3",
    orderId: "o3",
    customerId: "c3",
    amount: 1500,
    type: "incoming",
    notes: "Deposit",
    createdAt: new Date("2023-04-15"),
  },
  {
    id: "t4",
    orderId: "o1",
    customerId: "c1",
    amount: 200,
    type: "outgoing",
    notes: "Refund for damaged item",
    createdAt: new Date("2023-04-18"),
  },
]

// Mock Firebase functions
export const firestore = {
  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    return [...customers].sort((a, b) => a.name.localeCompare(b.name))
  },

  getCustomerById: async (id: string): Promise<Customer | null> => {
    return customers.find((c) => c.id === id) || null
  },

  addCustomer: async (customer: Omit<Customer, "id" | "profileNumber" | "createdAt">): Promise<Customer> => {
    const newCustomer: Customer = {
      id: `c${customers.length + 1}`,
      profileNumber: String(customers.length + 1).padStart(3, "0"),
      ...customer,
      createdAt: new Date(),
    }
    customers.push(newCustomer)
    return newCustomer
  },

  updateCustomer: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const index = customers.findIndex((c) => c.id === id)
    if (index === -1) throw new Error("Customer not found")

    const updatedCustomer = { ...customers[index], ...data }
    customers[index] = updatedCustomer
    return updatedCustomer
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    return [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  getOrdersByCustomerId: async (customerId: string): Promise<Order[]> => {
    return orders
      .filter((o) => o.customerId === customerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    return orders.find((o) => o.id === id) || null
  },

  addOrder: async (
    order: Omit<Order, "id" | "receivedAmount" | "pendingAmount" | "status" | "createdAt">,
  ): Promise<Order> => {
    const newOrder: Order = {
      id: `o${orders.length + 1}`,
      ...order,
      receivedAmount: 0,
      pendingAmount: order.totalAmount,
      status: "active",
      createdAt: new Date(),
    }
    orders.push(newOrder)
    return newOrder
  },

  updateOrder: async (id: string, data: Partial<Order>): Promise<Order> => {
    const index = orders.findIndex((o) => o.id === id)
    if (index === -1) throw new Error("Order not found")

    const updatedOrder = { ...orders[index], ...data }
    orders[index] = updatedOrder
    return updatedOrder
  },

  deleteOrder: async (id: string): Promise<void> => {
    const index = orders.findIndex((o) => o.id === id)
    if (index === -1) throw new Error("Order not found")

    orders.splice(index, 1)
    // Also delete related transactions
    transactions = transactions.filter((t) => t.orderId !== id)
  },

  // Transactions
  getTransactions: async (): Promise<Transaction[]> => {
    return [...transactions].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  getTransactionsByOrderId: async (orderId: string): Promise<Transaction[]> => {
    return transactions
      .filter((t) => t.orderId === orderId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  getTransactionsByCustomerId: async (customerId: string): Promise<Transaction[]> => {
    return transactions
      .filter((t) => t.customerId === customerId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  },

  addTransaction: async (transaction: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> => {
    const newTransaction: Transaction = {
      id: `t${transactions.length + 1}`,
      ...transaction,
      createdAt: new Date(),
    }
    transactions.push(newTransaction)

    // Update order amounts
    const orderIndex = orders.findIndex((o) => o.id === transaction.orderId)
    if (orderIndex !== -1) {
      const order = orders[orderIndex]
      if (transaction.type === "incoming") {
        order.receivedAmount += transaction.amount
        order.pendingAmount -= transaction.amount
      } else {
        order.receivedAmount -= transaction.amount
        order.pendingAmount += transaction.amount
      }

      // Update order status if fully paid
      if (order.pendingAmount <= 0) {
        order.status = "closed"
      } else {
        order.status = "active"
      }
    }

    return newTransaction
  },
}

// Custom hooks for real-time updates
export function useCustomers() {
  const [data, setData] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await firestore.getCustomers()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // In a real implementation, this would be a Firestore listener
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error }
}

export function useOrders() {
  const [data, setData] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await firestore.getOrders()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // In a real implementation, this would be a Firestore listener
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  return { data, loading, error }
}

export function useOrdersByCustomerId(customerId: string) {
  const [data, setData] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await firestore.getOrdersByCustomerId(customerId)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // In a real implementation, this would be a Firestore listener
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [customerId])

  return { data, loading, error }
}

export function useOrder(id: string) {
  const [data, setData] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await firestore.getOrderById(id)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // In a real implementation, this would be a Firestore listener
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [id])

  return { data, loading, error }
}

export function useTransactionsByOrderId(orderId: string) {
  const [data, setData] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await firestore.getTransactionsByOrderId(orderId)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // In a real implementation, this would be a Firestore listener
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [orderId])

  return { data, loading, error }
}

