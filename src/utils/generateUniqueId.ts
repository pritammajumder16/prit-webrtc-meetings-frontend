export const generateUniqueId = () => {
  let uniqueId = localStorage.getItem("uniqueId");
  if (!uniqueId) {
    uniqueId = crypto.randomUUID();
    localStorage.setItem("uniqueId", uniqueId);
  }
  return uniqueId;
};
