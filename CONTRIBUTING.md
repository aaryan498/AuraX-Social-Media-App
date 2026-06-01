# Contributing to AuraX

Thank you for considering contributing to AuraX, a feature-rich social media platform that connects millions of users worldwide.

AuraX is a full-stack MERN application that demonstrates modern web development practices including secure authentication, cloud-based media handling, real-time messaging, and scalable architecture. We welcome contributors of all experience levels, whether you are:

- Fixing bugs
- Improving UI/UX design
- Writing documentation
- Optimizing backend performance
- Adding new features
- Enhancing accessibility
- Improving security
- Or enhancing developer experience

Every contribution helps improve AuraX and the open-source community around it.

---

# Table of Contents

- Getting Started
- Development Setup
- Project Structure
- Finding Issues
- Contribution Workflow
- Branch Naming Convention
- Commit Message Guidelines
- Pull Request Process
- Code Style Guidelines
- Testing Guidelines
- Contribution Areas
- Best Practices
- Need Help?

---

# Getting Started

## Prerequisites

Before contributing to AuraX, ensure you have:

- Git
- Node.js 18+
- npm (comes with Node.js)
- MongoDB (local or MongoDB Atlas)
- Clerk Account (for authentication)
- ImageKit Account (for media storage)
- Understanding of MERN stack basics

---

# Fork and Clone the Repository

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/<your-username>/AuraX-Social-Media-App.git

# Navigate to project directory
cd AuraX-Social-Media-App

# Add upstream remote for syncing
git remote add upstream https://github.com/aaryan498/AuraX-Social-Media-App.git
```

---

# Development Setup

## Backend Setup

Navigate to server directory:

```bash
cd server
npm install
```

Create `.env` file in server directory:

```env
# Database
MONGO_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Email Service (Optional)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Server Configuration
PORT=4000
NODE_ENV=development
```

Start backend development server:

```bash
npm run server
```

The backend will run on `http://localhost:4000`

---

## Frontend Setup

Navigate to client directory:

```bash
cd client
npm install
```

Create `.env` file in client directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# API Configuration
VITE_API_BASE_URL=http://localhost:4000
```

Start frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

---

# Project Structure

```text
AuraX-Social-Media-App/
│
├── server/                          # Backend directory
│   ├── configs/
│   │   ├── db.js                   # MongoDB connection
│   │   ├── multer.js               # File upload config
│   │   └── imagekit.js             # ImageKit setup
│   │
│   ├── controllers/
│   │   ├── userController.js       # User operations
│   │   ├── postController.js       # Post operations
│   │   ├── storyController.js      # Story operations
│   │   └── messageController.js    # Messaging
│   │
│   ├── middlewares/
│   │   └── auth.js                 # Clerk middleware
│   │
│   ├── models/
│   │   ├── userModel.js            # User schema
│   │   ├── postModel.js            # Post schema
│   │   ├── storyModel.js           # Story schema
│   │   ├── messageModel.js         # Message schema
│   │   └── connectionModel.js      # Connection schema
│   │
│   ├── routes/
│   │   ├── userRoutes.js           # User routes
│   │   ├── postRoutes.js           # Post routes
│   │   ├── storyRoutes.js          # Story routes
│   │   └── messageRoutes.js        # Message routes
│   │
│   ├── inngest/
│   │   └── index.js                # Background jobs
│   │
│   ├── server.js                   # Express entry point
│   └── package.json
│
├── client/                          # Frontend directory
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js            # API configuration
│   │   │
│   │   ├── app/
│   │   │   └── store.js            # Redux store
│   │   │
│   │   ├── assets/                 # Images and dummy data
│   │   ├── components/             # Reusable components
│   │   ├── features/               # Redux slices
│   │   ├── pages/                  # Page components
│   │   ├── App.jsx                 # Main app
│   │   └── main.jsx                # Entry point
│   │
│   └── package.json
│
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── LICENSE
└── .gitignore
```

---

# Finding Issues

We maintain issues across multiple contribution levels and areas.

| Level | Labels | Examples |
|---|---|---|
| Beginner | `good first issue`, `documentation` | Adding comments, updating docs |
| Intermediate | `enhancement`, `bug` | New UI features, fixes |
| Advanced | `feature`, `backend` | New API endpoints, architecture |

---

# Before Working on an Issue

1. **Check Assignment**: Look for existing assignees
2. **Express Interest**: Comment on the issue with your intention
3. **Wait for Confirmation**: Get issue assigned before starting work
4. **Stay Updated**: Communicate progress and blockers
5. **Sync Regularly**: Pull latest changes from upstream

Inactive issues may be reassigned after 2 weeks of no progress.

---

# Contribution Workflow

## 1. Create a Feature Branch

Use meaningful, descriptive branch names:

```bash
git checkout -b feat/add-comment-feature
git checkout -b fix/message-loading-bug
git checkout -b docs/update-api-docs
git checkout -b refactor/optimize-feed-query
```

## 2. Make Changes

While making changes:

- Follow the existing code style
- Keep changes focused and atomic
- Test your code thoroughly
- Update relevant documentation
- Add comments for complex logic
- Avoid unrelated modifications

## 3. Commit Your Changes

Write clear, descriptive commit messages:

```bash
git add .
git commit -m "feat: add comment functionality to posts"
```

---

# Branch Naming Convention

| Type | Prefix | Example |
|---|---|---|
| Feature | `feat/` | `feat/add-notifications` |
| Bug Fix | `fix/` | `fix/post-likes-bug` |
| Documentation | `docs/` | `docs/api-guide` |
| Refactor | `refactor/` | `refactor/optimize-queries` |
| Performance | `perf/` | `perf/lazy-load-images` |
| Testing | `test/` | `test/add-integration-tests` |
| Chore | `chore/` | `chore/update-dependencies` |

---

# Commit Message Guidelines

Write clean, descriptive commit messages following this format:

```
<type>: <subject>

<body>

<footer>
```

### Examples

```bash
feat: add user notification system
fix: resolve message delivery timeout
docs: update backend API documentation
refactor: simplify post feed query logic
perf: optimize image loading with lazy loading
test: add tests for message controller
chore: update dependencies
```

---

# Making Changes

Best practices while contributing:

- Keep PRs focused on a single feature or fix
- Follow project structure and conventions
- Reuse existing components and utilities
- Write clean, readable, maintainable code
- Add meaningful comments for complex code
- Test thoroughly before submission
- Ensure no console errors or warnings
- Update relevant documentation

---

# Pull Request Process

## Before Submitting a PR

Make sure:

- ✅ Code compiles without errors
- ✅ No console errors or warnings
- ✅ All new features are tested
- ✅ Existing functionality still works
- ✅ Code follows project structure
- ✅ Environment variables are NOT committed
- ✅ PR addresses only one issue/feature
- ✅ Branch is up to date with upstream

## PR Submission Steps

1. **Push Your Branch**

```bash
git push origin feat/your-feature
```

2. **Create Pull Request**
   - Go to GitHub repository
   - Click "New Pull Request"
   - Select your branch

3. **Fill PR Details**
   - Clear, descriptive title
   - Detailed description of changes
   - Reference related issues (Closes #123)
   - Add screenshots for UI changes
   - Describe testing performed

4. **Wait for Review**
   - Maintainers will review your code
   - Address requested changes
   - Engage in constructive discussion

---

# Pull Request Checklist

Before submitting your PR, verify:

- [ ] Code compiles successfully
- [ ] No console errors or warnings
- [ ] All tests pass
- [ ] Responsive design verified
- [ ] Existing features unaffected
- [ ] Code follows project style
- [ ] Branch is up-to-date with upstream
- [ ] PR description is complete
- [ ] Relevant issue is linked
- [ ] No sensitive data committed

---

# Code Style Guidelines

## Frontend (React/JavaScript)

- Use functional components with hooks
- Use Arrow functions for callbacks
- Prefer const over let over var
- Use destructuring where possible
- Keep components modular and reusable
- Use meaningful variable names
- Follow React best practices
- Use Redux for global state
- Use Tailwind CSS for styling

Example:

```javascript
// ✅ Good
const UserCard = ({ user, onFollow }) => {
  const [loading, setLoading] = useState(false);
  
  const handleFollow = async () => {
    setLoading(true);
    try {
      await api.post('/follow', { userId: user._id });
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="card">
      <h3>{user.name}</h3>
      <button onClick={handleFollow} disabled={loading}>
        Follow
      </button>
    </div>
  );
};
```

## Backend (Node.js/Express)

- Use async/await for asynchronous operations
- Keep controllers focused and modular
- Use proper error handling
- Validate input data
- Use meaningful function names
- Follow REST API conventions
- Add proper middleware usage
- Use environment variables for config

Example:

```javascript
// ✅ Good
export const createPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ 
        success: false, 
        message: "Content is required" 
      });
    }

    const post = await Post.create({
      user: userId,
      content,
      createdAt: new Date()
    });

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};
```

---

# Testing Guidelines

## Frontend Testing

Before submitting frontend changes:

```bash
cd client
npm run dev
```

Verify:
- UI renders correctly
- Navigation works as expected
- Forms submit properly
- API calls are successful
- Error handling works
- Loading states display
- Responsive design works

## Backend Testing

Before submitting backend changes:

Use tools like Postman or Thunder Client to verify:

- API endpoints respond correctly
- Status codes are appropriate
- Error messages are clear
- Database operations succeed
- Authentication middleware works
- File uploads work properly
- Input validation functions

---

# Contribution Areas

Contributors can work on different aspects of the platform:

## Frontend Development

- UI/UX improvements
- Responsive design
- Component optimization
- Animation enhancements
- Accessibility improvements
- Performance optimization
- Dark mode implementation

## Backend Development

- API optimization
- Database query optimization
- Error handling
- Security enhancements
- Input validation
- Caching strategies
- Rate limiting

## Core Features

- Real-time notifications
- Advanced search
- Hashtag system
- Video support
- Feed algorithm
- User verification
- Group messaging

## Infrastructure

- CI/CD setup
- Docker configuration
- Monitoring setup
- Performance optimization
- Database optimization
- Deployment automation

## Testing & Quality

- Unit tests
- Integration tests
- E2E testing
- Bug fixes
- Performance testing
- Security testing

## Documentation

- README improvements
- API documentation
- Setup guides
- Troubleshooting guides
- Architecture docs
- Contributing guides

---

# Best Practices for Contributors

- **Quality over Quantity**: Focus on meaningful contributions
- **Clear Communication**: Explain your changes and reasoning
- **Test Thoroughly**: Verify your code works as expected
- **Follow Conventions**: Maintain consistency with existing code
- **Respect Feedback**: Be open to suggestions and improvements
- **Update Documentation**: Keep docs in sync with code
- **Ask Questions**: Don't hesitate to ask for clarification
- **Stay Updated**: Keep your fork synced with upstream

---

# Code Review Process

When you submit a PR:

1. **Automated Checks**: Tests and linters run automatically
2. **Maintainer Review**: Code is reviewed for quality and correctness
3. **Feedback**: Suggestions or changes requested
4. **Iterations**: You make requested changes
5. **Approval**: PR is approved once all concerns addressed
6. **Merge**: Your code is merged to main branch

Be patient and professional throughout the review process.

---

# Need Help?

If you face issues while contributing:

- Check existing issues and discussions
- Read the README and documentation
- Ask questions in issue comments
- Open a new discussion
- Reach out to maintainers politely
- Check troubleshooting section in README

---

# Thank You

Thank you for contributing to AuraX! Your effort in improving the platform helps thousands of users have better social media experience. Together, we're building something amazing! 🚀
