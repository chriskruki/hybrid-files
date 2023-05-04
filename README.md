# hybrid-files
A hybrid file storage solution for maintaining files locally and on the cloud.

## Project Setup

### Create / seed database

Open MySQL Command line as root user

```sql
SOURCE project_path/schema.sql
```

Where `project_path` is the path to this project

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

# Development Mentions

- `group` and `file` turned out to be reserved keywords and provided some trouble when creating tables with those names