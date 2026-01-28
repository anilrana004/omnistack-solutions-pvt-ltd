import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { logger } from "@/src/lib/logger";

interface ContactFormData {
  plan?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  message: string;
}

const DEFAULT_ADMIN_EMAIL = "admin@omnistack.co.in";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getSmtpConfig() {
  const host = (process.env.SMTP_HOST || "smtpout.secureserver.net").trim();
  const portRaw = (process.env.SMTP_PORT || "587").trim();
  const secureRaw = process.env.SMTP_SECURE?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number.parseInt(portRaw, 10);

  if (!Number.isFinite(port) || !user || !pass) {
    return null;
  }

  const secure = secureRaw ? secureRaw === "true" : false;
  return {
    host,
    port,
    secure,
    user,
    pass,
  };
}

function buildEmailHtml(data: ContactFormData) {
  const planRow = data.plan
    ? `<p style="margin: 0 0 8px;"><strong>Selected Plan:</strong> ${data.plan}</p>`
    : "";
  const projectRow = `<p style="margin: 0 0 8px;"><strong>Selected Project Type:</strong> ${data.projectType}</p>`;
  const companyRow = data.company
    ? `<p style="margin: 0 0 8px;"><strong>Company:</strong> ${data.company}</p>`
    : "";

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 640px; margin: 0 auto;">
      <h2 style="color: #0f172a; margin-bottom: 16px;">New Contact Request</h2>
      <div style="background: #f8fafc; padding: 16px 18px; border-radius: 10px; margin-bottom: 20px;">
        ${planRow}
        ${projectRow}
        <p style="margin: 0 0 8px;"><strong>Name:</strong> ${data.name}</p>
        <p style="margin: 0 0 8px;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p style="margin: 0 0 8px;"><strong>Phone:</strong> ${data.phone}</p>
        ${companyRow}
      </div>
      <div style="margin-bottom: 20px;">
        <h3 style="color: #0f172a; margin-bottom: 10px;">Message</h3>
        <p style="white-space: pre-wrap; line-height: 1.6; margin: 0;">${data.message}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="color: #64748b; font-size: 12px; margin: 0;">
        Submitted from the OmniStack Solutions website.
      </p>
    </div>
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, projectType, name, email, phone, company, message } = body ?? {};

    if (!projectType || !name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Project type, name, email, phone, and message are required." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(String(email))) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const phoneValue = String(phone).trim();
    const phoneRegex = /^[\d+\s-]+$/;
    if (!phoneRegex.test(phoneValue)) {
      return NextResponse.json(
        { error: "Please provide a valid phone number." },
        { status: 400 }
      );
    }

    if (String(message).trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters long." },
        { status: 400 }
      );
    }

    const smtpConfig = getSmtpConfig();
    if (!smtpConfig) {
      return NextResponse.json(
        { error: "Email service is not configured. Please try again later." },
        { status: 500 }
      );
    }

    const formData: ContactFormData = {
      plan: plan ? String(plan).trim() : undefined,
      projectType: String(projectType).trim(),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: phoneValue,
      company: company ? String(company).trim() : undefined,
      message: String(message).trim(),
    };

    const adminEmail = 
      process.env.ADMIN_EMAIL?.trim() || 
      process.env.COMPANY_EMAIL?.trim() || 
      DEFAULT_ADMIN_EMAIL;

    if (!EMAIL_REGEX.test(adminEmail)) {
      logger.error('Invalid ADMIN_EMAIL configuration', undefined, { adminEmail });
      return NextResponse.json(
        { error: "Email service configuration error. Please try again later." },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
    });

    await transporter.sendMail({
      from: `OmniStack Solutions <${adminEmail}>`,
      to: adminEmail,
      replyTo: formData.email,
      subject: "New Contact Request — OmniStack Solutions",
      text: [
        formData.plan ? `Selected Plan: ${formData.plan}` : null,
        `Selected Project Type: ${formData.projectType}`,
        `Name: ${formData.name}`,
        `Email: ${formData.email}`,
        `Phone: ${formData.phone}`,
        formData.company ? `Company: ${formData.company}` : null,
        "",
        formData.message,
      ]
        .filter(Boolean)
        .join("\n"),
      html: buildEmailHtml(formData),
    });

    return NextResponse.json(
      { success: true, message: "Thanks! We'll get back to you soon." },
      { status: 200 }
    );
  } catch (error) {
    // Log full error details for debugging (appears in Vercel Functions logs)
    logger.apiError('/api/contact', error instanceof Error ? error : new Error(String(error)), {
      errorType: 'SMTP_RELAY_ERROR',
      code: (error as any)?.code,
      command: (error as any)?.command,
      response: (error as any)?.response,
    });
    
    // Return user-friendly error (no sensitive details)
    return NextResponse.json(
      {
        error: "Failed to send your message. Please try again later.",
      },
      { status: 500 }
    );
  }
}

