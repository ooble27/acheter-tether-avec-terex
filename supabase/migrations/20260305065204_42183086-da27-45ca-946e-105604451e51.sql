-- Allow admins to delete international_transfers
CREATE POLICY "Admins can delete transfers"
ON public.international_transfers
FOR DELETE TO authenticated
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role = ANY (ARRAY['admin'::user_role, 'kyc_reviewer'::user_role])
));

-- Allow admins to delete orders (already have ALL policy but explicit is clearer)
CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE TO authenticated
USING (EXISTS (
  SELECT 1 FROM user_roles
  WHERE user_roles.user_id = auth.uid()
  AND user_roles.role = ANY (ARRAY['admin'::user_role, 'kyc_reviewer'::user_role])
));