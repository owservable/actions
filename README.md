![owservable](https://avatars0.githubusercontent.com/u/87773159?s=75)

# @owservable/actions

A TypeScript library implementing the Action Pattern for creating reusable, executable units of work that can be run as commands, cronjobs, watchers, workers, or controllers.

## 🚀 Features

- **Action Pattern Implementation**: Structured approach to organizing business logic
- **Multiple Execution Contexts**: Run actions as commands, cronjobs, watchers, workers, or controllers
- **Commander.js Integration**: Built-in CLI command support with option parsing
- **TypeScript Support**: Full type safety with comprehensive interfaces
- **Flexible Architecture**: Abstract base class with specialized interfaces

## 📦 Installation

```bash
npm install @owservable/actions
```

or

```bash
yarn add @owservable/actions
```

or

```bash
pnpm add @owservable/actions
```

## 🔧 Usage

### Basic Action Implementation

```typescript
import { Action, ActionInterface } from '@owservable/actions';

class MyAction extends Action implements ActionInterface {
  protected _description = 'My custom action';

  async handle(...args: any[]): Promise<any> {
    // Your business logic here
    console.log('Action executed with args:', args);
    return { success: true };
  }

  description(): string {
    return this._description;
  }
}
```

### Command Line Action

```typescript
import { Action, ActionAsCommandInterface } from '@owservable/actions';

class MyCommandAction extends Action implements ActionAsCommandInterface {
  protected _signature = 'my-command {--option=default}';
  protected _description = 'My command action';

  async handle(...args: any[]): Promise<any> {
    // Your business logic here
    return { success: true };
  }

  async asCommand(options: any): Promise<void> {
    console.log('Command executed with options:', options);
    await this.handle(options);
  }

  signature(): string {
    return this._signature;
  }

  description(): string {
    return this._description;
  }
}
```

### Running Actions as Commands

```typescript
import { runActionAsCommand } from '@owservable/actions';

const action = new MyCommandAction();
await runActionAsCommand(action);
```

### Cronjob Action

```typescript
import { Action, ActionAsCronjobInterface } from '@owservable/actions';

class MyCronjobAction extends Action implements ActionAsCronjobInterface {
  protected _schedule = '0 0 * * *'; // Daily at midnight
  protected _description = 'Daily cleanup job';

  async handle(...args: any[]): Promise<any> {
    // Your cronjob logic here
    return { success: true };
  }

  async asCronjob(): Promise<void> {
    console.log('Cronjob executed');
    await this.handle();
  }

  schedule(): string {
    return this._schedule;
  }

  description(): string {
    return this._description;
  }
}
```

### Watcher Action

```typescript
import { Action, ActionAsWatcherInterface } from '@owservable/actions';

class MyWatcherAction extends Action implements ActionAsWatcherInterface {
  protected _description = 'File watcher action';

  async handle(...args: any[]): Promise<any> {
    // Your watcher logic here
    return { success: true };
  }

  async asWatcher(): Promise<void> {
    console.log('Watcher executed');
    await this.handle();
  }

  description(): string {
    return this._description;
  }
}
```

## 📚 API Documentation

### Base Classes

#### `Action`
Abstract base class providing common functionality for all actions.

**Properties:**
- `_signature`: Command signature for CLI actions
- `_description`: Human-readable description
- `_schedule`: Cron schedule for cronjob actions

**Methods:**
- `signature()`: Returns the command signature
- `description()`: Returns the action description
- `schedule()`: Returns the cron schedule

### Interfaces

#### `ActionInterface`
Base interface that all actions must implement.

**Methods:**
- `description(): string` - Returns action description
- `handle(...args: any[]): Promise<any>` - Main action logic

#### `ActionAsCommandInterface`
Interface for actions that can be run as CLI commands.

**Extends:** `ActionInterface`

**Methods:**
- `signature(): string` - Returns command signature
- `asCommand(options: any): Promise<void>` - Execute as command

#### `ActionAsCronjobInterface`
Interface for actions that can be run as scheduled cronjobs.

**Extends:** `ActionInterface`

**Methods:**
- `asCronjob(): Promise<void>` - Execute as cronjob

#### `ActionAsWatcherInterface`
Interface for actions that can be run as file/directory watchers.

**Extends:** `ActionInterface`

**Methods:**
- `asWatcher(): Promise<void>` - Execute as watcher

#### `ActionAsWorkerInterface`
Interface for actions that can be run as background workers.

**Extends:** `ActionInterface`

**Methods:**
- `asWorker(): Promise<void>` - Execute as worker

#### `ActionAsControllerInterface`
Interface for actions that can be run as HTTP controllers.

**Extends:** `ActionInterface`

**Methods:**
- `asController(): Promise<void>` - Execute as controller

### Utility Functions

#### `runActionAsCommand(action: ActionAsCommandInterface): Promise<void>`
Executes an action as a CLI command with option parsing.

#### `findCommandAction(actionsFolder: string, actionName: string): ActionAsCommandInterface`
Finds and loads a command action from a folder.

#### `getOptionAndDefaultValue(config: string): {option: string, defaultValue: any}`
Parses command option configuration strings.

## 🏗️ Requirements

- Node.js >= 20
- TypeScript support

## 🧪 Testing

```bash
npm test
```

## 📖 Documentation

- **TypeDoc Documentation**: [https://owservable.github.io/actions/docs/](https://owservable.github.io/actions/docs/)
- **Test Coverage**: [https://owservable.github.io/actions/coverage/](https://owservable.github.io/actions/coverage/)

## 🔗 Related Projects

- [@owservable/folders](https://github.com/owservable/folders) - File system utilities
- [@owservable/fastify-auto-routes](https://github.com/owservable/fastify-auto-routes) - Fastify auto routing
- [owservable](https://github.com/owservable/owservable) - Main reactive backend library

## 📄 License

Licensed under [The Unlicense](./LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
