import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getSupabaseServerClient } from "@/lib/supabase/server-client";

const intakeInput = z.object({
  kind: z.enum(["enquiry", "safeguarding"]),
  audience: z.enum(["family", "school", "education_group", "organisation", "press", "general"]),
  name: z.string().trim().max(120).optional(),
  email: z.string().trim().email().max(254).optional(),
  organisation: z.string().trim().max(160).optional(),
  message: z.string().trim().min(20).max(8000),
  contactPermitted: z.boolean(),
  website: z.string().max(200).optional(),
});

export const submitPublicIntakeFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => intakeInput.parse(input))
  .handler(async ({ data }): Promise<
    | { ok: true; reference: string }
    | { ok: false; error: string }
  > => {
    if (data.kind === "enquiry" && (!data.email || !data.contactPermitted)) {
      return { ok: false, error: "Please provide an email address and allow us to respond." };
    }

    const supabase = getSupabaseServerClient();
    const { data: response, error } = await supabase.functions.invoke("public-intake", {
      body: data,
    });

    if (error || response?.data?.accepted !== true || typeof response?.data?.reference !== "string") {
      return { ok: false, error: "We couldn't record that submission right now. Please try again." };
    }

    return { ok: true, reference: response.data.reference };
  });
