# data/demo — provenance

This is the tiny, public-domain, in-git demo dataset described in §3 / §22 of the
spec. It exists only to exercise the pipeline end-to-end (`inspect`, `generate`,
tests). It is **not curated for gameplay quality** and is explicitly useless as a
real dictionary — see §22.

## Source

- Upstream: [`dwyl/english-words`](https://github.com/dwyl/english-words),
  file `words_alpha.txt`.
- License: [Unlicense](https://unlicense.org/) (public domain dedication) —
  see `english-words/LICENSE.md` in that repository.
- Snapshot fetched: 2026-08-27, from the `master` branch.

## How `core.txt` / `bonus.txt` / `block.txt` were derived

Deterministic, scripted, no manual judgment calls beyond the fixed rules below
(documented here so the selection can be reproduced or redone from a fresh
snapshot if needed — it is **not** regenerated automatically at build/install
time, the committed `.txt` files are the source of truth):

1. Keep only pure `[a-z]` entries, length 3–10.
2. Remove a small fixed profanity/slur blocklist (20 words) → written verbatim
   to `block.txt`. These never enter the vocab index (§5.4).
3. All remaining 3-letter words → `bonus.txt` (2128 words). Per §4.1, bonus.txt
   is allowed to be "a large machine list" — no manual curation applied.
4. `core.txt` (exactly 2000 words, length 4–9):
   - Six anchor wheel words are guaranteed present, along with every
     dictionary word that is a letter-subset of each one: `kitchen`, `garden`,
     `picture`, `mountain`, `computer`, `elephant`. This guarantees
     `lexicross inspect --dataset data/demo --word KITCHEN` (the literal
     example in §19 / M1 acceptance) produces a non-trivial report — 77 words
     ≥4 letters fit the KITCHEN pool, 120 words ≥3 letters, and `thicken` is a
     genuine second pangram alongside `kitchen` itself.
   - The remainder is filled with an evenly-strided deterministic sample
     across the rest of the filtered 4–9 letter word list (same index formula
     every time given the same input file → reproducible per §15).

## Known quality caveats (expected, not a bug)

`words_alpha.txt` is a large automated scrape and contains some archaic,
dialectal, or foreign-derived entries (e.g. `echt`, `chien`) and at least one
proper noun that slipped through (`abilene`). This is fine for a throwaway
demo/test fixture per §22 ("бесполезный для реальной игры") but means
`core.txt` should **not** be treated as a template for how a real, hand-reviewed
`core.txt` should look — that one genuinely gets checked by a human per §4.1.

## Checksums (of the files as committed)

```
sha256  core.txt   df24f51a9b76054cf7b04f45635e4c4dcd26a73771cd528360186b76d611fb10
sha256  bonus.txt  bab140501f62cc2f8e8c44862d99c29d81f049ae123a893752ad4c8b77015aa8
sha256  block.txt  1bd56d26919c09407b65fd5b8e8754d20b073f7f2fb4ef9c785b6d6d581cc91d
```
