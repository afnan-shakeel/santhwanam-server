export type Role = {
  roleId: string
  roleCode: string
  roleName: string
  description?: string | null
  scopeType: 'None' | 'Forum' | 'Area' | 'Unit' | 'Agent'
  isActive: boolean
  isSystemRole: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export type Permission = {
  permissionId: string
  permissionCode: string
  permissionName: string
  description?: string | null
  module?: string | null
  action?: string | null
  isActive: boolean
  createdAt: Date
}
