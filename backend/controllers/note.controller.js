// controllers/note.controller.js
const Note = require('../models/note.model');
const { createSuccess, createError } = require('../utils/response.utils');

// ─── Save or Update Note ──────────────────────────────────────────────────────

exports.saveNote = async (req, res, next) => {
  try {
    const { courseId, lessonId, content } = req.body;
    const studentId = req.user.id;

    if (!courseId) {
      return res.status(400).json(createError('courseId is required', 400));
    }

    const note = await Note.findOneAndUpdate(
      { courseId, studentId },
      { lessonId: lessonId || null, content },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(createSuccess(note, 'Note saved successfully'));
  } catch (err) {
    next(err);
  }
};

// ─── Get Note for Course ──────────────────────────────────────────────────────

exports.getNote = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const note = await Note.findOne({ courseId, studentId });
    // Don't throw error if not found, just return empty note
    res.json(createSuccess(note || { content: '' }));
  } catch (err) {
    next(err);
  }
};

// ─── Delete Note ──────────────────────────────────────────────────────────────

exports.deleteNote = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    await Note.findOneAndDelete({ courseId, studentId });
    res.json(createSuccess(null, 'Note deleted'));
  } catch (err) {
    next(err);
  }
};
