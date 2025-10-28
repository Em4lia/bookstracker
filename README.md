# 📚 Трекер книг (Book Tracker)

Веб-застосунок, призначений для управління особистою бібліотекою користувача та відстеження процесу читання книг. Користувачі можуть додавати книги до свого списку, позначати їх як прочитані, оцінювати та залишати відгуки.

## 🚀 Основні Можливості

* **Автентифікація користувачів:** Реєстрація та вхід у систему за допомогою JWT (JSON Web Tokens).
* **Загальна бібліотека:** Перегляд списку всіх книг з пошуком, сортуванням (за назвою, рейтингом) та пагінацією.
* **Особиста бібліотека:** Користувачі можуть додавати книги до свого списку та керувати їх статусом:
    * `Хочу прочитати`
    * `Читаю`
    * `Прочитано`
* **Система відгуків та рейтингів:** Після позначення книги як "Прочитано", користувач може залишити текстовий відгук та поставити рейтинг (від 1 до 10).
* **Перегляд відгуків:** Усі відвідувачі (навіть незареєстровані) можуть читати відгуки на сторінці книги.
* **Панель адміністратора:**
    * **Керування користувачами:** Можливість блокувати користувачів.
    * **Керування відгуками:** Адміністратор може видаляти будь-який відгук користувача.
    * **Керування контентом:** (У розробці) Додавання/редагування/видалення книг, авторів та жанрів.

## 🛠️ Технологічний стек

* **Frontend:**
    * [**React**](https://reactjs.org/) (з використанням Vite)
    * [**React Router**](https://reactrouter.com/) (для навігації)
    * [**React Bootstrap**](https://react-bootstrap.github.io/) (для UI компонентів)
    * [**Axios**](https://axios-http.com/) (для HTTP-запитів)
* **Backend:**
    * [**Node.js**](https://nodejs.org/)
    * [**Express**](https://expressjs.com/) (для REST API)
    * [**mysql2**](https://github.com/sidorares/node-mysql2) (для роботи з БД)
    * [**JWT (jsonwebtoken)**](https://github.com/auth0/node-jsonwebtoken) (для автентифікації)
    * [**bcryptjs**](https://github.com/dcodeIO/bcrypt.js) (для хешування паролів)
    * [**CORS**](https://github.com/expressjs/cors)
* **База даних:**
    * [**MySQL**](https://www.mysql.com/)

## 📝 Структура Бази Даних

Проєкт використовує реляційну базу даних MySQL з наступними основними таблицями:

* `user` (id, username, password, name, surname, role, is_blocked, created_at)
* `book` (id, isbn, title, author_id, description, year, genre_id)
* `author` (id, name)
* `genre` (id, name)
* `userbookinteraction` (user_id, book_id, status, rating, comment, created_at)
    * *Примітка: `(user_id, book_id)` є унікальним ключем, щоб уникнути дублікатів.*
    * *Поле `status` використовує `ENUM('to_read', 'reading', 'read')`.*

## ⚙️ Встановлення та Запуск

### Передумови

* [Node.js](https://nodejs.org/en/) (v16 або новіше)
* Сервер [MySQL](https://dev.mysql.com/downloads/mysql/)

---

### 1. Налаштування Бекенду (папка `/server`)

1.  **Клонуйте репозиторій:**
    ```bash
    git clone https://github.com/Em4lia/bookstracker.git
    cd project/server
    ```

2.  **Встановіть залежності:**
    ```bash
    npm install
    ```

3.  **Створіть базу даних:**
    * Запустіть ваш MySQL сервер.
    * Створіть нову базу даних (наприклад, `book_tracker`).
    * Виконайте SQL-скрипти для створення всіх таблиць (`user`, `book` і т.д.) та додавання `ALTER TABLE` запитів (для `is_blocked`, `name`, `surname`, `UNIQUE KEY` та `ENUM` статусу).

4.  **Створіть `.env` файл:**
    * У корені папки `/server` створіть файл `.env`.
    * Додайте ваші налаштування (замініть `your_` значеннями):
    ```env
    # Сервер
    PORT=5000

    # База даних MySQL
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_mysql_password
    DB_NAME=book_tracker

    # JWT Секретний ключ
    JWT_SECRET=your_super_secret_key_for_jwt
    ```

5.  **Запустіть сервер:**
    ```bash
    node server.js
    ```
    *Або, якщо встановлено `nodemon`:*
    ```bash
    nodemon server.js
    ```
    Сервер має запуститися на `http://localhost:5000`.

---

### 2. Налаштування Фронтенду (папка `/client`)

1.  **Перейдіть до папки клієнта:**
    ```bash
    cd ../client
    ```

2.  **Встановіть залежності:**
    ```bash
    npm install
    ```

3.  **Запустіть клієнт (Vite):**
    ```bash
    npm run dev
    ```
    Застосунок буде доступний на `http://localhost:5173` (або на іншому порту, вказаному Vite).

4.  **Відкрийте застосунок у браузері** та протестуйте реєстрацію, вхід та інші функції.
