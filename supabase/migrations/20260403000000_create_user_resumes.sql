CREATE TABLE IF NOT EXISTS public.user_resumes (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_role text NOT NULL,
  company text,
  job_description text,
  optimization_type text NOT NULL,
  ats_score integer,
  status text NOT NULL DEFAULT 'draft',
  template_id text,
  generated_content jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Turn on row level security
ALTER TABLE public.user_resumes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own resumes"
  ON public.user_resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own resumes"
  ON public.user_resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON public.user_resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON public.user_resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Create a storage index for quick lookups
CREATE INDEX idx_user_resumes_user_id ON public.user_resumes(user_id);
