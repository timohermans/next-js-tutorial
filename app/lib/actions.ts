'use server'

import { z } from 'zod';
import { db } from '@/db';
import { invoices } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';

const FormSchema = z.object({
    id: z.coerce.number(),
    customerId: z.coerce.number(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string()
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });



export async function createInvoice(formData: FormData) {
    const { amount, customerId, status } = CreateInvoice.parse(Object.fromEntries(formData.entries()));

    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await db.insert(invoices).values({
            amount: amountInCents,
            customerId,
            status,
            date,
        });
    } catch (error) {
        return {
            message: 'Database error: failed to create invoice'
        }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(id: number, formData: FormData) {
    const { amount, customerId, status } = UpdateInvoice.parse(Object.fromEntries(formData.entries()));

    const amountInCents = amount * 100;

    try {
        await db
            .update(invoices)
            .set({
                amount: amountInCents,
                customerId,
                status,
            })
            .where(eq(invoices.id, id));
    } catch (error) {
        return {
            message: 'Database error: failed to update invoice'
        }
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: number) {
    throw new Error('Failed to delete invoice');

    try {
        await db
            .delete(invoices)
            .where(eq(invoices.id, id));
        revalidatePath('/dashboard/invoices');
        return {
            message: 'Deleted invoice'
        }
    } catch (error) {
        return {
            message: 'Database error: failed to delete invoice'
        }
    }

}

