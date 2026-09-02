#!/usr/bin/env python3
"""Collect every outbound link the app can open, for on-device testing.

Writes one URL per line to /tmp/link-test-urls.txt (or argv[1]).
Pair with test-links-on-phone.sh — see that script for why the phone is the
only environment worth testing these in.
"""
import re, sys, pathlib, urllib.parse

root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/link-test-urls.txt")

urls = set()
for p in list((root/'src'/'routes').glob('*.tsx')) + list((root/'src'/'content').glob('*.json')):
    for m in re.finditer(r'https?://[^\s"\'<>)\\]+', p.read_text()):
        urls.add(m.group(0).rstrip('.,'))

# Skip our own bundled asset host — those are files, not pages to review.
urls = {u for u in urls if 's3-us-gov-west-1.amazonaws.com' not in u}
ordered = sorted(urls, key=lambda u: (urllib.parse.urlparse(u).netloc, u))
out.write_text('\n'.join(ordered) + '\n')
print(f"{len(ordered)} links -> {out}")
