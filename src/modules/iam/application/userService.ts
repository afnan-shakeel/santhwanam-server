import { SearchRequest, searchService } from '@/shared/infrastructure/search'
import { UserRepository } from '../domain/repositories'
import { NotFoundError } from '@/shared/utils/error-handling/httpErrors'

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async searchUsers(searchRequest: Omit<SearchRequest, 'model'>) {
    return searchService.execute({ ...searchRequest, model: 'User' })
  }

  async updateUser(userId: string, updates: Partial<any>) {
    // Basic validation can be added here if desired
    const existing = await this.userRepo.findById(userId)
    if (!existing) throw new Error('User not found')

    const updated = await this.userRepo.updateById(userId, updates)
    return updated
  }

  async getUserById(userId: string) {
    const u = await this.userRepo.findById(userId)
    if (!u) throw new NotFoundError('User not found')
    return u
  }
}

export default UserService
