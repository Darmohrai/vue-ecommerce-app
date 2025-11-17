# vue-ecommerce-app (FakeStore E-Commerce Application) 🛒

This project is a term course project (Laboratory Work #9-10) for developing a fully functional e-commerce application. The goal was to build a highly responsive and stable application using **React + TypeScript** and **Zustand** for state management, interacting with the Platzi Fake Store API.

Although the repository name follows the original **Vue** assignment requirement, the implementation is entirely based on **React** as per the individual task modification.

---

## 🚀 Technology Stack

| Component | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (Composition API) + Vite | Building the user interface. |
| **Language** | TypeScript | Enforcing strong typing (`types/`). |
| **State Management** | **Zustand** (replacing Pinia) | Global state management for filters, cart, and products. |
| **Persistence** | Zustand `persist` Middleware | Saving `cart` and `favorites` to `localStorage`. |
| **API** | Platzi Fake Store API | Source for products and categories. |
| **Styling** | Tailwind CSS + SCSS | Fast and responsive styling. |
| **Routing** | React Router v6 | Navigation with **Scroll Behavior** implementation. |

---

## 🛠️ Installation and Project Setup

To get the project running locally, execute the following commands in your terminal:

### 1. Cloning and Setup

```bash

# Install all necessary dependencies
npm install