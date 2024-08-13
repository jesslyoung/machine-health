# Design notes

## Running the app (changes)

- `backend`
  1. `docker compose up` (must be run prior to loading data)
  2. `yarn`, warns about data load script
  3. `./scripts/load-data.sh`
- `native-app`
  1. `yarn` runs `expo run prebuild` for managed workflow + dependencies not in Expo Go
  2. `yarn start` 


## Further implementation

- Local db consistency & retrieval
  - See workflow as commented in `app/_layout`
  - Server: update redis on `GET /data`
  - Client: various touchpoints
- Chunked data ranges
  - Adjustable time window on various screens
  - app-wide listener to fetch additional data range
  - see `Data Syncronization Flow` diagram below
- ServerPush/Websockets
  - Kafka-driven events for new data & modified data
- UI enhancements
  - shared values across stylesheets
  - landscape view
  - overall styling
  - loading indicators
  - etc.


## Diagrams

### Architecture (current)
```mermaid

graph LR
    subgraph Frontend
        direction TB
        A[Expo App]
        A1[Zustand]
        A2[SQLite]
        A <-->|Ephemeral State| A1
        A -->|Data| A2
    end

    subgraph Backend
        direction TB
        B[Express API]
        A -->|Read/Write| B
    end
    
    subgraph Docker
        B -->|Fetches Metrics| D[InfluxDB]
        E[Redis Cache]
    end

    subgraph Web
        direction TB
        A <-->|Authenticates| F[Auth0]
    end

    classDef frontend fill:#f9f,stroke:#333,stroke-width:2px;
    classDef backend fill:#ccf,stroke:#333,stroke-width:2px;
    classDef db fill:#cfc,stroke:#333,stroke-width:2px;
    classDef auth fill:#fcf,stroke:#333,stroke-width:2px;
    classDef cache fill:#cff,stroke:#333,stroke-width:2px;

%%class A;
class C,D db;
class E cache;
class F auth;


```

### Data Syncronization Flow

```mermaid
sequenceDiagram
  participant SQLite
  participant Zustand
  participant Client
  participant Server
  participant Redis
  participant InfluxDB

  Client->>Client: Load App
  Client->>SQLite: fetch chunks
  SQLite->>Client: data chunks and hashes by date
  Client->>Client: get data dates
  
  Client->>Server: chunks and hashes, requested dates
  Server->>Redis: requested dates
  Redis->>Server: latest hashes by date
  Server->>Server: determine discrepancies
  Server->>InfluxDB: request disparate data
  InfluxDB->>Server: requested data
  
  Server->>Client: Supply multipart response with updated data

  Client->>SQLite: save data
  Client->>Zustand: set lastDataUpdated in Store


```
