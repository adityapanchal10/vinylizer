/*
Base method to parse title*/
import * as re from 're';
import { reduce } from 'functools';
var SEPARATORS;
SEPARATORS = [" -- ", "--", " - ", " \u2013 ", " \u2014 ", " _ ", "-", "\u2013", "\u2014", ":", "|", "///", " / ", "_", "/"];

function clean_mvpv(text) {
  /*
  Remove various versions of "MV" and "PV" markers
  */
  text = re.sub("\\s*\\[\\s*(?:off?icial\\s+)?([PM]\\/?V)\\s*]", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("\\s*\\(\\s*(?:off?icial\\s+)?([PM]\\/?V)\\s*\\)", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("\\s*\u3010\\s*(?:off?icial\\s+)?([PM]\\/?V)\\s*\u3011", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("[\\s\\-\u2013_]+(?:off?icial\\s+)?([PM]\\/?V)\\s*", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("(?:off?icial\\s+)?([PM]\\/?V)[\\s\\-\u2013_]+", "", text);
  return text;
}

function clean_fluff(text) {
  /*
  Remove fluff
  */
  text = clean_mvpv(text);
  text = re.sub("\\s*\\[[^\\]]+]$", "", text);
  text = re.sub("^\\s*\\[[^\\]]+]\\s*", "", text);
  text = re.sub("\\s*\\([^)]*\\bver(\\.|sion)?\\s*\\)$", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("\\s*[a-z]*\\s*\\bver(\\.|sion)?$", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("\\s*(of+icial\\s*)?(music\\s*)?video", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("\\s*(full\\s*)?album", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("\\s*(ALBUM TRACK\\s*)?(album track\\s*)", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("\\s*\\(\\s*of+icial\\s*\\)", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("\\s*\\(\\s*lyric(s)?\\s*\\)", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("\\s*\\(\\s*(of+icial)?\\s*lyric(s)?\\s*\\)", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("\\s*\\(\\s*[0-9]{4}\\s*\\)", "", text, {
    "flags": re.IGNORECASE
  });
  text = re.sub("\\s+\\(\\s*(HD|HQ|[0-9]{3,4}p|4K)\\s*\\)$", "", text);
  text = re.sub("[\\s\\-\u2013_]+(HD|HQ|[0-9]{3,4}p|4K)\\s*$", "", text);
  return text;
}

function clean_title(title) {
  /*
  Clean song title
  */
  title = title.strip(" ");
  title = clean_fluff(title);
  title = re.sub("\\s*\\*+\\s?\\S+\\s?\\*+$", "", title);
  title = re.sub("\\s*video\\s*clip", "", title, {
    "flags": re.IGNORECASE
  });
  title = re.sub("\\s+\\(?live\\)?$", "", title, {
    "flags": re.IGNORECASE
  });
  title = re.sub("\\(\\s*\\)", "", title);
  title = re.sub("\\[\\s*]", "", title);
  title = re.sub("\u3010\\s*\u3011", "", title);
  title = re.sub("^(|.*\\s)\\\"(.*)\\\"(\\s.*|)$", "\\2", title);
  title = re.sub("^(|.*\\s)'(.*)'(\\s.*|)$", "\\2", title);
  title = re.sub("^[/\\s,:;~\\-\u2013_\\s\\\"]+", "", title);
  title = re.sub("[/\\s,:;~\\-\u2013_\\s\\\"]+$", "", title);
  return title;
}

function clean_artist(artist) {
  /*
  Clean artist name
  */
  artist = artist.strip(" ");
  artist = clean_fluff(artist);
  artist = re.sub("\\s*[0-1][0-9][0-1][0-9][0-3][0-9]\\s*", "", artist);
  artist = re.sub("^[/\\s,:;~\\-\u2013_\\s\\\"]+", "", artist);
  artist = re.sub("[/\\s,:;~\\-\u2013_\\s\\\"]+$", "", artist);
  return artist;
}

function in_quotes(text, idx) {
  var close_chars, index, open_chars, open_pars, toggle_chars;
  open_chars = "([{\u00ab";
  close_chars = ")]}\u00bb";
  toggle_chars = "\"'";
  open_pars = {
    ")": 0,
    "]": 0,
    "}": 0,
    "\u00bb": 0,
    "\"": 0,
    "'": 0
  };

  for (var character, _pj_c = 0, _pj_a = text.slice(0, idx), _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
    character = _pj_a[_pj_c];
    index = open_chars.find(character);

    if (index !== -1) {
      open_pars[close_chars[index]] += 1;
    } else {
      if (close_chars.find(character) !== -1 && open_pars[character] > 0) {
        open_pars[character] -= 1;
      }
    }

    if (toggle_chars.find(character) !== -1) {
      open_pars[character] = 1 - open_pars[character];
    }
  }

  return reduce((acc, value) => {
    return acc + value;
  }, open_pars.values()) > 0;
}

function split_artist_title(text) {
  /*
  Split text at separators
  */
  var idx;

  for (var separator, _pj_c = 0, _pj_a = SEPARATORS, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
    separator = _pj_a[_pj_c];

    try {
      idx = text.index(separator);
    } catch (e) {
      if (e instanceof ValueError) {
        continue;
      } else {
        throw e;
      }
    }

    if (idx > -1 && !in_quotes(text, idx)) {
      return [text.slice(0, idx), text.slice(idx + separator.length)];
    }
  }
}
