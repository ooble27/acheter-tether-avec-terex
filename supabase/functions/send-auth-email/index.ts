
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

// Import du template optimisé
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
    const startTime = Date.now();
    const { email, type = 'signup' } = await req.json();

    console.log(`Début envoi email ${type} pour:`, email, 'à', new Date().toISOString());

    if (!email) {
      throw new Error('Email requis');
    }

    // Générer le Magic Link avec Supabase
    const { data, error } = await supabase.auth.admin.generateLink({
      type: type as 'signup' | 'magiclink',
      email: email,
      options: {
        redirectTo: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}.vercel.app/auth/callback`
      }
    });

    if (error) {
      console.error('Erreur génération lien:', error);
      throw error;
    }

    console.log('Lien généré en', Date.now() - startTime, 'ms');

    // Template simplifié et optimisé
    const htmlContent = await renderAsync(
      React.createElement(FastMagicLinkEmail, {
        magicLink: data.properties?.action_link || '',
        userEmail: email,
        type: type
      })
    );

    console.log('Template rendu en', Date.now() - startTime, 'ms');

    // Sujet optimisé selon le type
    let subject = '';
    if (type === 'signup') {
      subject = '🚀 Activez votre compte Terex - Connexion rapide';
    } else {
      subject = '🔐 Votre lien de connexion Terex';
    }

    // Envoi via Resend pour une livraison rapide
    const emailResponse = await resend.emails.send({
      from: "Terex <noreply@terangaexchange.com>",
      to: [email],
      subject: subject,
      html: htmlContent,
      // Headers pour améliorer la deliverability
      headers: {
        'X-Priority': '1',
        'X-Mailer': 'Terex Platform'
      }
    });

    const totalTime = Date.now() - startTime;
    console.log(`Email ${type} envoyé avec succès en ${totalTime}ms pour:`, email);

    if (emailResponse.error) {
      console.error('Erreur Resend:', emailResponse.error);
      throw emailResponse.error;
    }

    // Log pour monitoring
    console.log('Email response:', emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      data: emailResponse,
      processingTime: totalTime,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Erreur dans send-auth-email:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
