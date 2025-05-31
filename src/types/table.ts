export type TableType = "customers" | "transactions" | "stores" | "product_lines"

export interface Customer {
  customer_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  birth_date: string;
  registration_date: string;
  address: string;
  city: string;
  business_id: number;
}

export interface Transaction {
  transaction_id: string;
  customer_id: string;
  store_id: string;
  transaction_date: string;
  total_amount: number;
  payment_method: string;
  quantity: number;
  unit_price: number;
  business_id: number;
  product_line_id: string;
}

export interface Store {
  store_id: string;
  store_name: string;
  address: string;
  city: string;
  store_type: string;
  opening_date: string;
  business_id: number;
  region: string;
}

export interface ProductLine {
  product_line_id: string;
  name: string;
  category: string;
  subcategory: string;
  brand: string;
  unit_cost: number;
  business_id: number;
}

export type TableData = Customer | Transaction | Store | ProductLine;

export const TABLE_CONFIG = {
  customers: {
    title: "Customers",
    columns: [
      { key: "customer_id", label: "ID" },
      { key: "first_name", label: "First Name" },
      { key: "last_name", label: "Last Name" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "gender", label: "Gender" },
      { key: "birth_date", label: "Birth Date" },
      { key: "registration_date", label: "Registration Date" },
      { key: "address", label: "Address" },
      { key: "city", label: "City" },
      { key: "business_id", label: "Business ID" }
    ]
  },
  transactions: {
    title: "Transactions",
    columns: [
      { key: "transaction_id", label: "ID" },
      { key: "customer_id", label: "Customer ID" },
      { key: "store_id", label: "Store ID" },
      { key: "transaction_date", label: "Transaction Date" },
      { key: "total_amount", label: "Total Amount" },
      { key: "payment_method", label: "Payment Method" },
      { key: "quantity", label: "Quantity" },
      { key: "unit_price", label: "Unit Price" },
      { key: "business_id", label: "Business ID" },
      { key: "product_line_id", label: "Product Line ID" }
    ]
  },
  stores: {
    title: "Stores",
    columns: [
      { key: "store_id", label: "ID" },
      { key: "store_name", label: "Store Name" },
      { key: "address", label: "Address" },
      { key: "city", label: "City" },
      { key: "store_type", label: "Store Type" },
      { key: "opening_date", label: "Opening Date" },
      { key: "business_id", label: "Business ID" },
      { key: "region", label: "Region" }
    ]
  },
  product_lines: {
    title: "Product Lines",
    columns: [
      { key: "product_line_id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "category", label: "Category" },
      { key: "subcategory", label: "Subcategory" },
      { key: "brand", label: "Brand" },
      { key: "unit_cost", label: "Unit Cost" },
      { key: "business_id", label: "Business ID" }
    ]
  }
} as const; 