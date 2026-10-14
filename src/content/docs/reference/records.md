---
title: Records
description: Each record the chat core writes on the log target libchat::groupv2trace, with its fields.
---

A record is one log line at `info` on the target `libchat::groupv2trace`: a name, then `key=value` words. The
chat module writes `delivery` on its own target, `chat_module::report`.

```text
2026-10-14T12:05:40.250000Z  INFO libchat::groupv2trace: epoch installation=51e55f2c convo=c97b8bdf9a epoch=1 state=f5c9c15c49fac915 members=3 roster=7426eb33:7361726f,51e55f2c:72617961,69c76448:706178
```

| Record | Written when | Fields |
|---|---|---|
| `run` | the chat core starts for an installation | `installation` `account` |
| `epoch` | the conversation is created or joined, and each time its epoch changes | `installation` `convo` `epoch` `state` `members` `roster` |
| `left` | a commit removed this installation | `installation` `convo` `epoch` |
| `sent` | it published a post of its own | `installation` `convo` `frame` `epoch` |
| `received` | it read another member's post | `installation` `convo` `frame` `from` `epoch` |
| `unreadable` | a frame of the group could not be read | `installation` `convo` `frame` `epoch` `why` |
| `delivery` | the app's delivery service changed state | `state` |

| Field | Holds |
|---|---|
| `installation` | the first 4 bytes of the installation's public signing key, in hex |
| `account` | the first 4 bytes of the account id, in hex |
| `convo` | the conversation id, with a byte outside `[0-9A-Za-z_-]` written `%xx` |
| `epoch` | the MLS epoch: the one held, in `epoch` and `left`; the one the frame was sent at, as its header names it, in `sent`, `received` and `unreadable` |
| `state` | 8 bytes of BLAKE2b over the epoch authenticator, in hex |
| `members` | how many members the roster holds |
| `roster` | the members as `installation:account` pairs |
| `frame` | 8 bytes of BLAKE2b over the frame's bytes, in hex: the same at the sender and every reader |
| `from` | the sender's installation |
| `why` | `epoch` (another epoch), `decrypt` (failed to decrypt), or `sender` (the sender could not be checked) |
| `state` of `delivery` | `initialising`, `online`, `error` or `stopped` |

`run`, `epoch` and `left` decide the verdict; the others draw the page's posts and timeline. The records are
written in `core/conversations/src/report.rs`, from `core.rs` (`run`) and `conversation/group_v2.rs` (the
rest).
