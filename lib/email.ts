import { Resend } from 'resend';
import { ContactFormData } from './types';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;

interface EmailResult {
  success: boolean;
  message: string;
  emailSent: boolean;
}

function formatContactEmail(data: ContactFormData): {
  subject: string;
  html: string;
} {
  const categoryLabels: Record<string, string> = {
    hiring: 'Hiring/Contract',
    collaboration: 'Collaboration',
    speaking: 'Speaking/Interview',
    general: 'General',
    feedback: 'Website Feedback',
  };

  const subject = `[Portfolio Contact] ${categoryLabels[data.category]} from ${data.name}`;

  const fields: { label: string; value: string | undefined }[] = [
    { label: 'Name', value: data.name },
    { label: 'Email', value: data.email },
    { label: 'Category', value: categoryLabels[data.category] },
    { label: 'Company', value: data.company },
    { label: 'Role', value: data.role },
    { label: 'Budget/Rate', value: data.budget },
    { label: 'Timeline', value: data.projectTimeline },
    { label: 'Tech Stack', value: data.stack },
    { label: 'Project Type', value: data.projectType },
    { label: 'What You Need', value: data.whatYouNeed },
    { label: 'Event', value: data.event },
    { label: 'Event Date', value: data.eventDate },
    { label: 'Topic', value: data.topic },
    { label: 'Page', value: data.page },
    { label: 'Issue', value: data.issue },
  ];

  const filledFields = fields.filter((f) => f.value);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">
            New Contact Form Submission
          </h1>

          <table style="width: 100%; border-collapse: collapse;">
            ${filledFields
              .map(
                (field) => `
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-weight: 500; width: 140px;">
                  ${field.label}
                </td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">
                  ${field.value}
                </td>
              </tr>
            `
              )
              .join('')}
          </table>

          <div style="margin-top: 20px; padding: 20px; background: #f9f9f9; border-radius: 4px;">
            <h3 style="color: #333; margin: 0 0 10px 0; font-size: 16px;">Message</h3>
            <p style="color: #555; white-space: pre-wrap; margin: 0; line-height: 1.6;">
              ${data.message}
            </p>
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
            Sent from aderabiruk.dev contact form
          </p>
        </div>
      </body>
    </html>
  `;

  return { subject, html };
}

export async function sendContactEmail(
  data: ContactFormData
): Promise<EmailResult> {
  // Log the submission regardless of email config
  console.log('[Contact Form]', JSON.stringify(data, null, 2));

  if (!resend || !CONTACT_TO_EMAIL) {
    console.log(
      '[Contact Form] Email not configured. RESEND_API_KEY or CONTACT_TO_EMAIL missing.'
    );
    return {
      success: true,
      message:
        'Your message has been received. Email notifications are not configured, but your submission has been logged.',
      emailSent: false,
    };
  }

  try {
    const { subject, html } = formatContactEmail(data);

    await resend.emails.send({
      from: 'Portfolio <noreply@aderabiruk.dev>',
      to: CONTACT_TO_EMAIL,
      reply_to: data.email,
      subject,
      html,
    });

    return {
      success: true,
      message: 'Thank you for reaching out! I\'ll get back to you soon.',
      emailSent: true,
    };
  } catch (error) {
    console.error('[Contact Form] Email send error:', error);
    return {
      success: false,
      message:
        'There was an error sending your message. Please try again or reach out directly via email.',
      emailSent: false,
    };
  }
}
