import * as Yup from 'yup';

// ===== LOGIN VALIDATION SCHEMA =====
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Please enter email'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Please enter password'),
});

// ===== REGISTER VALIDATION SCHEMA =====
export const registerSchema = Yup.object().shape({
  Email: Yup.string()
    .email('Invalid email')
    .required('Please enter email'),
  FullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters')
    .required('Please enter full name'),
  PasswordHash: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least 1 uppercase, 1 lowercase and 1 number'
    )
    .required('Please enter password'),
  ConfirmPassword: Yup.string()
    .oneOf([Yup.ref('PasswordHash')], 'Confirm password does not match')
    .required('Please confirm password'),
});

// ===== VEHICLE VALIDATION SCHEMA =====
export const vehicleSchema = Yup.object().shape({
  vehicleName: Yup.string()
    .min(2, 'Vehicle name must be at least 2 characters')
    .max(50, 'Vehicle name must not exceed 50 characters')
    .required('Please enter vehicle name'),
  vehicleType: Yup.string()
    .min(2, 'Vehicle type must be at least 2 characters')
    .max(30, 'Vehicle type must not exceed 30 characters')
    .required('Please enter vehicle type'),
  licensePlate: Yup.string()
    .matches(
      /^[0-9]{2}[A-Z]{1,2}-[0-9]{3,5}\.[0-9]{2}$/,
      'Invalid license plate (e.g.: 51H-123.45)'
    )
    .required('Please enter license plate'),
  battery: Yup.number()
    .positive('Battery capacity must be a positive number')
    .min(0.1, 'Battery capacity must be greater than 0')
    .max(1000, 'Battery capacity must not exceed 1000 kWh')
    .nullable()
    .transform((value, originalValue) => 
      originalValue === '' ? null : value
    ),
});
