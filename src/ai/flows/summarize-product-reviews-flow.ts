'use server';
/**
 * @fileOverview This file implements a Genkit flow to summarize product reviews.
 *
 * - summarizeProductReviews - A function that handles the summarization of product reviews.
 * - SummarizeProductReviewsInput - The input type for the summarizeProductReviews function.
 * - SummarizeProductReviewsOutput - The return type for the summarizeProductReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).describe('The 1-5 star rating given by the customer.'),
  comment: z.string().describe('The customer\'s review comment.'),
});

const SummarizeProductReviewsInputSchema = z.object({
  productTitle: z.string().describe('The title of the product.'),
  reviews: z.array(ReviewSchema).describe('An array of customer reviews for the product.'),
});
export type SummarizeProductReviewsInput = z.infer<typeof SummarizeProductReviewsInputSchema>;

const SummarizeProductReviewsOutputSchema = z.object({
  summary: z.string().describe('A summary of the customer sentiment and key areas for improvement.'),
});
export type SummarizeProductReviewsOutput = z.infer<typeof SummarizeProductReviewsOutputSchema>;

export async function summarizeProductReviews(
  input: SummarizeProductReviewsInput
): Promise<SummarizeProductReviewsOutput> {
  return summarizeProductReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProductReviewsPrompt',
  input: {schema: SummarizeProductReviewsInputSchema},
  output: {schema: SummarizeProductReviewsOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing customer reviews for a product.
Your goal is to provide a concise overview of overall customer sentiment and identify common themes, positive feedback, and areas that could be improved.

Product Title: {{{productTitle}}}

Customer Reviews:
{{#each reviews}}
Rating: {{{rating}}} stars
Comment: "{{{comment}}}"
---
{{/each}}

Based on the reviews above, provide a summary focusing on:
1. Overall sentiment (positive, negative, mixed).
2. Key positive points highlighted by customers.
3. Key areas for improvement or common complaints.
4. Any recurring themes or suggestions.

Your summary should be presented in a clear, easy-to-read format. Focus on actionable insights for the seller.
`,
});

const summarizeProductReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeProductReviewsFlow',
    inputSchema: SummarizeProductReviewsInputSchema,
    outputSchema: SummarizeProductReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
