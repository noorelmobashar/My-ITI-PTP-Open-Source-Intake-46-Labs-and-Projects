import { ref } from 'vue';

export function useApi(resourcePath) {
  const data = ref(null);
  const error = ref(null);
  const loading = ref(false);

  const baseUrl = `http://localhost:3000${resourcePath}`;

  const doFetch = async (url, options = {}, showLoading = true, updateData = true) => {
    if (showLoading) loading.value = true;
    error.value = null;

    try {
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (updateData) data.value = result;
      return result;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      if (showLoading) loading.value = false;
    }
  };

  const getAll = () => doFetch(baseUrl);

  const getOne = (id) => doFetch(`${baseUrl}/${id}`);

  const update = (id, payload) => {
    return doFetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, false, false);
  };

  return {
    data,
    error,
    loading,
    getAll,
    getOne,
    update
  };
}