/* eslint-disable react/no-unescaped-entities */
import  { useState } from 'react';
import styles from './AddCollaborator.module.css';

const AddCollaborator = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  const [extractedData, setExtractedData] = useState(null);

  // Step 1: Handle basic collaborator info submission
  const handleUserDataSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // Update user data on input change
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  // Step 2: Simulate CV upload and extraction
  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulated API response with static data
      const staticData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        skills: 'JavaScript, React, Node.js',
        experience: '3 years',
      };
      setExtractedData(staticData);
    }
  };

  // Update extracted data on input change
  const handleExtractedChange = (e) => {
    setExtractedData({
      ...extractedData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.container}>
      {step === 1 && (
        <form className={styles.userForm} onSubmit={handleUserDataSubmit}>
          <h2>Add Collaborator</h2>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={userData.name}
              onChange={handleChange}
              placeholder="Enter collaborator's name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Enter collaborator's email"
              required
            />
          </div>
          <button type="submit" className={styles.btn}>
            Next
          </button>
        </form>
      )}

      {step === 2 && (
        <div className={styles.cvImport}>
          <h2>Import Freelancer's CV</h2>
          {/* Hidden file input; label acts as a button */}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleCvUpload}
            style={{ display: 'none' }}
            id="cvUpload"
          />
          <label htmlFor="cvUpload" className={styles.btn}>
            Import CV
          </label>

          {extractedData && (
            <div className={styles.extractedData}>
              <h3>Extracted Information</h3>
              <div className={styles.formGroup}>
                <label htmlFor="extractedName">Name:</label>
                <input
                  type="text"
                  name="name"
                  id="extractedName"
                  value={extractedData.name || ''}
                  onChange={handleExtractedChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="extractedEmail">Email:</label>
                <input
                  type="email"
                  name="email"
                  id="extractedEmail"
                  value={extractedData.email || ''}
                  onChange={handleExtractedChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="skills">Skills:</label>
                <input
                  type="text"
                  name="skills"
                  id="skills"
                  value={extractedData.skills || ''}
                  onChange={handleExtractedChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="experience">Experience:</label>
                <input
                  type="text"
                  name="experience"
                  id="experience"
                  value={extractedData.experience || ''}
                  onChange={handleExtractedChange}
                />
              </div>
              <button
                className={styles.btn}
                onClick={() => alert("Collaborator added successfully!")}
              >
                Save Collaborator
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddCollaborator;
