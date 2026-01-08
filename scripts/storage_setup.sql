-- 1. Policy: Public Read Access (Everyone can download papers)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'papers' );

-- 2. Policy: Authenticated Upload (Only logged-in users can upload)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'papers' AND auth.role() = 'authenticated' );

-- 3. Policy: Maintainer Delete/Update
CREATE POLICY "Individual Delete"
ON storage.objects FOR DELETE
USING ( bucket_id = 'papers' AND auth.uid() = owner );

CREATE POLICY "Individual Update"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'papers' AND auth.uid() = owner );
