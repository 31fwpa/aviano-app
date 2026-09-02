#!/bin/bash
# Test the app's outbound links from the PHONE, not from this Mac.
#
# Why: the Mac's network can't reach most .mil hosts, so curl here reports
# failures for links that work perfectly on a phone (AFPAAS returned no
# response to curl and works fine in reality). The phone is the environment
# users are actually in, so it is the only environment worth trusting.
#
# Usage:  scripts/test-links-on-phone.sh [urls-file]
# Default urls file: /tmp/link-test-urls.txt (one URL per line)
#
# For each URL it opens the phone's browser, waits, and saves a screenshot.
# Review the screenshots to see what a user would actually get: the page, a
# sign-in wall, or an error. That judgement needs eyes — a status code cannot
# tell a CAC prompt from a working page.

set -u
ADB="${ADB:-$HOME/Library/Android/sdk/platform-tools/adb}"
URLS="${1:-/tmp/link-test-urls.txt}"
OUT="${OUT:-/tmp/link-test-shots}"
# DoD sites are slow. At 8s several screenshotted mid-load with the progress
# bar still running, which reads as a failure but isn't. 15s is enough.
WAIT="${WAIT:-15}"

[ -f "$URLS" ] || { echo "No URL list at $URLS"; exit 1; }
"$ADB" devices | grep -q "device$" || { echo "No phone connected (adb sees none)."; exit 1; }

echo "Leave the phone alone while this runs — every screenshot captures"
echo "whatever is on screen, so touching it mid-run ruins those results."
echo

# Keep the screen on for the duration. Without this the display sleeps partway
# through and the remaining screenshots come back solid black.
"$ADB" shell svc power stayon usb >/dev/null 2>&1
restore_power() { "$ADB" shell svc power stayon false >/dev/null 2>&1; }
trap restore_power EXIT

mkdir -p "$OUT"
total=$(grep -c . "$URLS")
i=0
# Read the list on file descriptor 3, not stdin: `adb shell` consumes stdin,
# which silently eats the rest of the list and ends the loop after one URL.
# (macOS ships bash 3.2, so no `mapfile` here.)
while IFS= read -r url <&3; do
  [ -z "$url" ] && continue
  i=$((i+1))
  name=$(printf "%02d" "$i")_$(echo "$url" | sed 's|https\?://||; s|[^A-Za-z0-9]|_|g' | cut -c1-60)
  printf "[%d/%d] %s\n" "$i" "$total" "${url:0:80}"
  "$ADB" shell input keyevent KEYCODE_WAKEUP >/dev/null 2>&1
  "$ADB" shell am start -a android.intent.action.VIEW -d "'$url'" >/dev/null 2>&1
  sleep "$WAIT"
  "$ADB" exec-out screencap -p > "$OUT/$name.png" 2>/dev/null
done 3< "$URLS"

echo
echo "Screenshots in $OUT"
echo "Review them: a working page, a sign-in wall, or an error each look obviously different."
