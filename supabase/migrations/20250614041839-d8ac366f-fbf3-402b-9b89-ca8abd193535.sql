
-- Créer une table pour sauvegarder les conversations de l'IA
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  message_role TEXT NOT NULL CHECK (message_role IN ('user', 'assistant')),
  message_content TEXT NOT NULL,
  intent_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter RLS pour que les utilisateurs ne voient que leurs conversations
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

-- Politique pour voir ses propres conversations
CREATE POLICY "Users can view their own conversations" 
  ON public.ai_conversations 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Politique pour créer ses propres conversations
CREATE POLICY "Users can create their own conversations" 
  ON public.ai_conversations 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Politique pour supprimer ses propres conversations
CREATE POLICY "Users can delete their own conversations" 
  ON public.ai_conversations 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX idx_ai_conversations_user_created 
ON public.ai_conversations (user_id, created_at DESC);
