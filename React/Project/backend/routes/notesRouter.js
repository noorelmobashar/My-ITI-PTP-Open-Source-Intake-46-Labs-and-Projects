const { Router } = require("express");
const notesController = require("../controllers/notesController");
const { validate, authenticate } = require("../middlewares");
const createNoteSchema = require("../validations/notes/createNoteSchema");
const updateNoteSchema = require("../validations/notes/updateNoteSchema");

const router = Router();

router.post("/", authenticate, validate(createNoteSchema), notesController.createNote);
router.get("/", authenticate, notesController.listNotes);
router.get("/:id", authenticate, notesController.getNoteById);
router.patch("/:id", authenticate, validate(updateNoteSchema), notesController.updateNote);
router.delete("/:id", authenticate, notesController.deleteNote);

module.exports = router;
