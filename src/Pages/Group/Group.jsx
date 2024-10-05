
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Group.css';
import { toast } from "react-toastify";

function Group() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [selectedGroup, setSelectedGroup] = useState();
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]); // État pour les fichiers
  const [newMessage, setNewMessage] = useState('');
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [file, setFile] = useState(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  // const [uniqueGroup, setUniqueGroup] = useState([]);

  const navigate = useNavigate();


  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Non authentifié. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/groups', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setGroups(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        navigate("/login");
      }
    }
  };

  const handleGroupSelect = async (group) => {
    setSelectedGroup(group);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Non authentifié. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    try {
      // Récupération des messages et fichiers du groupe
      const response = await axios.get(`http://127.0.0.1:8000/api/getGroups`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      const groupData = response.data.find(g => g.id === group.id);

      if (groupData) {
        const { messages = [], fichiers = [] } = groupData;

        const formattedMessages = messages.map(message => ({
          id: message.id,
          text: message.text,
          uploadedBy: message.name
        }));

        const formattedFiles = fichiers.map(fichier => ({
          id: fichier.id,
          filePath: fichier.file_path,
          uploadedBy: fichier.uploaded_by || 'Inconnu'
        }));

        setMessages(formattedMessages);
        setFiles(formattedFiles);
      } else {
        setMessages([]);
        setFiles([]);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages et fichiers:", error);
      toast.error("Erreur lors de la récupération des messages et fichiers.");
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '' && !file) return;

    const uploadedFileUrl = file ? await uploadFile(file) : null;
    const userName = localStorage.getItem("userName");

    const messageToSend = {
      id: messages.length + 1,
      text: newMessage,
      file: uploadedFileUrl,
      uploadedBy: userName
    };

    setMessages([...messages, messageToSend]);
    setNewMessage('');
    setFile(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    const token = localStorage.getItem("token");
    if (!file || !selectedGroup || !token) return;

    const formData = new FormData();
    formData.append('file_name', file);
    formData.append('groupe_id', selectedGroup.id);

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/files`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}`
          }
        }
      );
      const { file_name, uploaded_by } = response.data.fichier;
      return { file_name, uploaded_by };
    } catch (error) {
      console.error("Erreur lors de l'upload du fichier:", error);
      return null;
    }
  };


  const inviteUserToGroup = async () => {
    const token = localStorage.getItem("token");

    if (!inviteName || !inviteEmail || !selectedGroup || !token) {
      alert("Veuillez entrer un nom, un email et sélectionner un groupe.");
      return;
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/groups/${selectedGroup.id}/members`,  // URL d'invitation avec groupId
        {
          name: inviteName,
          email: inviteEmail,
          groupe_id: selectedGroup.id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          }
        }
      );

      alert(`Invitation envoyée à ${inviteEmail}`);
      setInviteName('');
      setInviteEmail('');
    } catch (error) {
      if (error.response && error.response.status === 422) {
        alert("Cet email a déjà été invité.");
      } else {
        console.error("Erreur lors de l'invitation de l'utilisateur:", error);
        alert("Erreur lors de l'envoi de l'invitation.");
      }
    }
  };

  // Fonction pour afficher le contenu d'un fichier en fonction de son type
  const renderFileContent = (file) => {
    const fileExtension = file.filePath.split('.').pop().toLowerCase();

    if (['png', 'jpg', 'jpeg', 'gif'].includes(fileExtension)) {
      // Afficher une image
      return <img src={"http://127.0.0.1:8000/storage/" + file.filePath} alt="Fichier Image" style={{ maxWidth: '200px' }} />;
    } else if (['txt'].includes(fileExtension)) {
      // Lire et afficher un fichier texte
      return <pre>{fetchTextFileContent("http://127.0.0.1:8000/storage/" + file.filePath)}</pre>;
    } else if (['pdf'].includes(fileExtension)) {
      // Lien pour télécharger ou visualiser le PDF
      return <a href={"http://127.0.0.1:8000/storage/" + file.filePath} target="_blank" rel="noopener noreferrer">Ouvrir PDF</a>;
    } else {
      // Autres types de fichiers - lien de téléchargement
      return <a href={"http://127.0.0.1:8000/storage/" + file.filePath} download>Télécharger {file.filePath}</a>;
    }
  };

  // Fonction pour récupérer le contenu d'un fichier texte
  const fetchTextFileContent = async (filePath) => {
    try {
      const response = await axios.get(filePath);
      return response.data; // Contenu du fichier texte
    } catch (error) {
      console.error("Erreur lors de la lecture du fichier texte:", error);
      return "Impossible de lire le fichier";
    }
  };

  // Fonction pour ajouter un groupe
  const addGroup = async () => {
    if (!newGroupName || !newGroupDescription) {
      toast.error("Veuillez remplir le nom et la description du groupe.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Non authentifié. Veuillez vous connecter.");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/groups',
        { name: newGroupName, description: newGroupDescription },
        {
          headers: { "Authorization": `Bearer ${token}` }
        }
      );
      const newGroup = response.data.group;
      setGroups([...groups, newGroup]);
      setNewGroupName('');
      setNewGroupDescription('');
      setShowCreateGroupForm(false);
      toast.success("Groupe créé avec succès.");
    } catch (error) {
      console.error("Erreur lors de la création du groupe:", error);
      toast.error("Erreur lors de la création du groupe.");
    }
  };

  return (
    <div className="group-chat-container">
      {/* Left Panel - Group List */}
      <div className="group-list">
        <h2>Vos Groupes</h2>

        <button onClick={() => setShowCreateGroupForm(true)}>Créer un Groupe</button>
        <ul>
          {groups.map((group, index) => (
            <li key={group && group.id ? group.id : index} onClick={() => handleGroupSelect(group)}>
              {group && group.name ? group.name : "Nom du groupe non disponible"}
            </li>
          ))}
        </ul>


        {showCreateGroupForm && (
          <div>
            <h3>Nouveau Groupe</h3>
            <input
              type="text"
              placeholder="Nom du groupe"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description du groupe"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
            />
            <button onClick={addGroup}>Créer</button>
          </div>
        )}
      </div>

      {/* Right Panel - Selected Group Messages and Files */}
      <div className="chat-area">
        {selectedGroup ? (
          <div>
            <h3>Groupe: {selectedGroup.name}</h3>
            <h4>Messages</h4>
            <ul>
              {messages.map((message) => (
                <li key={message.id}>
                  <span>{message.uploadedBy}: {message.text}</span>
                </li>
              ))}
            </ul>

            <h4>Fichiers</h4>
            <ul>
              {files.map((file) => (
                <li key={file.id}>
                  <span>{file.uploadedBy}: {renderFileContent(file)}</span>
                </li>
              ))}
            </ul>

            {/* <input
          type="text"
          placeholder="Tapez un message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        /> */}
            <input type="file" onChange={handleFileChange} />
            <button onClick={sendMessage}>Envoyer</button>

            {/* Invite User */}
            <div className="invite-user">
              <h4>Inviter un utilisateur</h4>
              <input
                type="text"
                placeholder="Nom"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <button onClick={inviteUserToGroup}>Inviter</button>
            </div>
          </div>
        ) : (
          <p>Sélectionnez un groupe pour voir les messages</p>
        )}
      </div>
    </div>

  );
}

export default Group;
