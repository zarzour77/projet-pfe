/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from 'react';
import styles from './Admindispute.module.css';
import {
  getAllDisputes,
  updateDisputeStatus,
  updateAdminResponse,
  transferFunds
} from '../services/AdminDisputeService';
import ConsultantService from '../Services/ConsultantService';
import EntrepriseService from '../Services/EntrepriseService';
import UserService from '../Services/UserService';
// Utility function: extract MIME type from a data URL
const getMimeType = (dataUrl) => {
  const match = dataUrl.match(/^data:(.*?);/);
  return match ? match[1] : '';
};

// Return an appropriate icon based on MIME type
const getFileIcon = (mimeType) => {
  if (mimeType.includes('pdf')) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        fill="currentColor"
        className={styles.pdfIcon}
        viewBox="0 0 16 16"
      >
        <path d="M4.879 1.707a1 1 0 0 1 1.414 0l.853.854H11a1 1 0 0 1 1 1v2H4V2a1 1 0 0 1 .879-.293z" />
        <path d="M14 4v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4h12zm-2 9V5H4v8a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1z" />
        <path fillRule="evenodd" d="M5.5 7a.5.5 0 0 1 .5.5V9h.5a.5.5 0 0 1 .5.5v2H8v-2h.5a.5.5 0 0 1 .5-.5V9h.5a.5.5 0 0 1 .5-.5V7h-4z" />
      </svg>
    );
  } else if (mimeType.includes('word')) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        fill="currentColor"
        className={styles.fileIcon}
        viewBox="0 0 16 16"
      >
        <path d="M4.5 0A1.5 1.5 0 0 0 3 1.5v13A1.5 1.5 0 0 0 4.5 16h7A1.5 1.5 0 0 0 13 14.5V4.121a1 1 0 0 0-.44-1.06L10.94.44A1.5 1.5 0 0 0 9.88 0H4.5zM9 1.5L12.5 5H9V1.5zM5 7h6v1H5V7zm0 2h6v1H5V9z" />
      </svg>
    );
  } else if (mimeType.includes('excel')) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        fill="currentColor"
        className={styles.fileIcon}
        viewBox="0 0 16 16"
      >
        <path d="M4.5 0A1.5 1.5 0 0 0 3 1.5v13A1.5 1.5 0 0 0 4.5 16h7A1.5 1.5 0 0 0 13 14.5V4.121a1.5 1.5 0 0 0-.44-1.06L10.94.44A1.5 1.5 0 0 0 9.88 0H4.5zm6 1.5L12.5 5H10V1.5zM5 7h1v1H5V7zm2 0h1v1H7V7zm2 0h1v1h-1V7zM5 9h1v1H5V9zm2 0h1v1H7V9zm2 0h1v1h-1V9z" />
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        fill="currentColor"
        className={styles.fileIcon}
        viewBox="0 0 16 16"
      >
        <path d="M4.5 0A1.5 1.5 0 0 0 3 1.5v13A1.5 1.5 0 0 0 4.5 16h7A1.5 1.5 0 0 0 13 14.5V1.5A1.5 1.5 0 0 0 11.5 0h-7zM4 1.5A.5.5 0 0 1 4.5 1h7a.5.5 0 0 1 .5.5V2H4v-.5zM4 3h8v10.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5V3z" />
      </svg>
    );
  }
};

const AdminDispute = () => {
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfPreviewEvidence, setPdfPreviewEvidence] = useState("");
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [selectedTransferDispute, setSelectedTransferDispute] = useState(null);

  // State for entreprises for the select element
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState("");

  // Fetch entreprises when transfer modal opens
  // Fetch transfer options when transfer modal opens
  useEffect(() => {
    if (showTransferModal) {
      const fetchTransferOptions = async () => {
        try {
          let rawData;
          
          // Use uppercase 'Entreprise' to match database value
          if (selectedTransferDispute?.sender?.role === 'Entreprise') {
            rawData = await ConsultantService.getAllConsultants();
          } else {
            rawData = await EntrepriseService.getAllEntreprises();
          }
  
          const validOptions = rawData.map(entity => ({
            id: entity.id,
            name: selectedTransferDispute?.sender?.role === 'Entreprise'
              ? `${entity.prenom || ''} ${entity.nom || ''}`.trim() 
              : entity.nomEntreprise || entity.nom
          })).sort((a, b) => a.name.localeCompare(b.name));
  
          setEntreprises(validOptions);
        } catch (error) {
          console.error("Error fetching transfer options:", error);
          setEntreprises([]);
        }
      };
      fetchTransferOptions();
    }
  }, [showTransferModal, selectedTransferDispute]);

  useEffect(() => {
    fetchDisputes();
  }, []);

  // Fetch disputes and update sender info if needed
  const fetchDisputes = async () => {
    try {
      const data = await getAllDisputes();
      const updatedDisputes = await Promise.all(
        data.map(async (dispute) => {
          if (typeof dispute.sender === 'number') {
            try {
              // First get basic user info to check role
              const user = await UserService.getById(dispute.sender);
              
              // Then fetch full profile based on role
              let fullProfile;
              if (user.role === 'Consultant') {
                fullProfile = await ConsultantService.getConsultantById(dispute.sender);
              } else if (user.role === 'Entreprise') {
                fullProfile = await EntrepriseService.getEntrepriseById(dispute.sender);
              }
              
              // Merge basic user info with role-specific data
              dispute.sender = { ...user, ...fullProfile };
            } catch (error) {
              console.error(`Error fetching sender ID ${dispute.sender}:`, error);
            }
          }
          return dispute;
        })
      );
      setDisputes(updatedDisputes);
    } catch (error) {
      console.error("Erreur lors de la récupération des litiges :", error);
    }
  };

  const handleSelectDispute = (dispute) => {
    setSelectedDispute(dispute);
    setAdminResponse(dispute.adminResponse || "");
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const updated = await updateDisputeStatus(id, status);
      setDisputes(disputes.map((d) => (d.id === id ? updated : d)));
      if (selectedDispute && selectedDispute.id === id) {
        setSelectedDispute(updated);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut :", error);
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (selectedDispute) {
      try {
        const updated = await updateAdminResponse(
          selectedDispute.id,
          adminResponse,
          selectedDispute.status
        );
        setDisputes(disputes.map((d) => (d.id === selectedDispute.id ? updated : d)));
        setSelectedDispute(updated);
        alert("Réponse envoyée !");
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la réponse admin :", error);
      }
    }
  };

  const handleFundTransfer = async () => {
    if (!selectedTransferDispute || !transferAmount || !selectedEntreprise) return;
    
    try {
      const isSenderEntreprise = selectedTransferDispute.sender?.role === 'Entreprise';
      console.log("ss",selectedTransferDispute.sender)
  
      await transferFunds({
        disputeId: selectedTransferDispute.id,
        amount: parseFloat(transferAmount),
        payerId: isSenderEntreprise 
          ? parseInt(selectedEntreprise)      // From selected consultant
          : parseInt(selectedEntreprise),     // From selected entreprise
        payeeId: isSenderEntreprise 
          ? selectedTransferDispute.sender.id // To entreprise (victim)
          : selectedTransferDispute.sender.id,// To consultant (victim)
        payerType: isSenderEntreprise ? 'CONSULTANT' : 'ENTREPRISE'
      });
  
      alert("Transfert effectué avec succès!");
      setShowTransferModal(false);
      setTransferAmount("");
      setSelectedEntreprise("");
      fetchDisputes();
    } catch (error) {
      console.error("Erreur lors du transfert:", error);
      alert(`Erreur: ${error.response?.data?.message || error.message}`);
    }
  };

  const formatTransaction = (tx) => {
    if (!tx) return null;
    return {
      type: tx.paymentType === 'Subscription' ? 'Abonnement' : tx.paymentType,
      statut: (tx.status === 'succeeded' || tx.status === 'PROCESSED') ? 'Réussi' : 'Échoué',
      date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('fr-FR') : "–",
      montant: tx.amount ? (tx.amount / 100).toFixed(2) : "–",
      currency: tx.currency || "USD"
    };
  };

  const formattedTransaction =
    selectedDispute && selectedDispute.paymentTransaction
      ? formatTransaction(selectedDispute.paymentTransaction)
      : null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestion des Litiges</h1>
      <div className={styles.content}>
        {/* Left panel: list of tickets */}
        <div className={styles.leftPanel}>
          <h2>Liste des litiges</h2>
          <div className={styles.ticketList}>
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className={`${styles.ticketItem} ${selectedDispute && selectedDispute.id === dispute.id ? styles.activeTicket : ''}`}
                onClick={() => handleSelectDispute(dispute)}
              >
                <div className={`${styles.statusBadge} ${
                    dispute.status === 'OPEN'
                      ? styles.statusPending
                      : dispute.status === 'IN_PROGRESS'
                      ? styles.statusInProgress
                      : dispute.status === 'RESOLVED'
                      ? styles.statusResolved
                      : styles.statusClosed
                  }`}>
                  {dispute.status === 'OPEN' && 'En attente'}
                  {dispute.status === 'IN_PROGRESS' && 'En cours'}
                  {dispute.status === 'RESOLVED' && 'Résolu'}
                  {dispute.status === 'CLOSED' && 'Refusé'}
                </div>
                <p><strong>{dispute.subject}</strong></p>
                {dispute.sender && typeof dispute.sender === 'object' ? (
  <p className={styles.senderInfo}>
    <strong>De : </strong> 
    {dispute.sender.role === 'Entreprise'
      ? dispute.sender.nomEntreprise
      : `${dispute.sender.prenom || ''} ${dispute.sender.nom || ''}`
    }
  </p>
) : (
  <p className={styles.senderInfo}><strong>De :</strong> Inconnu</p>
)}
                <p className={styles.ticketDate}>
                  Créé le : {new Date(dispute.createdAt).toLocaleDateString()} par (dispute.sender)
                </p>
                {dispute.adminResponse ? (
                  <p className={styles.responseStatus}>Répondu</p>
                ) : (
                  <p className={styles.responseStatus}>En attente</p>
                )}
                <div className={styles.statusButtons}>
                  <button className={styles.statusButton} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(dispute.id, 'IN_PROGRESS'); }}>En cours</button>
                  <button className={styles.statusButton} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(dispute.id, 'RESOLVED'); }}>Terminer</button>
                  <button className={styles.statusButton} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(dispute.id, 'CLOSED'); }}>Refuser</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Right panel: detailed view and admin response */}
        <div className={styles.rightPanel}>
          {selectedDispute ? (
            <div className={styles.disputeDetail}>
              <h2>Détails du litige</h2>
              <p><strong>Sujet :</strong> {selectedDispute.subject}</p>
              {selectedDispute.sender && typeof selectedDispute.sender === 'object' ? (
                <p className={styles.senderInfo}><strong>De :</strong> {selectedDispute.sender.prenom} {selectedDispute.sender.nom}</p>
              ) : (
                <p className={styles.senderInfo}><strong>De :</strong> Inconnu</p>
              )}
              <p className={styles.detailDescription}><strong>Description :</strong><br />{selectedDispute.description}</p>
              <div className={styles.detailEvidence}>
                <strong>Preuve :</strong><br />
                {selectedDispute.evidence.startsWith('data:image') ? (
                  <img src={selectedDispute.evidence} alt="Preuve" className={styles.evidenceImage} onClick={() => window.open(selectedDispute.evidence, '_blank')} style={{ cursor: 'pointer' }} />
                ) : selectedDispute.evidence.startsWith('data:application/pdf') ? (
                  <div onClick={() => { setPdfPreviewEvidence(selectedDispute.evidence); setShowPdfModal(true); }} style={{ cursor: 'pointer', display: 'inline-block' }}>
                    {getFileIcon('application/pdf')}
                  </div>
                ) : (
                  <div onClick={() => window.open(selectedDispute.evidence, '_blank')} style={{ cursor: 'pointer', display: 'inline-block' }}>
                    {getFileIcon(getMimeType(selectedDispute.evidence))}
                  </div>
                )}
              </div>
              <div className={styles.detailTransaction}>
                <strong>Transaction associée :</strong>
                <p>
                  {formattedTransaction ? (
                    <>
                      {formattedTransaction.type} – {formattedTransaction.statut}<br />
                      Date : {formattedTransaction.date}<br />
                      Montant : {formattedTransaction.montant} {formattedTransaction.currency}
                    </>
                  ) : (
                    <>
                      –<br />Date : –<br />Montant : – USD
                    </>
                  )}
                </p>
              </div>
              {/* "Résoudre le paiement" button appears above the admin response */}
              {selectedDispute.subject === 'Problème de paiement' && (
                <div className={styles.detailActions}>
                  <button className={styles.resolveButton} onClick={() => { setSelectedTransferDispute(selectedDispute); setShowTransferModal(true); }}>
                    Résoudre le paiement
                  </button>
                </div>
              )}
              <div className={styles.detailResponse}>
                <strong>Réponse de l'admin :</strong>
                <form onSubmit={handleResponseSubmit} className={styles.responseForm}>
                  <textarea value={adminResponse} onChange={(e) => setAdminResponse(e.target.value)} placeholder="Entrez votre réponse ici..." required />
                  <button type="submit" className={styles.submitResponseButton}>Envoyer la réponse</button>
                </form>
              </div>
            </div>
          ) : (
            <div className={styles.noSelection}>
              <p>Veuillez sélectionner un ticket pour voir les détails.</p>
            </div>
          )}
        </div>
      </div>
      {/* Inline PDF Modal */}
      {showPdfModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.pdfModal}>
            <button onClick={() => setShowPdfModal(false)} className={styles.closeModalButton}>&times;</button>
            <iframe src={pdfPreviewEvidence} title="PDF Preview" className={styles.pdfIframe} />
          </div>
        </div>
      )}
      {/* Inline Transfer Modal */}
      {showTransferModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.transferModal}>
      <button className={styles.modalCloseBtn} onClick={() => setShowTransferModal(false)}>
        &times;
      </button>
      <h3>Résolution du litige de paiement</h3>

      {/* Dynamic Select Section */}
      <div className={styles.selectSection}>
        <label>
          {selectedTransferDispute?.sender?.role === 'Entreprise' 
            ? 'Consultant payeur' 
            : 'Entreprise payeuse'}
        </label>
        <select
          value={selectedEntreprise}
          onChange={(e) => setSelectedEntreprise(e.target.value)}
        >
          <option value="">-- Sélectionnez --</option>
          {entreprises.map((ent) => (
            <option key={ent.id} value={ent.id}>
              {ent.name}
            </option>
          ))}
        </select>
      </div>

      {/* Transfer Direction Display */}
      <div className={styles.transferDetails}>
        <p>
          <strong>Transfert :</strong> 
          De {selectedEntreprise 
            ? entreprises.find(e => e.id === parseInt(selectedEntreprise))?.name 
            : '...'} 
          {' → '}
          {selectedTransferDispute?.sender?.role === 'Entreprise'
            ? selectedTransferDispute.sender.nomEntreprise
            : `${selectedTransferDispute?.sender?.prenom} ${selectedTransferDispute?.sender?.nom}`}
        </p>
      </div>

      {/* Amount Input */}
      <div className={styles.amountInput}>
        <label>Montant à transférer (en euros) :</label>
        <input
          type="number"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          placeholder="Entrez le montant"
          min="0"
          step="0.01"
        />
      </div>

      <div className={styles.modalActions}>
        <button 
          onClick={handleFundTransfer} 
          className={styles.confirmButton} 
          disabled={!selectedEntreprise || !transferAmount}
        >
          Confirmer le transfert
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminDispute;
