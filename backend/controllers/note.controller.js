const Note = require('../models/note');

exports.saveNote = async (req, res) => {
  try {
    const { courseId, note } = req.body;
    const existing = await Note.findOne({ studentId: req.user.id, courseId });

    if (existing) {
      existing.note = note;
      await existing.save();
      return res.json({ message: 'Note updated', note: existing });
    }

    const newNote = new Note({ studentId: req.user.id, courseId, note });
    await newNote.save();
    res.status(201).json({ message: 'Note saved', note: newNote });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
