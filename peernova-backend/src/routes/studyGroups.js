const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');
const {
  validateStudyGroupCreate,
  validateStudyGroupUpdate,
  validateStudyGroupId,
  validatePagination,
  mapSubjectToEnum,
} = require('../middleware/validation');
const { success, error } = require('../utils/response');
const { formatDateLabel } = require('../utils/dateFormatter');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../middleware/errorHandler');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/study-groups
 * List all study groups with pagination & filtering
 */
router.get('/', authenticate, validatePagination, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim() || '';
    const sort = req.query.sort || 'newest';
    const subjects = req.query.subjects?.split(',').filter(Boolean) || [];
    const members = req.query.members;

    // Build where clause
    const where = {};

    // Search filter (MySQL default collation is case-insensitive)
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Subject filter - map frontend format to enum
    if (subjects.length > 0) {
      const mappedSubjects = subjects.map((s) => mapSubjectToEnum(s.trim()));
      where.subject = { in: mappedSubjects };
    }

    // Member count filter
    if (members) {
      // We'll filter after fetching based on memberCount
      // This is a limitation - for better performance, consider adding a computed field
    }

    // Build orderBy
    let orderBy = {};
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'alpha':
        orderBy = { name: 'asc' };
        break;
      case 'most-members':
        // We'll sort after fetching based on memberCount
        orderBy = { createdAt: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    // Get groups with member count
    const [groups, total] = await Promise.all([
      prisma.studyGroup.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
      }),
      prisma.studyGroup.count({ where }),
    ]);

    // Check membership for each group
    const groupIds = groups.map((g) => g.id);
    const memberships = await prisma.studyGroupMember.findMany({
      where: {
        studyGroup_id: { in: groupIds },
        user_id: userId,
      },
      select: {
        studyGroup_id: true,
      },
    });

    const memberGroupIds = new Set(memberships.map((m) => m.studyGroup_id));

    // Format groups
    let formattedGroups = groups.map((group) => {
      const memberCount = group._count.members;
      const isOwner = group.owner_id === userId;
      const isMember = memberGroupIds.has(group.id);

      return {
        id: group.id,
        name: group.name,
        description: group.description,
        subject: group.subject,
        maxMembers: group.maxMembers,
        memberCount,
        isOwner,
        isMember,
        createdBy: group.owner.name,
        createdAt: group.createdAt,
        createdAtLabel: formatDateLabel(group.createdAt),
      };
    });

    // Filter by member count if specified
    if (members) {
      formattedGroups = formattedGroups.filter((g) => {
        if (members === 'lt5') return g.memberCount < 5;
        if (members === '5to10') return g.memberCount >= 5 && g.memberCount <= 10;
        if (members === 'gt10') return g.memberCount > 10;
        return true;
      });
    }

    // Sort by most-members if needed
    if (sort === 'most-members') {
      formattedGroups.sort((a, b) => b.memberCount - a.memberCount);
    }

    return success(res, {
      items: formattedGroups,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }, 'Study groups retrieved successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/study-groups
 * Create a new study group
 */
router.post('/', authenticate, validateStudyGroupCreate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, description, subject: subjectInput, maxMembers = 50 } = req.body;
    const subject = mapSubjectToEnum(subjectInput);

    // Create group
    const group = await prisma.studyGroup.create({
      data: {
        name,
        description,
        subject,
        maxMembers,
        owner_id: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    // Add creator as first member
    await prisma.studyGroupMember.create({
      data: {
        studyGroup_id: group.id,
        user_id: userId,
      },
    });

    // Update member count
    const memberCount = 1;

    const response = {
      id: group.id,
      name: group.name,
      description: group.description,
      subject: group.subject,
      maxMembers: group.maxMembers,
      memberCount,
      isOwner: true,
      isMember: true,
      createdBy: group.owner.name,
      createdAt: group.createdAt,
      createdAtLabel: formatDateLabel(group.createdAt),
    };

    return success(res, response, 'Study group created successfully', 201);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/study-groups/:id
 * Get single study group
 */
router.get('/:id', authenticate, validateStudyGroupId, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const group = await prisma.studyGroup.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundError('Study group not found');
    }

    const isOwner = group.owner_id === userId;
    const isMember = group.members.some((m) => m.user_id === userId);

    const response = {
      id: group.id,
      name: group.name,
      description: group.description,
      subject: group.subject,
      maxMembers: group.maxMembers,
      memberCount: group._count.members,
      isOwner,
      isMember,
      createdBy: group.owner.name,
      createdAt: group.createdAt,
      createdAtLabel: formatDateLabel(group.createdAt),
      members: group.members.map((member) => ({
        id: member.id,
        user: {
          id: member.user.id,
          name: member.user.name,
          email: member.user.email,
        },
        joinedAt: member.joinedAt,
        joinedAtLabel: formatDateLabel(member.joinedAt),
      })),
    };

    return success(res, response, 'Study group retrieved successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/study-groups/:id
 * Update study group (owner only)
 */
router.put('/:id', authenticate, validateStudyGroupId, validateStudyGroupUpdate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description, subject: subjectInput, maxMembers } = req.body;
    const subject = subjectInput ? mapSubjectToEnum(subjectInput) : undefined;

    // Get group
    const group = await prisma.studyGroup.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundError('Study group not found');
    }

    // Check ownership
    if (group.owner_id !== userId) {
      throw new ForbiddenError('Only the owner can update this group');
    }

    // Validate maxMembers is not less than current member count
    if (maxMembers !== undefined && maxMembers < group._count.members) {
      throw new BadRequestError(
        `Cannot set maxMembers below current member count (${group._count.members})`
      );
    }

    // Build update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (subject !== undefined) updateData.subject = subject;
    if (maxMembers !== undefined) updateData.maxMembers = maxMembers;

    // Update group
    const updatedGroup = await prisma.studyGroup.update({
      where: { id },
      data: updateData,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    const response = {
      id: updatedGroup.id,
      name: updatedGroup.name,
      description: updatedGroup.description,
      subject: updatedGroup.subject,
      maxMembers: updatedGroup.maxMembers,
      memberCount: updatedGroup._count.members,
      isOwner: true,
      isMember: true,
      createdBy: updatedGroup.owner.name,
      createdAt: updatedGroup.createdAt,
      createdAtLabel: formatDateLabel(updatedGroup.createdAt),
    };

    return success(res, response, 'Study group updated successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/study-groups/:id
 * Delete study group (owner only, cascade deletes members and resources)
 */
router.delete('/:id', authenticate, validateStudyGroupId, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Get group
    const group = await prisma.studyGroup.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundError('Study group not found');
    }

    // Check ownership
    if (group.owner_id !== userId) {
      throw new ForbiddenError('Only the owner can delete this group');
    }

    // Delete group (cascade will handle members and resources)
    await prisma.studyGroup.delete({
      where: { id },
    });

    return success(res, null, 'Study group deleted successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/study-groups/:id/join
 * Join a study group
 */
router.post('/:id/join', authenticate, validateStudyGroupId, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Get group with member count
    const group = await prisma.studyGroup.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundError('Study group not found');
    }

    // Check if already a member
    const existingMember = await prisma.studyGroupMember.findUnique({
      where: {
        studyGroup_id_user_id: {
          studyGroup_id: id,
          user_id: userId,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestError('You are already a member of this group');
    }

    // Check if group is full
    if (group._count.members >= group.maxMembers) {
      throw new BadRequestError('This group is full');
    }

    // Add member
    await prisma.studyGroupMember.create({
      data: {
        studyGroup_id: id,
        user_id: userId,
      },
    });

    return success(res, null, 'Successfully joined the study group');
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/study-groups/:id/leave
 * Leave a study group
 */
router.delete('/:id/leave', authenticate, validateStudyGroupId, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Get group
    const group = await prisma.studyGroup.findUnique({
      where: { id },
    });

    if (!group) {
      throw new NotFoundError('Study group not found');
    }

    // Check if owner is leaving
    if (group.owner_id === userId) {
      // Owner leaving - delete the group (cascade handles members/resources)
      await prisma.studyGroup.delete({
        where: { id },
      });
      return success(res, null, 'Group deleted as owner left');
    }

    // Check if member
    const membership = await prisma.studyGroupMember.findUnique({
      where: {
        studyGroup_id_user_id: {
          studyGroup_id: id,
          user_id: userId,
        },
      },
    });

    if (!membership) {
      throw new BadRequestError('You are not a member of this group');
    }

    // Remove member
    await prisma.studyGroupMember.delete({
      where: {
        studyGroup_id_user_id: {
          studyGroup_id: id,
          user_id: userId,
        },
      },
    });

    return success(res, null, 'Successfully left the study group');
  } catch (err) {
    next(err);
  }
});

module.exports = router;

