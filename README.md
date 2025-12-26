# JSONMind - JSON Visualization Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Transform JSON data into interactive mind maps for better visualization and understanding.

![JSONMind Screenshot](https://github.com/user-attachments/assets/3af4484a-7e32-4560-9a17-579553552ce5)

## 🌟 Features

- **Visual JSON Representation**: Automatically converts JSON data into intuitive mind map structures
- **Real-time Synchronization**: Bidirectional sync between JSON editor and mind map visualization
- **Type-based Color Coding**: Different colors for different data types
  - 🟢 **Green**: String values
  - 🔵 **Blue**: Number values  
  - 🟠 **Orange**: Boolean values
  - ⚪ **Grey**: Null values
  - 🟡 **Orange Container**: Object nodes
  - 🔵 **Blue Container**: Array nodes
- **Split Node Design**: Combined key-value display for primitive types
- **Interactive Navigation**: Zoom in/out, pan, and center content
- **JSON Validation**: Real-time JSON syntax checking with error messages
- **Format JSON**: One-click JSON beautification

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HoChihchou/JSONMind.git
cd JSONMind
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 Usage

1. **Edit JSON**: Type or paste JSON data in the left editor panel
2. **Auto-visualization**: The mind map updates automatically as you type
3. **Format**: Click "Format JSON" to beautify your JSON
4. **Navigate**: Use zoom controls to explore large JSON structures
5. **Validate**: Check for syntax errors with real-time validation

### Example JSON

```json
{
  "name": "JSONMind",
  "version": "1.0.0",
  "author": "Developer",
  "license": "MIT",
  "features": ["visualization", "editing"],
  "status": "active",
  "count": 42,
  "enabled": true
}
```

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework**: React + TypeScript 5.9
- **State Management**: Zustand 4.4
- **Graph Visualization**: AntV X6 2.18
- **Build Tool**: Vite 5.x
- **UI Components**: Ant Design 5.x

### Project Structure

```
src/
├── components/          # React components
│   ├── Editor/         # JSON editor component
│   ├── MindMap/        # Mind map visualization
│   └── Layout/         # Layout components
├── core/               # Core logic
│   ├── parser.ts       # JSON parser
│   └── transformer.ts  # Data transformer
├── store/              # State management
│   └── appStore.ts     # Zustand store
├── types/              # TypeScript types
│   ├── node.ts         # Node types
│   └── graph.ts        # Graph types
└── utils/              # Utility functions
```

### Key Design Patterns

- **Unidirectional Data Flow**: JSON → Parser → Tree Model → Graph Data → Visualization
- **Type Safety**: Strong TypeScript typing throughout the codebase
- **Component Composition**: Modular, reusable React components
- **Custom Node Rendering**: Specialized nodes for different data types

## 🎨 Visual Design

The application follows the design specifications from the PRD:

- **Horizontal Layout**: Root node on the left, children extend to the right
- **Symmetric Distribution**: Balanced vertical spacing
- **Container Nodes**: Show type icon ({} or []) and key name
- **Split Nodes**: Left side (grey) shows key, right side (colored) shows value with type icon

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

The project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Vite** for fast development and building

## 📋 Roadmap

### Current Features (v1.0)
- ✅ JSON parsing and validation
- ✅ Mind map visualization
- ✅ Bidirectional synchronization
- ✅ Type-based color coding
- ✅ Zoom and pan controls
- ✅ Format JSON

### Future Enhancements (v2.0)
- [ ] Node editing (double-click to edit values)
- [ ] Add/delete nodes
- [ ] Drag and drop for arrays
- [ ] Undo/redo functionality
- [ ] Export to PNG/SVG
- [ ] Export to JSON file
- [ ] Keyboard shortcuts
- [ ] Dark mode
- [ ] Lazy loading for large JSON files
- [ ] Search and filter

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Based on the technical specifications in [技术方案.md](./技术方案.md)
- Inspired by the need for better JSON visualization tools
- Built with modern web technologies

## 📞 Contact

Project Link: [https://github.com/HoChihchou/JSONMind](https://github.com/HoChihchou/JSONMind)

---

Made with ❤️ for developers who work with JSON
