# Agric AI 🌾

Agric AI is a comprehensive platform designed to assist farmers in identifying crop diseases using AI. The system provides two main methods for disease detection: text-based input (where users can describe the symptoms) and image-based analysis (where users can upload photos of affected crops). Additionally, users can subscribe to premium features using payment options like M-Pesa or PayPal.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Backend API Endpoints](#backend-api-endpoints)
- [Frontend Details](#frontend-details)
- [Payment Integration](#payment-integration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Disease Detection**:
  - Detect crop diseases by either describing the symptoms or uploading an image.
  - AI-driven analysis for accurate and quick diagnosis.
- **User Subscription**:
  - Subscribe to premium features using M-Pesa or PayPal.
- **Responsive UI**:
  - User-friendly interface built with Next.js for smooth navigation and experience.

## Tech Stack

### Backend (Spring Boot)
- **Spring Boot**: Core backend framework.
- **REST API**: Exposes endpoints for disease analysis and user management.
- **PostgreSQL**: Database for storing user data, payment records, and disease information.
- **PayPal & M-Pesa Integration**: Facilitates user subscriptions.

### Frontend (Next.js)
- **Next.js**: React framework for building server-rendered applications.
- **Tailwind CSS**: For responsive and customizable styling.
- **Axios**: For handling HTTP requests.

## Setup and Installation

### Prerequisites
- **Java 17+** for running the Spring Boot application.
- **Node.js 14+** for the Next.js frontend.
- **Maven** for managing backend dependencies.
- **PostgreSQL** for database management.

### Backend Setup

1. Clone the repository:
   

bash
   git clone https://github.com/Felix-kerich/full_stack_Agric-springboot-Next-js-.git
   cd full_stack_Agric-springboot-Next-js-
