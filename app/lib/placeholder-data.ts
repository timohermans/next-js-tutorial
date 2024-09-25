// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const userData = [
  {
    id: 1,
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const customerData = [
  {
    id: 1,
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    imageUrl: '/customers/evil-rabbit.png',
  },
  {
    id: 2,
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    imageUrl: '/customers/delba-de-oliveira.png',
  },
  {
    id: 3,
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    imageUrl: '/customers/lee-robinson.png',
  },
  {
    id: 4,
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    imageUrl: '/customers/michael-novotny.png',
  },
  {
    id: 5,
    name: 'Amy Burns',
    email: 'amy@burns.com',
    imageUrl: '/customers/amy-burns.png',
  },
  {
    id: 6,
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    imageUrl: '/customers/balazs-orban.png',
  },
];

const invoiceData = [
  {
    customerId: customerData[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    customerId: customerData[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    customerId: customerData[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    customerId: customerData[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
  },
  {
    customerId: customerData[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
  },
  {
    customerId: customerData[2].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
  },
  {
    customerId: customerData[0].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
  },
  {
    customerId: customerData[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
  },
  {
    customerId: customerData[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
  },
  {
    customerId: customerData[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
  },
  {
    customerId: customerData[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
  },
  {
    customerId: customerData[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
  },
  {
    customerId: customerData[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
  },
];

const revenueData = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

export { userData, customerData, invoiceData, revenueData };
