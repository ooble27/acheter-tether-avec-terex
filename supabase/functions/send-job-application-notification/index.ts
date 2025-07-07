import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface JobApplicationRequest {
  position: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  location?: string;
  experience_years?: number;
  cover_letter?: string;
  linkedin_profile?: string;
  portfolio_url?: string;
  availability?: string;
  salary_expectation?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const applicationData: JobApplicationRequest = await req.json();

    // Email pour l'admin
    const adminEmailResponse = await resend.emails.send({
      from: "Terex Careers <careers@terex.app>",
      to: ["Terangaexchange@gmail.com"],
      subject: `Nouvelle candidature : ${applicationData.position}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0FA958; text-align: center;">Nouvelle Candidature</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Poste : ${applicationData.position}</h2>
            
            <h3 style="color: #0FA958;">Informations du candidat</h3>
            <p><strong>Nom :</strong> ${applicationData.first_name} ${applicationData.last_name}</p>
            <p><strong>Email :</strong> ${applicationData.email}</p>
            ${applicationData.phone ? `<p><strong>Téléphone :</strong> ${applicationData.phone}</p>` : ''}
            ${applicationData.location ? `<p><strong>Localisation :</strong> ${applicationData.location}</p>` : ''}
            ${applicationData.experience_years ? `<p><strong>Années d'expérience :</strong> ${applicationData.experience_years}</p>` : ''}
            ${applicationData.availability ? `<p><strong>Disponibilité :</strong> ${applicationData.availability}</p>` : ''}
            ${applicationData.salary_expectation ? `<p><strong>Prétentions salariales :</strong> ${applicationData.salary_expectation}</p>` : ''}
            
            ${applicationData.linkedin_profile ? `<p><strong>LinkedIn :</strong> <a href="${applicationData.linkedin_profile}">${applicationData.linkedin_profile}</a></p>` : ''}
            ${applicationData.portfolio_url ? `<p><strong>Portfolio :</strong> <a href="${applicationData.portfolio_url}">${applicationData.portfolio_url}</a></p>` : ''}
          </div>
          
          ${applicationData.cover_letter ? `
            <div style="background: #fff; padding: 20px; border-left: 4px solid #0FA958; margin: 20px 0;">
              <h3 style="color: #0FA958; margin-top: 0;">Lettre de motivation</h3>
              <p style="white-space: pre-wrap;">${applicationData.cover_letter}</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://terex.app/admin" style="background: #0FA958; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Voir dans l'admin
            </a>
          </div>
        </div>
      `,
    });

    // Email de confirmation pour le candidat
    const candidateEmailResponse = await resend.emails.send({
      from: "Terex Careers <careers@terex.app>",
      to: [applicationData.email],
      subject: `Candidature reçue - ${applicationData.position} chez Terex`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0FA958; text-align: center;">Candidature reçue avec succès</h1>
          
          <p>Bonjour ${applicationData.first_name},</p>
          
          <p>Nous avons bien reçu votre candidature pour le poste de <strong>${applicationData.position}</strong> chez Terex.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0FA958; margin-top: 0;">Prochaines étapes</h3>
            <ul>
              <li>Notre équipe RH va examiner votre candidature dans les 48 heures</li>
              <li>Si votre profil correspond à nos besoins, nous vous contacterons pour un premier entretien</li>
              <li>Le processus de recrutement comprend généralement 2-3 étapes d'entretiens</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">À propos de Terex</h3>
            <p>Terex est la première plateforme d'échange crypto-fiat dédiée à l'Afrique francophone et au Canada. Nous révolutionnons les transferts d'argent avec des solutions rapides, sécurisées et transparentes.</p>
          </div>
          
          <p>En attendant, n'hésitez pas à nous suivre sur nos réseaux sociaux pour rester informé de nos actualités :</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:Terangaexchange@gmail.com" style="background: #0FA958; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 0 10px;">
              Nous contacter
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Cordialement,<br>
            L'équipe Terex<br>
            <a href="https://terex.app">terex.app</a>
          </p>
        </div>
      `,
    });

    console.log("Emails sent successfully:", { adminEmailResponse, candidateEmailResponse });

    return new Response(JSON.stringify({ 
      success: true,
      adminEmail: adminEmailResponse,
      candidateEmail: candidateEmailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-job-application-notification function:", error);
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