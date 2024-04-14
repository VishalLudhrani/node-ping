const axios = require('axios');
const crypto = require('crypto');
require('dotenv').config()

// Set the target URL
const baseUrl = process.env.DOMAIN;

function sendRequests() {
  // Create an array of promises to represent the requests
  const requests = Array.from({ length: 2 }, () => {
    // Generate a random delay for the request
    const delay = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;

    // Return a promise that resolves after the delay and sends a request
    return new Promise((resolve) => {
      setTimeout(async () => {
        try {
          // Generate a random query parameter in a random order
          let shouldGenerateQueryParam = parseInt(Math.random() * 10) > 5
          const queryParam = shouldGenerateQueryParam ? crypto.randomBytes(10).toString('hex') : '';

          // Send a request to the target URL with a random query parameter
          const response = await axios.get(`${baseUrl}/${queryParam}`);

          // Log the response status code
          console.log(`Status code: ${response.status}\nurl: ${baseUrl}/${queryParam}`);

          // Handle 3xx or 4xx status codes
          if (response.status >= 300 && response.status < 500) {
            console.log(`Redirect or client error: ${response.status}`);
          }
        } catch (error) {
          // Log any errors
          console.error(error);
        }

        // Resolve the promise
        resolve();
      }, delay);
    });
  });

  // Wait for all requests to complete
  Promise.all(requests).then(() => {
    // Send more requests
    sendRequests();
  });
}

// Send the first set of requests
sendRequests();