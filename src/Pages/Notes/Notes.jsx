import React, { useContext, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Context } from "../../context/context";
import { ThemeContext } from "../../context/ThemeContext";
import {
  FiBookmark,
  FiEdit3,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiCopy,
  FiCheck,
  FiX,
  FiEye,
  FiTag,
  FiClock,
  FiArrowLeft,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import "./Notes.css";

const Notes = ({ profile, setProfile }) => {
  const { notes, saveNote, deleteNote, updateNote } = useContext(Context);
  const { theme } = useContext(ThemeContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("All");

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeNoteModal, setActiveNoteModal] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  // Form State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Personal");

  // Copy status state
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    saveNote({
      title: newTitle.trim(),
      content: newContent.trim(),
      type: "manual",
      tags: [newCategory],
    });

    setNewTitle("");
    setNewContent("");
    setNewCategory("Personal");
    setShowCreateModal(false);
  };

  const handleUpdateNote = (e) => {
    e.preventDefault();
    if (!editingNote || !editingNote.title.trim() || !editingNote.content.trim()) return;

    updateNote(editingNote.id, {
      title: editingNote.title.trim(),
      content: editingNote.content.trim(),
      tags: [editingNote.category || "Personal"],
    });

    setEditingNote(null);
  };

  // Filter Notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.question && note.question.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterTag === "All") return matchesSearch;
    if (filterTag === "Chat Q&A") return matchesSearch && note.type === "chat";
    if (filterTag === "Personal") return matchesSearch && note.type !== "chat";
    return matchesSearch;
  });

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="home-layout">
      <Sidebar profile={profile} setProfile={setProfile} />

      <div className="notes-page-container">
        {/* Header Bar */}
        <div className="notes-header">
          <div className="notes-title-group">
            <NavLink to="/" className="back-link" title="Back to Chat">
              <FiArrowLeft />
            </NavLink>
            <div>
              <h1>My Notes</h1>
              <p>Save chat answers, organize ideas, and keep track of important Q&As.</p>
            </div>
          </div>

          <button
            className="create-note-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus /> New Note
          </button>
        </div>

        {/* Controls Bar: Search & Filter Tabs */}
        <div className="notes-controls">
          <div className="notes-search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search your notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery("")}>
                <FiX />
              </button>
            )}
          </div>

          <div className="notes-filter-tabs">
            {["All", "Chat Q&A", "Personal"].map((tag) => (
              <button
                key={tag}
                className={`filter-tab ${filterTag === tag ? "active" : ""}`}
                onClick={() => setFilterTag(tag)}
              >
                {tag === "Chat Q&A" && <FiBookmark style={{ marginRight: 6 }} />}
                {tag === "Personal" && <FiEdit3 style={{ marginRight: 6 }} />}
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note.id} className={`note-card ${note.type === "chat" ? "chat-type" : ""}`}>
                <div className="note-card-header">
                  <span className={`note-type-badge ${note.type === "chat" ? "badge-chat" : "badge-personal"}`}>
                    {note.type === "chat" ? <FiBookmark /> : <FiTag />}
                    {note.type === "chat" ? "Chat Q&A" : note.tags?.[0] || "Personal"}
                  </span>

                  <div className="note-card-actions">
                    <button
                      className="note-action-icon"
                      title="View Details"
                      onClick={() => setActiveNoteModal(note)}
                    >
                      <FiEye />
                    </button>

                    <button
                      className="note-action-icon"
                      title="Copy Note"
                      onClick={() => handleCopy(note.content || note.answer, note.id)}
                    >
                      {copiedId === note.id ? <FiCheck className="copied" /> : <FiCopy />}
                    </button>

                    {note.type !== "chat" && (
                      <button
                        className="note-action-icon"
                        title="Edit Note"
                        onClick={() =>
                          setEditingNote({
                            id: note.id,
                            title: note.title,
                            content: note.content,
                            category: note.tags?.[0] || "Personal",
                          })
                        }
                      >
                        <FiEdit3 />
                      </button>
                    )}

                    <button
                      className="note-action-icon delete"
                      title="Delete Note"
                      onClick={() => deleteNote(note.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <h3 className="note-title" onClick={() => setActiveNoteModal(note)}>
                  {note.title}
                </h3>

                <p className="note-snippet" onClick={() => setActiveNoteModal(note)}>
                  {note.content ? note.content.slice(0, 140) : note.answer?.slice(0, 140)}
                  {(note.content?.length > 140 || note.answer?.length > 140) ? "..." : ""}
                </p>

                <div className="note-footer">
                  <span className="note-date">
                    <FiClock /> {formatDate(note.updatedAt || note.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-notes-state">
            <div className="empty-icon-wrapper">
              <FiBookmark />
            </div>
            <h3>{searchQuery ? "No matching notes found" : "No notes saved yet"}</h3>
            <p>
              {searchQuery
                ? "Try searching with a different term."
                : "You can save chat answers directly while chatting or create custom notes here!"}
            </p>
            {!searchQuery && (
              <button
                className="create-note-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <FiPlus /> Create Your First Note
              </button>
            )}
          </div>
        )}
      </div>

      {/* CREATE NOTE MODAL */}
      {showCreateModal && (
        <div className="notes-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="notes-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="notes-modal-header">
              <h2>Create New Note</h2>
              <button className="close-modal-btn" onClick={() => setShowCreateModal(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateNote} className="notes-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  placeholder="Enter note title..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Idea">Idea</option>
                </select>
              </div>

              <div className="form-group">
                <label>Note Content</label>
                <textarea
                  rows="6"
                  placeholder="Write your note content here..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                ></textarea>
              </div>

              <div className="notes-modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT NOTE MODAL */}
      {editingNote && (
        <div className="notes-modal-overlay" onClick={() => setEditingNote(null)}>
          <div className="notes-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="notes-modal-header">
              <h2>Edit Note</h2>
              <button className="close-modal-btn" onClick={() => setEditingNote(null)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleUpdateNote} className="notes-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editingNote.title}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={editingNote.category}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, category: e.target.value })
                  }
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Study">Study</option>
                  <option value="Idea">Idea</option>
                </select>
              </div>

              <div className="form-group">
                <label>Note Content</label>
                <textarea
                  rows="6"
                  value={editingNote.content}
                  onChange={(e) =>
                    setEditingNote({ ...editingNote, content: e.target.value })
                  }
                  required
                ></textarea>
              </div>

              <div className="notes-modal-footer">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingNote(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Update Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW NOTE DETAIL MODAL */}
      {activeNoteModal && (
        <div className="notes-modal-overlay" onClick={() => setActiveNoteModal(null)}>
          <div className="notes-modal-card view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notes-modal-header">
              <span className={`note-type-badge ${activeNoteModal.type === "chat" ? "badge-chat" : "badge-personal"}`}>
                {activeNoteModal.type === "chat" ? <FiBookmark /> : <FiTag />}
                {activeNoteModal.type === "chat" ? "Chat Q&A" : activeNoteModal.tags?.[0] || "Personal"}
              </span>
              <button className="close-modal-btn" onClick={() => setActiveNoteModal(null)}>
                <FiX />
              </button>
            </div>

            <div className="view-note-content">
              <h2>{activeNoteModal.title}</h2>
              <span className="view-note-date">
                Saved on {formatDate(activeNoteModal.createdAt)}
              </span>

              {activeNoteModal.question && (
                <div className="q-section">
                  <h4>Question:</h4>
                  <p>{activeNoteModal.question}</p>
                </div>
              )}

              <div className="a-section">
                {activeNoteModal.question && <h4>Answer / Content:</h4>}
                <div className="note-text-body">{activeNoteModal.content || activeNoteModal.answer}</div>
              </div>
            </div>

            <div className="notes-modal-footer">
              <button
                className="copy-note-full-btn"
                onClick={() =>
                  handleCopy(
                    activeNoteModal.content || activeNoteModal.answer,
                    "modal_copy"
                  )
                }
              >
                {copiedId === "modal_copy" ? <FiCheck /> : <FiCopy />}
                {copiedId === "modal_copy" ? "Copied to Clipboard!" : "Copy Full Content"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
