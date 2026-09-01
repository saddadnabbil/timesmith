#!/bin/sh
# :8081 is QA-only — a revive must never inherit a stale built-output preview.
npm run dev >>/tmp/app-startup.log 2>&1 &
