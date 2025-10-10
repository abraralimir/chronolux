'use server';

/**
 * @fileOverview Generates an inspirational quote using Genkit.
 *
 * - generateInspirationalQuote - A function that generates an inspirational quote.
 * - GenerateInspirationalQuoteInput - The input type for the generateInspirationalQuote function (empty object).
 * - GenerateInspirationalQuoteOutput - The return type for the generateInspirationalQuote function (string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInspirationalQuoteInputSchema = z.object({});
export type GenerateInspirationalQuoteInput = z.infer<typeof GenerateInspirationalQuoteInputSchema>;

const GenerateInspirationalQuoteOutputSchema = z.object({
  quote: z.string().describe('An inspirational quote.'),
});
export type GenerateInspirationalQuoteOutput = z.infer<typeof GenerateInspirationalQuoteOutputSchema>;

export async function generateInspirationalQuote(
  input: GenerateInspirationalQuoteInput
): Promise<GenerateInspirationalQuoteOutput> {
  return generateInspirationalQuoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInspirationalQuotePrompt',
  input: {schema: GenerateInspirationalQuoteInputSchema},
  output: {schema: GenerateInspirationalQuoteOutputSchema},
  prompt: `You are SASHA, an AI that generates inspiring quotes. Generate a short, powerful, and elegant quote about ambition, success, and the future. The quote should be suitable for a luxury brand focused on 'VISION 2030'.`,
});

const generateInspirationalQuoteFlow = ai.defineFlow(
  {
    name: 'generateInspirationalQuoteFlow',
    inputSchema: GenerateInspirationalQuoteInputSchema,
    outputSchema: GenerateInspirationalQuoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
