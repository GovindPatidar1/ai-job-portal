const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    location: { type: String, required: true },
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    type: {
      type: String,
      enum: ['full-time', 'part-time', 'remote', 'internship', 'contract'],
      default: 'full-time',
    },
    experience: {
      type: String,
      enum: ['fresher', '1-2 years', '2-5 years', '5+ years'],
      default: 'fresher',
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', description: 'text', skills: 'text' });

module.exports = mongoose.model('Job', jobSchema);
