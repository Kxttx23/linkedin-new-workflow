import { Request, Response } from 'express';
import { draftPost } from '../services/geminiService'; // പുതിയ ഫങ്ക്ഷൻ നാമം
import { buildPost } from '../services/postBuilder'; // R5 ഫങ്ക്ഷൻ
import { sendApprovalEmail } from '../services/emailService';
import { approvalStore } from '../store/approvalStore';
import { formPage } from '../templates/formPage';
import { APPROVER_EMAIL } from '../config/env';

export async function showForm(req: Request, res: Response) {
  res.send(formPage(String(req.query.day || '1')));
}

export async function handleSubmit(req: Request, res: Response) {
  const { learned, codeLink, dayNumber } = req.body;
  
  try {
    // 1. AI ഡ്രാഫ്റ്റിംഗ് (പുതിയ റിട്രൈ ലോജിക് ഉള്ള ഫങ്ക്ഷൻ)
    const draftResult = await draftPost(learned);

    // R6: ഡ്രാഫ്റ്റിംഗ് പരാജയപ്പെട്ടാൽ ഈമെയിൽ അയക്കരുത്, ഉപയോക്താവിനോട് പറയുക
    if (!draftResult.ok) {
      console.error("Drafting failed:", draftResult.reason);
      return res.status(500).send(`❌ Drafting failed: ${draftResult.reason}. Please write the post yourself.`);
    }

    // 2. അവസാന പോസ്റ്റ് തയ്യാറാക്കുക (R5)
    const header = `Day ${dayNumber}/100 🚀`;
    const postBuildResult = buildPost(header, draftResult.data, codeLink);

    if (!postBuildResult.ok) {
      return res.status(500).send(`❌ Error: ${postBuildResult.reason}`);
    }

    const finalPost = postBuildResult.post;

    // 3. അപ്രൂവൽ ഈമെയിൽ അയക്കുക (ഡ്രാഫ്റ്റിംഗ് വിജയിച്ചാൽ മാത്രം)
    const token = await sendApprovalEmail(APPROVER_EMAIL, finalPost, Number(dayNumber));
    approvalStore.set(token, { postText: finalPost, dayNumber: Number(dayNumber), createdAt: new Date() });

    res.send('<h3>✅ Approval email sent! Check your inbox.</h3>');
    
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Error generating post.');
  }
}