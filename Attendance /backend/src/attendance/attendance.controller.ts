import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common'
import { AttendanceService } from './attendance.service'

@Controller()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('classes')
  async getClasses() {
    return this.attendanceService.getClasses()
  }

  @Post('classes')
  async addClass(@Body() body: { name?: string }) {
    if (!body?.name) {
      return { error: 'name is required' }
    }

    return this.attendanceService.addClass({ name: body.name })
  }

  @Delete('classes/:classId')
  async deleteClass(@Param('classId') classId: string, @Query('confirm') confirm?: string) {
    if (!confirm || confirm.toLowerCase() !== 'confirm') {
      return { error: 'confirmation required' }
    }

    return this.attendanceService.deleteClass({ classId: Number(classId) })
  }

  @Get('attendance')
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
    if (!body?.studentCode || !body?.fullName) {
      return { error: 'studentCode and fullName are required' }
    }

    return this.attendanceService.addStudent({
      studentCode: body.studentCode,
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

  @Put('attendance')
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
