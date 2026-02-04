import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CurriculumSubject } from './entities'

type CurriculumPayload = {
  name?: string
  code?: string
  year?: number
  semester?: number
  lectureHours?: number
  labHours?: number
  description?: string
  courseName?: string
}

const toNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

@Injectable()
export class CurriculumService {
  constructor(
    @InjectRepository(CurriculumSubject)
    private readonly curriculumRepo: Repository<CurriculumSubject>,
  ) {}

  async getAll() {
    return this.curriculumRepo.find({ order: { id: 'ASC' } })
  }

  async create(payload: CurriculumPayload) {
    if (!payload?.name || !payload?.code) {
      return { error: 'name and code are required' }
    }

    const created = this.curriculumRepo.create({
      name: payload.name,
      code: payload.code,
      year: toNumber(payload.year) ?? 1,
      semester: toNumber(payload.semester) ?? 1,
      lectureHours: toNumber(payload.lectureHours) ?? 0,
      labHours: toNumber(payload.labHours) ?? 0,
      description: payload.description?.trim() || undefined,
      courseName: payload.courseName?.trim() || undefined,
    })

    return this.curriculumRepo.save(created)
  }

  async update(id: number, payload: CurriculumPayload) {
    const existing = await this.curriculumRepo.findOne({ where: { id } })
    if (!existing) {
      return { error: 'subject not found' }
    }

    if (payload.name !== undefined) existing.name = payload.name
    if (payload.code !== undefined) existing.code = payload.code
    if (payload.description !== undefined) {
      existing.description = payload.description?.trim() || undefined
    }
    if (payload.courseName !== undefined) {
      existing.courseName = payload.courseName?.trim() || undefined
    }

    const year = toNumber(payload.year)
    if (year !== undefined) existing.year = year

    const semester = toNumber(payload.semester)
    if (semester !== undefined) existing.semester = semester

    const lectureHours = toNumber(payload.lectureHours)
    if (lectureHours !== undefined) existing.lectureHours = lectureHours

    const labHours = toNumber(payload.labHours)
    if (labHours !== undefined) existing.labHours = labHours

    return this.curriculumRepo.save(existing)
  }

  async remove(id: number) {
    const existing = await this.curriculumRepo.findOne({ where: { id } })
    if (!existing) {
      return { deleted: false }
    }

    await this.curriculumRepo.remove(existing)
    return { deleted: true }
  }
}
