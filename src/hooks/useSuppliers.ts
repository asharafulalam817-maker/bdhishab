import { useState, useMemo } from 'react';

export interface Supplier {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  due_amount: number;
  created_at: string;
  updated_at: string;
}

// Demo suppliers data
const DEMO_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'ওয়ালটন ডিস্ট্রিবিউটর',
    phone: '01711223344',
    email: 'walton@dist.com',
    address: 'গাজীপুর, ঢাকা',
    due_amount: 125000,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-20T10:00:00Z',
  },
  {
    id: '2',
    name: 'স্যামসাং বাংলাদেশ',
    phone: '01899887766',
    email: 'samsung@bd.com',
    address: 'উত্তরা, ঢাকা',
    due_amount: 0,
    created_at: '2025-01-05T10:00:00Z',
    updated_at: '2025-01-05T10:00:00Z',
  },
  {
    id: '3',
    name: 'সিঙ্গার বাংলাদেশ',
    phone: '01555667788',
    email: null,
    address: 'মতিঝিল, ঢাকা',
    due_amount: 85000,
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-18T10:00:00Z',
  },
  {
    id: '4',
    name: 'ভিশন ইলেকট্রনিক্স',
    phone: '01622334455',
    email: 'vision@electronics.com',
    address: 'টঙ্গী, গাজীপুর',
    due_amount: 45000,
    created_at: '2024-12-15T10:00:00Z',
    updated_at: '2025-01-22T10:00:00Z',
  },
  {
    id: '5',
    name: 'মার্সেল ইন্ডাস্ট্রিজ',
    phone: '01933445566',
    email: null,
    address: 'আশুলিয়া, সাভার',
    due_amount: 0,
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T10:00:00Z',
  },
];

export interface SupplierFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(DEMO_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDue, setFilterDue] = useState<'all' | 'due' | 'clear'>('all');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.phone?.includes(searchQuery) ||
        supplier.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDue =
        filterDue === 'all' ||
        (filterDue === 'due' && supplier.due_amount > 0) ||
        (filterDue === 'clear' && supplier.due_amount === 0);

      return matchesSearch && matchesDue;
    });
  }, [suppliers, searchQuery, filterDue]);

  const addSupplier = (data: SupplierFormData) => {
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
      address: data.address || null,
      due_amount: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    return newSupplier;
  };

  const updateSupplier = (id: string, data: SupplierFormData) => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id
          ? {
              ...supplier,
              ...data,
              phone: data.phone || null,
              email: data.email || null,
              address: data.address || null,
              updated_at: new Date().toISOString(),
            }
          : supplier
      )
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id));
  };

  const adjustDue = (id: string, amount: number, type: 'add' | 'subtract') => {
    setSuppliers((prev) =>
      prev.map((supplier) =>
        supplier.id === id
          ? {
              ...supplier,
              due_amount:
                type === 'add'
                  ? supplier.due_amount + amount
                  : Math.max(0, supplier.due_amount - amount),
              updated_at: new Date().toISOString(),
            }
          : supplier
      )
    );
  };

  const totalDue = useMemo(() => {
    return suppliers.reduce((sum, s) => sum + s.due_amount, 0);
  }, [suppliers]);

  return {
    suppliers: filteredSuppliers,
    allSuppliers: suppliers,
    searchQuery,
    setSearchQuery,
    filterDue,
    setFilterDue,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    adjustDue,
    totalDue,
  };
}
