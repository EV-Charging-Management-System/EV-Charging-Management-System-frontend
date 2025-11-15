import * as Yup from 'yup';

// ===== LOGIN VALIDATION SCHEMA =====
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  password: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
});

// ===== REGISTER VALIDATION SCHEMA =====
export const registerSchema = Yup.object().shape({
  Email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  FullName: Yup.string()
    .min(2, 'Họ tên phải có ít nhất 2 ký tự')
    .max(50, 'Họ tên không được quá 50 ký tự')
    .required('Vui lòng nhập họ và tên'),
  PasswordHash: Yup.string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .max(100, 'Mật khẩu không được quá 100 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'
    )
    .required('Vui lòng nhập mật khẩu'),
  ConfirmPassword: Yup.string()
    .oneOf([Yup.ref('PasswordHash')], 'Mật khẩu xác nhận không khớp')
    .required('Vui lòng xác nhận mật khẩu'),
});

// ===== VEHICLE VALIDATION SCHEMA =====
export const vehicleSchema = Yup.object().shape({
  vehicleName: Yup.string()
    .min(2, 'Tên xe phải có ít nhất 2 ký tự')
    .max(50, 'Tên xe không được quá 50 ký tự')
    .required('Vui lòng nhập tên xe'),
  vehicleType: Yup.string()
    .min(2, 'Loại xe phải có ít nhất 2 ký tự')
    .max(30, 'Loại xe không được quá 30 ký tự')
    .required('Vui lòng nhập loại xe'),
  licensePlate: Yup.string()
    .matches(
      /^[0-9]{2}[A-Z]{1,2}-[0-9]{3,5}\.[0-9]{2}$/,
      'Biển số xe không hợp lệ (VD: 51H-123.45)'
    )
    .required('Vui lòng nhập biển số xe'),
  battery: Yup.number()
    .positive('Dung lượng pin phải là số dương')
    .min(0.1, 'Dung lượng pin phải lớn hơn 0')
    .max(1000, 'Dung lượng pin không được quá 1000 kWh')
    .nullable()
    .transform((value, originalValue) => 
      originalValue === '' ? null : value
    ),
});
