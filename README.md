# 📚 Book Tracker (Трекер книг)

Book Tracker — це повностековий вебзастосунок, створений для допомоги користувачам в управлінні їхньою особистою бібліотекою. Він дозволяє відстежувати процес читання, додавати книги до персональних списків, залишати відгуки та ставити оцінки. Проєкт включає повноцінну рольову модель з панеллю адміністратора для керування контентом та користувачами.

## ✨ Основні можливості (Features)

* **Автентифікація користувачів:** Повна система реєстрації та входу на основі JWT (JSON Web Tokens).
* **Загальна бібліотека:** Публічний каталог книг з пошуком, сортуванням за рейтингом/назвою та пагінацією.
* **Особиста бібліотека ("Мої книги"):** Користувачі можуть додавати книги до свого списку.
* **Статуси читання:** Можливість позначати книги як **"Хочу прочитати"**, **"Читаю"** або **"Прочитано"**.
* **Система відгуків та рейтингів:** Тільки ті користувачі, що "Прочитали" книгу, можуть залишити їй текстовий відгук та поставити рейтинг від 1 до 10.
* **Панель адміністратора:** Повноцінний, захищений розділ (`/admin`) для керування сайтом.
* **Керування контентом (CRUD):** Адміністратори можуть додавати, редагувати та видаляти книги, авторів та жанри через модальні вікна.
* **Керування користувачами:** Адміністратори можуть переглядати список всіх користувачів, блокувати та розблоковувати їхні акаунти.
* **Модерація:** Адміністратори можуть видаляти будь-які відгуки користувачів.
* **Безпека:** Реалізована рольова модель (User, Admin). Заблоковані користувачі не можуть залишати відгуки чи змінювати статуси книг.

## 🛠 Технологічний стек

| Категорія | Технологія |
| :--- | :--- |
| **Frontend** | React, Vite, React Router, React Bootstrap, Axios |
| **Backend** | Node.js, Express.js |
| **База даних** | MySQL |
| **Автентифікація** | JWT (jsonwebtoken), bcryptjs |

## 🚀 Встановлення та запуск

Для запуску проєкту локально, виконайте наступні кроки:

### 1. Клонування репозиторію

```bash
git clone https://github.com/Em4lia/bookstracker.git
cd bookstracker
```

### 2. Налаштування Бази Даних

1. Переконайтеся, що у вас встановлено та запущено сервер MySQL.
2. Створіть нову базу даних (наприклад, `book_tracker`).
3. Виконайте SQL-скрипт для створення всіх необхідних таблиць.

```sql
CREATE DATABASE IF NOT EXISTS `bookstracker` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `bookstracker`;

DROP TABLE IF EXISTS `author`;
CREATE TABLE `author` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `genre`;
CREATE TABLE `genre` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `book`;
CREATE TABLE `book` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `isbn` VARCHAR(17) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `description` LONGTEXT,
  `year` INT NOT NULL,
  `author_id` BIGINT NOT NULL,
  `genre_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `isbn` (`isbn`),
  KEY `books_author_id_fk` (`author_id`),
  KEY `books_genre_id_fk` (`genre_id`),
  CONSTRAINT `books_author_id_fk` FOREIGN KEY (`author_id`) REFERENCES `author` (`id`),
  CONSTRAINT `books_genre_id_fk` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `surname` VARCHAR(255) NOT NULL,
  `role` ENUM('user','admin') NOT NULL DEFAULT 'user',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `is_blocked` TINYINT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS `userbookinteraction`;
CREATE TABLE `userbookinteraction` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status` ENUM('to_read','reading','read') NOT NULL,
  `rating` INT DEFAULT NULL,
  `comment` TEXT,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` INT DEFAULT NULL,
  `book_id` INT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_book_unique` (`user_id`,`book_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `userbookinteraction_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `userbookinteraction_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
```

### 3. Налаштування Бекенду (папка `/backend`)

1.Перейдіть до папки бекенду:
```bash
cd backend
```
2. Встановіть залежності:
 ```bash
npm install
 ```
3. Створіть файл `.env` у корені папки `/backend` та додайте наступні змінні:

```env
# Налаштування сервера
 PORT=5000

 # Налаштування бази даних MySQL
 DB_HOST=localhost
 DB_USER=root
 DB_PASSWORD=your_mysql_password
 DB_NAME=book_tracker

 # Секретний ключ для JWT
 JWT_SECRET=your_super_secret_key_that_is_long_and_random
 ```

### 4. Налаштування Фронтенду (папка `/client`)

1. Відкрийте новий термінал та перейдіть до папки клієнта:
 ```bash
cd client
 ```
2. Встановіть залежності:
 ```bash
npm install
 ```

### 5. Запуск проєкту

1. **Запустіть бекенд-сервер** (у терміналі в папці `/backend`):
 ```bash
 node server.js
 # або, якщо у вас є nodemon
 nodemon server.js
 ```
 *Сервер повинен запуститися на `http://localhost:5000`.*

2. **Запустіть фронтенд-сервер** (у терміналі в папці `/client`):
 ```bash
 npm run dev
 ```
 *Проєкт відкриється на `http://localhost:5173` (або на іншому порту, вказаному Vite).*

### 6. Створення першого адміністратора

Після реєстрації звичайного користувача, вам потрібно вручну надати йому права адміністратора:

```sql
UPDATE user SET role = 'admin' WHERE username = 'ваш_логін';
```

Після цього вийдіть з сайту та увійдіть знову, щоб отримати новий токен з роллю адміністратора.

# 📝 Ліцензія

Цей проєкт ліцензовано за умовами ліцензії MIT.
