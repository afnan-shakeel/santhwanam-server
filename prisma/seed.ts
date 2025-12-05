import prisma from '../src/shared/infrastructure/prisma/prismaClient';

async function main() {
  // Upsert super_admin role
  const role = await prisma.role.upsert({
    where: { roleCode: 'super_admin' },
    update: {},
    create: {
      roleCode: 'super_admin',
      roleName: 'Super Administrator',
      description: 'System super admin with all permissions',
      scopeType: 'None',
      isActive: true,
      isSystemRole: true,
    },
  })

  const permissionCodes = ['member.create', 'member.read', 'member.update']
  const perms = [] as any[]

  for (const code of permissionCodes) {
    const p = await prisma.permission.upsert({
      where: { permissionCode: code },
      update: {},
      create: {
        permissionCode: code,
        permissionName: code,
        module: 'Membership',
        action: code.split('.').pop(),
        isActive: true,
      },
    })
    perms.push(p)
  }

  for (const p of perms) {
    const exists = await prisma.rolePermission.findFirst({
      where: { roleId: role.roleId, permissionId: p.permissionId },
    })
    if (!exists) {
      await prisma.rolePermission.create({
        data: {
          roleId: role.roleId,
          permissionId: p.permissionId,
        },
      })
    }
  }

  console.log('Seed complete: super_admin and 3 permissions created/upserted.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
