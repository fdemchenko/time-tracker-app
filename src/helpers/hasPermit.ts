export const hasPermit = (permissionJson: string, permission: string): boolean => {
  if (permissionJson.toLowerCase() === "all") {
    return true;
  }

  try {
    const permissions: Record<string, boolean> = JSON.parse(permissionJson);

    if (permissions[permission] !== undefined) {
      return permissions[permission];
    }
  } catch (error) {
    return false;
  }

  return false;
};