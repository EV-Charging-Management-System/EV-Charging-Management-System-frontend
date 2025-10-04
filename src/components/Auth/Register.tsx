'use client'

import type React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useAuth } from '../../hooks/useAuth'
import Button from '../Common/Button'
import Input from '../Common/Input'
import type { RegisterRequest } from '../../utils/types'
import Logo from '../../assets/logo.png'
import { parse, isValid, differenceInYears } from 'date-fns'

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    Email: '',
    PasswordHash: '',
    ConfirmPassword: '',
    FullName: '',
    PhoneNumber: '',
    Address: '',
    DateOfBirth: '',
    SignatureImage: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setFormData((prev) => ({ ...prev, SignatureImage: base64String }))
    }
    reader.readAsDataURL(file)
  }

  const validationSchema = Yup.object({
    Email: Yup.string().email('Invalid email').required('Required'),
    PasswordHash: Yup.string().min(8, 'Password must be at least 8 characters').required('Required'),
    ConfirmPassword: Yup.string()
      .oneOf([Yup.ref('PasswordHash')], 'Passwords must match')
      .required('Required'),
    FullName: Yup.string().required('Required'),
    PhoneNumber: Yup.string()
      .matches(/^(0|\+84)[0-9]{9}$/, 'Số điện thoại không hợp lệ')
      .required('Bắt buộc nhập số điện thoại'),
    Address: Yup.string().required('Required'),

    DateOfBirth: Yup.string()
      .required('Bắt buộc nhập ngày sinh')
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Định dạng ngày sinh phải là YYYY-MM-DD')
      .test('is-18-or-older', 'Bạn phải từ 18 tuổi trở lên', (value) => {
        if (!value) return false
        const birthDate = parse(value, 'yyyy-MM-dd', new Date())
        if (!isValid(birthDate)) return false
        return differenceInYears(new Date(), birthDate) >= 18
      }),
    SignatureImage: Yup.string().required('Required')
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await validationSchema.validate(formData, { abortEarly: false })
      setFieldErrors({})
    } catch (err: any) {
      const errors: Record<string, string> = {}
      err.inner.forEach((e: Yup.ValidationError) => {
        if (e.path) errors[e.path] = e.message
      })
      setFieldErrors(errors)
      setLoading(false)
      return
    }

    try {
      const response = await register(formData)
      setSuccessMessage(response.message || 'Register successful! Redirecting...')
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (error: any) {
      const message = error?.message || String(error)
      const cleaned = message.replace('Error:', '').trim()
      setError('Một số thông tin đang lỗi như: ' + cleaned)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <div className='mx-auto h-20 w-20 flex items-center justify-center rounded-full '>
            <img src={Logo} alt='' />
          </div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Tạo tài khoản của bạn</h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Hoặc{' '}
            <Link to='/login' className='font-medium text-teal-600 hover:text-teal-500'>
              Đăng nhập
            </Link>
          </p>
        </div>

        {successMessage && (
          <div className='bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md'>
            {successMessage}
          </div>
        )}
        {error && <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md'>{error}</div>}

        <form className='space-y-4' onSubmit={handleSubmit}>
          <Input
            label='Email '
            type='email'
            name='Email'
            value={formData.Email}
            onChange={handleChange}
            required
            placeholder='Nhập Email của bạn'
            error={fieldErrors.Email}
          />
          <Input
            label='Mật khẩu'
            type='password'
            name='PasswordHash'
            value={formData.PasswordHash}
            onChange={handleChange}
            required
            placeholder='Nhập mật khẩu'
            error={fieldErrors.PasswordHash}
          />
          <Input
            label='Xác nhận mật khẩu'
            type='password'
            name='ConfirmPassword'
            value={formData.ConfirmPassword}
            onChange={handleChange}
            required
            placeholder='Xác nhận mật khẩu của bạn'
            error={fieldErrors.ConfirmPassword}
          />
          <Input
            label='Họ Tên'
            type='text'
            name='FullName'
            value={formData.FullName}
            onChange={handleChange}
            required
            placeholder='Nhập Họ Tên của bạn'
            error={fieldErrors.FullName}
          />
          <Input
            label='Số điện thoại'
            type='text'
            name='PhoneNumber'
            value={formData.PhoneNumber}
            onChange={handleChange}
            required
            placeholder='Nhập số điện thoại của bạn'
            error={fieldErrors.PhoneNumber}
          />
          <Input
            label='Địa chỉ'
            type='text'
            name='Address'
            value={formData.Address}
            onChange={handleChange}
            required
            placeholder='Nhập địa chỉ nhà của bạn'
            error={fieldErrors.Address}
          />
          <Input
            label='Ngày Sinh'
            type='date'
            name='DateOfBirth'
            value={formData.DateOfBirth}
            onChange={handleChange}
            required
            placeholder='Ngày Tháng Năm Sinh của bạn'
            error={fieldErrors.DateOfBirth}
          />

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Hình ảnh vân tay của bạn *</label>
            <Input
              type='file'
              name='SignatureImage'
              accept='image/*'
              onChange={handleImageChange}
              className='w-full px-4 py-2 border border-gray-300 rounded-md'
              required
            />
          </div>

          <div className='flex items-center'>
            <Input
              id='agree-terms'
              name='agree-terms'
              type='checkbox'
              required
              className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
            />
            <label htmlFor='agree-terms' className='ml-2 block text-sm text-gray-900'>
              Tôi đồng ý với các{' '}
              <Link to='/terms' target='_blank' rel='noopener noreferrer' className='text-teal-600 hover:text-teal-500'>
                Điều khoản và Điều kiện
              </Link>
            </label>
          </div>

          <Button type='submit' className='w-full' loading={loading}>
            Tạo Tài Khoản
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Register
