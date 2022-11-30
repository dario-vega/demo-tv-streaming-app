CREATE INDEX IF NOT EXISTS idx_showid ON stream_acct(
    info.contentStreamed[].showId as INTEGER)
    WITH UNIQUE KEYS PER ROW
