/**
 * ✨ EDIT THIS FILE to customize the birthday greeting! ✨
 *
 * This is the ONLY file you need to modify.
 * No need to touch HTML, CSS, or any other JavaScript files.
 *
 * AVAILABLE SECTION TYPES:
 *   "greeting"      → Opening greeting with recipient's name
 *   "announcement"  → Birthday announcement text
 *   "chatbox"       → Chat message with typing animation
 *   "ideas"         → Sequential text reveals, one by one
 *   "quote"         → Styled quote card with optional author
 *   "countdown"     → Animated 3-2-1 countdown
 *   "stars"         → Twinkling stars background
 *   "fireworks"     → Colorful firework sparks burst
 *   "balloons"      → Floating balloon animation
 *   "profile"       → Profile photo with birthday wish
 *   "gallery"       → Photo gallery with both of you
 *   "confetti"      → Confetti burst animation
 *   "closing"       → Closing message with replay button
 *
 * HOW TO USE:
 *   REMOVE a section  → Delete its object from the sections array
 *   DUPLICATE          → Copy-paste any section object
 *   REORDER            → Move the section object up/down in the array
 *   EDIT TEXT          → Change the string values
 */

const CONFIG = {
  // ── Recipient Info ────────────────────────────────────────────
  name: "Mantasha Irshad",
  fromName: "Adarsh Khan",
  photo: "./img/mantasha1.jpg",       // Place your photo in the img/ folder
  music: "./music/hbd.mpeg",          // File name in the music/ folder (e.g. "hbd.mpeg")

  // ── Theme Colors ──────────────────────────────────────────────
  // A toggle button lets the viewer switch between dark & light mode.
  colors: {
    primary: "#ff6b9d",               // Main accent color (rose pink)
    accent: "#c9a96e",                // Secondary accent color (gold)
    dark: {
      background: "#0d0221",          // Deep purple-black
      text: "#f5e6d3",                // Warm cream
    },
    light: {
      background: "#fdf6f0",          // Soft cream
      text: "#3d2b44",                // Deep plum
    },
  },

  // ── Default Color Mode ────────────────────────────────────────
  // Options: "dark" or "light"
  defaultMode: "dark",

  // ── Gallery Timing ────────────────────────────────────────────
  // How many seconds each photo stays on screen in the "gallery" section.
  // Raise it for a slower, dreamier slideshow.
  galleryDuration: 3.2,

  // ── Sections ──────────────────────────────────────────────────
  // Add, remove, duplicate, or reorder as you wish!
  sections: [
    {
      type: "greeting",
      title: "Hey",
      subtitle: "I've been waiting for this day... for you 💖",
    },
    {
      type: "countdown",
      from: 3,                    // Countdown from this number
      goText: "✨",              // Text shown after countdown ends
    },
    {
      type: "announcement",
      text: "It's your birthday, my love! 🎂",
    },
    {
      type: "chatbox",
      message:
        "Happy birthday to the most beautiful, amazing, and wonderful person I know. May your day be filled with as much happiness, love, and sparkle as you bring into my life. I love you more than words can say! 💌",
      buttonText: "Send with love",
    },
    {
      type: "ideas",
      lines: [
        "I wanted to do something <strong>special</strong> for you.",
        "Because you deserve the world and so much more.",
        "You are my <strong>sunshine</strong>, my <strong>strength</strong>, my <strong>everything</strong>.",
        "And I'll always be there, loving you, now and forever. 💕",
      ],
      bigLetters: "LOVE",
    },
    {
      type: "quote",
      text: "In all the world, there is no heart for me like yours. In all the souls, there is no love for you like mine.",
      author: "— Adarsh 💖",
    },
    {
      type: "stars",
      count: 60,
    },
    {
      type: "balloons",
      count: 30,
    },
    {
      type: "gallery",
      title: "My Whole World 💖",
      // Each photo appears alone, one by one, with its own love note below.
      photos: [
        "./img/mantasha1.jpg",
        "./img/mantasha2.jpg",
        "./img/couple1.jpg",
        "./img/couple2.jpg",
        "./img/WhatsApp Image 2026-10-17 at 1.36.45 PM.jpeg",
        "./img/WhatsApp Image 2026-10-17 at 1.36.46 PM.jpeg",
        "./img/WhatsApp Image 2026-10-17 at 1.36.46 PM (1).jpeg",
        "./img/WhatsApp Image 2026-10-17 at 1.36.46 PM (2).jpeg",
      ],
      captions: [
        "my love 💗",
        "love u forever and ever 💞",
        "my life line 🥰",
        "my sweet heart 💝",
        "my princess 👑",
        "my soulmate 💫",
        "my whole world 🌍",
        "forever yours, my jaan ❤️",
      ],
    },
    {
      type: "profile",
      wishTitle: "Happy Birthday, Mantasha! 💖",
      wishText: "May this year bring you everything your heart desires. You are my greatest blessing. I love you endlessly, my beautiful love. 🌹✨",
    },
    {
      type: "fireworks",
      count: 30,
    },
    {
      type: "confetti",
      count: 12,
    },
    {
      type: "closing",
      text: "This was made with so much love, just for you. 💖\n\nHappy Birthday, my love. I adore you.",
      replayText: "Click to watch it all over again 🌹",
    },
  ],
};