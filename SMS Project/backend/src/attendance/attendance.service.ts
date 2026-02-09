import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, FindOptionsWhere, Repository } from 'typeorm'
import { AttendanceRecord, ClassEntity } from './entities'
import { Course } from '../course/entity/course.entity'
import { Student } from '../dashboard/students/entities/student.entity'
import { Subject } from '../curriculum/entities/curriculum.entity'
const DEFAULT_COURSE_NAMES = [
  'Bachelor degree in Nursing and Midwifery',
  'Associate degree in Nurse',
  'Continue Primary Nurse to Associate degree',
  'Continue Primary Midwife to Associate degree',
  'Continue Primary Nurse to Associate degree',
]
const DEFAULT_COURSE_IMAGE = 'placeholder.png'
const DEFAULT_STUDENT_TEXT = 'N/A'
const ALLOWED_YEARS = new Set([1, 2, 3, 4, 5])
const ALLOWED_MODULES = ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5']

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Course) private readonly courseRepo: Repository<Course>,
    @InjectRepository(ClassEntity) private readonly classRepo: Repository<ClassEntity>,
    @InjectRepository(Subject) private readonly subjectRepo: Repository<Subject>,
    @InjectRepository(Student) private readonly studentRepo: Repository<Student>,
    @InjectRepository(AttendanceRecord) private readonly attendanceRepo: Repository<AttendanceRecord>,
  ) {}

  private buildStudentDefaults(classEntity: ClassEntity | null) {
    const className = classEntity?.name ?? 'Unknown Class'
    const courseName = classEntity?.course?.courseName ?? 'Unknown Course'
    const yearValue = classEntity?.year ?? 1

    return {
      class: className,
      major: courseName,
      group: className,
      year: yearValue,
      generation: String(yearValue),
      location: DEFAULT_STUDENT_TEXT,
      contact: DEFAULT_STUDENT_TEXT,
      exam: DEFAULT_STUDENT_TEXT,
    }
  }

  async ensureDefaultCourses(): Promise<Course[]> {
    const existingCourses = await this.courseRepo.find({ order: { id: 'ASC' } })
    const coursesByName = new Map<string, Course[]>()
    for (const course of existingCourses) {
      const list = coursesByName.get(course.courseName) ?? []
      list.push(course)
      coursesByName.set(course.courseName, list)
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
          const newCourse = this.courseRepo.create({
            courseName: name,
            image: DEFAULT_COURSE_IMAGE,
          })
          const saved = await this.courseRepo.save(newCourse)
          list.push(saved)
        }
        coursesByName.set(name, list)
      }
    }

    const ordered: Course[] = []
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
    let classes = await this.classRepo.find({
      order: { id: 'ASC' },
      relations: { course: true, subject: true },
    })

    if (classes.length === 0) {
      return classes
    }

    const courses = await this.ensureDefaultCourses()
    const defaultCourse = courses[0] ?? null
    if (defaultCourse) {
      const missingCourse = classes.filter((item) => !item.course)
      if (missingCourse.length > 0) {
        for (const item of missingCourse) {
          item.course = defaultCourse
          await this.classRepo.save(item)
        }
        classes = await this.classRepo.find({
          order: { id: 'ASC' },
          relations: { course: true, subject: true },
        })
      }
    }

    return classes
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
    return courses.map((course) => ({ id: course.id, name: course.courseName }))
  }

  async getClasses() {
    const classes = await this.ensureDefaultClasses()
    const filtered = classes.filter(
      (item) => ALLOWED_YEARS.has(item.year) && ALLOWED_MODULES.includes(item.module),
    )

    return filtered.map((item) => ({
      id: item.id,
      name: item.name,
      year: item.year,
      module: item.module,
      courseId: item.course?.id ?? null,
      courseName: item.course?.courseName ?? 'Unknown Course',
      subjectId: item.subject?.id ?? null,
      subjectName: item.subject?.name ?? null,
    }))
  }

  async addClass(payload: {
    name?: string
    courseId?: number
    subjectId?: number
    year?: number
    module?: string
  }) {
    const courses = await this.ensureDefaultCourses()
    let course: Course | null = null
    let subject: Subject | null = null

    const courseId = payload.courseId ? Number(payload.courseId) : undefined
    if (payload.subjectId) {
      subject = await this.subjectRepo.findOne({
        where: { id: Number(payload.subjectId) },
        relations: { course: true },
      })
      if (!subject) {
        throw new Error('Subject not found')
      }
      course = subject.course ?? null
    } else if (courseId) {
      course = await this.courseRepo.findOne({ where: { id: courseId } })
    }

    if (!course) {
      course = courses[0] ?? null
    }

    if (!course) {
      throw new Error('Course not found')
    }

    const year = payload.year
      ? Number(payload.year)
      : subject?.year
        ? Number(subject.year)
        : 1
    if (!ALLOWED_YEARS.has(year)) {
      throw new Error('Year must be between 1 and 5')
    }

    const moduleRaw =
      payload.module?.trim() ||
      (subject ? `Module ${subject.semester}` : 'Module 1')
    const moduleName =
      ALLOWED_MODULES.find((value) => value.toLowerCase() === moduleRaw.toLowerCase()) ?? null
    if (!moduleName) {
      throw new Error('Module must be Module 1-5')
    }

    const existing = await this.classRepo.find({
      where: {
        course: { id: course.id },
        year,
        module: moduleName,
        ...(subject ? { subject: { id: subject.id } } : {}),
      },
      relations: { course: true, subject: true },
      order: { id: 'ASC' },
    })

    const trimmedName = payload.name?.trim()
    if (trimmedName) {
      const duplicate = existing.find(
        (item) => item.name.trim().toLowerCase() === trimmedName.toLowerCase(),
      )
      if (duplicate) {
        return {
          id: duplicate.id,
          name: duplicate.name,
          year: duplicate.year,
          module: duplicate.module,
          courseId: duplicate.course?.id ?? null,
          courseName: duplicate.course?.courseName ?? 'Unknown Course',
          subjectId: duplicate.subject?.id ?? null,
          subjectName: duplicate.subject?.name ?? null,
        }
      }
    }

    let name = trimmedName
    if (!name) {
      const usedNumbers = new Set<number>()
      for (const item of existing) {
        const match = item.name.match(/class\s*(\d+)/i)
        if (match) {
          usedNumbers.add(Number(match[1]))
        }
      }
      let nextNumber = 1
      while (usedNumbers.has(nextNumber)) {
        nextNumber += 1
      }
      name = `Class ${nextNumber}`
    }
    const created = this.classRepo.create({
      name,
      course,
      year,
      module: moduleName,
      subject: subject ?? null,
    })
    const saved = await this.classRepo.save(created)
    return {
      id: saved.id,
      name: saved.name,
      year: saved.year,
      module: saved.module,
      courseId: course.id,
      courseName: course.courseName,
      subjectId: subject?.id ?? null,
      subjectName: subject?.name ?? null,
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
      classEntity = await this.classRepo.findOne({
        where: { id: classId },
        relations: { course: true },
      })
    }

    const { start, end } = this.getMonthRange(month)
    const totalDays = end.getUTCDate()
    const days = Array.from({ length: totalDays }, (_, index) => index + 1)

    if (!classEntity) {
      return { days, students: [] }
    }

    const where: FindOptionsWhere<Student> = {
      class: classEntity.name,
    }
    if (classEntity.course?.courseName) {
      where.major = classEntity.course.courseName
    }
    const classStudents = await this.studentRepo.find({
      where,
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
      id: student.studentId,
      name: student.name,
      presentDays: attendanceMap.get(student.id) ?? [],
    }))

    return { days, students }
  }

  async addStudent(payload: { studentCode: string; fullName: string; classId?: number }) {
    let classEntity: ClassEntity | null = null

    if (payload.classId) {
      classEntity = await this.classRepo.findOne({
        where: { id: payload.classId },
        relations: { course: true },
      })
    }

    if (!classEntity) {
      throw new Error('Class not found')
    }

    const defaults = this.buildStudentDefaults(classEntity)
    let student = await this.studentRepo.findOne({ where: { studentId: payload.studentCode } })
    if (!student) {
      student = this.studentRepo.create({
        studentId: payload.studentCode,
        name: payload.fullName,
        ...defaults,
      })
      student = await this.studentRepo.save(student)
      return {
        id: student.studentId,
        name: student.name,
      }
    }

    student.name = payload.fullName
    student.class = defaults.class
    student.major = defaults.major
    student.group = defaults.group
    student.year = defaults.year
    student.generation = defaults.generation
    student.location = defaults.location
    student.contact = defaults.contact
    student.exam = defaults.exam
    student = await this.studentRepo.save(student)

    return {
      id: student.studentId,
      name: student.name,
    }
  }

  async updateStudent(payload: {
    studentCode: string
    fullName?: string
    newStudentCode?: string
    classId?: number
  }) {
    let student = await this.studentRepo.findOne({ where: { studentId: payload.studentCode } })
    if (!student) {
      throw new Error('Student not found')
    }

    const nextCode = payload.newStudentCode?.trim() || student.studentId
    if (nextCode !== student.studentId) {
      const existing = await this.studentRepo.findOne({ where: { studentId: nextCode } })
      if (existing && existing.id !== student.id) {
        throw new Error('Student code already exists')
      }
      student.studentId = nextCode
    }

    if (payload.fullName) {
      student.name = payload.fullName.trim()
    }

    if (payload.classId) {
      const classEntity = await this.classRepo.findOne({
        where: { id: payload.classId },
        relations: { course: true },
      })
      if (!classEntity) {
        throw new Error('Class not found')
      }
      const defaults = this.buildStudentDefaults(classEntity)
      student.class = defaults.class
      student.major = defaults.major
      student.group = defaults.group
      student.year = defaults.year
      student.generation = defaults.generation
      student.location = defaults.location
      student.contact = defaults.contact
      student.exam = defaults.exam
    }

    student = await this.studentRepo.save(student)
    return {
      id: student.studentId,
      name: student.name,
    }
  }

  async removeStudentFromClass(payload: { classId: number; studentCode: string }) {
    const classEntity = await this.classRepo.findOne({
      where: { id: payload.classId },
      relations: { course: true },
    })
    if (!classEntity) {
      throw new Error('Class not found')
    }

    const student = await this.studentRepo.findOne({
      where: { studentId: payload.studentCode },
    })
    if (!student) {
      return { removed: false }
    }

    if (student.class !== classEntity.name) {
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

    const student = await this.studentRepo.findOne({ where: { studentId: payload.studentCode } })
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
