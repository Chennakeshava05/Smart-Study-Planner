export const parseJsonResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    throw new Error(
      response.ok
        ? 'Server returned an empty response'
        : `Server error (${response.status} ${response.statusText || 'error'})`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Unexpected server response (${response.status}): ${text.slice(0, 200)}`);
  }
};
