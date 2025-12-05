const express = require('express');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');
const {
  validateProfileUpdate,
  validatePasswordChange,
} = require('../middleware/validation');
const { success, error } = require('../utils/response');
const { formatDateLabel } = require('../utils/dateFormatter');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../middleware/errorHandler');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/profile
 * Get user profile with stats
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user with relationships
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        // Note: If these fields exist in your User model, uncomment:
        // fullName: true,
        // university: true,
        // bio: true,
        // avatar: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Get stats
    const [groupsCreated, groupsJoined, resourcesUploaded, totalDownloads] = await Promise.all([
      prisma.studyGroup.count({ where: { owner_id: userId } }),
      prisma.studyGroupMember.count({ where: { user_id: userId } }),
      prisma.resource.count({ where: { uploadedBy_id: userId } }),
      prisma.resource.aggregate({
        where: { uploadedBy_id: userId },
        _sum: { downloadCount: true },
      }),
    ]);

    // Get owned groups with member counts
    const ownedGroups = await prisma.studyGroup.findMany({
      where: { owner_id: userId },
      select: {
        id: true,
        name: true,
        subject: true,
        createdAt: true,
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Format owned groups with member count
    const formattedOwnedGroups = ownedGroups.map((g) => ({
      id: g.id,
      name: g.name,
      subject: g.subject,
      memberCount: g._count?.members || 0,
      createdAt: g.createdAt,
      createdAtLabel: formatDateLabel(g.createdAt),
    }));

    // Get joined groups (not owned) with member counts
    const joinedGroupsData = await prisma.studyGroupMember.findMany({
      where: {
        user_id: userId,
        studyGroup: {
          owner_id: { not: userId },
        },
      },
      include: {
        studyGroup: {
          select: {
            id: true,
            name: true,
            subject: true,
            createdAt: true,
            _count: {
              select: { members: true },
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
      take: 10,
    });

    const joinedGroups = joinedGroupsData.map((item) => ({
      id: item.studyGroup.id,
      name: item.studyGroup.name,
      subject: item.studyGroup.subject,
      memberCount: item.studyGroup._count?.members || 0,
      createdAt: item.studyGroup.createdAt,
      createdAtLabel: formatDateLabel(item.studyGroup.createdAt),
      joinedAt: item.joinedAt,
      joinedAtLabel: formatDateLabel(item.joinedAt),
      isMember: true,
      isOwner: false,
    }));

    // Get owned resources
    const ownedResources = await prisma.resource.findMany({
      where: { uploadedBy_id: userId },
      select: {
        id: true,
        title: true,
        category: true,
        downloadCount: true,
        createdAt: true,
        file_url: true,
        fileName: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const profile = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        // Note: If your User model has these fields, uncomment:
        // fullName: user.fullName,
        // university: user.university,
        // bio: user.bio,
        // avatar: user.avatar,
      },
      createdAtLabel: formatDateLabel(user.createdAt),
      memberSinceLabel: formatDateLabel(user.createdAt),
      stats: {
        groupsCreated,
        groupsJoined,
        resourcesUploaded,
        totalDownloads: totalDownloads._sum.downloadCount || 0,
      },
      ownedGroups: formattedOwnedGroups.map((g) => ({
        ...g,
        isOwner: true,
        isMember: true,
      })),
      joinedGroups,
      ownedResources: ownedResources.map((r) => {
        const fileUrl = r.file_url.startsWith('http') 
          ? r.file_url 
          : `${baseUrl}${r.file_url}`;
        return {
          id: r.id,
          title: r.title,
          category: r.category,
          downloadCount: r.downloadCount,
          fileUrl,
          fileName: r.fileName,
          createdAt: r.createdAt,
          createdAtLabel: formatDateLabel(r.createdAt),
        };
      }),
    };

    return success(res, profile, 'Profile retrieved successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/profile
 * Update user profile
 */
router.put('/', authenticate, validateProfileUpdate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { fullName, university, bio, avatar } = req.body;

    // Build update object (only include provided fields)
    const updateData = {};
    if (fullName !== undefined) updateData.name = fullName; // Using 'name' field from schema
    // Note: If your User model has these fields, uncomment:
    // if (university !== undefined) updateData.university = university;
    // if (bio !== undefined) updateData.bio = bio;
    // if (avatar !== undefined) updateData.avatar = avatar;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        // fullName: true,
        // university: true,
        // bio: true,
        // avatar: true,
      },
    });

    return success(res, updatedUser, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/profile/password
 * Change user password
 */
router.put('/password', authenticate, validatePasswordChange, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestError('Old password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return success(res, null, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/profile
 * Delete user account (cascade deletes groups, resources, etc.)
 */
router.delete('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Delete user (cascade will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    return success(res, null, 'Account deleted successfully');
  } catch (err) {
    next(err);
  }
});

module.exports = router;

