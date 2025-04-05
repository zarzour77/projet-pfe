import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Admindispute.module.css';
import { getAllDisputes, updateDisputeStatus, updateAdminResponse } from '../services/AdminDisputeService';

// Fonction utilitaire pour extraire le MIME type d'une data URL
const getMimeType = (dataUrl) => {
  const match = dataUrl.match(/^data:(.*?);/);
  return match ? match[1] : '';
};

// Fonction qui retourne une icône en fonction du MIME type
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
        <path d="M4.5 0A1.5 1.5 0 0 0 3 1.5v13A1.5 1.5 0 0 0 4.5 16h7A1.5 1.5 0 0 0 13 14.5V4.121a1.5 1.5 0 0 0-.44-1.06L10.94.44A1.5 1.5 0 0 0 9.88 0H4.5zM9 1.5L12.5 5H9V1.5zM5 7h6v1H5V7zm0 2h6v1H5V9z" />
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
    // Icône générique pour les autres types
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

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const data = await getAllDisputes();
      console.log("Tickets récupérés depuis le back :", data);
      setDisputes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des litiges :", error);
    }
  };

  const handleSelectDispute = (dispute) => {
    console.log("Ticket sélectionné :", dispute);
    setSelectedDispute(dispute);
    setAdminResponse(dispute.adminResponse || "");
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const updated = await updateDisputeStatus(id, status);
      console.log(`Mise à jour du ticket ${id} avec le statut ${status} :`, updated);
      setDisputes(disputes.map(d => d.id === id ? updated : d));
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
        const updated = await updateAdminResponse(selectedDispute.id, adminResponse, selectedDispute.status);
        console.log("Réponse de l'admin mise à jour pour le ticket :", updated);
        setDisputes(disputes.map(d => d.id === selectedDispute.id ? updated : d));
        setSelectedDispute(updated);
        alert("Réponse envoyée !");
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la réponse admin :", error);
      }
    }
  };

  // Fonction utilitaire pour formater la transaction
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

  const formattedTransaction = selectedDispute && selectedDispute.paymentTransaction
    ? formatTransaction(selectedDispute.paymentTransaction)
    : null;

  // Ouvre la preview PDF dans un modal
  const handlePdfPreview = (pdfData) => {
    setPdfPreviewEvidence(pdfData);
    setShowPdfModal(true);
  };

  // Rendu du modal PDF via React Portal pour l'affichage au-dessus
  const pdfModal = showPdfModal
    ? ReactDOM.createPortal(
        <div className={styles.modalOverlay}>
          <div className={styles.pdfModal}>
            <button onClick={() => setShowPdfModal(false)} className={styles.closeModalButton}>
              &times;
            </button>
            <iframe
              src={pdfPreviewEvidence}
              title="PDF Preview"
              className={styles.pdfIframe}
            />
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestion des Litiges</h1>
      <div className={styles.content}>
        {/* Panneau gauche : Liste des tickets */}
        <div className={styles.leftPanel}>
          <h2>Liste des tickets</h2>
          <div className={styles.ticketList}>
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className={`${styles.ticketItem} ${selectedDispute && selectedDispute.id === dispute.id ? styles.activeTicket : ""}`}
                onClick={() => handleSelectDispute(dispute)}
              >
                <p><strong>{dispute.subject}</strong></p>
                <p className={styles.ticketDate}>
                  Créé le : {new Date(dispute.createdAt).toLocaleDateString()}
                </p>
                {dispute.adminResponse ? (
                  <p className={styles.responseStatus}>Répondu</p>
                ) : (
                  <p className={styles.responseStatus}>En attente</p>
                )}
                <div className={styles.statusButtons}>
                  <button
                    className={styles.statusButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(dispute.id, "IN_PROGRESS");
                    }}
                  >
                    en cours
                  </button>
                  <button
                    className={styles.statusButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(dispute.id, "RESOLVED");
                    }}
                  >
                    terminé
                  </button>
                  <button
                    className={styles.statusButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(dispute.id, "CLOSED");
                    }}
                  >
                    fermé
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Panneau droit : Détails du ticket et réponse */}
        <div className={styles.rightPanel}>
          {selectedDispute ? (
            <div className={styles.disputeDetail}>
              <h2>Détails du ticket</h2>
              <p>
                <strong>Sujet :</strong> {selectedDispute.subject}
              </p>
              <p className={styles.detailDescription}>
                <strong>Description :</strong>
                <br />
                {selectedDispute.description}
              </p>
              <div className={styles.detailEvidence}>
                <strong>Preuve :</strong>
                <br />
                {selectedDispute.evidence.startsWith("data:image") ? (
                  <img
                    src={selectedDispute.evidence}
                    alt="Preuve"
                    className={styles.evidenceImage}
                    onClick={() => window.open(selectedDispute.evidence, '_blank')}
                    style={{ cursor: 'pointer' }}
                  />
                ) : selectedDispute.evidence.startsWith("data:application/pdf") ? (
                  <div
                    onClick={() => handlePdfPreview(selectedDispute.evidence)}
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                  >
                    {getFileIcon("application/pdf")}
                  </div>
                ) : (
                  <div
                    onClick={() => window.open(selectedDispute.evidence, '_blank')}
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                  >
                    {getFileIcon(getMimeType(selectedDispute.evidence))}
                  </div>
                )}
              </div>
              <div className={styles.detailTransaction}>
                <strong>Transaction associée :</strong>
                <p>
                  {formattedTransaction ? (
                    <>
                      {formattedTransaction.type} – {formattedTransaction.statut} <br />
                      Date : {formattedTransaction.date} <br />
                      Montant : {formattedTransaction.montant} {formattedTransaction.currency}
                    </>
                  ) : (
                    <>
                      – <br />
                      Date : – <br />
                      Montant : – USD
                    </>
                  )}
                </p>
              </div>
              <div className={styles.detailResponse}>
                <strong>Réponse de l'admin :</strong>
                <form onSubmit={handleResponseSubmit} className={styles.responseForm}>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    placeholder="Entrez votre réponse ici..."
                    required
                  />
                  <button type="submit" className={styles.submitResponseButton}>
                    Envoyer la réponse
                  </button>
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
      {pdfModal}
    </div>
  );
};

export default AdminDispute;
