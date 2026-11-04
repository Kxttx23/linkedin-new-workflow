import { Request, Response } from 'express';
import { publishToLinkedIn } from '../services/linkedinService';
import { approvalStore } from '../store/approvalStore';

export async function handleApproval(req: Request, res: Response) {
  const { token, action } = req.query;
  const pending = approvalStore.get(token as string);

  if (!pending) return res.status(400).send('❌ Invalid or expired token.');

  if (action === 'approve') {
    try {
      console.log('Attempting to publish post to LinkedIn with token:', token);
      await publishToLinkedIn(pending.postText);
      console.log('Post published successfully to LinkedIn with token:', token);
      approvalStore.delete(token as string);
      res.send('<h3>✅ Post published successfully to LinkedIn!</h3>');
    } catch (error) {
      console.error(error);
      res.status(500).send('❌ Failed to publish to LinkedIn. Check server logs.');
    }
  } else {
    approvalStore.delete(token as string);
    res.send('<h3>🚫 Post declined.</h3>');
  }
}