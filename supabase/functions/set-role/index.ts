import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_BODY_SIZE = 1024; // 1KB max

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

  try {
    // Only allow POST
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: jsonHeaders,
      });
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: jsonHeaders,
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: jsonHeaders,
      });
    }

    const userId = claimsData.claims.sub;

    // Validate request body size
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_BODY_SIZE) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    // Parse and validate body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    const { role } = body as Record<string, unknown>;
    if (typeof role !== "string" || (role !== "student" && role !== "teacher")) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: jsonHeaders,
      });
    }

    // Use service role client to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check if user already has a role
    const { data: existing } = await supabaseAdmin
      .from("user_roles")
      .select("id, role")
      .eq("user_id", userId)
      .maybeSingle();

    if (existing) {
      // Generic message - don't reveal system state details
      return new Response(
        JSON.stringify({ error: "Cannot modify role" }),
        { status: 400, headers: jsonHeaders }
      );
    }

    // Assign role for first time only
    const { error: insertError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role });

    if (insertError) {
      console.error("Role assignment failed:", insertError.message);
      return new Response(JSON.stringify({ error: "Request failed" }), {
        status: 500,
        headers: jsonHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true, role }), {
      status: 200,
      headers: jsonHeaders,
    });
  } catch (err) {
    console.error("Unexpected error in set-role:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: jsonHeaders,
    });
  }
});
