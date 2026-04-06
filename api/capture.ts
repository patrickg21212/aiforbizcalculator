// Vercel Serverless Function — Email Capture
// Receives quiz results + email, sends report via Resend, notifies Patrick

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { email, score, tier, industry, industryLabel, teamSize, topAutomations } = body;

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error('RESEND_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });
    }

    // Send results email to the user
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AI for Biz Calculator <calculator@epiphany.help>',
        to: email,
        reply_to: 'patrick@epiphanydynamics.ai',
        subject: `Your AI Readiness Report — Score: ${score}/100`,
        html: buildUserEmail({ score, tier, industryLabel, teamSize, topAutomations }),
      }),
    });

    // Notify Patrick
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AI for Biz Calculator <calculator@epiphany.help>',
        to: 'patrick@epiphanydynamics.ai',
        subject: `New Calculator Lead: ${email} (Score: ${score}, ${industryLabel})`,
        html: buildNotifyEmail({ email, score, tier, industryLabel, teamSize, topAutomations }),
      }),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Capture error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
}

// ── Email Templates ──────────────────────────────────────────

function buildUserEmail(data: { score: number; tier: string; industryLabel: string; teamSize: string; topAutomations: string[] }) {
  const automationList = data.topAutomations.map(a => `<li style="margin-bottom:6px;">${a}</li>`).join('');

  return `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1e293b;">
      <h1 style="font-size:24px;margin-bottom:16px;">Your AI Business Report</h1>
      <p style="font-size:16px;color:#475569;">Here's a summary of your results from the AI for Biz Calculator.</p>

      <div style="background:#f1f5f9;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
        <div style="font-size:48px;font-weight:800;color:#3b82f6;">${data.score}</div>
        <div style="font-size:14px;color:#64748b;">out of 100</div>
        <div style="font-size:18px;font-weight:700;margin-top:8px;text-transform:capitalize;">${data.tier.replace(/_/g, ' ')}</div>
      </div>

      <p><strong>Industry:</strong> ${data.industryLabel}</p>
      <p><strong>Team Size:</strong> ${data.teamSize}</p>

      <h2 style="font-size:18px;margin-top:24px;">Your Top Recommendations</h2>
      <ol style="padding-left:20px;color:#475569;">
        ${automationList}
      </ol>

      <div style="margin-top:32px;text-align:center;">
        <a href="https://epiphanydynamics.ai/book" style="display:inline-block;padding:14px 32px;background:#3b82f6;color:white;text-decoration:none;border-radius:999px;font-weight:600;">
          Book Your Free AI Audit
        </a>
        <p style="font-size:13px;color:#94a3b8;margin-top:10px;">30 minutes. No obligation. We'll review your report together.</p>
      </div>

      <hr style="margin:32px 0;border:none;border-top:1px solid #e2e8f0;" />
      <p style="font-size:12px;color:#94a3b8;">
        Built by <a href="https://epiphanydynamics.ai" style="color:#3b82f6;text-decoration:none;">Epiphany Dynamics</a> — AI Automation for Modern Business
      </p>
    </div>
  `;
}

function buildNotifyEmail(data: { email: string; score: number; tier: string; industryLabel: string; teamSize: string; topAutomations: string[] }) {
  return `
    <div style="font-family:monospace;padding:16px;color:#e2e8f0;background:#0f172a;">
      <h2 style="color:#3b82f6;">New Calculator Lead</h2>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Score:</strong> ${data.score}/100 (${data.tier})</p>
      <p><strong>Industry:</strong> ${data.industryLabel}</p>
      <p><strong>Team Size:</strong> ${data.teamSize}</p>
      <p><strong>Top Automations:</strong></p>
      <ul>
        ${data.topAutomations.map(a => `<li>${a}</li>`).join('')}
      </ul>
    </div>
  `;
}
