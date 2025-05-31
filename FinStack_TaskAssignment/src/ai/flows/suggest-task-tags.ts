// src/ai/flows/suggest-task-tags.ts
'use server';

/**
 * @fileOverview This file contains the Genkit flow for suggesting task tags based on the task description.
 *
 * - suggestTaskTags - A function that takes a task description and returns a list of suggested tags.
 * - SuggestTaskTagsInput - The input type for the suggestTaskTags function.
 * - SuggestTaskTagsOutput - The return type for the suggestTaskTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTaskTagsInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the task for which tags are to be suggested.'),
});
export type SuggestTaskTagsInput = z.infer<typeof SuggestTaskTagsInputSchema>;

const SuggestTaskTagsOutputSchema = z.object({
  tags: z
    .array(z.string())
    .describe('An array of suggested tags for the task, based on its description.'),
});
export type SuggestTaskTagsOutput = z.infer<typeof SuggestTaskTagsOutputSchema>;

export async function suggestTaskTags(input: SuggestTaskTagsInput): Promise<SuggestTaskTagsOutput> {
  return suggestTaskTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTaskTagsPrompt',
  input: {schema: SuggestTaskTagsInputSchema},
  output: {schema: SuggestTaskTagsOutputSchema},
  prompt: `You are a task categorization expert. Given a task description, you will suggest relevant tags to help users categorize and find their tasks later.

Task Description: {{{taskDescription}}}

Please provide a list of tags that are relevant to the task description. The tags should be concise and descriptive. Return at most 5 tags.

Ensure that the tags are returned in an array format.`,
});

const suggestTaskTagsFlow = ai.defineFlow(
  {
    name: 'suggestTaskTagsFlow',
    inputSchema: SuggestTaskTagsInputSchema,
    outputSchema: SuggestTaskTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
