const notesService = require("../services/notesService");
const APIError = require("../utils/APIError");

const createNote = async (req, res) => {
    const noteData = { ...req.body, user: req.user.id };
    if (noteData.tags && typeof noteData.tags === "string") {
        noteData.tags = noteData.tags.split(",").map(t => t.trim()).filter(Boolean);
    }
    const note = await notesService.createNote(noteData);
    res.status(201).json({ message: "Note created successfully", data: note });
};

const getNoteById = async (req, res) => {
    const note = await notesService.getNoteById(req.params.id);
    if (!note) {
        throw new APIError("Note not found", 404);
    }
    if (note.user.toString() !== req.user.id) {
        throw new APIError("You can only view your own notes", 403);
    }
    res.json({ message: "Note fetched successfully", data: note });
};

const updateNote = async (req, res) => {
    const note = await notesService.getNoteById(req.params.id);
    if (!note) {
        throw new APIError("Note not found", 404);
    }
    if (note.user.toString() !== req.user.id) {
        throw new APIError("You can only edit your own notes", 403);
    }
    const updateData = { ...req.body };
    if (updateData.tags && typeof updateData.tags === "string") {
        updateData.tags = updateData.tags.split(",").map(t => t.trim()).filter(Boolean);
    }
    const updatedNote = await notesService.updateNote(req.params.id, updateData);
    res.json({ message: "Note updated successfully", data: updatedNote });
};

const deleteNote = async (req, res) => {
    const note = await notesService.getNoteById(req.params.id);
    if (!note) {
        throw new APIError("Note not found", 404);
    }
    if (note.user.toString() !== req.user.id) {
        throw new APIError("You can only delete your own notes", 403);
    }
    await notesService.deleteNote(req.params.id);
    res.json({ message: "Note deleted successfully" });
};

const listNotes = async (req, res) => {
    const filter = { user: req.user.id };

    if (req.query.search) {
        filter.$or = [
            { title: { $regex: req.query.search, $options: "i" } },
            { content: { $regex: req.query.search, $options: "i" } }
        ];
    }

    if (req.query.category) {
        filter.category = req.query.category;
    }

    if (req.query.status) {
        filter.status = req.query.status;
    }

    if (req.query.isPinned !== undefined) {
        filter.isPinned = req.query.isPinned === "true";
    }

    const sortField = req.query.sortBy || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await notesService.listNotes(filter, sort, page, limit);
    res.json({ message: "Notes fetched successfully", data: result });
};

module.exports = {
    createNote,
    getNoteById,
    updateNote,
    deleteNote,
    listNotes
};
