export const MESSAGES = {
  AUTH: {
    LOGIN_SUCCESS: 'Welcome back! You’ve logged in successfully.',
    LOGIN_FAILED: 'Incorrect email or password. Please try again.',
    REGISTER_SUCCESS: 'Account created! Welcome to BloodLine DNA.',
    REGISTER_FAILED: 'Registration failed. Please double-check your details.',
    EMAIL_EXISTS: 'This email is already in use. Please choose another.',
    LOGOUT_SUCCESS: 'You have been logged out.',
    PASSWORD_CHANGED: 'Your password was changed successfully.',
    TOKEN_EXPIRED: 'Session expired. Please log in again.',
    UNAUTHORIZED: 'Please log in to continue.',
  },

  VALIDATION: {
    REQUIRED: 'This field is required.',
    EMAIL_INVALID: 'Enter a valid email address.',
    EMAIL_REQUIRED: 'Email is required.',
    PASSWORD_REQUIRED: 'Password is required.',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters.',
    PASSWORD_MISMATCH: 'Passwords do not match.',
    PHONE_INVALID: 'Enter a valid phone number.',
    DATE_INVALID: 'Invalid date. Please check again.',
    DATE_FUTURE: 'Please choose a future date.',
    NAME_REQUIRED: 'Full name is required.',
    RELATIONSHIP_REQUIRED: 'Relationship is required.',
    YEAR_BIRTH_REQUIRED: 'Year of birth is required.',
    YEAR_BIRTH_INVALID: 'Enter a valid year of birth.',
    SERVICE_REQUIRED: 'Please select a service.',
    SAMPLE_PROVIDERS_MIN: 'At least one sample provider is required.',
    APPOINTMENT_DATE_REQUIRED: 'Appointment date is required.',
    COLLECTION_METHOD_REQUIRED: 'Collection method is required.',
  },

  SERVICE: {
    LOADING: 'Loading services...',
    LOAD_ERROR: 'Unable to load services. Try again later.',
    NOT_FOUND: 'Service not found.',
    SELECTION_SUCCESS: 'Service selected.',
    REGISTRATION_SUCCESS: 'Your request has been submitted!',
    REGISTRATION_ERROR: 'Unable to register for service. Please try again.',
  },

  REGISTRATION: {
    CREATING: 'Creating your request...',
    SUCCESS: 'Test request submitted successfully!',
    ERROR: 'Failed to submit request. Please try again.',
    LOADING: 'Fetching your request details...',
    NOT_FOUND: 'Test request not found.',
    STATUS_UPDATED: 'Status updated successfully.',
    KIT_ASSIGNED: 'DNA kit assigned and sent.',
  },

  PAYMENT: {
    PROCESSING: 'Processing payment...',
    SUCCESS: 'Thank you! Payment successful.',
    FAILED: 'Payment failed. Please try again.',
    CANCELLED: 'Payment was cancelled.',
    REDIRECTING: 'Redirecting to payment gateway...',
    VERIFYING: 'Verifying payment...',
    INVALID_AMOUNT: 'Invalid amount. Please check and try again.',
  },

  PROFILE: {
    LOADING: 'Loading profile...',
    UPDATE_SUCCESS: 'Profile updated successfully.',
    UPDATE_ERROR: 'Could not update profile. Try again.',
    UPLOAD_SUCCESS: 'File uploaded!',
    UPLOAD_ERROR: 'Upload failed. Check file type and size.',
  },

  DASHBOARD: {
    LOADING: 'Loading dashboard...',
    LOAD_ERROR: 'Unable to load dashboard.',
    STATS_UPDATED: 'Dashboard stats updated.',
  },

  GENERAL: {
    LOADING: 'Loading...',
    SAVING: 'Saving...',
    DELETING: 'Deleting...',
    SUCCESS: 'Operation completed successfully.',
    ERROR: 'Something went wrong. Try again.',
    NETWORK_ERROR: 'Network error. Check your connection.',
    PERMISSION_DENIED: "You don't have permission to do this.",
    CONFIRM_DELETE: 'Are you sure you want to delete this item?',
    UNSAVED_CHANGES: 'You have unsaved changes. Leave anyway?',
    NO_DATA: 'No data available.',
    TRY_AGAIN: 'Please try again.',
  },

  FILE: {
    UPLOAD_SUCCESS: 'File uploaded successfully!',
    UPLOAD_ERROR: 'Upload failed. Please check file type or size.',
    INVALID_TYPE: 'Invalid file type. Use JPG, PNG, or GIF.',
    TOO_LARGE: 'File is too large. Please select a smaller file.',
    SELECT_FILE: 'Please choose a file to upload.',
  },

  NOTIFICATION: {
    NEW_RESULT: 'Your DNA test result is now available!',
    KIT_SHIPPED: 'Your DNA kit has been shipped.',
    PAYMENT_CONFIRMED: 'Your payment has been confirmed.',
    APPOINTMENT_REMINDER: 'Reminder: You have an appointment soon.',
    TEST_COMPLETED: 'Your DNA test has been completed.',
  },
}
