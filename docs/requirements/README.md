# Requirements queue

Parked user asks, one file each: `REQ-NNN-<slug>.md`, starting with a status header:

```
Status: parked | planned | built
```

/discover appends here, /architect promotes to `docs/plans/`, and lanes flip the status to `built` when done.
The site's upstream requirement is REQ-002 (product website). It lives in the TapNConnect docs repo.
