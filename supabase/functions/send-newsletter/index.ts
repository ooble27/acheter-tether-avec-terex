import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { NewsletterEmail } from './_templates/newsletter-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  subject: string;
  previewText: string;
  heroTitle: string;
  heroSubtitle: string;
  updates: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  ctaText?: string;
  ctaUrl?: string;
  testEmail?: string; // Pour envoyer un test à une seule adresse
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: NewsletterRequest = await req.json();
    
    console.log('Début de l\'envoi de newsletter:', {
      subject: requestData.subject,
      testEmail: requestData.testEmail,
      updatesCount: requestData.updates.length
    });

    let recipients: { email: string; name: string }[] = [];

    // Si c'est un test, envoyer uniquement à l'adresse de test
    if (requestData.testEmail) {
      recipients = [{ email: requestData.testEmail, name: 'Test' }];
      console.log('Mode test - envoi à:', requestData.testEmail);
    } else {
      // Récupérer tous les utilisateurs avec leur profil
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        console.error('Erreur lors de la récupération des utilisateurs:', usersError);
        throw new Error('Impossible de récupérer la liste des utilisateurs');
      }

      // Récupérer les noms depuis les profils
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name');

      if (profilesError) {
        console.error('Erreur lors de la récupération des profils:', profilesError);
      }

      const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

      // Filtrer les utilisateurs avec email valide
      recipients = users.users
        .filter(user => user.email && user.email_confirmed_at)
        .map(user => ({
          email: user.email!,
          name: profileMap.get(user.id) || user.email!.split('@')[0]
        }));

      console.log(`${recipients.length} destinataires trouvés`);
    }

    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: 'Aucun destinataire trouvé' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Envoyer les emails par lots de 10
    const batchSize = 10;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (recipient) => {
        try {
          const htmlContent = await renderAsync(
            React.createElement(NewsletterEmail, {
              userName: recipient.name,
              subject: requestData.subject,
              previewText: requestData.previewText,
              heroTitle: requestData.heroTitle,
              heroSubtitle: requestData.heroSubtitle,
              updates: requestData.updates,
              ctaText: requestData.ctaText,
              ctaUrl: requestData.ctaUrl,
            })
          );

          const { error } = await resend.emails.send({
            from: "Terex <noreply@terangaexchange.com>",
            to: [recipient.email],
            subject: requestData.subject,
            html: htmlContent,
          });

          if (error) {
            throw error;
          }

          console.log(`Email envoyé à ${recipient.email}`);
          return { success: true };
        } catch (err: any) {
          console.error(`Erreur pour ${recipient.email}:`, err);
          return { success: false, email: recipient.email, error: err.message };
        }
      });

      const results = await Promise.all(emailPromises);
      
      results.forEach(result => {
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
          errors.push(`${result.email}: ${result.error}`);
        }
      });

      // Petite pause entre les lots pour éviter les limites de rate
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Newsletter envoyée: ${successCount} succès, ${errorCount} erreurs`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Newsletter envoyée à ${successCount} destinataire(s)`,
        stats: {
          total: recipients.length,
          success: successCount,
          errors: errorCount,
          errorDetails: errors.slice(0, 10) // Limiter à 10 erreurs
        }
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Erreur lors de l'envoi de la newsletter:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
