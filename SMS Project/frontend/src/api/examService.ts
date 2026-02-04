import axios, { AxiosInstance } from 'axios'
import { SMS_API_BASE_URL } from '@/config/api'

const API_URL = SMS_API_BASE_URL

interface PaginatedResponse<T> {
  data: T[]
  total: number
}

// Helper to set authorization header
function setAuthHeader(config: any) {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

// Exam Types API Service
class ExamTypesService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/exam-types`,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // Add auth interceptor
    this.api.interceptors.request.use(setAuthHeader)
  }

  async getAll(skip = 0, take = 10): Promise<PaginatedResponse<any>> {
    const response = await this.api.get('/', {
      params: { skip, take },
    })
    return response.data
  }

  async getById(id: string): Promise<any> {
    const response = await this.api.get(`/${id}`)
    return response.data
  }

  async create(data: any): Promise<any> {
    const response = await this.api.post('/', data)
    return response.data
  }

  async update(id: string, data: any): Promise<any> {
    const response = await this.api.patch(`/${id}`, data)
    return response.data
  }

  async delete(id: string): Promise<any> {
    const response = await this.api.delete(`/${id}`)
    return response.data
  }

  async toggleStatus(id: string): Promise<any> {
    const response = await this.api.patch(`/${id}/toggle-status`)
    return response.data
  }
}

// Exam Schedules API Service
class ExamSchedulesService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/exam-schedules`,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // Add auth interceptor
    this.api.interceptors.request.use(setAuthHeader)
  }

  async getAll(
    skip = 0,
    take = 10,
    examTypeId?: string,
    examDate?: string,
  ): Promise<PaginatedResponse<any>> {
    const response = await this.api.get('/', {
      params: { skip, take, examTypeId, examDate },
    })
    return response.data
  }

  async getById(id: string): Promise<any> {
    const response = await this.api.get(`/${id}`)
    return response.data
  }

  async create(data: any): Promise<any> {
    const response = await this.api.post('/', data)
    return response.data
  }

  async update(id: string, data: any): Promise<any> {
    const response = await this.api.patch(`/${id}`, data)
    return response.data
  }

  async delete(id: string): Promise<any> {
    const response = await this.api.delete(`/${id}`)
    return response.data
  }

  async changeStatus(id: string, status: string): Promise<any> {
    const response = await this.api.patch(`/${id}/status`, { status })
    return response.data
  }
}

// Exam Results API Service
class ExamResultsService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/exam-results`,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    // Add auth interceptor
    this.api.interceptors.request.use(setAuthHeader)
  }

  async getAll(
    skip = 0,
    take = 10,
    studentId?: string,
    examScheduleId?: string,
  ): Promise<PaginatedResponse<any>> {
    const response = await this.api.get('/', {
      params: { skip, take, studentId, examScheduleId },
    })
    return response.data
  }

  async getById(id: string): Promise<any> {
    const response = await this.api.get(`/${id}`)
    return response.data
  }

  async create(data: any): Promise<any> {
    const response = await this.api.post('/', data)
    return response.data
  }

  async update(id: string, data: any): Promise<any> {
    const response = await this.api.patch(`/${id}`, data)
    return response.data
  }

  async delete(id: string): Promise<any> {
    const response = await this.api.delete(`/${id}`)
    return response.data
  }

  async search(studentId?: string, examScheduleId?: string): Promise<any[]> {
    const response = await this.api.get('/search/query', {
      params: { studentId, examScheduleId },
    })
    return response.data
  }
}

// Export singletons
export const examTypesService = new ExamTypesService()
export const examSchedulesService = new ExamSchedulesService()
export const examResultsService = new ExamResultsService()
