import fetch from 'node-fetch';
import 'dotenv/config';

(async () => {
  try {
    const response = await fetch(macho-dragon.pikapod.net/api/server-info, {
      headers: {
        'Authorization': `Bearer ${process.env.PASSWORD}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Server Response:', data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})();
