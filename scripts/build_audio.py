import asyncio, pathlib, re, urllib.parse, json, sys, os
if not any(flag in sys.argv for flag in ("--list", "--check")):
    import edge_tts
    if os.environ.get("SSL_CERT_FILE"):
        from edge_tts.communicate import _SSL_CTX
        _SSL_CTX.load_verify_locations(os.environ["SSL_CERT_FILE"])
source = pathlib.Path("index.html").read_text(encoding="utf-8")
words = set(re.findall(r'\["([^"]+)","[^"]+"\]', source))
words.update(["Super!", "Sehr gut!", "oben", "unten", "links", "rechts", "in der Mitte"])
words.update(re.findall(r'speech:"([^"]+)"', source))
words.update(re.findall(r'sentence:"([^"]+)"', source))
words.update(re.findall(r'feedback:"([^"]+)"', source))
for block in re.findall(r'lines:\[([^\]]+)\]', source):
    words.update(re.findall(r'"([^"]+)"', block))
instructions = re.findall(r'^\s*(?:quiz|explore|memory|scene|position|spatial):"([^"]+)"[,]?$', source, re.MULTILINE)
words.update(instructions)
objects = json.loads(re.search(r'const spatialObjects=(\[[\s\S]*?\n\]);', source)[1])
for obj in objects:
    words.add(obj['noun'])
    for key in ('acc', 'detail'):
        for destination in ('nach oben', 'nach unten', 'nach links', 'nach rechts', 'in die Mitte'):
            words.add(f"Lege {obj[key]} {destination}.")
target = pathlib.Path("audio")
target.mkdir(exist_ok=True)
async def generate(word, semaphore):
    filename = urllib.parse.quote(word, safe="").replace("%", "_") + ".mp3"
    output = target / filename
    if output.exists() and output.stat().st_size > 1000:
        return
    async with semaphore:
        for attempt in range(4):
            try:
                await asyncio.wait_for(
                    edge_tts.Communicate(word, "cs-CZ-VlastaNeural" if word in instructions else "de-DE-KatjaNeural", rate="-10%", proxy=os.environ.get("HTTPS_PROXY")).save(str(output)),
                    timeout=45
                )
                if output.stat().st_size > 1000:
                    return
                raise RuntimeError("MP3 file too small")
            except Exception as exc:
                print(f"Neural voice failed ({attempt + 1}/4) for {word}: {exc}", flush=True)
                output.unlink(missing_ok=True)
                await asyncio.sleep(2 * (attempt + 1))
        raise RuntimeError(f"Cannot generate natural voice for {word}")
async def main():
    semaphore = asyncio.Semaphore(4)
    await asyncio.gather(*(generate(word, semaphore) for word in sorted(words)))
if '--list' in sys.argv:
    print('\n'.join(sorted(words)))
    sys.exit(0)
if '--check' in sys.argv:
    missing = [word for word in sorted(words) if not (target / (urllib.parse.quote(word, safe="").replace("%", "_") + ".mp3")).is_file() or (target / (urllib.parse.quote(word, safe="").replace("%", "_") + ".mp3")).stat().st_size <= 1000]
    print('Missing/invalid MP3: ' + str(len(missing)))
    print('\n'.join(missing))
    sys.exit(bool(missing))
asyncio.run(main())
print(f"Natural Katja Neural MP3 ready: {len(words)} phrases")
