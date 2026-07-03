const Note = require("../models/note");

const createNote = async (noteData) => {
    const newNote = await Note.create(noteData);
    return newNote;
};

const getNoteById = async (id) => {
    const note = await Note.findById(id);
    return note;
};

const updateNote = async (id, data) => {
    const updatedNote = await Note.findByIdAndUpdate(id, data, { new: true });
    return updatedNote;
};

const deleteNote = async (id) => {
    const deletedNote = await Note.findByIdAndDelete(id);
    return deletedNote;
};

const listNotes = async (filter = {}, sort = { createdAt: -1 }, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const finalSort = { isPinned: -1, ...sort };
    const notes = await Note.find(filter).sort(finalSort).skip(skip).limit(limit);
    const total = await Note.countDocuments(filter);
    return { notes, total, page, totalPages: Math.ceil(total / limit) };
};

module.exports = {
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
    listNotes
};
