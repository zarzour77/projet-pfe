import styles from './CollaboratorsList.module.css';

const CollaboratorsList = () => {
  // Static list of collaborators for demonstration purposes.
  const collaborators = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      skills: 'JavaScript, React, Node.js',
      experience: '3 years',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      skills: 'Python, Django, Machine Learning',
      experience: '5 years',
    },
    {
      id: 3,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      skills: 'Java, Spring Boot, Microservices',
      experience: '4 years',
    },
  ];

  return (
    <div className={styles.container}>
      <h2>Collaborators List</h2>
      <div className={styles.collaboratorsGrid}>
        {collaborators.map((collaborator) => (
          <div key={collaborator.id} className={styles.card}>
            <h3>{collaborator.name}</h3>
            <p><strong>Email:</strong> {collaborator.email}</p>
            <p><strong>Skills:</strong> {collaborator.skills}</p>
            <p><strong>Experience:</strong> {collaborator.experience}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaboratorsList;
