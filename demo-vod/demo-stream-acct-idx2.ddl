CREATE INDEX IF NOT EXISTS idx_showid_minWatched ON stream_acct(
    info.contentStreamed[].showId as INTEGER,
    info.contentStreamed[].seriesInfo[].episodes[].minWatched as INTEGER,
    info.contentStreamed[].seriesInfo[].episodes[].episodeID as INTEGER)
    WITH UNIQUE KEYS PER ROW
