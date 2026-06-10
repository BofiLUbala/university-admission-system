import logging
from django.conf import settings
from django.core.mail import send_mail, EmailMultiAlternatives
from django.utils import timezone
from datetime import timedelta

logger = logging.getLogger(__name__)

def send_verification_email(user):
    token = user.generate_verification_token()
    user.email_verification_sent_at = timezone.now()
    user.save(update_fields=['email_verification_token', 'email_verification_sent_at'])

    verification_link = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    subject = "Confirmez votre adresse email - ULK Admission"
    
    text_message = f"""
Bonjour {user.first_name or user.username},

Merci d'avoir créé un compte sur le portail d'admission ULK.

Veuillez cliquer sur le lien ci-dessous pour confirmer votre adresse email :
{verification_link}

Ce lien est valable 2 heures et ne peut être utilisé qu'une seule fois.

Si vous n'avez pas créé de compte, veuillez ignorer cet email.

Cordialement,
L'équipe d'admission ULK
"""

    html_message = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation d'email - ULK</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:30px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header with ULK branding -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a2647 0%,#1a4a7a 50%,#2c5f8a 100%);padding:36px 30px;text-align:center;">
              <div style="display:inline-block;width:64px;height:64px;background-color:#d4a843;border-radius:16px;line-height:64px;font-size:28px;font-weight:900;color:#0a2647;margin-bottom:12px;">ULK</div>
              <h1 style="color:#ffffff;margin:8px 0 0;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Portail d'Admission</h1>
              <p style="color:#a8c8e8;margin:4px 0 0;font-size:14px;">Université Libre de Kinshasa</p>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td style="padding:36px 30px;">
              <h2 style="color:#1a1a2e;font-size:20px;font-weight:700;margin:0 0 18px;">Confirmez votre adresse email</h2>
              <p style="color:#4a4a5a;font-size:15px;line-height:1.7;margin:0 0 10px;">Bonjour <strong style="color:#1a1a2e;">{user.first_name or user.username}</strong>,</p>
              <p style="color:#4a4a5a;font-size:15px;line-height:1.7;margin:0 0 6px;">
                Merci d'avoir créé un compte sur le portail d'admission de l'<strong>Université Libre de Kinshasa</strong>.
              </p>
              <p style="color:#4a4a5a;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Pour activer votre compte et commencer votre processus d'admission, veuillez cliquer sur le bouton ci-dessous :
              </p>

              <!-- CTA Button -->
              <div style="text-align:center;margin:0 0 28px;">
                <a href="{verification_link}" style="display:inline-block;background:linear-gradient(135deg,#1a4a7a 0%,#2c5f8a 100%);color:#ffffff;text-decoration:none;padding:15px 44px;border-radius:10px;font-size:16px;font-weight:700;letter-spacing:0.3px;box-shadow:0 4px 12px rgba(26,74,122,0.3);">
                  Confirmer mon email
                </a>
              </div>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8faff;border:1px solid #e8ecf4;border-radius:10px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="color:#5a6a8a;font-size:13px;line-height:1.6;margin:0;">
                      <strong style="color:#1a4a7a;">⏱ Lien valable 2 heures</strong><br>
                      Ce lien expire dans 2 heures et ne peut être utilisé qu'une seule fois. 
                      Si vous ne confirmez pas votre email dans ce délai, vous devrez créer un nouveau compte.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#8888a0;font-size:13px;line-height:1.6;margin:0 0 4px;">
                Si vous n'avez pas créé de compte sur notre plateforme, veuillez ignorer cet email.
              </p>
              <p style="color:#8888a0;font-size:13px;line-height:1.6;margin:0;">
                Pour toute assistance, contactez notre équipe support.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8f9fb;padding:24px 30px;text-align:center;border-top:1px solid #eef0f4;">
              <p style="color:#999aaa;font-size:12px;line-height:1.6;margin:0 0 6px;">
                <strong style="color:#666880;">Université Libre de Kinshasa (ULK)</strong><br>
                Kinshasa, République Démocratique du Congo
              </p>
              <p style="color:#bbbbcc;font-size:11px;margin:0;">
                &copy; {timezone.now().year} ULK - Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    try:
        email = EmailMultiAlternatives(
            subject=subject,
            body=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        email.attach_alternative(html_message, "text/html")
        email.send(fail_silently=False)
        logger.info(f"Verification email sent successfully to {user.email}")
    except Exception as e:
        logger.error(f"Failed to send verification email to {user.email}: {e}")
        # Fallback: try with console backend if SMTP fails
        try:
            from django.core.mail import get_connection
            console_connection = get_connection(backend='django.core.mail.backends.console.EmailBackend')
            fallback_email = EmailMultiAlternatives(
                subject=subject,
                body=text_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[user.email],
                connection=console_connection,
            )
            fallback_email.attach_alternative(html_message, "text/html")
            fallback_email.send(fail_silently=False)
            logger.info(f"Verification email printed to console for {user.email} (SMTP unavailable)")
        except Exception as fallback_err:
            logger.error(f"Console fallback also failed: {fallback_err}")
            # Last resort - just print to stdout
            print(f"\n===== VERIFICATION EMAIL FOR {user.email} =====")
            print(f"TOKEN: {token}")
            print(f"LINK: {verification_link}")
            print(f"===============================================\n")


def is_verification_token_valid(user):
    if not user.email_verification_sent_at:
        return False
    expiry = user.email_verification_sent_at + timedelta(hours=2)
    return timezone.now() <= expiry
