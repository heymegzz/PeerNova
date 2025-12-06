const express = require('express');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');
const {
  validateResourceCreate,
  validateResourceUpdate,
  validateResourceId,
  validatePagination,
  mapCategoryToEnum,
} = require('../middleware/validation');
const { upload, uploadRateLimit, uploadsDir } = require('../middleware/upload');
const { success, error } = require('../utils/response');
const { formatDateLabel } = require('../utils/dateFormatter');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../middleware/errorHandler');

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /api/resources
 * List all resources with pagination & filtering
 */
router.get('/', authenticate, validatePagination, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim() || '';
    const sort = req.query.sort || 'newest';
    const category = req.query.category;
    const date = req.query.date; // week, month, year

    // Build where clause
    const where = {};

    // Search filter (MySQL default collation is case-insensitive)
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Category filter - map frontend format to enum
    if (category) {
      where.category = mapCategoryToEnum(category);
    }

    // Date filter
    if (date) {
      const now = new Date();
      let startDate;
      switch (date) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }
      if (startDate) {
        where.createdAt = { gte: startDate };
      }
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
        orderBy = { title: 'asc' };
        break;
      case 'most-downloaded':
        orderBy = { downloadCount: 'desc' };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Get resources
    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      prisma.resource.count({ where }),
    ]);

    // Format resources
    const formattedResources = resources.map((resource) => {
      const isOwner = resource.uploadedBy_id === userId;
      const fileUrl = resource.file_url.startsWith('http') 
        ? resource.file_url 
        : `${baseUrl}${resource.file_url}`;
      return {
        id: resource.id,
        title: resource.title,
        description: resource.description,
        category: resource.category,
        subject: resource.subject,
        fileUrl,
        fileName: resource.fileName,
        downloadCount: resource.downloadCount,
        isOwner,
        uploadedBy: resource.uploadedBy.name,
        createdAt: resource.createdAt,
        createdAtLabel: formatDateLabel(resource.createdAt),
      };
    });

    return success(res, {
      items: formattedResources,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }, 'Resources retrieved successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/resources
 * Upload a new resource
 */
router.post('/', authenticate, uploadRateLimit, upload, async (req, res, next) => {
  try {
    const userId = req.user.id;
    let { title, description, category: categoryInput, subject } = req.body;

    // Trim and validate inputs
    title = title ? title.trim() : '';
    description = description ? description.trim() : '';
    subject = subject ? subject.trim() : null;

    // Manual validation for multipart/form-data
    if (!title) {
      throw new BadRequestError('Title is required');
    }
    if (title.length < 3 || title.length > 200) {
      throw new BadRequestError('Title must be between 3 and 200 characters');
    }
    if (!description) {
      throw new BadRequestError('Description is required');
    }
    if (description.length < 10 || description.length > 2000) {
      throw new BadRequestError('Description must be between 10 and 2000 characters');
    }
    if (!categoryInput) {
      throw new BadRequestError('Category is required');
    }
    const validCategories = ['Notes', 'PDF', 'PresentationSlides', 'Video', 'Code', 'Other', 'Presentation/Slides'];
    if (!validCategories.includes(categoryInput)) {
      throw new BadRequestError('Invalid category');
    }
    const category = mapCategoryToEnum(categoryInput);

    // Check if file was uploaded
    if (!req.file) {
      throw new BadRequestError('File is required');
    }

    // Build file URL (absolute path for now)
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `/uploads/${req.file.filename}`;

    // Create resource
    const resource = await prisma.resource.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        subject: subject ? subject.trim() : null,
        file_url: fileUrl,
        fileName: req.file.originalname,
        uploadedBy_id: userId,
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const response = {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      category: resource.category,
      subject: resource.subject,
      fileUrl: `${baseUrl}${resource.file_url}`,
      fileName: resource.fileName,
      downloadCount: resource.downloadCount,
      isOwner: true,
      uploadedBy: resource.uploadedBy.name,
      createdAt: resource.createdAt,
      createdAtLabel: formatDateLabel(resource.createdAt),
    };

    return success(res, response, 'Resource uploaded successfully', 201);
  } catch (err) {
    // Delete uploaded file if resource creation failed
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
      }
    }
    next(err);
  }
});

/**
 * GET /api/resources/:id
 * Get single resource
 */
router.get('/:id', authenticate, validateResourceId, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!resource) {
      throw new NotFoundError('Resource not found');
    }

    const isOwner = resource.uploadedBy_id === userId;

    // Build full file URL
    const fileUrl = resource.file_url.startsWith('http') 
      ? resource.file_url 
      : `${baseUrl}${resource.file_url}`;

    // Check if preview is available (for PDFs and images)
    // Use preview endpoint for proper headers
    let previewUrl = null;
    const fileExt = path.extname(resource.file_url).toLowerCase();
    if (['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExt)) {
      const filename = path.basename(resource.file_url);
      previewUrl = `${baseUrl}/api/resources/preview/${filename}`;
    }

    const response = {
      id: resource.id,
      title: resource.title,
      description: resource.description,
      category: resource.category,
      subject: resource.subject,
      fileUrl,
      fileName: resource.fileName,
      downloadCount: resource.downloadCount,
      isOwner,
      uploadedBy: resource.uploadedBy.name,
      createdAt: resource.createdAt,
      createdAtLabel: formatDateLabel(resource.createdAt),
      previewUrl,
    };

    return success(res, response, 'Resource retrieved successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/resources/:id
 * Update resource (owner only)
 */
router.put('/:id', authenticate, validateResourceId, uploadRateLimit, upload, validateResourceUpdate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, category: categoryInput, subject } = req.body;
    const category = categoryInput ? mapCategoryToEnum(categoryInput) : undefined;
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Get resource
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundError('Resource not found');
    }

    // Check ownership
    if (resource.uploadedBy_id !== userId) {
      throw new ForbiddenError('Only the owner can update this resource');
    }

    // Build update data
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (subject !== undefined) updateData.subject = subject || null;

    // Handle file replacement if new file uploaded
    if (req.file) {
      // Delete old file
      const oldFilePath = path.join(uploadsDir, path.basename(resource.file_url));
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (unlinkErr) {
        console.error('Error deleting old file:', unlinkErr);
      }

      // Update with new file
      const fileUrl = `/uploads/${req.file.filename}`;
      updateData.file_url = fileUrl;
      updateData.fileName = req.file.originalname;
    }

    // Update resource
    const updatedResource = await prisma.resource.update({
      where: { id },
      data: updateData,
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const response = {
      id: updatedResource.id,
      title: updatedResource.title,
      description: updatedResource.description,
      category: updatedResource.category,
      subject: updatedResource.subject,
      fileUrl: `${baseUrl}${updatedResource.file_url}`,
      fileName: updatedResource.fileName,
      downloadCount: updatedResource.downloadCount,
      isOwner: true,
      uploadedBy: updatedResource.uploadedBy.name,
      createdAt: updatedResource.createdAt,
      createdAtLabel: formatDateLabel(updatedResource.createdAt),
    };

    return success(res, response, 'Resource updated successfully');
  } catch (err) {
    // Delete uploaded file if update failed
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error('Error deleting file:', unlinkErr);
      }
    }
    next(err);
  }
});

/**
 * DELETE /api/resources/:id
 * Delete resource (owner only)
 */
router.delete('/:id', authenticate, validateResourceId, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Get resource
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      throw new NotFoundError('Resource not found');
    }

    // Check ownership
    if (resource.uploadedBy_id !== userId) {
      throw new ForbiddenError('Only the owner can delete this resource');
    }

    // Delete file from storage
    const filePath = path.join(uploadsDir, path.basename(resource.file_url));
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (unlinkErr) {
      console.error('Error deleting file:', unlinkErr);
      // Continue with resource deletion even if file deletion fails
    }

    // Delete resource
    await prisma.resource.delete({
      where: { id },
    });

    return success(res, null, 'Resource deleted successfully');
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/resources/preview/:filename
 * Serve files for preview (with proper headers for embedding)
 */
router.get('/preview/:filename', authenticate, async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(uploadsDir)) {
      throw new BadRequestError('Invalid file path');
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundError('File not found');
    }

    // Get file extension to set proper content type
    const fileExt = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.pdf': 'application/pdf',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };

    const contentType = contentTypes[fileExt] || 'application/octet-stream';

    // Set headers for preview (allow embedding, no download)
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', 'inline'); // inline instead of attachment
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Allow CORS for preview
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    // Send file
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/resources/download/:filename
 * Serve uploaded files (triggers download)
 */
router.get('/download/:filename', authenticate, async (req, res, next) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    // Security: prevent directory traversal
    if (!filePath.startsWith(uploadsDir)) {
      throw new BadRequestError('Invalid file path');
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      throw new NotFoundError('File not found');
    }

    // Increment download count if resource exists
    const fileUrl = `/uploads/${filename}`;
    await prisma.resource.updateMany({
      where: { file_url: fileUrl },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    // Send file with download headers
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.sendFile(filePath);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

