import initSqlJs from 'sql.js';

const BLOCKED_KEYWORDS = ['DROP', 'ALTER', 'DELETE', 'TRUNCATE', 'INSERT', 'UPDATE', 'CREATE', 'ATTACH', 'DETACH', 'PRAGMA', 'VACUUM', 'REINDEX'];
const MAX_ROWS = 100;
const QUERY_TIMEOUT_MS = 3000;

const SAMPLE_DATA = `
-- Departments
CREATE TABLE departments (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  budget REAL NOT NULL,
  location TEXT NOT NULL
);

INSERT INTO departments (id, name, budget, location) VALUES
  (1, 'Engineering', 500000, 'Mumbai'),
  (2, 'Marketing', 200000, 'Delhi'),
  (3, 'Sales', 300000, 'Bangalore'),
  (4, 'HR', 150000, 'Mumbai'),
  (5, 'Finance', 250000, 'Delhi'),
  (6, 'Support', 100000, 'Pune');

-- Employees
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  department_id INTEGER,
  salary REAL NOT NULL,
  city TEXT NOT NULL,
  hire_date TEXT NOT NULL,
  manager_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (manager_id) REFERENCES employees(id)
);

INSERT INTO employees (id, name, email, department_id, salary, city, hire_date, manager_id) VALUES
  (1,  'Rahul Sharma',    'rahul@company.com',    1, 120000, 'Mumbai',    '2020-01-15', NULL),
  (2,  'Priya Patel',     'priya@company.com',    1, 95000,  'Mumbai',    '2021-03-20', 1),
  (3,  'Amit Kumar',      'amit@company.com',     2, 85000,  'Delhi',     '2019-07-10', NULL),
  (4,  'Sneha Gupta',     'sneha@company.com',    1, 110000, 'Bangalore', '2020-06-01', 1),
  (5,  'Vikram Singh',    'vikram@company.com',   3, 75000,  'Delhi',     '2022-01-10', NULL),
  (6,  'Anjali Desai',    'anjali@company.com',   3, 70000,  'Pune',      '2022-05-15', 5),
  (7,  'Rohan Mehta',     'rohan@company.com',    4, 65000,  'Mumbai',    '2021-09-01', NULL),
  (8,  'Kavita Joshi',    'kavita@company.com',   5, 105000, 'Delhi',     '2019-11-20', NULL),
  (9,  'Suresh Reddy',    'suresh@company.com',   1, 130000, 'Bangalore', '2018-04-10', 1),
  (10, 'Neha Agarwal',    'neha@company.com',     2, 78000,  'Mumbai',    '2023-02-01', 3),
  (11, 'Deepak Verma',    'deepak@company.com',   3, 90000,  'Bangalore', '2020-08-15', 5),
  (12, 'Pooja Nair',      'pooja@company.com',    5, 98000,  'Pune',      '2021-04-20', 8),
  (13, 'Arjun Rao',       'arjun@company.com',    1, 88000,  'Delhi',     '2022-11-01', 1),
  (14, 'Meera Iyer',      'meera@company.com',    4, 72000,  'Bangalore', '2023-06-10', 7),
  (15, 'Karan Malhotra',  'karan@company.com',    6, 60000,  'Pune',      '2023-09-01', NULL),
  (16, 'Divya Chauhan',   'divya@company.com',    NULL, 55000, 'Mumbai',  '2024-01-15', NULL);

-- Products
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL
);

INSERT INTO products (id, name, category, price, stock) VALUES
  (1,  'Laptop',        'Electronics', 75000, 50),
  (2,  'Mouse',         'Electronics', 500,   200),
  (3,  'Keyboard',      'Electronics', 1500,  150),
  (4,  'Desk Chair',    'Furniture',   12000, 30),
  (5,  'Monitor',       'Electronics', 25000, 40),
  (6,  'Headphones',    'Electronics', 3000,  100),
  (7,  'Standing Desk', 'Furniture',   35000, 15),
  (8,  'Webcam',        'Electronics', 4000,  60),
  (9,  'Notebook',      'Stationery',  200,   500),
  (10, 'Pen Set',       'Stationery',  150,   300),
  (11, 'Backpack',      'Accessories', 2500,  80),
  (12, 'USB Hub',       'Electronics', 1200,  90);

-- Customers
CREATE TABLE customers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  joined_date TEXT NOT NULL
);

INSERT INTO customers (id, name, email, city, country, joined_date) VALUES
  (1,  'Aarav Sharma',   'aarav@mail.com',   'Mumbai',    'India',   '2023-01-10'),
  (2,  'Sara Khan',      'sara@mail.com',    'Delhi',     'India',   '2023-02-15'),
  (3,  'John Smith',     'john@mail.com',    'New York',  'USA',     '2023-03-20'),
  (4,  'Riya Patel',     'riya@mail.com',    'Bangalore', 'India',   '2023-04-01'),
  (5,  'Mike Johnson',   'mike@mail.com',    'London',    'UK',      '2023-05-10'),
  (6,  'Ananya Reddy',   'ananya@mail.com',  'Hyderabad', 'India',   '2023-06-15'),
  (7,  'David Brown',    'david@mail.com',   'New York',  'USA',     '2023-07-20'),
  (8,  'Ishaan Gupta',   'ishaan@mail.com',  'Pune',      'India',   '2023-08-01'),
  (9,  'Emma Wilson',    'emma@mail.com',    'London',    'UK',      '2023-09-10'),
  (10, 'Zara Ali',       'zara@mail.com',    'Delhi',     'India',   '2023-10-15');

-- Orders (sales)
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  total_amount REAL NOT NULL,
  order_date TEXT NOT NULL,
  status TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO orders (id, customer_id, product_id, quantity, total_amount, order_date, status) VALUES
  (1,  1, 1, 1, 75000,  '2024-01-05', 'delivered'),
  (2,  1, 2, 2, 1000,   '2024-01-05', 'delivered'),
  (3,  2, 5, 1, 25000,  '2024-01-12', 'delivered'),
  (4,  3, 1, 2, 150000, '2024-01-18', 'delivered'),
  (5,  4, 6, 3, 9000,   '2024-02-01', 'delivered'),
  (6,  5, 7, 1, 35000,  '2024-02-10', 'shipped'),
  (7,  2, 3, 1, 1500,   '2024-02-14', 'delivered'),
  (8,  6, 4, 2, 24000,  '2024-02-20', 'delivered'),
  (9,  7, 1, 1, 75000,  '2024-03-01', 'shipped'),
  (10, 1, 8, 1, 4000,   '2024-03-05', 'delivered'),
  (11, 8, 9, 10, 2000,  '2024-03-10', 'delivered'),
  (12, 3, 5, 2, 50000,  '2024-03-15', 'delivered'),
  (13, 9, 11, 1, 2500,  '2024-03-20', 'shipped'),
  (14, 4, 12, 3, 3600,  '2024-04-01', 'pending'),
  (15, 10, 6, 2, 6000,  '2024-04-05', 'pending'),
  (16, 6, 1, 1, 75000,  '2024-04-10', 'pending'),
  (17, 2, 10, 5, 750,   '2024-04-12', 'delivered'),
  (18, 5, 3, 2, 3000,   '2024-04-15', 'shipped'),
  (19, 8, 4, 1, 12000,  '2024-04-20', 'delivered'),
  (20, 1, 11, 2, 5000,  '2024-04-25', 'delivered');

-- Marks / Students (for academic queries)
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  city TEXT NOT NULL
);

INSERT INTO students (id, name, class, city) VALUES
  (1, 'Aman',   '10th', 'Mumbai'),
  (2, 'Bhavna', '10th', 'Delhi'),
  (3, 'Chirag', '12th', 'Pune'),
  (4, 'Disha',  '10th', 'Mumbai'),
  (5, 'Eshan',  '12th', 'Bangalore'),
  (6, 'Farheen','12th', 'Delhi'),
  (7, 'Gaurav', '10th', 'Pune'),
  (8, 'Hina',   '12th', 'Mumbai');

CREATE TABLE marks (
  id INTEGER PRIMARY KEY,
  student_id INTEGER NOT NULL,
  subject TEXT NOT NULL,
  score INTEGER NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO marks (id, student_id, subject, score) VALUES
  (1,  1, 'Math',    85),
  (2,  1, 'Science', 90),
  (3,  1, 'English', 78),
  (4,  2, 'Math',    92),
  (5,  2, 'Science', 88),
  (6,  2, 'English', 95),
  (7,  3, 'Math',    70),
  (8,  3, 'Science', 65),
  (9,  3, 'English', 80),
  (10, 4, 'Math',    98),
  (11, 4, 'Science', 94),
  (12, 4, 'English', 88),
  (13, 5, 'Math',    55),
  (14, 5, 'Science', 60),
  (15, 5, 'English', 72),
  (16, 6, 'Math',    83),
  (17, 6, 'Science', 79),
  (18, 6, 'English', 91),
  (19, 7, 'Math',    45),
  (20, 7, 'Science', 50),
  (21, 7, 'English', 65),
  (22, 8, 'Math',    88),
  (23, 8, 'Science', 92),
  (24, 8, 'English', 85);
`;

const SCHEMA = [
  {
    table: 'departments',
    columns: [
      { name: 'id', type: 'INTEGER', key: 'PK' },
      { name: 'name', type: 'TEXT', key: null },
      { name: 'budget', type: 'REAL', key: null },
      { name: 'location', type: 'TEXT', key: null },
    ],
    rowCount: 6,
  },
  {
    table: 'employees',
    columns: [
      { name: 'id', type: 'INTEGER', key: 'PK' },
      { name: 'name', type: 'TEXT', key: null },
      { name: 'email', type: 'TEXT', key: null },
      { name: 'department_id', type: 'INTEGER', key: 'FK → departments.id' },
      { name: 'salary', type: 'REAL', key: null },
      { name: 'city', type: 'TEXT', key: null },
      { name: 'hire_date', type: 'TEXT', key: null },
      { name: 'manager_id', type: 'INTEGER', key: 'FK → employees.id' },
    ],
    rowCount: 16,
  },
  {
    table: 'products',
    columns: [
      { name: 'id', type: 'INTEGER', key: 'PK' },
      { name: 'name', type: 'TEXT', key: null },
      { name: 'category', type: 'TEXT', key: null },
      { name: 'price', type: 'REAL', key: null },
      { name: 'stock', type: 'INTEGER', key: null },
    ],
    rowCount: 12,
  },
  {
    table: 'customers',
    columns: [
      { name: 'id', type: 'INTEGER', key: 'PK' },
      { name: 'name', type: 'TEXT', key: null },
      { name: 'email', type: 'TEXT', key: null },
      { name: 'city', type: 'TEXT', key: null },
      { name: 'country', type: 'TEXT', key: null },
      { name: 'joined_date', type: 'TEXT', key: null },
    ],
    rowCount: 10,
  },
  {
    table: 'orders',
    columns: [
      { name: 'id', type: 'INTEGER', key: 'PK' },
      { name: 'customer_id', type: 'INTEGER', key: 'FK → customers.id' },
      { name: 'product_id', type: 'INTEGER', key: 'FK → products.id' },
      { name: 'quantity', type: 'INTEGER', key: null },
      { name: 'total_amount', type: 'REAL', key: null },
      { name: 'order_date', type: 'TEXT', key: null },
      { name: 'status', type: 'TEXT', key: null },
    ],
    rowCount: 20,
  },
  {
    table: 'students',
    columns: [
      { name: 'id', type: 'INTEGER', key: 'PK' },
      { name: 'name', type: 'TEXT', key: null },
      { name: 'class', type: 'TEXT', key: null },
      { name: 'city', type: 'TEXT', key: null },
    ],
    rowCount: 8,
  },
  {
    table: 'marks',
    columns: [
      { name: 'id', type: 'INTEGER', key: 'PK' },
      { name: 'student_id', type: 'INTEGER', key: 'FK → students.id' },
      { name: 'subject', type: 'TEXT', key: null },
      { name: 'score', type: 'INTEGER', key: null },
    ],
    rowCount: 24,
  },
];

let SQL = null;

async function getSqlJs() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  return SQL;
}

function validateQuery(query) {
  const normalized = query.toUpperCase().replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

  for (const keyword of BLOCKED_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(normalized)) {
      throw new Error(`Blocked: "${keyword}" statements are not allowed in the SQL playground.`);
    }
  }

  if (normalized.includes(';')) {
    const statements = normalized.split(';').map(s => s.trim()).filter(Boolean);
    if (statements.length > 1) {
      throw new Error('Only single SELECT statements are allowed.');
    }
  }

  if (!normalized.trim().startsWith('SELECT')) {
    throw new Error('Only SELECT queries are allowed in the SQL playground.');
  }
}

export async function executeSQL(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    throw new Error('Query cannot be empty.');
  }

  if (query.length > 5000) {
    throw new Error('Query too long. Maximum 5000 characters.');
  }

  validateQuery(query);

  const SqlJs = await getSqlJs();
  const db = new SqlJs.Database();

  try {
    // Set up sample data
    db.run(SAMPLE_DATA);

    // Execute user query with timeout
    const result = await Promise.race([
      new Promise((resolve) => {
        const results = db.exec(query.trim());
        resolve(results);
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timed out (3s limit).')), QUERY_TIMEOUT_MS)
      ),
    ]);

    if (!result || result.length === 0) {
      return { columns: [], rows: [], rowCount: 0, schema: SCHEMA, message: 'Query executed successfully. No rows returned.' };
    }

    const { columns, values } = result[0];
    const limitedRows = values.slice(0, MAX_ROWS);

    return {
      columns,
      rows: limitedRows,
      rowCount: values.length,
      truncated: values.length > MAX_ROWS,
      schema: SCHEMA,
      message: values.length > MAX_ROWS
        ? `Showing ${MAX_ROWS} of ${values.length} rows.`
        : `${values.length} row${values.length === 1 ? '' : 's'} returned.`,
    };
  } finally {
    db.close();
  }
}
