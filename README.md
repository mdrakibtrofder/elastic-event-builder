# Elastic Event Builder - Backend Implementation Guide

This document outlines the detailed implementation of a NestJS backend for the Elastic Event Builder project, replacing the current `localStorage` implementation with a robust PostgreSQL database using TypeORM.

## Table of Contents
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [TypeORM Entities](#typeorm-entities)
- [API Endpoints](#api-endpoints)
- [Migration Strategy](#migration-strategy)
- [Frontend Transition](#frontend-transition)
- [Setup & Installation](#setup--installation)

---

## Architecture Overview

The backend is built as a RESTful API using the NestJS framework. It follows a modular architecture where each domain (Events, Organizations, Locations, Types) is encapsulated in its own module.

**Data Flow:**
`Frontend (React)` <-> `REST API (NestJS)` <-> `TypeORM` <-> `PostgreSQL`

---

## Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Database:** PostgreSQL
- **Language:** TypeScript
- **Validation:** class-validator & class-transformer
- **Migrations:** TypeORM CLI

---

## Database Schema

The database consists of 4 primary tables with relational links to mirror the existing frontend logic:

1.  **organizations**: Entities that own or collaborate on events.
2.  **locations**: Physical or virtual venues for events.
3.  **event_types**: Categorization labels (Workshop, Webinar, etc.).
4.  **events**: The core entity connecting all others.

### Relationships:
- **Event -> Organization (Owner):** Many-to-One.
- **Event -> Location:** Many-to-One.
- **Event -> EventType:** Many-to-One.
- **Event -> Organizations (Collaborators):** Many-to-Many (via `event_collaborators` join table).
- **Event -> Events (Related):** Many-to-Many (via `event_relations` self-referencing join table).

---

## TypeORM Entities

### 1. Organization Entity
```typescript
@Entity('organizations')
export class OrganizationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  contactEmail: string;

  @OneToMany(() => EventEntity, (event) => event.organization)
  ownedEvents: EventEntity[];

  @ManyToMany(() => EventEntity, (event) => event.collaborators)
  collaboratedEvents: EventEntity[];
}
```

### 2. Event Entity (Core)
```typescript
@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'text' })
  details: string;

  @ManyToOne(() => EventTypeEntity)
  type: EventTypeEntity;

  @ManyToOne(() => OrganizationEntity, (org) => org.ownedEvents)
  organization: OrganizationEntity;

  @ManyToOne(() => LocationEntity)
  location: LocationEntity;

  @ManyToMany(() => OrganizationEntity, (org) => org.collaboratedEvents)
  @JoinTable({ name: 'event_collaborators' })
  collaborators: OrganizationEntity[];

  @ManyToMany(() => EventEntity)
  @JoinTable({ name: 'event_relations' })
  relatedEvents: EventEntity[];
}
```

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/events` | List all events with relations (type, location, owner) |
| **POST** | `/events` | Create a new event |
| **GET** | `/events/:id` | Get event details + collaborators + related events |
| **PATCH** | `/events/:id` | Update event details and relationships |
| **DELETE** | `/events/:id` | Remove an event |
| **GET** | `/organizations` | List all registered organizations |
| **GET** | `/locations` | List all registered locations |
| **GET** | `/event-types` | List all event categories |

---

## Migration Strategy

TypeORM migrations ensure that the database schema is version-controlled.

1.  **Generate Migration:**
    `npm run typeorm migration:generate src/migrations/InitialSchema`
2.  **Run Migration:**
    `npm run typeorm migration:run`
3.  **Revert Migration:**
    `npm run typeorm migration:revert`

The backend configuration will use `migrationsRun: true` in production to ensure the schema is up-to-date on startup.

---

## Frontend Transition

To replace `localStorage` with this backend, the `src/hooks/use-registry.ts` file in the frontend must be updated:

1.  Replace `store.events.list()` with a TanStack Query `useQuery` fetch to `/events`.
2.  Replace `eventsApi.upsert()` with a `useMutation` calling `POST /events` or `PATCH /events/:id`.
3.  Update the data mapping to handle the nested relational objects returned by the API (e.g., `event.organization.name` instead of finding it manually in a local array).

---

## Setup & Installation

### 1. Database Setup
Ensure PostgreSQL is running and create a database named `event_builder`.

### 2. Backend Environment Variables
Create a `.env` file in the backend root:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=event_builder
```

### 3. Running the Backend
```bash
# Install dependencies
npm install

# Run migrations
npm run migration:run

# Start in dev mode
npm run start:dev
```

### 4. Seeding Data
The backend includes a seeding service that mirrors the `seedIfEmpty` logic found in `src/lib/storage.ts` to populate the database with initial data on first run.
