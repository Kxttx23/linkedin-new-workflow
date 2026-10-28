import { Request, Response } from 'express';
import { generatePostBody } from '../services/geminiService';
import { sendApprovalEmail } from '../services/emailService';
import { approvalStore } from '../store/approvalStore';
import { formPage } from '../templates/formPage';
import { HASHTAGS } from '../config/constants';
import { APPROVER_EMAIL } from '../config/env';

export async function showForm(req: Request, res: Response) {
  res.send(formPage(String(req.query.day || '1')));
}

export async function handleSubmit(req: Request, res: Response) {
  const { learned, codeLink, dayNumber } = req.body;
  try {
    const body = await generatePostBody(learned);
    const header = `Day ${dayNumber}/100 🚀`;
    const finalPost = [header, '', body, codeLink ? `\nCode: ${codeLink}\n` : '', HASHTAGS].filter(Boolean).join('\n');

    const token = await sendApprovalEmail(APPROVER_EMAIL, finalPost, Number(dayNumber));
    approvalStore.set(token, { postText: finalPost, dayNumber: Number(dayNumber), createdAt: new Date() });

    res.send('<h3>✅ Approval email sent! Check your inbox.</h3>');
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Error generating post.');
  }
}