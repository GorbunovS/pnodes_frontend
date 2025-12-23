export const copyToClipboard = async (data) => {
    const jsonData = JSON.stringify(data);
  try {
    const textToCopy = jsonData;
    if (!textToCopy) return;
    await navigator.clipboard.writeText(textToCopy);
    console.log('JSON copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
};

