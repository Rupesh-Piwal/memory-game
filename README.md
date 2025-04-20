# 🧠 Memory Match Game

A fun and responsive memory matching game built with React and Lucide icons! Flip cards, find pairs of famous team logos, and try to beat your best time.

## 🎮 Game Instructions

### 🧩 Objective

Match all the pairs of cards in the shortest time and with the fewest moves possible.

### 🕹️ How to Play

1. **Start the Game**  
   On page load, the game automatically initializes with a 4x4 grid (can be changed to 2x2–6x6).

2. **Flip Cards**  
   Click any two cards to flip them. If they match, they stay face up. If not, they'll flip back.

3. **Track Progress**

   - ⏱ Timer starts with your first card flip.
   - 🎯 Matches and 🌀 Moves are tracked on the side panel.
   - 🏆 Try to match all cards as quickly and efficiently as possible.

4. **Winning the Game**  
   When all card pairs are matched:
   - A victory modal appears.
   - Your time is recorded.
   - If it's your best for the selected grid size, it's saved locally.

### ⚙️ Features

- Adjustable grid size (2x2 to 6x6)
- Local storage for best scores per grid size
- Timer and move counter
- Animated card flipping
- Team logos like CSK, MI, RCB, FCB, RM, and more
- Win modal with best time notification

## 🛠️ Setup & Installation

1. **Clone the Repo**

   ```bash
   git clone https://github.com/your-username/memory-match-game.git
   cd memory-match-game
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Development Server**

   ```bash
   npm run dev
   ```

4. **Open in Browser**
   ```
   http://localhost:5173
   ```

## ✅ Build for Production

To build the app for production, run:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add Some Feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request
