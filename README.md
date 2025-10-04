# Bloodline DNA Frontend

A modern React-based frontend application for DNA testing services, built with TypeScript and Vite.

## 🚀 Features

- **Modern UI/UX**: Clean and responsive design with Tailwind CSS
- **Role-Based Dashboard**: Different interfaces for Admin, Manager, Staff, and Customer roles
- **Authentication**: Secure login/register with JWT token management
- **Test Management**: Complete DNA test request and tracking workflow
- **Payment Integration**: Seamless payment processing with VNPay
- **Real-time Updates**: Live status updates for test requests
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **File Management**: Upload and download test results and reports

## 🛠 Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📁 Project Structure

```bash
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   └── Common/         # Shared components
├── pages/              # Page components
│   ├── admin/          # Admin dashboard pages
│   ├── manager/        # Manager dashboard pages
│   ├── staff/          # Staff dashboard pages
│   └── customer/       # Customer dashboard pages
├── services/           # API service functions
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and types
└── assets/             # Static assets
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd bloodline-dna-frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a \`.env\` file in the root directory:

\`\`\`env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Bloodline DNA
VITE_VNPAY_RETURN_URL=http://localhost:3000/payment-result
\`\`\`

4. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:3000\`

## 🎯 User Roles & Features

### 👤 Customer Features
- **Account Management**: Register, login, and profile management
- **Service Booking**: Browse and book DNA testing services
- **Test Tracking**: Real-time tracking of test request status
- **Payment**: Secure online payment processing
- **Results**: View and download test results
- **History**: Access to service history
- **Feedback**: Submit feedback and reviews

### 👨‍💼 Staff Features
- **Request Management**: View and process assigned test requests
- **Sample Processing**: Update test progress and status
- **Result Submission**: Upload and submit test results
- **Dashboard**: Overview of assigned tasks and workload

### 👩‍💼 Manager Features
- **Test Result Management**: Review and approve test results
- **Blog Management**: Create and manage blog content
- **Feedback Management**: Monitor customer feedback
- **Analytics**: View performance metrics and reports

### 👑 Admin Features
- **User Management**: Manage all user accounts and roles
- **System Overview**: Complete system statistics and monitoring
- **Role Assignment**: Assign and modify user roles
- **System Configuration**: Manage system settings

## 🎨 UI Components

### Common Components
- **Header**: Navigation with role-based menu items
- **Sidebar**: Dashboard navigation for authenticated users
- **Footer**: Site information and links
- **Button**: Reusable button component with variants
- **Input**: Form input components with validation
- **Modal**: Confirmation and dialog modals

### Authentication Components
- **Login**: User authentication form
- **Register**: New user registration
- **ForgotPassword**: Password reset request
- **ResetPassword**: Password reset form

## 🔧 Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm run lint\` - Run ESLint
- \`npm run type-check\` - Run TypeScript type checking

## 🌐 API Integration

The frontend communicates with the backend through RESTful APIs:

### Authentication
- Login/Register/Logout
- Password reset functionality
- JWT token management

### User Management
- Profile management
- Service history
- Role-based access control

### Test Requests
- Create new test requests
- Track request status
- View test results

### Payments
- Process payments via VNPay
- Handle payment callbacks
- Payment history

## 🎨 Styling & Theming

The application uses Tailwind CSS for styling with:
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable styled components
- **Color Scheme**: Professional blue and white theme
- **Typography**: Clean and readable font hierarchy

## 🚀 Deployment

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Deploy to Vercel
The project is configured for Vercel deployment with:
- Automatic deployments from Git
- Environment variable management
- SPA routing configuration

### Environment Variables for Production
Set the following environment variables in your deployment platform:
- \`VITE_API_BASE_URL\`: Production API URL
- \`VITE_APP_NAME\`: Application name
- \`VITE_VNPAY_RETURN_URL\`: Production payment return URL

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Role-based route protection
- **Input Validation**: Client-side form validation
- **XSS Protection**: Sanitized user inputs
- **HTTPS**: Secure communication in production

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured dashboard experience
- **Tablet**: Adapted layout for medium screens
- **Mobile**: Touch-friendly mobile interface

## 🧪 Testing

\`\`\`bash
npm run test
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Component Structure**: Functional components with hooks

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**:
   - Check if backend server is running
   - Verify API base URL in environment variables

2. **Authentication Problems**:
   - Clear browser localStorage
   - Check JWT token expiration

3. **Build Issues**:
   - Clear node_modules and reinstall dependencies
   - Check TypeScript errors

