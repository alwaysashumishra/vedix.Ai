import React, { useContext, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Context } from "../../context/context";
import { ThemeContext } from "../../context/ThemeContext";
import FormattedResponse from "../../components/FormattedResponse/FormattedResponse";
import {
  FiUsers,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiEye,
  FiX,
  FiCheck,
  FiArrowLeft,
  FiMail,
  FiMessageCircle,
  FiShare2,
  FiUserPlus,
  FiMessageSquare,
  FiClock,
  FiBriefcase,
  FiTag,
  FiBookOpen,
} from "react-icons/fi";
import { NavLink } from "react-router-dom";
import "./Groups.css";

const Groups = ({ profile, setProfile }) => {
  const { groups, createGroup, deleteGroup, addMemberToGroup } = useContext(Context);
  const { theme } = useContext(ThemeContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeGroupModal, setActiveGroupModal] = useState(null);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  // Forms State
  const [groupName, setGroupName] = useState("");
  const [groupDesc, setGroupDesc] = useState("");
  const [groupCat, setGroupCat] = useState("Team");
  const [initialMember, setInitialMember] = useState("");

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberPhone, setNewMemberPhone] = useState("");
  const [newMemberName, setNewMemberName] = useState("");

  const [inviteCopied, setInviteCopied] = useState(false);

  const handleCreateGroup = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    const initialMembers = [
      {
        id: `m_admin_${Date.now()}`,
        name: profile?.username || "You",
        email: profile?.email || "ashutoshmmishra15@gmail.com",
        role: "Admin",
      },
    ];

    if (initialMember.trim()) {
      initialMembers.push({
        id: `m_${Date.now()}`,
        name: initialMember.split("@")[0],
        email: initialMember.includes("@") ? initialMember.trim() : "",
        phone: !initialMember.includes("@") ? initialMember.trim() : "",
        role: "Member",
      });
    }

    const created = createGroup({
      name: groupName.trim(),
      description: groupDesc.trim(),
      category: groupCat,
      members: initialMembers,
    });

    setGroupName("");
    setGroupDesc("");
    setGroupCat("Team");
    setInitialMember("");
    setShowCreateModal(false);
    setActiveGroupModal(created);
  };

  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    if (!activeGroupModal) return;
    if (!newMemberEmail.trim() && !newMemberPhone.trim()) return;

    addMemberToGroup(activeGroupModal.id, {
      name: newMemberName.trim() || newMemberEmail.split("@")[0] || newMemberPhone,
      email: newMemberEmail.trim(),
      phone: newMemberPhone.trim(),
      role: "Member",
    });

    // Refresh active group modal view
    const updatedGroup = groups.find((g) => g.id === activeGroupModal.id);
    if (updatedGroup) {
      setActiveGroupModal({
        ...updatedGroup,
        members: [
          ...(updatedGroup.members || []),
          {
            id: `m_${Date.now()}`,
            name: newMemberName.trim() || newMemberEmail.split("@")[0] || newMemberPhone,
            email: newMemberEmail.trim(),
            phone: newMemberPhone.trim(),
            role: "Member",
          },
        ],
      });
    }

    setNewMemberName("");
    setNewMemberEmail("");
    setNewMemberPhone("");
    setShowAddMemberModal(false);
  };

  const handleWhatsAppInvite = (phone, groupName) => {
    const inviteText = `Hey! Join our AI Collaboration Group "${groupName}" on lexi.AI to share prompts, research, and Q&A conversations!`;
    const targetPhone = phone ? phone.replace(/[^0-9]/g, "") : "";
    const url = targetPhone
      ? `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(inviteText)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteText)}`;
    window.open(url, "_blank");
  };

  const handleEmailInvite = (email, groupName) => {
    const subject = `Invitation to join "${groupName}" on lexi.AI`;
    const body = `Hi,\n\nYou have been invited to join the AI Collaboration Group "${groupName}" on lexi.AI.\n\nStart sharing chats and research Q&As together!`;
    window.open(`mailto:${email || ""}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
  };

  // Filter Groups
  const filteredGroups = groups.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.members?.some((m) => m.email?.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filterCategory === "All") return matchesSearch;
    return matchesSearch && g.category === filterCategory;
  });

  const totalGroups = groups.length;
  const totalMembers = groups.reduce((acc, g) => acc + (g.members?.length || 0), 0);
  const totalSharedChats = groups.reduce((acc, g) => acc + (g.sharedChats?.length || 0), 0);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="home-layout">
      <Sidebar profile={profile} setProfile={setProfile} />

      <div className="groups-page-container">
        {/* Header */}
        <div className="groups-header">
          <div className="groups-title-group">
            <NavLink to="/" className="back-link" title="Back to Chat">
              <FiArrowLeft />
            </NavLink>
            <div>
              <h1>Team Groups & Sharing</h1>
              <p>Create groups, invite collaborators via WhatsApp & Email, and share chat conversations.</p>
            </div>
          </div>

          <button className="create-group-btn" onClick={() => setShowCreateModal(true)}>
            <FiPlus /> Create Group
          </button>
        </div>

        {/* Stats Strip */}
        <div className="groups-stats-strip">
          <div className="stat-card">
            <div className="stat-icon-box groups-icon">
              <FiUsers />
            </div>
            <div className="stat-info">
              <h3>{totalGroups}</h3>
              <p>Total Groups</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box members-icon">
              <FiUserPlus />
            </div>
            <div className="stat-info">
              <h3>{totalMembers}</h3>
              <p>Group Members</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-box chats-icon">
              <FiMessageSquare />
            </div>
            <div className="stat-info">
              <h3>{totalSharedChats}</h3>
              <p>Shared Chats</p>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="groups-controls">
          <div className="groups-search-box">
            <div className="search-icon-badge">
              <FiSearch />
            </div>
            <input
              type="text"
              placeholder="Search groups by name, description, or member email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery("")}>
                <FiX />
              </button>
            )}
          </div>

          <div className="groups-filter-tabs">
            {["All", "Team", "Project", "Research", "Study"].map((cat) => (
              <button
                key={cat}
                className={`filter-tab ${filterCategory === cat ? "active" : ""}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Groups Grid */}
        {filteredGroups.length > 0 ? (
          <div className="groups-grid">
            {filteredGroups.map((group) => (
              <div key={group.id} className="group-card">
                <div className="group-card-header">
                  <span className="group-cat-badge">
                    <FiTag /> {group.category || "Team"}
                  </span>
                  <div className="group-actions">
                    <button
                      className="group-action-btn"
                      title="View Group Details"
                      onClick={() => setActiveGroupModal(group)}
                    >
                      <FiEye />
                    </button>
                    <button
                      className="group-action-btn delete"
                      title="Delete Group"
                      onClick={() => deleteGroup(group.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>

                <h3 className="group-name" onClick={() => setActiveGroupModal(group)}>
                  {group.name}
                </h3>
                <p className="group-desc">{group.description || "Collaborative team space for AI sharing."}</p>

                {/* Member Avatars */}
                <div className="group-members-preview" onClick={() => setActiveGroupModal(group)}>
                  <div className="avatar-stack">
                    {(group.members || []).slice(0, 4).map((member, idx) => (
                      <div key={idx} className="avatar-pill" title={`${member.name} (${member.role})`}>
                        {member.name?.charAt(0).toUpperCase() || "M"}
                      </div>
                    ))}
                    {(group.members?.length || 0) > 4 && (
                      <div className="avatar-more">+{group.members.length - 4}</div>
                    )}
                  </div>
                  <span className="members-count">{group.members?.length || 0} Members</span>
                </div>

                {/* Footer Info */}
                <div className="group-card-footer">
                  <span className="shared-badge">
                    <FiMessageSquare /> {group.sharedChats?.length || 0} Shared Chats
                  </span>
                  <button className="open-group-btn" onClick={() => setActiveGroupModal(group)}>
                    Open Group &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-groups-state">
            <div className="empty-icon-wrapper">
              <FiUsers />
            </div>
            <h3>{searchQuery ? "No matching groups found" : "No Team Groups Created Yet"}</h3>
            <p>
              {searchQuery
                ? "Try searching with a different group name or member email."
                : "Create a group to share chat conversations, research notes, and collaborate with your team via WhatsApp or Email!"}
            </p>
            {!searchQuery && (
              <button className="create-group-btn" onClick={() => setShowCreateModal(true)}>
                <FiPlus /> Create First Group
              </button>
            )}
          </div>
        )}
      </div>

      {/* CREATE GROUP MODAL */}
      {showCreateModal && (
        <div className="groups-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="groups-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="groups-modal-header">
              <h2>Create Collaboration Group</h2>
              <button className="close-modal-btn" onClick={() => setShowCreateModal(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="groups-form">
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  placeholder="e.g. AI Research Team, Marketing Group..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select value={groupCat} onChange={(e) => setGroupCat(e.target.value)}>
                  <option value="Team">Team</option>
                  <option value="Project">Project</option>
                  <option value="Research">Research</option>
                  <option value="Study">Study</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe the purpose of this group..."
                  value={groupDesc}
                  onChange={(e) => setGroupDesc(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Add First Member (Email or WhatsApp Phone)</label>
                <input
                  type="text"
                  placeholder="e.g. collaborator@gmail.com or +919876543210"
                  value={initialMember}
                  onChange={(e) => setInitialMember(e.target.value)}
                />
              </div>

              <div className="groups-modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GROUP DETAILS MODAL */}
      {activeGroupModal && (
        <div className="groups-modal-overlay" onClick={() => setActiveGroupModal(null)}>
          <div className="groups-modal-card detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="groups-modal-header">
              <div>
                <span className="group-cat-badge">{activeGroupModal.category || "Team"}</span>
                <h2 style={{ marginTop: 4 }}>{activeGroupModal.name}</h2>
              </div>
              <button className="close-modal-btn" onClick={() => setActiveGroupModal(null)}>
                <FiX />
              </button>
            </div>

            <div className="group-detail-body">
              <p className="group-detail-desc">{activeGroupModal.description || "Team collaboration group."}</p>

              {/* Members Section */}
              <div className="detail-section">
                <div className="detail-section-head">
                  <h3><FiUsers /> Members ({activeGroupModal.members?.length || 0})</h3>
                  <button className="add-member-btn" onClick={() => setShowAddMemberModal(true)}>
                    <FiUserPlus /> Add Member
                  </button>
                </div>

                <div className="members-list">
                  {(activeGroupModal.members || []).map((m) => (
                    <div key={m.id} className="member-row">
                      <div className="member-info">
                        <div className="member-avatar">{m.name?.charAt(0).toUpperCase()}</div>
                        <div>
                          <strong>{m.name}</strong>
                          <p>{m.email || m.phone}</p>
                        </div>
                      </div>

                      <div className="member-invite-actions">
                        {m.phone && (
                          <button
                            className="invite-icon-btn whatsapp"
                            title="Send WhatsApp Invite"
                            onClick={() => handleWhatsAppInvite(m.phone, activeGroupModal.name)}
                          >
                            <FiMessageCircle /> WhatsApp
                          </button>
                        )}
                        {m.email && (
                          <button
                            className="invite-icon-btn email"
                            title="Send Email Invite"
                            onClick={() => handleEmailInvite(m.email, activeGroupModal.name)}
                          >
                            <FiMail /> Email
                          </button>
                        )}
                        <span className="role-tag">{m.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shared Conversations Section */}
              <div className="detail-section">
                <h3><FiMessageSquare /> Shared Chat Conversations ({activeGroupModal.sharedChats?.length || 0})</h3>

                {activeGroupModal.sharedChats?.length > 0 ? (
                  <div className="shared-chats-feed">
                    {activeGroupModal.sharedChats.map((chat) => (
                      <div key={chat.id} className="shared-chat-card">
                        <div className="shared-chat-head">
                          <strong>Q: {chat.question}</strong>
                          <span className="shared-by-tag">Shared by {chat.sharedBy}</span>
                        </div>
                        <div className="shared-chat-body">
                          <FormattedResponse content={chat.answer} />
                        </div>
                        <span className="shared-date"><FiClock /> {formatDate(chat.sharedAt)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-feed-hint">No chats shared to this group yet. Use the "Share" button on any chat answer to send it here!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddMemberModal && activeGroupModal && (
        <div className="groups-modal-overlay" onClick={() => setShowAddMemberModal(false)}>
          <div className="groups-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="groups-modal-header">
              <h2>Add Member to {activeGroupModal.name}</h2>
              <button className="close-modal-btn" onClick={() => setShowAddMemberModal(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit} className="groups-form">
              <div className="form-group">
                <label>Member Name</label>
                <input
                  type="text"
                  placeholder="Enter collaborator name..."
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="collaborator@example.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>WhatsApp Phone Number</label>
                <input
                  type="text"
                  placeholder="+919876543210"
                  value={newMemberPhone}
                  onChange={(e) => setNewMemberPhone(e.target.value)}
                />
              </div>

              <div className="groups-modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowAddMemberModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
