-- Optimize Profiles RLS
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can insert own profile" ON public.profiles 
FOR INSERT WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Users can view own profile" ON public.profiles 
FOR SELECT USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON public.profiles 
FOR UPDATE USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can delete own profile" ON public.profiles 
FOR DELETE USING ((SELECT auth.uid()) = id);

-- Optimize User Documents RLS
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Users can insert their own documents" ON public.user_documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON public.user_documents;

CREATE POLICY "Users can insert their own documents" ON public.user_documents 
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can view their own documents" ON public.user_documents 
FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own documents" ON public.user_documents 
FOR DELETE USING ((SELECT auth.uid()) = user_id);

-- Optimize User Resumes RLS
DROP POLICY IF EXISTS "Users can delete their own resumes" ON public.user_resumes;
DROP POLICY IF EXISTS "Users can insert their own resumes" ON public.user_resumes;
DROP POLICY IF EXISTS "Users can view their own resumes" ON public.user_resumes;
DROP POLICY IF EXISTS "Users can update their own resumes" ON public.user_resumes;

CREATE POLICY "Users can insert their own resumes" ON public.user_resumes 
FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can view their own resumes" ON public.user_resumes 
FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can update their own resumes" ON public.user_resumes 
FOR UPDATE USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users can delete their own resumes" ON public.user_resumes 
FOR DELETE USING ((SELECT auth.uid()) = user_id);
