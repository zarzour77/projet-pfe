// import { useNavigate  } from 'react-router-dom'; // Import useNavigate hook
import Navbar from './Navbar'; // Import Navbar component
import styles from './Home.module.css'; // Import the CSS file for the font and logo styling

const Home = () => {
 
  return (
    <div className={styles.customBackground}>
      <Navbar />
      {/* Project Name Logo */}
      <h1>Welcome to the Home Page</h1>
    </div>
  );
};

export default Home;
