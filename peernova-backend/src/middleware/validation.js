const { body, param, query, validationResult } = require('express-validator');
const { BadRequestError } = require('./errorHandler');

/**
 * Validation middleware - checks for validation errors
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      data: null,
      message: 'Validation Error',
      errors: errors.array().map(e => `${e.param || e.msg}: ${e.msg}`),
    });
  }
  next();
};

/**
 * Sanitize string inputs
 */
const sanitizeString = (value) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
};

/**
 * Sanitize email
 */
const sanitizeEmail = (value) => {
  if (typeof value === 'string') {
    return value.trim().toLowerCase();
  }
  return value;
};

// Profile validation rules
const validateProfileUpdate = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('university')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('University name must be less than 200 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Bio must be less than 1000 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),
  validate,
];

const validatePasswordChange = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Old password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  validate,
];

// Subject mapping: Frontend format -> Backend enum
const mapSubjectToEnum = (subject) => {
  const mapping = {
    // Full names (from create/edit forms)
    'Data Structures & Algorithms': 'DataStructuresAlgorithms',
    'Web Development': 'WebDevelopment',
    'Machine Learning': 'MachineLearning',
    'Competitive Programming': 'CompetitiveProgramming',
    'Mobile Development': 'MobileDevelopment',
    'Other': 'Other',
    // Filter short names (from filter buttons)
    'DSA': 'DataStructuresAlgorithms',
    'Web Dev': 'WebDevelopment',
    'ML': 'MachineLearning',
    'Mobile Dev': 'MobileDevelopment',
    // Also accept enum values directly
    'DataStructuresAlgorithms': 'DataStructuresAlgorithms',
    'WebDevelopment': 'WebDevelopment',
    'MachineLearning': 'MachineLearning',
    'CompetitiveProgramming': 'CompetitiveProgramming',
    'MobileDevelopment': 'MobileDevelopment',
  };
  return mapping[subject] || subject;
};

// Resource category mapping: Frontend format -> Backend enum
const mapCategoryToEnum = (category) => {
  const mapping = {
    'Presentation/Slides': 'PresentationSlides',
    // Also accept enum values directly
    'Notes': 'Notes',
    'PDF': 'PDF',
    'PresentationSlides': 'PresentationSlides',
    'Video': 'Video',
    'Code': 'Code',
    'Other': 'Other',
  };
  return mapping[category] || category;
};

// Study Group validation rules
const validateStudyGroupCreate = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Group name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Group name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('subject')
    .custom((value) => {
      const validSubjects = [
        'DataStructuresAlgorithms',
        'WebDevelopment',
        'MachineLearning',
        'CompetitiveProgramming',
        'MobileDevelopment',
        'Other',
        // Frontend formats
        'Data Structures & Algorithms',
        'Web Development',
        'Machine Learning',
        'Competitive Programming',
        'Mobile Development',
      ];
      return validSubjects.includes(value);
    })
    .withMessage('Invalid subject'),
  body('maxMembers')
    .optional()
    .isInt({ min: 2, max: 100 })
    .withMessage('Max members must be between 2 and 100'),
  validate,
];

const validateStudyGroupUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Group name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('subject')
    .optional()
    .custom((value) => {
      const validSubjects = [
        'DataStructuresAlgorithms',
        'WebDevelopment',
        'MachineLearning',
        'CompetitiveProgramming',
        'MobileDevelopment',
        'Other',
        // Frontend formats
        'Data Structures & Algorithms',
        'Web Development',
        'Machine Learning',
        'Competitive Programming',
        'Mobile Development',
      ];
      return validSubjects.includes(value);
    })
    .withMessage('Invalid subject'),
  body('maxMembers')
    .optional()
    .isInt({ min: 2, max: 100 })
    .withMessage('Max members must be between 2 and 100'),
  validate,
];

const validateStudyGroupId = [
  param('id')
    .isUUID()
    .withMessage('Invalid study group ID'),
  validate,
];

// Resource validation rules
const validateResourceCreate = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .custom((value) => {
      const validCategories = [
        'Notes',
        'PDF',
        'PresentationSlides',
        'Video',
        'Code',
        'Other',
        // Frontend format
        'Presentation/Slides',
      ];
      return validCategories.includes(value);
    })
    .withMessage('Invalid category'),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Subject tag must be less than 100 characters'),
  validate,
];

const validateResourceUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('category')
    .optional()
    .custom((value) => {
      const validCategories = [
        'Notes',
        'PDF',
        'PresentationSlides',
        'Video',
        'Code',
        'Other',
        // Frontend format
        'Presentation/Slides',
      ];
      return validCategories.includes(value);
    })
    .withMessage('Invalid category'),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Subject tag must be less than 100 characters'),
  validate,
];

const validateResourceId = [
  param('id')
    .isUUID()
    .withMessage('Invalid resource ID'),
  validate,
];

// Settings validation rules
const validateSettingsUpdate = [
  body('emailNotifications')
    .optional()
    .isBoolean()
    .withMessage('emailNotifications must be a boolean'),
  body('inAppNotifications')
    .optional()
    .isBoolean()
    .withMessage('inAppNotifications must be a boolean'),
  body('privateProfile')
    .optional()
    .isBoolean()
    .withMessage('privateProfile must be a boolean'),
  body('hideActivity')
    .optional()
    .isBoolean()
    .withMessage('hideActivity must be a boolean'),
  body('theme')
    .optional()
    .isIn(['light', 'dark'])
    .withMessage('Theme must be either "light" or "dark"'),
  validate,
];

// Query parameter validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  validate,
];

module.exports = {
  validate,
  sanitizeString,
  sanitizeEmail,
  mapSubjectToEnum,
  mapCategoryToEnum,
  validateProfileUpdate,
  validatePasswordChange,
  validateStudyGroupCreate,
  validateStudyGroupUpdate,
  validateStudyGroupId,
  validateResourceCreate,
  validateResourceUpdate,
  validateResourceId,
  validateSettingsUpdate,
  validatePagination,
};

