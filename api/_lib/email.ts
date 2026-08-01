type EmailAction = {
    label: string;
    url: string;
};

type EmailSection = {
    title: string;
    rows: Array<[string, string | number | null | undefined]>;
};

type SendEmailInput = {
    to: string | string[];
    subject: string;
    preview: string;
    eyebrow?: string;
    title: string;
    intro: string;
    sections?: EmailSection[];
    action?: EmailAction;
    footerNote?: string;
    replyTo?: string;
    from?: string;
};

const brand = {
    name: 'This Is Hip Hop Caribbean',
    red: '#ff1744',
    black: '#050505',
    panel: '#101010',
    border: '#3a1119',
    white: '#ffffff',
    muted: '#b8b8b8',
};

export const adminEmails = (process.env.ADMIN_NOTIFY_EMAILS || 'andremillwood@gmail.com')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean);

function brandedSender(configured: string | undefined, label: string, fallbackAddress: string) {
    const address = configured?.match(/<([^>]+)>/)?.[1] || configured?.trim() || fallbackAddress;
    return `${label} <${address}>`;
}

export const emailSenders = {
    default: brandedSender(process.env.RESEND_FROM_EMAIL, brand.name, 'noreply@ilovehiphopja.com'),
    orders: brandedSender(process.env.RESEND_ORDERS_FROM_EMAIL, `${brand.name} Orders`, 'orders@ilovehiphopja.com'),
    events: brandedSender(process.env.RESEND_EVENTS_FROM_EMAIL, `${brand.name} Events`, 'events@ilovehiphopja.com'),
    membership: brandedSender(process.env.RESEND_MEMBERS_FROM_EMAIL, `${brand.name} Members`, 'members@ilovehiphopja.com'),
    ops: brandedSender(process.env.RESEND_OPS_FROM_EMAIL, `${brand.name} Ops`, 'ops@ilovehiphopja.com'),
};

function getBaseUrl() {
    const configuredUrl = process.env.SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
    if (!configuredUrl) return 'https://ilovehiphopja.com';
    return configuredUrl.startsWith('http') ? configuredUrl : `https://${configuredUrl}`;
}

function getLogoUrl() {
    return process.env.EMAIL_LOGO_URL || siteUrl('/brand/ilhh-logo.png');
}

function escapeHtml(value: string | number) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderRows(rows: EmailSection['rows']) {
    return rows
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([label, value]) => `
            <tr>
                <td style="padding:10px 0;color:${brand.muted};font:700 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;border-bottom:1px solid ${brand.border};">${escapeHtml(label)}</td>
                <td style="padding:10px 0;color:${brand.white};font:600 14px Arial,sans-serif;text-align:right;border-bottom:1px solid ${brand.border};">${escapeHtml(value as string | number)}</td>
            </tr>
        `)
        .join('');
}

function renderHtml(input: SendEmailInput) {
    const sections = input.sections?.map((section) => `
        <div style="margin-top:24px;padding:20px;background:${brand.panel};border:1px solid ${brand.border};">
            <h2 style="margin:0 0 12px;color:${brand.red};font:800 18px Arial,sans-serif;text-transform:uppercase;letter-spacing:.06em;">${escapeHtml(section.title)}</h2>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                ${renderRows(section.rows)}
            </table>
        </div>
    `).join('') || '';

    const action = input.action ? `
        <div style="margin-top:28px;">
            <a href="${escapeHtml(input.action.url)}" style="display:inline-block;background:${brand.red};color:${brand.black};font:900 14px Arial,sans-serif;text-transform:uppercase;letter-spacing:.08em;text-decoration:none;padding:14px 22px;border:1px solid ${brand.red};">
                ${escapeHtml(input.action.label)}
            </a>
        </div>
    ` : '';

    return `
        <!doctype html>
        <html>
            <body style="margin:0;background:${brand.black};padding:0;">
                <div style="display:none;max-height:0;overflow:hidden;color:transparent;">${escapeHtml(input.preview)}</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${brand.black};">
                    <tr>
                        <td align="center" style="padding:32px 16px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:collapse;">
                                <tr>
                                    <td style="border:1px solid ${brand.border};background:#090909;">
                                        <div style="padding:24px 28px 0;text-align:left;">
                                            <a href="${escapeHtml(siteUrl('/'))}" style="display:inline-block;text-decoration:none;">
                                                <img src="${escapeHtml(getLogoUrl())}" width="104" alt="I Luv Hip Hop" style="display:block;width:104px;max-width:100%;height:auto;border:0;" />
                                            </a>
                                            <p style="margin:12px 0 0;color:${brand.white};font:800 14px Arial,sans-serif;text-transform:uppercase;letter-spacing:.12em;">This Is Hip Hop Caribbean</p>
                                        </div>
                                        <div style="padding:28px 28px 22px;border-top:5px solid ${brand.red};">
                                            <p style="margin:0 0 18px;color:${brand.red};font:800 12px Arial,sans-serif;text-transform:uppercase;letter-spacing:.24em;">${escapeHtml(input.eyebrow || brand.name)}</p>
                                            <h1 style="margin:0;color:${brand.white};font:900 36px Arial Black,Arial,sans-serif;line-height:1.02;text-transform:uppercase;letter-spacing:0;">${escapeHtml(input.title)}</h1>
                                            <p style="margin:18px 0 0;color:${brand.muted};font:500 16px/1.6 Arial,sans-serif;">${escapeHtml(input.intro)}</p>
                                            ${sections}
                                            ${action}
                                        </div>
                                        <div style="padding:18px 28px;background:${brand.panel};border-top:1px solid ${brand.border};">
                                            <p style="margin:0;color:${brand.muted};font:500 12px/1.6 Arial,sans-serif;">
                                                ${escapeHtml(input.footerNote || 'This message was sent by This Is Hip Hop Caribbean. I Luv Hip Hop is our signature event and merchandise brand.')}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
}

function renderText(input: SendEmailInput) {
    const sections = input.sections?.map((section) => {
        const rows = section.rows
            .filter(([, value]) => value !== undefined && value !== null && value !== '')
            .map(([label, value]) => `${label}: ${value}`)
            .join('\n');
        return `${section.title}\n${rows}`;
    }).join('\n\n') || '';

    return [
        input.title,
        '',
        input.intro,
        sections ? `\n${sections}` : '',
        input.action ? `\n${input.action.label}: ${input.action.url}` : '',
        `\n${input.footerNote || 'This message was sent by This Is Hip Hop Caribbean. I Luv Hip Hop is our signature event and merchandise brand.'}`,
    ].join('\n').trim();
}

export async function sendBrandedEmail(input: SendEmailInput) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.warn('Skipping email because RESEND_API_KEY is not configured.');
        return { skipped: true };
    }

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: input.from || emailSenders.default,
            to: input.to,
            subject: input.subject,
            html: renderHtml(input),
            text: renderText(input),
            reply_to: input.replyTo || process.env.RESEND_REPLY_TO || adminEmails[0],
        }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        console.error('Resend email failed:', data);
        return { skipped: false, error: data };
    }

    return { skipped: false, data };
}

export function siteUrl(path = '/') {
    return new URL(path, getBaseUrl()).toString();
}
