const addNoteButton = document.getElementById("add-note-btn");
const notesContainer = document.getElementById("notes-container");

addNoteButton.addEventListener("click", () => {
  const note = document.createElement("div");

  note.classList.add("note");

  const textarea = document.createElement("textarea");

  textarea.classList.add("note-textarea");

  note.appendChild(textarea);
  notesContainer.appendChild(note);
});
