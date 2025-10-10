'use server';

/**
 * @fileOverview Generates a luxury tagline using Genkit.
 *
 * - generateLuxuryTagline - A function that generates a luxury tagline.
 * - GenerateLuxuryTaglineInput - The input type for the generateLuxuryTagline function (empty object).
 * - GenerateLuxuryTaglineOutput - The return type for the generateLuxuryTagline function (string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLuxuryTaglineInputSchema = z.object({});
export type GenerateLuxuryTaglineInput = z.infer<typeof GenerateLuxuryTaglineInputSchema>;

const GenerateLuxuryTaglineOutputSchema = z.object({
  tagline: z.string().describe('A luxury tagline.'),
});
export type GenerateLuxuryTaglineOutput = z.infer<typeof GenerateLuxuryTaglineOutputSchema>;

export async function generateLuxuryTagline(
  input: GenerateLuxuryTaglineInput
): Promise<GenerateLuxuryTaglineOutput> {
  return generateLuxuryTaglineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLuxuryTaglinePrompt',
  input: {schema: GenerateLuxuryTaglineInputSchema},
  output: {schema: GenerateLuxuryTaglineOutputSchema},
  prompt: `Generate an inspiring 5-word tagline for a luxury watch. The tagline should capture the feeling of traveling in first-class or a private jet to an opulent destination like Dubai, Jeddah, or a major US city. It should evoke the sense of ambition, success, and the thrill of experiencing a new, luxurious place at night.`,
});

const generateLuxuryTaglineFlow = ai.defineFlow(
  {
    name: 'generateLuxuryTaglineFlow',
    inputSchema: GenerateLuxuryTaglineInputSchema,
    outputSchema: GenerateLuxuryTaglineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
