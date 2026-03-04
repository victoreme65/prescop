'use server';
/**
 * @fileOverview An AI assistant flow for generating or enhancing product descriptions.
 *
 * - generateProductDescription - A function that handles the generation/enhancement of product descriptions.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  features: z
    .array(z.string())
    .optional()
    .describe('Key features or benefits of the product, e.g., ["deeply moisturizing", "anti-inflammatory"].'),
  keywords: z
    .array(z.string())
    .optional()
    .describe('Keywords relevant to the product for SEO or marketing, e.g., ["skincare", "natural beauty"].'),
  existingDescription: z
    .string()
    .optional()
    .describe('An existing product description to be enhanced or rewritten.'),
});
export type GenerateProductDescriptionInput = z.infer<
  typeof GenerateProductDescriptionInputSchema
>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling and detailed product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<
  typeof GenerateProductDescriptionOutputSchema
>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const generateProductDescriptionPrompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an expert marketing copywriter for a beauty and cosmetics brand, specializing in elegant, persuasive, and informative descriptions for a B2C beauty marketplace called Prescop.

Your task is to generate a compelling product description for "{{{productName}}}".

{{#if existingDescription}}
Enhance the following existing description, making it more engaging, detailed, and persuasive:
Existing Description: {{{existingDescription}}}
{{else}}
Create a brand new description. Focus on highlighting the product's unique selling points.
{{/if}}

{{#if features}}
Incorporate these key features and benefits, explaining how they benefit the customer:
{{#each features}}- {{{this}}}
{{/each}}{{/if}}

{{#if keywords}}
Naturally integrate these keywords throughout the description to improve searchability and appeal:
{{#each keywords}}- {{{this}}}
{{/each}}{{/if}}

Ensure the description is elegant, informative, and persuasive, encouraging a purchase while maintaining a tone appropriate for a premium beauty aesthetic.`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateProductDescriptionPrompt(input);
    return output!;
  }
);
