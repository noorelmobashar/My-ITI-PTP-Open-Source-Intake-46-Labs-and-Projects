# LifeTrack — Smart Event Router

A CLI tool that lets users log life events (work sessions, study blocks, workouts, meals) and reacts to each one through a pluggable pipeline of outputs.

## How to Run

```bash
ruby main.rb
```

## Architecture

```
              ┌──────────────────────────────────────────┐
              │              EventRouter                 │
              │   handlers: [Handler, Handler, ...]      │
              │   dispatch(event) → calls each handler   │
              └──────────────────┬───────────────────────┘
                                 │  knows only Handler (D)
          ┌──────────────────────┼───────────────────────┐
          ▼                      ▼                       ▼
  ┌───────────────┐    ┌──────────────────┐    ┌──────────────────┐
  │ ConsoleHandler│    │   FileHandler    │    │  StatsHandler    │
  │  prints event │    │ appends to log   │    │  session stats   │
  │  to terminal  │    │      file        │    │  on exit         │
  └───────────────┘    └──────────────────┘    └──────────────────┘
        one job each (S) — interchangeable (L) — lean interface (I)
```

## File Structure

| File                          | Purpose                                      |
| ----------------------------- | -------------------------------------------- |
| `event.rb`                    | Data class — carries event info, nothing else |
| `handler.rb`                  | Abstract interface — one method: `call`       |
| `event_router.rb`             | Observer/Router — dispatches to all handlers  |
| `handlers/console_handler.rb` | Prints event to terminal                      |
| `handlers/file_handler.rb`    | Appends event to `life_track.log`             |
| `handlers/stats_handler.rb`   | Prints session stats on exit via `at_exit`    |
| `main.rb`                     | Entry point — wires handlers + runs menu      |

## Third Output Choice

**Statistics summary** — fires automatically on program exit via Ruby's `at_exit` hook. The menu loop never calls it directly.

---

## SOLID Self-Check

- [x] **S** — Each class has exactly one reason to change. The terminal output class has no file I/O in it. The router has no menu logic in it.
- [x] **O** — The third output (StatsHandler) was added by creating one new file. The router was not opened to do it.
- [x] **L** — Any output can be swapped for another in the registered list and the router still works without modification.
- [x] **I** — The shared interface has exactly one method (`call`). No output is forced to implement something it does not use.
- [x] **D** — Open `event_router.rb` — search for any concrete output class name. The result is zero.

---

## Bonus — Architect's Test (Slack Notifications)

> **1. What would you name the new class and where would it live?**

`SlackHandler` in `handlers/slack_handler.rb`.

> **2. What is the one method it must implement?**

`call(event)` — inherited from `Handler`.

> **3. List every existing file you would open to plug it in.**

Only `main.rb` — to `require_relative` the new file and `router.register(SlackHandler.new)`.

> **4. If that list includes the router or the shared interface — stop.**

It does **not**. The router and handler interface remain untouched. The Open/Closed Principle is satisfied: we extend the system by **adding** a class, not by editing existing ones.
