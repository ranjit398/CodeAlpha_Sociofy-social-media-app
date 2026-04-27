import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

/**
 * Hook for managing async operations (loading, error, execute)
 * @param {Function} asyncFn - Async function to execute
 * @returns {Object} - { loading, error, execute }
 */
export function useAsync(asyncFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await asyncFn(...args);
        return result;
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Something went wrong';
        setError(msg);
        toast.error(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFn]
  );

  return { loading, error, execute };
}

/**
 * Hook for infinite scroll / pagination
 * @param {Function} fetchFn - Function that fetches items with pageNum
 * @param {Array} deps - Dependency array to reset when changed
 * @returns {Object} - { items, loading, hasMore, initialLoaded, load, loadMore, reset, setItems }
 */
export function useInfiniteScroll(fetchFn, deps = []) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const load = useCallback(
    async (pageNum = 1, reset = false) => {
      if (loading) return;
      setLoading(true);
      try {
        const result = await fetchFn(pageNum);
        const newItems = result.posts || result.data || result;
        setItems((prev) => (reset ? newItems : [...prev, ...newItems]));
        setHasMore(result.pagination?.hasMore ?? false);
        setPage(pageNum);
        setInitialLoaded(true);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchFn, ...deps]
  );

  const resetScroll = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setInitialLoaded(false);
    load(1, true);
  }, [load]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading) load(page + 1);
  }, [hasMore, loading, load, page]);

  return {
    items,
    loading,
    hasMore,
    initialLoaded,
    load,
    loadMore,
    reset: resetScroll,
    setItems,
  };
}

/**
 * Hook for tracking form state with validation
 */
export function useForm(initialValues, onSubmit, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (validate) {
        const newErrors = validate(values);
        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;
      }
      setLoading(true);
      try {
        await onSubmit(values);
      } finally {
        setLoading(false);
      }
    },
    [values, onSubmit, validate]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
}
