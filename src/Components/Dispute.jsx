import React, { useState, useEffect } from 'react';
import styles from './Dispute.module.css';
import { createDispute, getDisputesByUser } from '../services/DisputeService';
import TransactionService from '../services/TransactionService';

// Fonction utilitaire pour extraire le MIME type du data URL
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
    // Icône générique pour les autres types de fichiers
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

const Dispute = () => {
  // États pour le sujet
  const [subjectOption, setSubjectOption] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState(''); // fichier converti en base64
  const [disputes, setDisputes] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfPreviewEvidence, setPdfPreviewEvidence] = useState('');

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;

  const fetchDisputes = async () => {
    try {
      const data = await getDisputesByUser(userId);
      setDisputes(data);
    } catch (error) {
      console.error("Erreur lors du chargement des litiges :", error);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await TransactionService.getUserTransactions(userId);
      setTransactions(data);
      setLoadingTransactions(false);
    } catch (error) {
      console.error("Erreur lors du chargement des transactions :", error);
      setLoadingTransactions(false);
    }
  };

  // Conversion du fichier sélectionné en base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidence(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Utiliser customSubject si "Autre" est sélectionné, sinon subjectOption
    const finalSubject = subjectOption === 'Autre' ? customSubject : subjectOption;

    try {
      const disputeData = {
        subject: finalSubject,
        description,
        evidence,
        sender: { id: userId },
      };
      if (selectedTransaction) {
        disputeData.paymentTransaction = { id: selectedTransaction.id };
      }
      const newDispute = await createDispute(disputeData);
      setDisputes([newDispute, ...disputes]);
      // Réinitialiser les états
      setSubjectOption('');
      setCustomSubject('');
      setDescription('');
      setEvidence('');
      setSelectedTransaction(null);
      document.getElementById("evidence").value = "";
    } catch (error) {
      console.error("Erreur lors de la création du ticket :", error);
    }
  };

  const handleOpenTransactionModal = () => {
    setShowTransactionModal(true);
    fetchTransactions();
  };

  const handleTransactionSelect = (tx) => {
    setSelectedTransaction(tx);
    setShowTransactionModal(false);
  };

  // Ouvre la preview PDF dans un modal
  const handlePdfPreview = (pdfData) => {
    setPdfPreviewEvidence(pdfData);
    setShowPdfModal(true);
  };

  const formatTransaction = (tx) => {
    if (!tx) return null;
    const isAdminMissionFee = storedUser.role === "Admin" && tx.paymentType === 'MISSION_FIRST_SLICE';
    return {
      id: tx.id,
      date: new Date(tx.createdAt),
      type:
        tx.paymentType === 'Subscription'
          ? 'Abonnement'
          : tx.paymentType === 'MISSION_FIRST_SLICE'
          ? isAdminMissionFee ? 'Frais de mission' : 'Première tranche de mission'
          : tx.paymentType === 'FUND_ADDITION'
          ? 'Ajout de fonds'
          : tx.paymentType === 'FROZEN_FUNDS'
          ? 'Fonds gelés'
          : 'Mission',
      montant: tx.amount ? (tx.amount / 100).toFixed(2) : "–",
      statut: tx.paymentType === 'FROZEN_FUNDS'
          ? 'Montant gelé'
          : (tx.status === 'succeeded' || tx.status === 'PROCESSED')
          ? 'Réussi'
          : 'Échoué',
      currency: tx.currency || "–"
    };
  };

  const getAdminResponse = (dispute) => {
    return dispute.adminResponse && dispute.adminResponse.trim() !== ""
      ? dispute.adminResponse 
      : "Votre ticket est en cours de traitement par l'admin.";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mes Litiges</h1>
      <div className={styles.content}>
        {/* Partie gauche : Formulaire d'envoi */}
        <div className={styles.leftPanel}>
          <div className={styles.newDispute}>
            <h2>Envoyer un nouveau ticket</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="subject">Sujet</label>
                <select
                  id="subject"
                  value={subjectOption}
                  onChange={(e) => setSubjectOption(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="Problème de paiement">Problème de paiement</option>
                  <option value="Non-conformité du livrable">Non-conformité du livrable</option>
                  <option value="Modification unilatérale du périmètre<">Modification unilatérale du périmètre</option>
                  <option value="Problème de communication">Problème de communication</option>
                  <option value="Qualité insuffisante du travail">Qualité insuffisante du travail</option>
                  <option value="Gestion des délais">Gestion des délais</option>
                  <option value="Répartition des tâches et responsabilités">Répartition des tâches et responsabilités</option>
                  <option value="Problème avec la méthode de paiement">Problème avec la méthode de paiement</option>
                  <option value="Autre">Autre</option>
                </select>
                {subjectOption === 'Autre' && (
                  <input
                    type="text"
                    placeholder="Entrez votre sujet"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    required
                  />
                )}
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez votre problème en détail"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="evidence">Preuve (fichier ou image)</label>
                <input
                  type="file"
                  id="evidence"
                  accept="image/*,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileChange}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.transactionGroup}`}>
                <button
                  type="button"
                  className={styles.chooseTransactionButton}
                  onClick={handleOpenTransactionModal}
                >
                  Sélectionner une transaction
                </button>
                {selectedTransaction && (
                  <div className={styles.selectedTransaction}>
                    <strong>Transaction :</strong>
                    <p>
                      {selectedTransaction.type} – {selectedTransaction.statut} <br />
                      Date : {selectedTransaction.date.toLocaleDateString('fr-FR')} <br />
                      Montant : {selectedTransaction.montant} {selectedTransaction.currency}
                    </p>
                  </div>
                )}
              </div>
              <div className={styles.formGroupSubmit}>
                <button type="submit" className={styles.submitButton}>
                  Envoyer le ticket
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* Partie droite : Historique des tickets */}
        <div className={styles.rightPanel}>
          <div className={styles.ticketList}>
            <h2>Historique des tickets</h2>
            {disputes.length > 0 ? (
              disputes.map((dispute) => {
                const formattedTransaction = formatTransaction(dispute.paymentTransaction);
                return (
                  <div key={dispute.id} className={styles.ticket}>
                    <p>
                      <strong>Sujet :</strong> {dispute.subject}
                    </p>
                    <p className={styles.ticketDescription}>
                      <strong>Description :</strong><br />
                      {dispute.description}
                    </p>
                    {formattedTransaction && (
                      <div className={styles.ticketTransaction}>
                        <strong>Transaction associée :</strong>
                        <p>
                          {formattedTransaction.type} – {formattedTransaction.statut} <br />
                          Date : {formattedTransaction.date.toLocaleDateString('fr-FR')} <br />
                          Montant : {formattedTransaction.montant} {formattedTransaction.currency}
                        </p>
                      </div>
                    )}
                    {dispute.evidence && (
                      <div className={styles.ticketEvidence}>
                        <strong>Preuve :</strong>
                        <br />
                        {dispute.evidence.startsWith("data:image") ? (
                          <img
                            src={dispute.evidence}
                            alt="Preuve"
                            className={styles.evidenceImage}
                            onClick={() => window.open(dispute.evidence, '_blank')}
                            style={{ cursor: 'pointer' }}
                          />
                        ) : dispute.evidence.startsWith("data:application/pdf") ? (
                          <div
                            onClick={() => handlePdfPreview(dispute.evidence)}
                            style={{ cursor: 'pointer', display: 'inline-block' }}
                          >
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
                          </div>
                        ) : (
                          <div
                            onClick={() => window.open(dispute.evidence, '_blank')}
                            style={{ cursor: 'pointer', display: 'inline-block' }}
                          >
                            {getFileIcon(getMimeType(dispute.evidence))}
                          </div>
                        )}
                      </div>
                    )}
                    <p className={styles.ticketDate}>Créé le : {dispute.createdAt}</p>
                    <div className={styles.ticketResponse}>
                      <strong>Réponse de l'admin :</strong>
                      <p>{getAdminResponse(dispute)}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Aucun ticket trouvé.</p>
            )}
          </div>
        </div>
      </div>

      {showTransactionModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Sélectionnez une transaction</h3>
            {loadingTransactions ? (
              <p>Chargement des transactions...</p>
            ) : transactions.length > 0 ? (
              <div className={styles.transactionsList}>
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className={styles.transactionRow}
                    onClick={() => handleTransactionSelect(tx)}
                  >
                    <span>{tx.date.toLocaleDateString('fr-FR')}</span>
                    <span>{tx.type}</span>
                    <span>{tx.montant} {tx.currency}</span>
                    <span className={tx.statut === 'Réussi' ? styles.successStatus : styles.errorStatus}>
                      {tx.statut}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucune transaction trouvée.</p>
            )}
            <div className={styles.modalActions}>
              <button type="button" onClick={() => setShowTransactionModal(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {showPdfModal && (
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
        </div>
      )}
    </div>
  );
};

export default Dispute;
