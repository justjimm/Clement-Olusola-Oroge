/* ============================================================================
   config.js — everything the family may want to change lives here.
   Edit this file, commit, and GitHub Pages republishes within a minute.
   Nothing else needs to be touched.
   ========================================================================== */

window.SITE = {

  /* --- Who ------------------------------------------------------------- */
  person: {
    name: "Clement Ayodeji Olusola Oroge",
    shortName: "Clement Ayodeji Oroge",
    knownAs: "Great Uncle",
    alsoKnownAs: ["Boda Sola", "Uncle Sola", "C.A.O."],
    born: "16 August 1951",
    died: "22 May 2026",
    years: "1951 — 2026",
    verse: "I have fought the good fight, I have finished the race, I have kept the faith.",
    verseRef: "2 Timothy 4:7"
  },

  /* --- The three gatherings -------------------------------------------- */
  /* mapQuery: any address or place name. Leave "" and the map is hidden
     and replaced by a short "venue to be confirmed" note.                  */
  events: [
    {
      id: "service-of-songs",
      kicker: "The first gathering",
      title: "Service of Songs",
      date: "Friday, 14 August 2026",
      isoDate: "2026-08-14",
      time: "4:00 p.m.",
      venue: "Purity & Power Christian Life Ministry",
      address: "21 Victor Olaleye, Unity Estate, Iju-Ishaga, Lagos",
      mapQuery: "21 Victor Olaleye Street, Unity Estate, Iju-Ishaga, Lagos, Nigeria",
      note: "A service of thanksgiving in songs, scripture and tribute.",
      programme: "downloads/Service-of-Songs-Programme.pdf",
      programmeLabel: "Order of Service (2 pages, PDF)",
      youtube: "https://www.youtube.com/live/9n1aLLaI8Vc",
      youtubeId: "9n1aLLaI8Vc",
      thumb: "assets/img/thumb-service-of-songs.webp",
      watchLabel: "Watch the Service of Songs"
    },
    {
      id: "celebration-of-life",
      kicker: "The second gathering",
      title: "Celebration of Life & Posthumous Birthday",
      date: "Saturday, 15 August 2026",
      isoDate: "2026-08-15",
      time: "10:00 a.m.",
      venue: "Abundant Life Gospel Church (Peace Arena)",
      address: "67/69 Iju Road, at Abundant Life Bus Stop, Agege, Lagos",
      mapQuery: "Abundant Life Gospel Church Peace Arena, 67/69 Iju Road, Agege, Lagos, Nigeria",
      note: "The funeral service, held the day before what would have been his 75th birthday. Reception follows immediately.",
      programme: "downloads/Celebration-of-Life-Programme.pdf",
      programmeLabel: "Full programme & tributes (28 pages, PDF)",
      youtube: "https://www.youtube.com/live/v8V9x9hM648",
      youtubeId: "v8V9x9hM648",
      thumb: "assets/img/thumb-celebration-of-life.webp",
      watchLabel: "Watch the Celebration of Life"
    },
    {
      id: "thanksgiving",
      kicker: "The third gathering",
      title: "Thanksgiving & Birthday Celebration",
      date: "Sunday, 16 August 2026",
      isoDate: "2026-08-16",
      time: "10:00 a.m.",
      venue: "Abundant Life Gospel Church (Peace Arena)",
      address: "67/69 Iju Road, at Abundant Life Bus Stop, Agege, Lagos",
      mapQuery: "Abundant Life Gospel Church Peace Arena, 67/69 Iju Road, Agege, Lagos, Nigeria",
      note: "Thanksgiving to God on what would have been his seventy-fifth birthday.",
      programme: "",
      programmeLabel: "",
      youtube: "https://www.youtube.com/results?search_query=abundant+life+gospel+church+hq",
      youtubeId: "",                               // ← ADD VIDEO ID once it is streamed
      thumb: "assets/img/thumb-thanksgiving.webp",
      watchLabel: "Recording to follow — the church channel"
    }
  ],

  /* --- RSVP ------------------------------------------------------------- */
  rsvp: [
    { name: "Eniola",   phone: "+234 703 850 4600" },
    { name: "Peace",    phone: "+234 809 136 6231" },
    { name: "Yomi",     phone: "+234 803 309 2192" },
    { name: "Christian", phone: "+234 809 263 2603" },
    { name: "Omolola",  phone: "+234 803 717 5154" }
  ],

  /* --- YouTube ---------------------------------------------------------- */
  youtube: {
    channel: "https://www.youtube.com/@ClementAyodejiOroge",
    channelHandle: "@ClementAyodejiOroge"
  },

  /* --- Extra downloads (beyond the two programmes above) ---------------- */
  extraDownloads: [
    {
      title: "Invitation",
      file: "downloads/Invitation-Poster.jpg",
      label: "The three services on one page — easy to forward on WhatsApp (image)"
    }
  ],

  /* --- His song (plays only when a visitor presses play) ---------------- */
  music: {
    videoId: "tjqlkWhz-aA",
    title: "Unto Thee, O Lord",
    performer: "Maranatha Singers",
    note: "Sung twice at the Service of Songs, as Hymn 2 and again as Hymn 6."
  },

  /* --- Collecting tributes and media ------------------------------------ */
  contribute: {
    googleFormUrl: "https://docs.google.com/forms/d/11X0EcyXSeWBCuFHwKbs3Yqnn2YXe11t7168K1t1S7Go/viewform",
    embedHeight: 1400,
    fallbackEmail: "",                  // ← optional: e.g. "tributes@example.com"
    whatsapp: ""                        // ← optional: e.g. "2348012345678" (no + and no spaces)
  },

  /* --- Footer ----------------------------------------------------------- */
  footer: {
    line: "Put together by the family, for everyone whose life he touched.",
    contact: ""                         // ← optional email shown in the footer
  }
};
