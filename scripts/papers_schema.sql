-- 1. Create papers table (if not exists) matches the fields used in code
CREATE TABLE IF NOT EXISTS public.papers (
  paper_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  paper_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  part TEXT NOT NULL,
  language TEXT NOT NULL,
  added_by TEXT NOT NULL,
  pdf_url TEXT NOT NULL,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Enable RLS
ALTER TABLE public.papers ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public Read Access
CREATE POLICY "Public papers are viewable by everyone" 
ON public.papers FOR SELECT 
USING (true);

-- 4. Policy: Authenticated Insert (Allow staff/admin to add papers)
CREATE POLICY "Authenticated users can insert papers" 
ON public.papers FOR INSERT 
WITH CHECK ( auth.role() = 'authenticated' );

-- 5. Policy: Authenticated Update (Allow staff/admin to edit papers)
CREATE POLICY "Authenticated users can update papers" 
ON public.papers FOR UPDATE 
USING ( auth.role() = 'authenticated' );

-- 6. Policy: Authenticated Delete (Allow staff/admin to delete papers)
CREATE POLICY "Authenticated users can delete papers" 
ON public.papers FOR DELETE 
USING ( auth.role() = 'authenticated' );
