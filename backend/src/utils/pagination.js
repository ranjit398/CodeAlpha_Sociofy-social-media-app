const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

/**
 * Parse cursor + limit from query params
 */
const parsePagination = (query) => {
  const limit = Math.min(parseInt(query.limit, 10) || DEFAULT_LIMIT, MAX_LIMIT);
  const cursor = query.cursor || null;
  return { cursor, limit };
};

/**
 * Build cursor-based pagination result
 * items: array (fetched with limit+1)
 * limit: requested limit
 */
const buildPaginatedResponse = (items, limit, getCursorFn) => {
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  const nextCursor = hasMore ? getCursorFn(data[data.length - 1]) : null;

  return {
    items: data,
    pagination: {
      hasMore,
      nextCursor,
      count: data.length,
    },
  };
};

module.exports = { parsePagination, buildPaginatedResponse, DEFAULT_LIMIT };