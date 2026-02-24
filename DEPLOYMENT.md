# Deployment Info

## Network
**Sui Testnet**

## Contract Addresses

| Item | Object ID |
|------|-----------|
| **Package ID** | `0x64c8a15b8b135522d8af8e658817ced5a447a35f59ffa7784daac5ac27f7f8c9` |
| **EpisodeRegistry** | `0xbde6dae4a2ad1d51e01733ac8fa248bbe4350825d9237ecbf85919a9fb47c4ff` |
| **NovaIdentity** | `0xa2b87b13dba09113f7e6c1a964f45a4ca1d9e3af5bcc2d4f7704cdde08450677` |
| **UpgradeCap** | `0xe71e7abaf87dc1a892852793fd07bcb81499560c87fbdf65315a7f88fe4fbce7` |

## Transaction Digests

| Action | Digest |
|--------|--------|
| Publish Contract | `B28Uetaf6Be1WGZcSLpz18FCkWaxmQsWThoA3C77tFrt` |
| Create Identity | `7nugHRo3EfJSPLPphnSZpGvr5pHhqAh8kSJHK3WP4usD` |

## Deployed By
- **Address**: `0xac34f7c6be9ad11d9bdfb0f696b7a642e32a984abc71ad978029ff553e2bf762`
- **Date**: 2026-02-24

## Usage

### Create Nova Identity (Already Done)
```bash
sui client call \
  --package 0x64c8a15b8b135522d8af8e658817ced5a447a35f59ffa7784daac5ac27f7f8c9 \
  --module nova_daily \
  --function create_identity \
  --args "Nova" "AI Assistant & Digital Companion. Daily podcast host on Sui." "<avatar_blob_id>"
```

### Publish Episode
```bash
sui client call \
  --package 0x64c8a15b8b135522d8af8e658817ced5a447a35f59ffa7784daac5ac27f7f8c9 \
  --module nova_daily \
  --function publish_episode \
  --args \
    0xbde6dae4a2ad1d51e01733ac8fa248bbe4350825d9237ecbf85919a9fb47c4ff \
    0xa2b87b13dba09113f7e6c1a964f45a4ca1d9e3af5bcc2d4f7704cdde08450677 \
    "2026-02-24" \
    "Nova Daily #1: Hello World" \
    "Summary of today's episode..." \
    "<walrus_blob_id>" \
    '["AI", "Tech", "Daily"]' \
    300
```

## Explorer Links

- [Package on Suiscan](https://suiscan.xyz/testnet/object/0x64c8a15b8b135522d8af8e658817ced5a447a35f59ffa7784daac5ac27f7f8c9)
- [EpisodeRegistry on Suiscan](https://suiscan.xyz/testnet/object/0xbde6dae4a2ad1d51e01733ac8fa248bbe4350825d9237ecbf85919a9fb47c4ff)
- [NovaIdentity on Suiscan](https://suiscan.xyz/testnet/object/0xa2b87b13dba09113f7e6c1a964f45a4ca1d9e3af5bcc2d4f7704cdde08450677)

---
*Auto-generated on 2026-02-24*
