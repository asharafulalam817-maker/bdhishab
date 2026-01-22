import { useState, useMemo } from 'react';

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  due_amount: number;
  created_at: string;
  updated_at: string;
}

// Demo customers data
const DEMO_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'রহিম উদ্দিন',
    phone: '01712345678',
    email: null,
    address: 'মিরপুর-১০, ঢাকা',
    due_amount: 5500,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'করিম সাহেব',
    phone: '01898765432',
    email: 'karim@email.com',
    address: 'উত্তরা, ঢাকা',
    due_amount: 0,
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
  },
  {
    id: '3',
    name: 'সালমা বেগম',
    phone: '01556789012',
    email: null,
    address: 'মোহাম্মদপুর, ঢাকা',
    due_amount: 12000,
    created_at: '2025-01-05T10:00:00Z',
    updated_at: '2025-01-18T10:00:00Z',
  },
  {
    id: '4',
    name: 'জামাল হোসেন',
    phone: '01623456789',
    email: 'jamal@email.com',
    address: 'গুলশান-২, ঢাকা',
    due_amount: 3200,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-22T10:00:00Z',
  },
  {
    id: '5',
    name: 'ফাতেমা খাতুন',
    phone: '01934567890',
    email: null,
    address: 'বনানী, ঢাকা',
    due_amount: 0,
    created_at: '2024-12-20T10:00:00Z',
    updated_at: '2024-12-20T10:00:00Z',
  },
];

export interface CustomerFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDue, setFilterDue] = useState<'all' | 'due' | 'clear'>('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Search filter
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase());

      // Due filter
      const matchesDue =
        filterDue === 'all' ||
        (filterDue === 'due' && customer.due_amount > 0) ||
        (filterDue === 'clear' && customer.due_amount === 0);

      return matchesSearch && matchesDue;
    });
  }, [customers, searchQuery, filterDue]);

  const addCustomer = (data: CustomerFormData) => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      due_amount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = (id: string, data: CustomerFormData) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              ...data,
              phone: data.phone || null,
              email: data.email || null,
              address: data.address || null,
              updated_at: new Date().toISOString(),
            }
          : customer
      )
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  const adjustDue = (id: string, amount: number, type: 'add' | 'subtract') => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              due_amount:
                type === 'add'
                  ? customer.due_amount + amount
                  : Math.max(0, customer.due_amount - amount),
              updated_at: new Date().toISOString(),
            }
          : customer
      )
    );
  };

  const totalDue = useMemo(() => {
    return customers.reduce((sum, c) => sum + c.due_amount, 0);
  }, [customers]);

  return {
    customers: filteredCustomers,
    allCustomers: customers,
    searchQuery,
    setSearchQuery,
    filterDue,
    setFilterDue,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    adjustDue,
    totalDue,
  };
}
