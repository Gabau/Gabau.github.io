// MoonSunToggle.jsx
import { useContext } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import ThemeContext from '../context/ThemeContext';

const MoonSunToggle = () => {
  const  {theme, setTheme} = useContext(ThemeContext);

  const toggleMode = () => {
    if (theme === 'light') {
        setTheme('dark');
    } else {
        setTheme('light');
    }
  };

  return (
    <button
      onClick={toggleMode}
      className="flex items-center justify-center w-16 h-8 bg-white dark:bg-gray-950 rounded-full p-1 transition-colors duration-300 focus:outline-none"
    >

      <div
        className={`flex flex-center items-center justify-center w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full shadow-md transform transition-transform duration-300 ${
          theme === 'dark' ? '-translate-x-3' : 'translate-x-3'
        }`}
      >
      {theme === 'dark' ? (
        <FaMoon className="text-white" />
      ) : (
        <FaSun className="text-yellow-400" />
      )}

      </div>
    </button>
  );
};

export default MoonSunToggle;
