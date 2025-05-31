"use server";
import { suggestTaskTags as suggestTaskTagsFlow, SuggestTaskTagsInput, SuggestTaskTagsOutput } from "@/ai/flows/suggest-task-tags";
// Removed unused Zod import as validation is handled by the flow's input schema.

export async function suggestTaskTagsAction(input: SuggestTaskTagsInput): Promise<SuggestTaskTagsOutput> {
  // The Genkit flow itself should handle input validation based on its defined schema.
  // If additional validation specific to the action were needed, it could be added here.
  try {
    const result = await suggestTaskTagsFlow(input);
    return result;
  } catch (error) {
    console.error("Error in suggestTaskTagsAction:", error);
    // It's good practice to return a structured error or throw a custom error
    // that the client can handle gracefully. For now, rethrowing.
    // In a production app, you might want to sanitize the error.
    throw new Error("Failed to suggest tags due to a server error.");
  }
}
