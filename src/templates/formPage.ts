export const formPage = (dayNumber: string) => `
  <html>
    <body style="font-family: sans-serif; max-width: 600px; margin: 40px auto;">
      <h2>Day ${dayNumber}/100 🚀</h2>
      <form action="/submit" method="POST">
        <input type="hidden" name="dayNumber" value="${dayNumber}" />
        <label><b>Learned today:</b></label><br/>
        <textarea name="learned" rows="5" style="width:100%" required></textarea><br/><br/>
        <label><b>Code link (optional):</b></label><br/>
        <input type="url" name="codeLink" style="width:100%" placeholder="https://github.com/..." /><br/><br/>
        <button type="submit" style="padding:10px 20px;">Generate Post</button>
      </form>
    </body>
  </html>
`;