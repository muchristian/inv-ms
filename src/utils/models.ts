export interface categoriesResponse {
  data: {
    _id: number;
    name: string;
  }[];
}

export interface categoriesResponse1 {
  message: string;
  data: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    budget: number | null;
    usedBudget?: number;
    usedBudgetPercentage?: number;
    usedBudgetColor?: string;
    transaction_type: {
      id: number;
      name: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  };
}

export interface categoriesBody {
  id?: number;
  name: string;
}

export interface categoriesQueries {
  user: number;
  dateFrom?: string;
  dateTo?: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
[];

export interface categoriesResponse1 {
  message: string;
  data: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    budget: number | null;
    usedBudget?: number;
    usedBudgetPercentage?: number;
    usedBudgetColor?: string;
    transaction_type: {
      id: number;
      name: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  };
}

export interface productBody {
  name: string;
  category: string;
  unit: string;
  quantity: number | "";
  price: string;
  image: {};
  description: string;
}

export interface productQueries {
  user: number;
  dateFrom?: string;
  dateTo?: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
[];

export interface signup {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface login {
  email: string;
  password: string;
}

export interface refreshResponse {
  message: string;
  payload: string;
}

export interface customersResponse {
  data: {
    _id: number;
    name: string;
  }[];
}

export interface customerBody {
  name: string;
}

export interface holdBody {
  customerName: string;
  products: string[];
  date: any;
}

export interface expenseBody {
  title: string;
  date: any;
}

export interface stockBody {
  _id: number;
  productId: string;
  productName: string;
  lastNight: number;
  new: number;
  now: number;
  consumed: number;
  amount: number;
  date: string;
}

export interface comptoirBody {
  _id: number;
  productId: string;
  productName: string;
  lastNight: number;
  new: number;
  now: number;
  consumed: number;
  amount: number;
  date: string;
}
