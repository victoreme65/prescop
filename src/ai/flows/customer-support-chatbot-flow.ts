'use server';
/**
 * @fileOverview An AI-powered chatbot for customer support, providing instant answers to common questions.
 *
 * - customerSupportChatbot - A function that handles customer queries and returns a chatbot response.
 * - CustomerSupportChatbotInput - The input type for the customerSupportChatbot function.
 * - CustomerSupportChatbotOutput - The return type for the customerSupportChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerSupportChatbotInputSchema = z
  .string()
  .describe('The customer\'s query about products, orders, shipping, or returns.');
export type CustomerSupportChatbotInput = z.infer<typeof CustomerSupportChatbotInputSchema>;

const CustomerSupportChatbotOutputSchema = z
  .string()
  .describe('The AI chatbot\'s response to the customer\'s query.');
export type CustomerSupportChatbotOutput = z.infer<typeof CustomerSupportChatbotOutputSchema>;

export async function customerSupportChatbot(input: CustomerSupportChatbotInput): Promise<CustomerSupportChatbotOutput> {
  return customerSupportChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customerSupportChatbotPrompt',
  input: {schema: CustomerSupportChatbotInputSchema},
  output: {schema: CustomerSupportChatbotOutputSchema},
  prompt: `You are a helpful and friendly customer support chatbot for Prescop, a beauty and cosmetics marketplace.
Your goal is to assist customers with their queries regarding products, orders, shipping, and returns.
Provide clear, concise, and accurate information.
If you don't know the answer, politely state that you cannot assist with that specific query and suggest they contact a human support agent.

Customer Query: {{{this}}}`,
});

const customerSupportChatbotFlow = ai.defineFlow(
  {
    name: 'customerSupportChatbotFlow',
    inputSchema: CustomerSupportChatbotInputSchema,
    outputSchema: CustomerSupportChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
