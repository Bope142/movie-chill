# Movie Chill 🎬🍿

Welcome to the GitHub repository of Movie Chill, an open-source application designed for movie and series enthusiasts. Through the integration of the TMDB API, users can explore an extensive collection of content, create accounts, manage favorites, and more, all within a sleek user interface.

- Explore a vast catalog of movies and series.
- Create an account and log in to customize your experience.
- Save your favorites for easy access.
- Get recommendations based on your tastes.
- Recover your password with ease.

## Demo

You can check out the live demo [here](https://movie-chill-nine.vercel.app/).

## Features

- User account creation and authentication.
- Password recovery via email.
- Email verification.
- Adding movies and series to favorites.

## Technologies

This project utilizes a variety of modern technologies for an optimal user experience:

- Next.js
- React
- Prisma with MySQL
- Firebase Storage
- Nodemailer for email sending
- Axios for HTTP requests
- And many more...

## Initial Setup

### Prerequisites

Before you start, make sure you have [Node.js](https://nodejs.org/) installed on your machine. 🛠

#### Database Configuration

Ensure you have MySQL installed and operational.
Run the provided SQL scripts in /database/structure.sql to initialize the database structure.

#### Environment Variables Configuration

Create a .env.local file at the root of the project and add the following variables:

```bash
 BASE_URL_API="https://api.themoviedb.org/3/"
 API_KEY="your_tmdb_api_key"
 URL_POSTER="https://image.tmdb.org/t/p/original"
 NODE_ENV="development"
 SMTP_PASSWORD="your_smtp_password"
 SMTP_HOST='smtp.gmail.com'
 SMTP_PORT=465
 SMTP_USER='your_email@gmail.com'
 NEXTAUTH_SECRET="your_nextauth_secret"
 FIREBASE_API_KEY="your_firebase_api_key"
 FIREBASE_AUTH_DOMAINE="your_firebase_domain"
 FIREBASE_PROJECT_ID="your_firebase_project_id"
 FIREBASE_STORAGE_BUCKET="your_firebase_bucket"
 FIREBASE_MESSAGING_SENDER_ID="your_firebase_sender_id"
 FIREBASE_APP_ID='your_firebase_app_id'
```

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Bope142/movie-chill.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd movie-chill
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

### Usage

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open your browser and go to [http://localhost:3000](http://localhost:3000).**

### Contributing

Contributions are what make the open-source community an incredible place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. **Fork the project**
2. **Create your feature branch (git checkout -b feature/AmazingFeature)**
3. **Commit your changes (git commit -m 'Add some AmazingFeature')**
4. **Push to the branch (git push origin feature/AmazingFeature)**
5. **Open a Pull Request**

### License

This project is licensed under the [MIT License](LICENSE). 📄

### Acknowledgements

The Movie Database [(TMDB)](https://developer.themoviedb.org/docs/getting-started) API for providing a rich and easy-to-use API.
To all the developers of packages and libraries used in this project.

## Author

Norbert Yemuang 🚀
