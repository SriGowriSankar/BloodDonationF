# Blood Donation Web Application

A comprehensive blood donation platform that connects donors, recipients, hospitals, and administrators to facilitate life-saving blood donations.

## 🚀 Features

### For Donors
- **Profile Management**: Complete donor profiles with blood group, location, and medical history
- **Donation History**: Track all past donations and impact
- **Blood Camp Registration**: Find and register for nearby blood donation camps
- **Smart Notifications**: Get notified about urgent blood requests in your area
- **Availability Status**: Control when you're available to donate

### For Recipients
- **Blood Requests**: Create urgent or scheduled blood requests
- **Donor Search**: Find compatible donors in your area
- **Request Tracking**: Monitor the status of your blood requests
- **Hospital Integration**: Connect with verified hospitals and blood banks

### For Hospitals/Blood Banks
- **Inventory Management**: Real-time blood stock tracking with expiry monitoring
- **Camp Organization**: Schedule and manage blood donation camps
- **Donor Verification**: Verify donor eligibility and medical history
- **Request Management**: Handle blood requests from recipients
- **Analytics Dashboard**: Comprehensive reporting and analytics

### For Administrators
- **User Management**: Manage all platform users and verification
- **System Analytics**: Platform-wide statistics and performance metrics
- **Content Management**: Manage notifications and system announcements
- **Quality Control**: Monitor and ensure platform integrity

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for modern, responsive design
- **Lucide React** for consistent iconography
- **Context API** for state management
- **Vite** for fast development and building

### Backend & Database
- **Supabase** for backend-as-a-service
- **PostgreSQL** for robust data storage
- **Row Level Security (RLS)** for data protection
- **Real-time subscriptions** for live updates
- **PostGIS** for geospatial queries

### Key Services
- **Authentication Service**: Secure user registration and login
- **Donor Service**: Donor profile and search functionality
- **Request Service**: Blood request management
- **Camp Service**: Blood camp organization and registration
- **Inventory Service**: Hospital blood stock management
- **Notification Service**: Multi-channel notification system

## 🏗️ Architecture

### Database Schema
- **users**: Core user information for all roles
- **donors**: Donor-specific profiles and preferences
- **hospitals**: Hospital/blood bank information
- **blood_inventory**: Real-time blood stock management
- **donation_requests**: Blood requests from recipients
- **blood_camps**: Blood donation events
- **camp_registrations**: Donor camp registrations
- **donation_records**: Historical donation tracking
- **notifications**: System-wide notification management

### Security Features
- **Row Level Security (RLS)** on all tables
- **Role-based access control** for different user types
- **JWT authentication** with Supabase Auth
- **Data validation** and sanitization
- **Secure API endpoints** with proper authorization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blood-donation-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create a `.env` file based on `.env.example`
   ```bash
   cp .env.example .env
   ```
   - Add your Supabase credentials to `.env`

4. **Set up the database**
   - Run the migration file in your Supabase SQL editor:
   ```sql
   -- Copy and paste the contents of supabase/migrations/create_blood_donation_schema.sql
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Database Setup

The application requires a PostgreSQL database with the following setup:

1. **Run the migration**: Execute the SQL migration file in your Supabase project
2. **Enable RLS**: Row Level Security is automatically enabled for all tables
3. **Set up policies**: Security policies are created for role-based access
4. **Create indexes**: Performance indexes are added for common queries

## 📱 Usage

### For New Users
1. **Register**: Choose your role (Donor, Recipient, Hospital, Admin)
2. **Complete Profile**: Add all required information
3. **Verification**: Wait for account verification (automatic for donors/recipients)
4. **Start Using**: Access role-specific features immediately

### Demo Accounts
The application includes demo functionality for testing:
- **Donor**: donor@demo.com
- **Recipient**: recipient@demo.com  
- **Hospital**: hospital@demo.com
- **Admin**: admin@demo.com

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Configuration
- **Authentication**: Email/password authentication enabled
- **Database**: PostgreSQL with Row Level Security
- **Storage**: File uploads for profile pictures and documents
- **Edge Functions**: For advanced server-side logic (optional)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
The application is optimized for Netlify deployment:
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on git push

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and FAQ

## 🙏 Acknowledgments

- **Supabase** for providing an excellent backend-as-a-service platform
- **React** and **Tailwind CSS** communities for amazing tools
- **Blood donation organizations** worldwide for inspiration
- **Healthcare workers** who make blood donation possible

---

**Made with ❤️ to save lives through technology**