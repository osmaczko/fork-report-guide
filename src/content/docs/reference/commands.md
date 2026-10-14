---
title: Commands
description: Every subcommand of forks and sim, with its flags and exit status, and the collector's HTTP calls.
---

Both tools run from the root of a logos-chat checkout. A `PATH` is a log, or a directory, which stands for
every `.log` file directly in it.

## forks

```sh
python3 tools/forks report PATH... [--json FILE]
python3 tools/forks check --expect FILE PATH...
python3 tools/forks serve --data DIR --token-file FILE [--bind ADDRESS] [--port N] [--max-bytes N]
python3 tools/forks share --to ADDRESS PATH...
```

| Command | Does |
|---|---|
| `report` | prints each conversation's report; `--json` also writes it as JSON |
| `check` | holds one conversation's report against an expectation |
| `serve` | the collector: keeps the runs sent to it in `DIR`, serves the page and JSON |
| `share` | sends every run in the paths to a collector, each from where the collector says it stopped |

| Flag | Default | Holds |
|---|---|---|
| `--token-file` | | the token: 16 to 128 characters of `A-Z a-z 0-9 _ -` |
| `--bind` | `127.0.0.1` | the address to listen on |
| `--port` | `8750` | the port; `0` lets the system pick |
| `--max-bytes` | no limit | the most bytes of logs to hold at a time |
| `--to` | | the share address, ending in `?token=TOKEN` |

| Exit | report | check | share |
|---|---|---|---|
| 0 | every conversation `whole`, nothing malformed | as expected | the collector holds every run whole |
| 1 | anything else | a difference, or a malformed record | it does not |
| 2 | the logs cannot be read | the logs or the expectation cannot be used | a path or the address cannot be used |

### An expectation for check

```json
{
  "conversation": "b05d4417e9",
  "verdict": "split at epoch 3",
  "installations": {
    "a3f91c07": {"name": "saro", "position": "tip"},
    "7b1e44d9": {"name": "raya", "position": "tip"},
    "19f6b0e3": {"name": "mira", "position": "tip"},
    "e09a3f52": {"name": "pax", "position": "tip"}
  },
  "posts": [
    {"sender": "a3f91c07", "cells": {"7b1e44d9": "read", "19f6b0e3": "read", "e09a3f52": "read"}},
    {"sender": "7b1e44d9", "cells": {"a3f91c07": "read", "e09a3f52": "unreadable"}},
    {"sender": "e09a3f52", "cells": {"a3f91c07": "unreadable"}}
  ]
}
```

`installations` names every installation in the report. `posts` is optional; when given, it names every
post, in each sender's order, with the cells that matter. A cell is `sent`, `read`, `unreadable`,
`not a member`, `no log` or `no record`. On a difference, `check` prints one line for each:

```text
verdict: split at epoch 3, expected whole
post 1 of raya (7b1e44d9) on pax (e09a3f52): unreadable, expected read
```

A simulation writes its `expect.json` in this format.

### The collector's calls

Each call carries `Authorization: Bearer TOKEN`; a browser's `GET` may carry the cookie instead.

| Call | Answer |
|---|---|
| `GET /?token=TOKEN` | a cookie with the token, and the page |
| `GET /conversations` | every conversation, the worst first |
| `GET /conversations/ID` | one conversation's report, as `report --json` writes it, with each run under the collector's id |
| `GET /runs/ID/log?line=N` | line N of a run's log, two before and three after |
| `POST /runs`, `PUT /runs/ID/log?offset=N`, `DELETE /runs/ID` | what `share` and the app's share box use to send and delete runs |

## sim

```sh
python3 tools/sim run SCENARIO RIG --out DIR [--share ADDRESS]
python3 tools/sim sweep SCENARIO RIG --out DIR --runs K [--share ADDRESS]
```

`run` runs the scenario once; `sweep` runs it K times, one after another. `RIG` is one of
`--chat-cli PATH` or `--one-process PATH` (harness-run). `DIR` must not exist. Both exit 0 when every run
went as expected, 1 when one did not, 2 when the command line or the scenario is refused, and 128 + n on
signal n.

## harness-run

```sh
cargo run --release -p integration_tests_core --bin harness-run -- PLAN.json OUT_DIR
```

Runs every member of one group in one process on a virtual clock, and writes `OUT_DIR/group.log` and
`OUT_DIR/result.json`. `sim --one-process` writes its plan from the scenario.
