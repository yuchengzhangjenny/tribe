const { db } = require('../utils/admin');
const usersRef = db.collection('users');

class User {
  /**
   * Get a user by ID
   * @param {string} userId - The user's ID
   * @returns {Promise<Object|null>} - User data or null if not found
   */
  static async getById(userId) {
    try {
      const userDoc = await usersRef.doc(userId).get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Create a new user
   * @param {string} userId - The user's ID (from Firebase Auth)
   * @param {Object} userData - User profile data
   * @returns {Promise<Object>} - Created user data
   */
  static async create(userId, userData) {
    try {
      const userRef = usersRef.doc(userId);
      
      // Initialize user with basic profile data
      await userRef.set({
        createdAt: new Date(),
        ...userData
      });
      
      // Initialize sub-collections
      await userRef.collection('profile').doc('info').set({
        profileCompleteness: 0,
        ...userData.profile
      });
      
      await userRef.collection('settings').doc('preferences').set({
        notifications: true,
        darkMode: false,
        ...userData.settings
      });
      
      await userRef.collection('stats').doc('appUsage').set({
        lastActive: new Date(),
        logins: 1
      });
      
      // Return the created user
      return {
        id: userId,
        ...userData
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update a user's profile
   * @param {string} userId - The user's ID
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} - Updated user data
   */
  static async update(userId, userData) {
    try {
      const userRef = usersRef.doc(userId);
      
      // Update only the fields that are provided
      await userRef.update({
        updatedAt: new Date(),
        ...userData
      });
      
      // Update profile sub-collection if profile data is provided
      if (userData.profile) {
        await userRef.collection('profile').doc('info').update({
          ...userData.profile
        });
      }
      
      // Return the updated user
      const updatedUser = await this.getById(userId);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  /**
   * Search for users by criteria
   * @param {Object} criteria - Search criteria (location, interests, etc.)
   * @param {number} limit - Maximum number of users to return
   * @returns {Promise<Array>} - Array of matching users
   */
  static async search(criteria, limit = 10) {
    try {
      let query = usersRef;
      
      // Apply filters based on criteria
      if (criteria.interests && criteria.interests.length > 0) {
        query = query.where('interests', 'array-contains-any', criteria.interests);
      }
      
      // Add more filters as needed...
      
      // Execute query with limit
      const snapshot = await query.limit(limit).get();
      
      if (snapshot.empty) {
        return [];
      }
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }
}

module.exports = User; 