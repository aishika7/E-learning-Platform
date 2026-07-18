// utils/response.utils.js
// Consistent API response helpers — mirrors marketpulse's createSuccessResponse pattern

const createSuccess = (data, message = 'Success') => ({
  success: true,
  message,
  data,
});

const createError = (message = 'An error occurred', code = 500) => ({
  success: false,
  message,
  code,
});

const createPaginated = (data, total, page, limit) => ({
  success: true,
  data,
  pagination: {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  },
});

module.exports = { createSuccess, createError, createPaginated };
