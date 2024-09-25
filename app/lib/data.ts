import { formatCurrency } from './utils';
import { db } from '@/db';
import { customers, invoices, revenue } from '@/db/schema';
import { asc, count, desc, eq, ilike, or, sql } from 'drizzle-orm';

export async function fetchRevenue() {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await db.select().from(revenue);

    console.log('Data fetch completed after 3 seconds.');

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await db.select({
      amount: invoices.amount,
      name: customers.name,
      imageUrl: customers.imageUrl,
      email: customers.email,
      id: invoices.id
    }).from(invoices)
      .innerJoin(customers, eq(invoices.customerId, customers.id))
      .orderBy(desc(invoices.date))
      .limit(5)

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = db.select({ count: count() }).from(invoices);
    const customerCountPromise = db.select({ count: count() }).from(customers);
    const invoiceStatusPromise = db.select({
      paid: sql<number>`sum(case when ${invoices.status} = 'paid' then ${invoices.amount} else 0 end)`,
      pending: sql<number>`sum(case when ${invoices.status} = 'pending' then ${invoices.amount} else 0 end)`
    }).from(invoices);

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0][0].count ?? 0);
    const numberOfCustomers = Number(data[1][0].count ?? 0);
    const totalPaidInvoices = formatCurrency(data[2][0].paid ?? 0);
    const totalPendingInvoices = formatCurrency(data[2][0].pending ?? 0);

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const filtered = await db
      .select({
        id: invoices.id,
        amount: invoices.amount,
        date: invoices.date,
        status: invoices.status,
        name: customers.name,
        email: customers.email,
        imageUrl: customers.imageUrl
      })
      .from(invoices)
      .where(or(
        ilike(customers.name, `%${query}%`),
        ilike(customers.email, `%${query}%`),
        ilike(invoices.amount, `%${query}%`),
        ilike(invoices.date, `%${query}%`),
        // sql`${invoices.amount}::text ILIKE '%${query}%'`,
        // sql`${invoices.date}::text ILIKE '%${query}%'`,
        ilike(invoices.status, `%${query}%`),
      ))
      .innerJoin(customers, eq(invoices.customerId, customers.id))
      .orderBy(desc(invoices.date))
      .limit(ITEMS_PER_PAGE)
      .offset(offset);

    return filtered;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const filteredCount = await db
      .select({
        count: count()
      })
      .from(invoices)
      .innerJoin(customers, eq(customers.id, invoices.customerId))
      .where(or(
        ilike(customers.name, `%${query}%`),
        ilike(customers.email, `%${query}%`),
        ilike(invoices.amount, `%${query}%`),
        ilike(invoices.date, `%${query}%`),
        // sql`${invoices.amount}::text ILIKE '%${query}%'`,
        // sql`${invoices.date}::text ILIKE '%${query}%'`,
        ilike(invoices.status, `%${query}%`),
      ));

    const totalPages = Math.ceil(Number(filteredCount[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: number) {
  try {
    const data = await db
      .select({
        id: invoices.id,
        customerId: invoices.customerId,
        amount: invoices.amount,
        status: invoices.status,
      })
      .from(invoices)
      .where(
        eq(invoices.id, id)
      );

    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');
  }
}

export async function fetchCustomers() {
  try {
    const data = await db
      .select({
        id: customers.id,
        name: customers.name,
      })
      .from(customers)
      .orderBy(customers.name);

    return data;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await db
      .select({
        id: customers.id,
        name: customers.name,
        email: customers.email,
        imageUrl: customers.imageUrl,
        totalInvoices: count(invoices.id),
        totalPending: sql<number>`sum(case when ${invoices.status} = 'pending' then ${invoices.amount} else 0 end)`,
        totalPaid: sql<number>`sum(case when ${invoices.status} = 'paid' then ${invoices.amount} else 0 end)`,
      })
      .from(customers)
      .leftJoin(invoices, eq(customers.id, invoices.customerId))
      .where(
        or(
          ilike(customers.name, `%${query}%`),
          ilike(customers.email, `%${query}%`),
        )
      )
      .groupBy(customers.id, customers.name, customers.email, customers.imageUrl)
      .orderBy(asc(customers.name));
    
    const customersData = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.totalPending),
      total_paid: formatCurrency(customer.totalPaid),
    }));

    return customersData;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}
