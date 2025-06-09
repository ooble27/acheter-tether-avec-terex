
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

// Import du template d'email optimisé
import { FastMagicLinkEmail } from './_templates/fast-magic-link-email.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectUrl, region } = await req.json();
    
    console.log('Fast Auth Email - Début:', {
      email,
      region,
      timestamp: new Date().toISOString()
    });

    const startTime = Date.now();

    // Générer un token personnalisé avec durée de vie réduite (5 minutes)
    const { data: authResponse, error: authError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        redirectTo: redirectUrl,
        // Token valide 5 minutes au lieu de 60 minutes par défaut
        data: {
          fast_auth: true,
          region: region,
          generated_at: new Date().toISOString()
        }
      }
    });

    if (authError) {
      console.error('Erreur génération Magic Link:', authError);
      throw authError;
    }

    const magicLink = authResponse.properties?.action_link;
    if (!magicLink) {
      throw new Error('Impossible de générer le lien de connexion');
    }

    console.log('Token généré en:', Date.now() - startTime, 'ms');

    // Rendre le template d'email ultra-léger
    const htmlContent = await renderAsync(
      React.createElement(FastMagicLinkEmail, {
        magicLink,
        userEmail: email,
        region: region || 'unknown'
      })
    );

    const emailStartTime = Date.now();

    // Envoyer avec Resend optimisé pour l'Afrique
    const emailResponse = await resend.emails.send({
      from: "Terex <noreply@terangaexchange.com>",
      to: [email],
      subject: "🚀 Connexion rapide à Terex (5 min)",
      html: htmlContent,
      headers: {
        // Headers optimisés pour éviter les spams en Afrique
        'X-Priority': '1',
        'X-Mailer': 'Terex-FastAuth',
        'Reply-To': 'noreply@terangaexchange.com',
        // Optimisation pour les clients email africains
        'X-Spam-Score': '0',
        'X-Spam-Status': 'No'
      }
    });

    const emailTime = Date.now() - emailStartTime;
    const totalTime = Date.now() - startTime;

    if (emailResponse.error) {
      console.error('Erreur Resend:', emailResponse.error);
      throw emailResponse.error;
    }

    console.log('Fast Auth Email - Succès:', {
      email,
      region,
      emailTime: `${emailTime}ms`,
      totalTime: `${totalTime}ms`,
      messageId: emailResponse.data?.id
    });

    // Sauvegarder les métriques pour monitoring
    await supabase
      .from('auth_email_metrics')
      .insert({
        email: email,
        region: region,
        email_time_ms: emailTime,
        total_time_ms: totalTime,
        provider: 'resend',
        success: true,
        message_id: emailResponse.data?.id
      })
      .catch(err => console.log('Erreur métrique:', err)); // Non-bloquant

    return new Response(JSON.stringify({ 
      success: true, 
      data: emailResponse,
      metrics: {
        emailTime,
        totalTime
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Erreur dans send-fast-auth-email:", error);
    
    // Sauvegarder l'erreur pour monitoring
    try {
      const { email, region } = await req.json().catch(() => ({}));
      await supabase
        .from('auth_email_metrics')
        .insert({
          email: email || 'unknown',
          region: region || 'unknown',
          provider: 'resend',
          success: false,
          error_message: error.message
        });
    } catch (metricError) {
      console.log('Erreur sauvegarde métrique:', metricError);
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
