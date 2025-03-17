"use client"

import { useEffect, useState } from "react"
import { db } from "@/firebase"
// import { initializeApp } from "firebase/app"

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  Timestamp,
  onSnapshot
} from "firebase/firestore"

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
  createdAt: Date,
  dueDate?: any,
  lastPaymentDate? : Date | undefined,
  lastPaymentAmount? : number 

}

export interface Transaction {
  id: string
  orderId: string
  customerId: string
  amount: number
  type: "incoming" | "outgoing"
  notes?: string
  createdAt: Date, 
  date : Date,
  paymentMethod? : string
}

// Helper function to convert Firestore data to our types
const convertTimestampToDate = (data: any) => {
  const result = { ...data };
  
  if (result.createdAt && result.createdAt instanceof Timestamp) {
    result.createdAt = result.createdAt.toDate();
  }
  if (result.date && result.date instanceof Timestamp) {
    result.date = result.date.toDate();
  }
  
  return result;
};

// Real Firebase functions
export const firestore = {
  // Customers
  getCustomers: async (): Promise<Customer[]> => {
    const customersRef = collection(db, "customers");
    const customersQuery = query(customersRef, orderBy("name"));
    const snapshot = await getDocs(customersQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestampToDate(doc.data())
    } as Customer));
  },

  getCustomerById: async (id: string): Promise<Customer | null> => {
    const docRef = doc(db, "customers", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...convertTimestampToDate(docSnap.data())
    } as Customer;
  },

  addCustomer: async (customer: Omit<Customer, "id" | "profileNumber" | "createdAt">): Promise<Customer> => {
    // Get current count of customers for profile number
    const customersRef = collection(db, "customers");
    const snapshot = await getDocs(customersRef);
    const profileNumber = String(snapshot.size + 1).padStart(3, "0");
    
    const customerData = {
      ...customer,
      profileNumber,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, "customers"), customerData);
    
    // Get the newly created document to return
    const newDoc = await getDoc(docRef);
    
    return {
      id: docRef.id,
      ...convertTimestampToDate(newDoc.data() || {})
    } as Customer;
  },

  updateCustomer: async (id: string, data: Partial<Customer>): Promise<Customer> => {
    const customerRef = doc(db, "customers", id);
    
    // Remove id from data if it exists
    const { id: _, ...updateData } = data;
    
    await updateDoc(customerRef, updateData);
    
    // Get the updated document
    const updatedDoc = await getDoc(customerRef);
    
    if (!updatedDoc.exists()) {
      throw new Error("Customer not found");
    }
    
    return {
      id: updatedDoc.id,
      ...convertTimestampToDate(updatedDoc.data())
    } as Customer;
  },

  // Orders
  getOrders: async (): Promise<Order[]> => {
    const ordersRef = collection(db, "orders");
    const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(ordersQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestampToDate(doc.data())
    } as Order));
  },

  getOrdersByCustomerId: async (customerId: string): Promise<Order[]> => {
    const ordersRef = collection(db, "orders");
    const ordersQuery = query(
      ordersRef, 
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(ordersQuery);
    console.log("SNAPSHOT from getOrdersByCustomerId : ", snapshot.docs);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestampToDate(doc.data())
    } as Order));
  },

  getOrderById: async (id: string): Promise<Order | null> => {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...convertTimestampToDate(docSnap.data())
    } as Order;
  },

  addOrder: async (
    order: Omit<Order, "id" | "receivedAmount" | "pendingAmount" | "status" | "createdAt">,
  ): Promise<Order> => {
    const orderData = {
      ...order,
      customerId: String(order.customerId), // Explicit conversion to string
      receivedAmount: 0,
      pendingAmount: order.totalAmount,
      status: "active",
      createdAt: serverTimestamp()
    };
    
    console.log("Adding order with data:", orderData);
    
    const docRef = await addDoc(collection(db, "orders"), orderData);
    
    // Get the newly created document
    const newDoc = await getDoc(docRef);
    
    return {
      id: docRef.id,
      ...convertTimestampToDate(newDoc.data() || {})
    } as Order;
  },

  updateOrder: async (id: string, data: Partial<Order>): Promise<Order> => {
    const orderRef = doc(db, "orders", id);
    
    // Remove id from data if it exists
    const { id: _, ...updateData } = data;
    
    await updateDoc(orderRef, updateData);
    
    // Get the updated document
    const updatedDoc = await getDoc(orderRef);
    
    if (!updatedDoc.exists()) {
      throw new Error("Order not found");
    }
    
    return {
      id: updatedDoc.id,
      ...convertTimestampToDate(updatedDoc.data())
    } as Order;
  },

  deleteOrder: async (id: string): Promise<void> => {
    // First delete related transactions
    const transactionsRef = collection(db, "transactions");
    const transactionsQuery = query(transactionsRef, where("orderId", "==", id));
    const snapshot = await getDocs(transactionsQuery);
    
    // Delete each transaction
    const deletePromises = snapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    await Promise.all(deletePromises);
    
    // Then delete the order
    await deleteDoc(doc(db, "orders", id));
  },

  // Transactions
  getTransactions: async (): Promise<Transaction[]> => {
    const transactionsRef = collection(db, "transactions");
    const transactionsQuery = query(transactionsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(transactionsQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestampToDate(doc.data())
    } as Transaction));
  },

  getTransactionsByOrderId: async (orderId: string): Promise<Transaction[]> => {
    const transactionsRef = collection(db, "transactions");
    const transactionsQuery = query(
      transactionsRef, 
      where("orderId", "==", orderId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(transactionsQuery);
    console.log("snapshpt transactions :", snapshot.docs)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestampToDate(doc.data())
    } as Transaction));
  },

  getTransactionsByCustomerId: async (customerId: string): Promise<Transaction[]> => {
    const transactionsRef = collection(db, "transactions");
    const transactionsQuery = query(
      transactionsRef, 
      where("customerId", "==", customerId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(transactionsQuery);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestampToDate(doc.data())
    } as Transaction));
  },

  addTransaction: async (transaction: Omit<Transaction, "id" | "createdAt">): Promise<Transaction> => {
    try {
      // Ensure customerId is a string
      const transactionData = {
        ...transaction,
        customerId: String(transaction.customerId), // Explicit conversion to string
        createdAt: serverTimestamp()
      };
      
      console.log("Adding transaction with data:", transactionData);
      
      const docRef = await addDoc(collection(db, "transactions"), transactionData);
      
      // Get the order to update
      const orderRef = doc(db, "orders", transaction.orderId);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        throw new Error("Order not found");
      }
      
      const orderData = orderSnap.data() as Order;
      let newReceivedAmount = orderData.receivedAmount;
      let newPendingAmount = orderData.pendingAmount;
      
      if (transaction.type === "incoming") {
        newReceivedAmount += transaction.amount;
        newPendingAmount -= transaction.amount;
      } else {
        newReceivedAmount -= transaction.amount;
        newPendingAmount += transaction.amount;
      }
      
      const newStatus = newPendingAmount <= 0 ? "closed" : "active";
      
      await updateDoc(orderRef, {
        receivedAmount: newReceivedAmount,
        pendingAmount: newPendingAmount,
        status: newStatus
      });
      
      const newTransDoc = await getDoc(docRef);
      
      return {
        id: docRef.id,
        ...convertTimestampToDate(newTransDoc.data() || {})
      } as Transaction;
    } catch (error) {
      console.error("Error adding transaction:", error);
      throw error;
    }
  },
}

// Custom hooks for real-time updates using Firestore listeners
export function useCustomers() {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const customersRef = collection(db, "customers");
    const customersQuery = query(customersRef, orderBy("name"));
    
    const unsubscribe = onSnapshot(
      customersQuery,
      (snapshot) => {
        const customers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestampToDate(doc.data())
        })) as Customer[];
        
        setData(customers);
        setLoading(false);
      },
      (err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, []);

  return { data, loading, error, setData };
}

export function useOrders() {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const ordersQuery = query(ordersRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestampToDate(doc.data())
        })) as Order[];
        
        setData(orders);
        setLoading(false);
      },
      (err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, []);

  return { data, loading, error };
}

export function useOrdersByCustomerId(customerId: string) {
  const [data, setData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!customerId) {
      setData([]);
      setLoading(false);
      return () => {};
    }
    
    const ordersRef = collection(db, "orders");
    // Fix: Ensure we're using a string comparison and proper indexing
    const ordersQuery = query(
      ordersRef, 
      where("customerId", "==", customerId)
      // Note: When you create a composite index, restore this line:
      // orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        console.log(`Orders snapshot for customer ${customerId}:`, snapshot.size);
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestampToDate(doc.data())
        })) as Order[];
        
        setData(orders);
        setLoading(false);
      },
      (err) => {
        console.error(`Error getting orders for customer ${customerId}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [customerId]);

  return { data, loading, error };
}

export function useOrder(id: string) {
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setLoading(false);
      return () => {};
    }
    
    const orderRef = doc(db, "orders", id);
    
    const unsubscribe = onSnapshot(
      orderRef,
      (doc) => {
        if (doc.exists()) {
          setData({
            id: doc.id,
            ...convertTimestampToDate(doc.data())
          } as Order);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [id]);

  return { data, loading, error };
}

export function useTransactionsByOrderId(orderId: string) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!orderId) {
      setData([]);
      setLoading(false);
      return () => {};
    }
    
    const transactionsRef = collection(db, "transactions");
    const transactionsQuery = query(
      transactionsRef, 
      where("orderId", "==", orderId),
      // orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestampToDate(doc.data())
        })) as Transaction[];
        
        setData(transactions);
        setLoading(false);
      },
      (err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [orderId]);

  return { data, loading, error };
}

export function useTransactionsByCustomerId(customerId: string) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!customerId) {
      setData([]);
      setLoading(false);
      return () => {};
    }
    
    const transactionsRef = collection(db, "transactions");
    // Fix: Ensure we're using a string comparison and proper indexing
    const transactionsQuery = query(
      transactionsRef, 
      where("customerId", "==", customerId)
      // Note: When you create a composite index, restore this line:
      // orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(
      transactionsQuery,
      (snapshot) => {
        console.log(`Transactions snapshot for customer ${customerId}:`, snapshot.size);
        const transactions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestampToDate(doc.data())
        })) as Transaction[];
        
        setData(transactions);
        setLoading(false);
      },
      (err) => {
        console.error(`Error getting transactions for customer ${customerId}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [customerId]);

  return { data, loading, error };
}
