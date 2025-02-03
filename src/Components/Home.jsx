import { useNavigate  } from 'react-router-dom'; // Import useNavigate hook
import Navbar from './Navbar'; // Import Navbar component
import './home.module.css'; // Import the CSS file for the font and logo styling

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Handle button click to navigate to login page
  const handleClick = () => {
    navigate('/login'); // Navigate to login page
  };

  return (
    <div>
      <Navbar />
      {/* Project Name Logo */}
      <h1>Welcome to the Home Page</h1>
      <button onClick={handleClick}>Go to Login</button>
    </div>
  );
};

export default Home;
