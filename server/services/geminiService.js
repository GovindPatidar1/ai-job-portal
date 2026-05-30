const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const safeParseJSON = (text, fallback) => {
  try {
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    const objMatch = text.match(/\{[\s\S]*\}/);
    if (arrayMatch) return JSON.parse(arrayMatch[0]);
    if (objMatch) return JSON.parse(objMatch[0]);
    return fallback;
  } catch {
    return fallback;
  }
};

exports.getJobRecommendations = async (userSkills, jobs) => {
  try {
    const jobList = jobs
      .map((j) => `ID:${j._id} | Title:${j.title} | Company:${j.company} | Skills:${j.skills.join(',')}`)
      .join('\n');

    const prompt = `User skills: ${userSkills.join(', ')}

Job listings:
${jobList}

Rank the top 5 most suitable jobs for this user. Return ONLY a JSON array (no markdown):
[{"jobId": "id_here", "reason": "brief reason why this job matches"}]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return safeParseJSON(text, []);
  } catch (err) {
    console.error('Gemini recommendations error:', err.message);
    return [];
  }
};

exports.generateCoverLetter = async (jobTitle, company, userSkills, experience) => {
  try {
    const prompt = `Write a professional cover letter for:
Job: ${jobTitle} at ${company}
My skills: ${userSkills.join(', ')}
My experience: ${experience || 'Fresher with strong technical foundation'}

Requirements:
- 3 paragraphs: Introduction, Why I'm a great fit, Closing
- Professional and enthusiastic tone
- Under 300 words`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Gemini cover letter error:', err.message);
    throw new Error('Failed to generate cover letter');
  }
};

exports.analyzeSkillGap = async (userSkills, jobSkills) => {
  try {
    const prompt = `User has skills: ${userSkills.join(', ')}
Job requires: ${jobSkills.join(', ')}

Identify missing skills and provide learning resources. Return ONLY JSON (no markdown):
{"missingSkills": [{"skill": "skill name", "resources": [{"name": "resource name", "url": "https://..."}]}]}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return safeParseJSON(text, { missingSkills: [] });
  } catch (err) {
    console.error('Gemini skill gap error:', err.message);
    return { missingSkills: [] };
  }
};

exports.chatbotReply = async (message, conversationHistory = []) => {
  try {
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: { maxOutputTokens: 500 },
      systemInstruction:
        'You are a helpful job portal assistant named JobBot. Help users with resume tips, job search advice, interview preparation, salary negotiation, and career guidance. Be concise, friendly and practical.',
    });

    const result = await chat.sendMessage(message);
    return result.response.text();
  } catch (err) {
    console.error('Gemini chatbot error:', err.message);
    throw new Error('Chatbot failed to respond');
  }
};
