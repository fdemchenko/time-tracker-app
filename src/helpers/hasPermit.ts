export enum UserStatusEnum {
  working,
  deactivated,
  ill,
  vacation
}

export enum PermissionsEnum {
  LoggedIn,
  CreateUser,
  GetUsers,
  DeactivateUser,
  UpdateUser,
  ManageHolidays,
  CreateWorkSessions,
  UpdateWorkSessions,
  DeleteWorkSessions,
  GetWorkSession,
  GetVacations,
  ApproveVacations,
  ManageSickLeaves,
  GetUsersWorkInfo
}

export const hasPermit = (permissionJson: string, permission: string): boolean => {
  if (!permissionJson) return false;

  const lowerCasePermissionJson = permissionJson.toLowerCase();
  const lowerCasePermission = permission.toLowerCase();

  if (lowerCasePermissionJson === "all") {
    return true;
  }

  try {
    const permissions: Record<string, boolean> = JSON.parse(lowerCasePermissionJson);

    if (permissions[lowerCasePermission] !== undefined) {
      return permissions[lowerCasePermission];
    }
  } catch (error) {
    return false;
  }

  return false;
};