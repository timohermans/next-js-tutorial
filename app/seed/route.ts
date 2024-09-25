import bcrypt from 'bcrypt';
import { db, DbTransaction } from '@/db';
import { userData, invoiceData, customerData, revenueData } from '@/app/lib/placeholder-data';
import { customers, invoices, revenue, users } from '@/db/schema';

export async function GET() {
  try {
    await db.transaction(async tx => {
      await db.insert(users).values(userData);
      await db.insert(customers).values(customerData);
      await db.insert(invoices).values(invoiceData);
      await db.insert(revenue).values(revenueData);
    });

    return Response.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}
