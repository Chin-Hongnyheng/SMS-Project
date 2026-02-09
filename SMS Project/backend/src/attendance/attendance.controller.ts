import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { AttendanceService } from './attendance.service'

const ALLOWED_YEARS = new Set([1, 2, 3, 4, 5])
const ALLOWED_MODULES = ['Module 1', 'Module 2', 'Module 3', 'Module 4', 'Module 5']

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('classes')
  async getClasses() {
    return this.attendanceService.getClasses()
  }

  @Get('courses')
  async getCourses() {
    return this.attendanceService.getCourses()
  }

  @Post('classes')
  async addClass(
    @Body()
    body: {
      name?: string
      courseId?: number
      subjectId?: number
      year?: number
      module?: string
    },
  ) {
    if (!body?.name && !body?.courseId && !body?.subjectId) {
      return { error: 'courseId, subjectId, or name is required' }
    }

    const year = body.year ? Number(body.year) : undefined
    if (year !== undefined && !ALLOWED_YEARS.has(year)) {
      return { error: 'year must be between 1 and 5' }
    }

    let moduleName: string | undefined
    if (body.module) {
      const moduleRaw = body.module.trim()
      moduleName = ALLOWED_MODULES.find(
        (value) => value.toLowerCase() === moduleRaw.toLowerCase(),
      )
      if (!moduleName) {
        return { error: 'module must be Module 1-5' }
      }
    }

    return this.attendanceService.addClass({
      name: body.name,
      courseId: body.courseId,
      subjectId: body.subjectId,
      year,
      module: moduleName,
    })
  }

  @Delete('classes/:classId')
  async deleteClass(@Param('classId') classId: string, @Query('confirm') confirm?: string) {
    if (!confirm || confirm.toLowerCase() !== 'confirm') {
      return { error: 'confirmation required' }
    }

    return this.attendanceService.deleteClass({ classId: Number(classId) })
  }

  @Get()
  async getAttendance(
    @Query('classId') classId?: string,
    @Query('month') month?: string,
  ) {
    const parsedId = classId ? Number(classId) : undefined
    return this.attendanceService.getAttendance(parsedId, month)
  }

  @Post('students')
  async addStudent(
    @Body() body: { studentCode?: string; fullName?: string; classId?: number },
  ) {
    if (!body?.studentCode || !body?.fullName || !body?.classId) {
      return { error: 'studentCode, fullName, and classId are required' }
    }

    return this.attendanceService.addStudent({
      studentCode: body.studentCode,
      fullName: body.fullName,
      classId: body.classId,
    })
  }

  @Put('students/:studentCode')
  async updateStudent(
    @Param('studentCode') studentCode: string,
    @Body() body: { studentCode?: string; fullName?: string; classId?: number },
  ) {
    if (!body?.studentCode && !body?.fullName && !body?.classId) {
      return { error: 'studentCode, fullName, or classId is required' }
    }

    return this.attendanceService.updateStudent({
      studentCode,
      newStudentCode: body.studentCode,
      fullName: body.fullName,
      classId: body.classId,
    })
  }

  @Delete('classes/:classId/students/:studentCode')
  async removeStudent(
    @Param('classId') classId: string,
    @Param('studentCode') studentCode: string,
  ) {
    return this.attendanceService.removeStudentFromClass({
      classId: Number(classId),
      studentCode,
    })
  }

  @Put()
  async updateAttendance(
    @Body()
    body: {
      classId?: number
      studentCode?: string
      attendanceDate?: string
      present?: boolean
    },
  ) {
    if (!body?.classId || !body?.studentCode || !body?.attendanceDate) {
      return { error: 'classId, studentCode, attendanceDate are required' }
    }

    return this.attendanceService.updateAttendance({
      classId: body.classId,
      studentCode: body.studentCode,
      attendanceDate: body.attendanceDate,
      present: Boolean(body.present),
    })
  }
}
