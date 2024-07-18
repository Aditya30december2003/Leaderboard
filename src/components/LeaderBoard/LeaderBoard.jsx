import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Leaderboard.css';
import footerImage1 from '../../assets/footer-image.png';
import footerImage2 from '../../assets/footer-image2.webp';
import footerImage3 from '../../assets/footer-image3.png'; 
import Navbar from '../../assets/Navbar.svg';
import { FaTrophy } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', time: '' });
  const [lastAddedUser, setLastAddedUser] = useState(null);
  const tableRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (lastAddedUser) {
      const userRow = document.getElementById(`user-${lastAddedUser.id}`);
      if (userRow) {
        userRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        userRow.classList.add('highlight');
        setTimeout(() => userRow.classList.remove('highlight'), 3000);
      }
    }
  }, [lastAddedUser]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://662f463e43b6a7dce30eeb70.mockapi.io/users');
      const sortedUsers = response.data.sort((a, b) => {
        const timeToSeconds = (time) => {
          const [minutes, seconds, milliseconds] = time.split(':').map(Number);
          return minutes * 60 + seconds + milliseconds / 1000;
        };
        return timeToSeconds(a.time) - timeToSeconds(b.time);
      });
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://662f463e43b6a7dce30eeb70.mockapi.io/users', newUser);
      setNewUser({ name: '', time: '' });
      await fetchUsers();
      setLastAddedUser(response.data);
      setIsPopupOpen(false);
    } catch (error) {
      console.error('Error adding new user:', error);
    }
  };

  const getCashMoney = (index) => {
    switch(index) {
      case 0: return '₹50000';
      case 1: return '₹5000';
      case 2: return '₹500';
      default: return '';
    }
  };

  return (
    <>
      <div className="app-container">
        <nav className="navbar">
          <div className="navbar-logo">Gillys Koramangla</div>
          <ul className="navbar-links">
            <li><img src={Navbar} href="#home" alt="Navbar" /></li>
          </ul>
        </nav>
        <div className="leaderboard-container">
          <h1 className='title'>FASTEST OF TODAY</h1>
          <div className="leaderboard">
            <table ref={tableRef}>
              <thead>
                <tr>
                  <th className='name'>
                    <FaTrophy/>
                  </th>
                  <th className='name'>NAME</th>
                  <th>PRIZE</th>
                  <th className='time'>
                    <IoIosTimer/>
                    TIME
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} id={`user-${user.id}`} className={index < 3 ? `top-${index + 1}` : ''}>
                    <td className='table-content'>{index + 1}</td>
                    <td className='table-content'>{user.name}</td>
                    <td>{getCashMoney(index)}</td>
                    <td className='table-content'>{user.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="add-score">
            <h2 className='header2'>Add Score</h2>
            <form onSubmit={handleSubmit}>
              <div className='form1'>
                <input
                  className='input'
                  type="text"
                  placeholder="Username"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
                <input
                  className='input'
                  type="text"
                  placeholder="Time (HH:MM:SS:MSS)"
                  value={newUser.time}
                  onChange={(e) => setNewUser({ ...newUser, time: e.target.value })}
                />
              </div>
              <button className='submit' type="submit">Add Score</button>
            </form>
          </div>
        </div>
        <div className="footer">
          <div className="footer-image-wrapper">
            <img src={footerImage1} alt="Footer 1" className="footer-image" />
            <img src={footerImage2} alt="Footer 2" className="footer-image" />
            <img src={footerImage3} alt="Footer 3" className="footer-image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;

