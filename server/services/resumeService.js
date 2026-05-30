const pdfParse = require('pdf-parse');
const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

const TECH_SKILLS = [
  'javascript','typescript','python','java','c++','c#','php','ruby','go','rust','swift','kotlin',
  'react','angular','vue','nextjs','nuxtjs','svelte','redux','zustand',
  'nodejs','express','fastapi','django','flask','spring','laravel',
  'mongodb','postgresql','mysql','sqlite','redis','firebase','supabase',
  'html','css','tailwind','bootstrap','sass','scss',
  'git','docker','kubernetes','aws','azure','gcp','linux','nginx',
  'graphql','rest','api','jwt','oauth',
  'figma','photoshop','canva',
  'machine learning','deep learning','tensorflow','pytorch','nlp','ai',
];

exports.parseResume = async (buffer) => {
  try {
    const data = await pdfParse(buffer);
    const text = data.text;

    const skills = extractSkills(text);
    const experience = extractExperience(text);
    const education = extractEducation(text);
    const summary = text.slice(0, 400).replace(/\n+/g, ' ').trim();

    return { skills, experience, education, summary };
  } catch (err) {
    console.error('Resume parse error:', err.message);
    return { skills: [], experience: [], education: [], summary: '' };
  }
};

function extractSkills(text) {
  const lower = text.toLowerCase();
  return TECH_SKILLS.filter((skill) => lower.includes(skill));
}

function extractExperience(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines
    .filter((l) => /experience|worked|developer|engineer|intern|company|project|built|developed/i.test(l))
    .slice(0, 6);
}

function extractEducation(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines
    .filter((l) => /b\.tech|m\.tech|bachelor|master|degree|university|college|12th|10th|school|engineering|computer science/i.test(l))
    .slice(0, 4);
}

exports.uploadResumeToCloud = async (buffer, userId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'resumes', public_id: `resume_${userId}`, resource_type: 'raw' },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};
