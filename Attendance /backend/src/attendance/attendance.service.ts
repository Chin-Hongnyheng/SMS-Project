import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { AttendanceRecord, ClassEntity, Student } from './entities'
const DEFAULT_CLASS_NAMES = ['Class A', 'Class B']

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(ClassEntity) private readonly classRepo: Repository<ClassEntity>,
    @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
    @InjectRepository(AttendanceRecord) private readonly attendanceRepo: Repository<AttendanceRecord>,
  ) {}

  async ensureDefaultClasses(): Promise<ClassEntity[]> {
    const existingClasses = await this.classRepo.find({ order: { id: 'ASC' } })
    if (existingClasses.length > 0) {
      return existingClasses
    }

    const created: ClassEntity[] = []
    for (const name of DEFAULT_CLASS_NAMES) {
      const newClass = this.classRepo.create({ name })
      created.push(await this.classRepo.save(newClass))
    }

    return created
  }

  private getMonthRange(month?: string) {
    if (!month) {
      const now = new Date()
      const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
      const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0))
      return { start, end }
    }

    const [year, monthIndex] = month.split('-').map(Number)
    const start = new Date(Date.UTC(year, monthIndex - 1, 1))
    const end = new Date(Date.UTC(year, monthIndex, 0))
    return { start, end }
  }

  async getClasses() {
    const classes = await this.ensureDefaultClasses()
    return classes.map((item) => ({ id: item.id, name: item.name }))
  }

  async addClass(payload: { name: string }) {
    const classes = await this.ensureDefaultClasses()
    const existing = classes.find((item) => item.name.toLowerCase() === payload.name.toLowerCase())
    if (existing) {
      return { id: existing.id, name: existing.name }
    }
    const created = this.classRepo.create({ name: payload.name })
    const saved = await this.classRepo.save(created)
    return { id: saved.id, name: saved.name }
  }

  async deleteClass(payload: { classId: number }) {
    const classEntity = await this.classRepo.findOne({ where: { id: payload.classId } })
    if (!classEntity) {
      return { deleted: false }
    }

    await this.classRepo.remove(classEntity)
    return { deleted: true }
  }

  async getAttendance(classId?: number, month?: string) {
    let classEntity: ClassEntity | null = null

    if (classId) {
      classEntity = await this.classRepo.findOne({ where: { id: classId } })
    }

    if (!classEntity) {
      const classes = await this.ensureDefaultClasses()
      classEntity = classes[0] ?? null
    }

    if (!classEntity) {
      return { days: [], students: [] }
    }

    const { start, end } = this.getMonthRange(month)
    const totalDays = end.getUTCDate()
    const days = Array.from({ length: totalDays }, (_, index) => index + 1)

    const classStudents = await this.studentRepo.find({
      where: { classEntity: { id: classEntity.id } },
      order: { id: 'ASC' },
    })

    const attendance = await this.attendanceRepo.find({
      where: {
        classEntity: { id: classEntity.id },
        attendanceDate: Between(start, end),
      },
      relations: { student: true },
    })

    const attendanceMap = new Map<number, number[]>()
    for (const record of attendance) {
      if (!record.present) continue
      const dateValue =
        record.attendanceDate instanceof Date
          ? record.attendanceDate
          : new Date(record.attendanceDate)
      const day = dateValue.getUTCDate()
      const list = attendanceMap.get(record.student.id) ?? []
      list.push(day)
      attendanceMap.set(record.student.id, list)
    }

    const students = classStudents.map((student) => ({
      id: student.studentCode,
      name: student.fullName,
      presentDays: attendanceMap.get(student.id) ?? [],
    }))

    return { days, students }
  }

  async addStudent(payload: { studentCode: string; fullName: string; classId?: number }) {
    let classEntity: ClassEntity | null = null

    if (payload.classId) {
      classEntity = await this.classRepo.findOne({ where: { id: payload.classId } })
    }

    if (!classEntity) {
      const classes = await this.ensureDefaultClasses()
      classEntity = classes[0] ?? null
    }

    if (!classEntity) {
      throw new Error('Class not found')
    }

    let student = await this.studentRepo.findOne({ where: { studentCode: payload.studentCode } })
    if (!student) {
      student = this.studentRepo.create({
        studentCode: payload.studentCode,
        fullName: payload.fullName,
        classEntity,
      })
      student = await this.studentRepo.save(student)
      return {
        id: student.studentCode,
        name: student.fullName,
      }
    }

    if (!student.classEntity || student.classEntity.id !== classEntity.id) {
      student.classEntity = classEntity
      student = await this.studentRepo.save(student)
    }

    return {
      id: student.studentCode,
      name: student.fullName,
    }
  }

  async removeStudentFromClass(payload: { classId: number; studentCode: string }) {
    const classEntity = await this.classRepo.findOne({ where: { id: payload.classId } })
    if (!classEntity) {
      throw new Error('Class not found')
    }

    const student = await this.studentRepo.findOne({ where: { studentCode: payload.studentCode } })
    if (!student) {
      return { removed: false }
    }

    if (!student.classEntity || student.classEntity.id !== classEntity.id) {
      return { removed: false }
    }

    await this.studentRepo.remove(student)
    return { removed: true }
  }

  async updateAttendance(payload: {
    classId: number
    studentCode: string
    attendanceDate: string
    present: boolean
  }) {
    const classEntity = await this.classRepo.findOne({ where: { id: payload.classId } })
    if (!classEntity) {
      throw new Error('Class not found')
    }

    const student = await this.studentRepo.findOne({ where: { studentCode: payload.studentCode } })
    if (!student) {
      throw new Error('Student not found')
    }

    const dateValue = new Date(`${payload.attendanceDate}T00:00:00Z`)
    const existing = await this.attendanceRepo.findOne({
      where: {
        classEntity: { id: classEntity.id },
        student: { id: student.id },
        attendanceDate: dateValue,
      },
    })

    if (existing) {
      existing.present = payload.present
      await this.attendanceRepo.save(existing)
      return { updated: true }
    }

    if (!payload.present) {
      return { updated: false }
    }

    const created = this.attendanceRepo.create({
      classEntity,
      student,
      attendanceDate: dateValue,
      present: true,
    })
    await this.attendanceRepo.save(created)
    return { updated: true }
  }
}
