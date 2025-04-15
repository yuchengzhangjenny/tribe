const express = require('express');
const router = express.Router();
const axios = require('axios');
const keys = require('../config/keys');

// Using the API key safely
router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address,
          key: keys.googleMaps.apiKey, // Safely access the API key
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error in geocoding request:', error);
    res.status(500).json({ error: 'Failed to geocode address' });
  }
});

module.exports = router; 