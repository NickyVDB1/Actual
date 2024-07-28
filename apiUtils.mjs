import actualAPI from '@actual-app/api';

export async function initializeAPI() {
  try {
    await actualAPI.init({
      dataDir: process.env.DATA_DIR,
      serverURL: process.env.SERVER_URL,
      password: process.env.PASSWORD,
    });
  } catch (error) {
    console.error('Error initializing API:', error);
    throw new Error('Error initializing API: ' + error.message);
  }
}

export async function shutdownAPI() {
  try {
    await actualAPI.shutdown();
  } catch (error) {
    console.error('Error shutting down API:', error);
    throw new Error('Error shutting down API: ' + error.message);
  }
}
