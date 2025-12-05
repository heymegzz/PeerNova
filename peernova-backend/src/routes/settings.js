const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');
const { validateSettingsUpdate } = require('../middleware/validation');
const { success, error } = require('../utils/response');
const { NotFoundError } = require('../middleware/errorHandler');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/settings
 * Get user settings (create with defaults if doesn't exist)
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get or create settings
    let settings = await prisma.settings.findUnique({
      where: { user_id: userId },
    });

    // Create with defaults if doesn't exist
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          user_id: userId,
          emailNotifications: true,
          inAppNotifications: true,
          privateProfile: false,
          hideActivity: false,
          theme: 'dark',
        },
      });
    }

    // Wrap settings in preferences object to match frontend expectations
    return success(res, { preferences: settings }, 'Settings retrieved successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/settings
 * Update user settings
 */
router.put('/', authenticate, validateSettingsUpdate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      emailNotifications,
      inAppNotifications,
      privateProfile,
      hideActivity,
      theme,
    } = req.body;

    // Build update data (only include provided fields)
    const updateData = {};
    if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications;
    if (inAppNotifications !== undefined) updateData.inAppNotifications = inAppNotifications;
    if (privateProfile !== undefined) updateData.privateProfile = privateProfile;
    if (hideActivity !== undefined) updateData.hideActivity = hideActivity;
    if (theme !== undefined) updateData.theme = theme;

    // Update or create settings
    const settings = await prisma.settings.upsert({
      where: { user_id: userId },
      update: updateData,
      create: {
        user_id: userId,
        emailNotifications: emailNotifications ?? true,
        inAppNotifications: inAppNotifications ?? true,
        privateProfile: privateProfile ?? false,
        hideActivity: hideActivity ?? false,
        theme: theme ?? 'dark',
      },
    });

    // Wrap settings in preferences object to match frontend expectations
    return success(res, { preferences: settings }, 'Settings updated successfully');
  } catch (err) {
    next(err);
  }
});

module.exports = router;

