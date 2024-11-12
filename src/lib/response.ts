/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'

interface IResSuccess {
  code?: number
  msg?: string
  data?: any
  created?: number
}

interface IResErr {
  code?: number
  msg?: string
  data?: any
}

interface IResponse {
  code: number
  msg: string
  data?: any
}

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export const ResSuccess = (params?: IResSuccess) => {
  const response: IResponse = {
    code: 0,
    msg: 'success',
  }

  return NextResponse.json(
    { ...response, ...params },
    { status: 200, headers: CORS_HEADERS },
  )
}

export const ResError = (params?: IResErr) => {
  const response: IResponse = {
    code: -1,
    msg: 'error',
  }

  return NextResponse.json(
    { ...response, ...params },
    { status: 500, headers: CORS_HEADERS },
  )
}
