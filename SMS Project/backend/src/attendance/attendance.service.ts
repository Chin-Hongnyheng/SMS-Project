import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { AttendanceRecord, ClassEntity, CourseEntity, Student } from './entities'
const DEFAULT_CLASS_NAMES = ['Class A', 'Class B']
const DEFAULT_COURSE_NAMES = [
  'Bachelor degree in Nursing and Midwifery',
  'Associate degree in Nurse',
  'Continue Primary Nurse to Associate degree',
  'Continue Primary Midwife to Associate degree',
  'Continue Primary Nurse to Associate degree',
]

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(CourseEntity) private readonly courseRepo: Repository<CourseEntity>,
    @InjectRepository(ClassEntity) private readonly classRepo: Repository<ClassEntity>,
    @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
    @InjectRepository(AttendanceRecord) private readonly attendanceRepo: Repository<AttendanceRecord>,
  ) {}

  async ensureDefaultCourses(): Promise<CourseEntity[]> {
    const existingCourses = await this.courseRepo.find({ order: { id: 'ASC' } })
    const coursesByName = new Map<string, CourseEntity[]>()
    for (const course of existingCourses) {
      const list = coursesByName.get(course.name) ?? []
      list.push(course)
      coursesByName.set(course.name, list)
    }

    const requiredCounts = new Map<string, number>()
    for (const name of DEFAULT_COURSE_NAMES) {
      requiredCounts.set(name, (requiredCounts.get(name) ?? 0) + 1)
    }

    for (const [name, count] of requiredCounts.entries()) {
      const list = coursesByName.get(name) ?? []
      const missing = count - list.length
      if (missing > 0) {
        for (let i = 0; i < missing; i += 1) {
          const newCourse = this.courseRepo.create({ name })
          const saved = await this.courseRepo.save(newCourse)
          list.push(saved)
        }
        coursesByName.set(name, list)
      }
    }

    const ordered: CourseEntity[] = []
    const usedCount = new Map<string, number>()
    for (const name of DEFAULT_COURSE_NAMES) {
      const list = coursesByName.get(name) ?? []
      const index = usedCount.get(name) ?? 0
      if (list[index]) {
        ordered.push(list[index])
        usedCount.set(name, index + 1)
      }
    }

    return ordered.length > 0 ? ordered : existingCourses
  }

  async ensureDefaultClasses(): Promise<ClassEntity[]> {
    const existingClasses = await this.classRepo.find({
      order: { id: 'ASC' },
      relations: { course: true },
    })
    if (existingClasses.length > 0) {
      return existingClasses
    }

    const courses = await this.ensureDefaultCourses()
    const defaultCourse = courses[0] ?? null
    if (!defaultCourse) {
      return []
    }

    const created: ClassEntity[] = []
    for (const [index, name] of DEFAULT_CLASS_NAMES.entries()) {
      const newClass = this.classRepo.create({
        name,
        course: defaultCourse,
        year: 1,
        module: `Module ${index + 1}`,
      })
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

  async getCourses() {
    const courses = await this.ensureDefaultCourses()
    return courses.map((course) => ({ id: course.id, name: course.name }))
  }

  async getClasses() {
    const courses = await this.ensureDefaultCourses()
    const defaultCourse = courses[0] ?? null

    let classes = await this.classRepo.find({
      order: { id: 'ASC' },
      relations: { course: true },
    })
    if (classes.length === 0) {
      await this.ensureDefaultClasses()
      classes = await this.classRepo.find({
        order: { id: 'ASC' },
        relations: { course: true },
      })
    }

    if (defaultCourse) {
      const missingCourse = classes.filter((item) => !item.course)
      if (missingCourse.length > 0) {
        for (const item of missingCourse) {
          item.course = defaultCourse
          await this.classRepo.save(item)
        }
        classes = await this.classRepo.find({
          order: { id: 'ASC' },
          relations: { course: true },
        })
      }
    }

    return classes.map((item) => ({
      id: item.id,
      name: item.name,
      year: item.year,
      module: item.module,
      courseId: item.course?.id ?? null,
      courseName: item.course?.name ?? 'Unknown Course',
    }))
  }

  async addClass(payload: { name?: string; courseId?: number; year?: number; module?: string }) {
    const courses = await this.ensureDefaultCourses()
    let course: CourseEntity | null = null

    const courseId = payload.courseId ? Number(payload.courseId) : undefined
    if (courseId) {
      course = await this.courseRepo.findOne({ where: { id: courseId } })
    }

    if (!course) {
      course = courses[0] ?? null
    }

    if (!course) {
      throw new Error('Course not found')
    }

    const year = payload.year ? Number(payload.year) : 1
    const moduleName = payload.module?.trim() || 'Module 1'

    const existing = await this.classRepo.findOne({
      where: {
        course: { id: course.id },
        year,
        module: moduleName,
      },
      relations: { course: true },
    })

    if (existing) {
      return {
        id: existing.id,
        name: existing.name,
        year: existing.year,
        module: existing.module,
        courseId: existing.course?.id ?? null,
        courseName: existing.course?.name ?? 'Unknown Course',
      }
    }

    const name = payload.name?.trim() || `${course.name} - Year ${year} - ${moduleName}`
    const created = this.classRepo.create({
      name,
      course,
      year,
      module: moduleName,
    })
    const saved = await this.classRepo.save(created)
    return {
      id: saved.id,
      name: saved.name,
      year: saved.year,
      module: saved.module,
      courseId: course.id,
      courseName: course.name,
    }
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

  async updateStudent(payload: {
    studentCode: string
    fullName?: string
    newStudentCode?: string
    classId?: number
  }) {
    let student = await this.studentRepo.findOne({ where: { studentCode: payload.studentCode } })
    if (!student) {
      throw new Error('Student not found')
    }

    const nextCode = payload.newStudentCode?.trim() || student.studentCode
    if (nextCode !== student.studentCode) {
      const existing = await this.studentRepo.findOne({ where: { studentCode: nextCode } })
      if (existing && existing.id !== student.id) {
        throw new Error('Student code already exists')
      }
      student.studentCode = nextCode
    }

    if (payload.fullName) {
      student.fullName = payload.fullName.trim()
    }

    if (payload.classId) {
      const classEntity = await this.classRepo.findOne({ where: { id: payload.classId } })
      if (!classEntity) {
        throw new Error('Class not found')
      }
      student.classEntity = classEntity
    }

    student = await this.studentRepo.save(student)
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

    const student = await this.studentRepo.findOne({
      where: { studentCode: payload.studentCode },
      relations: { classEntity: true },
    })
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
    const monthStart = new Date(Date.UTC(dateValue.getUTCFullYear(), dateValue.getUTCMonth(), 1))
    const monthEnd = new Date(Date.UTC(dateValue.getUTCFullYear(), dateValue.getUTCMonth() + 1, 0))
    const totalDays = monthEnd.getUTCDate()

    const existingRecords = await this.attendanceRepo.find({
      where: {
        classEntity: { id: classEntity.id },
        student: { id: student.id },
        attendanceDate: Between(monthStart, monthEnd),
      },
    })

    const byDate = new Map<string, AttendanceRecord>()
    for (const record of existingRecords) {
      const recordDate =
        record.attendanceDate instanceof Date
          ? record.attendanceDate
          : new Date(record.attendanceDate)
      const key = recordDate.toISOString().slice(0, 10)
      byDate.set(key, record)
    }

    const toCreate: AttendanceRecord[] = []
    for (let day = 1; day <= totalDays; day += 1) {
      const dayDate = new Date(Date.UTC(dateValue.getUTCFullYear(), dateValue.getUTCMonth(), day))
      const key = dayDate.toISOString().slice(0, 10)
      if (!byDate.has(key)) {
        toCreate.push(
          this.attendanceRepo.create({
            classEntity,
            student,
            attendanceDate: dayDate,
            present: false,
          }),
        )
      }
    }

    if (toCreate.length > 0) {
      await this.attendanceRepo.save(toCreate)
    }

    const targetKey = dateValue.toISOString().slice(0, 10)
    let target: AttendanceRecord | null = byDate.get(targetKey) ?? null
    if (!target) {
      target = await this.attendanceRepo.findOne({
        where: {
          classEntity: { id: classEntity.id },
          student: { id: student.id },
          attendanceDate: dateValue,
        },
      })
    }

    if (!target) {
      target = this.attendanceRepo.create({
        classEntity,
        student,
        attendanceDate: dateValue,
        present: payload.present,
      })
    } else {
      target.present = payload.present
    }

    await this.attendanceRepo.save(target)
    return { updated: true }
  }
}
