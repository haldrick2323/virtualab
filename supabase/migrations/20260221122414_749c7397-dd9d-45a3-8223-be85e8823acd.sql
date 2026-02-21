
-- Remove the unsafe INSERT and UPDATE policies on user_roles
DROP POLICY IF EXISTS "Users can set own role" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update own role" ON public.user_roles;
