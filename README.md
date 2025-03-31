# MBTI Compatibility Checker

An opensource web application that helps you understand compatibility between MBTI personality types. This app provides detailed insights into how different MBTI types interact in relationships, friendships, and work environments.

## ✨ Features

- **Standardized Compatibility Scores** - Calculate precise compatibility percentages based on cognitive function theory
- **Detailed Analysis** - Get comprehensive insights into communication styles, strengths, and challenges
- **Visual Compatibility Meter** - Interactive, animated circular gauge showing compatibility percentage
- **Celebrity Examples** - See famous personalities for each MBTI type for better understanding
- **Premium UI/UX** - Modern, responsive design with smooth animations and color-coded compatibility indicators
- **Mobile-Friendly** - Works seamlessly on all devices

## 🛠️ Tech Stack

- **Next.js 14** - React framework with server-side rendering
- **TypeScript** - For type safety and better developer experience
- **Tailwind CSS** - For styling and responsive design
- **OpenAI API** - Powers the compatibility analysis
- **Lucide Icons** - Minimalist icon library

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mbti-compatibility-checker.git
cd mbti-compatibility-checker
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 📊 How It Works

The app uses a sophisticated algorithm based on cognitive function theory to calculate compatibility between MBTI types. When you select two MBTI types:

1. The app references a standardized compatibility matrix with scores for all 256 possible MBTI type combinations.
2. It sends a request to the OpenAI API to generate a detailed analysis including:
   - Overview of the relationship dynamics
   - Communication styles
   - Key strengths (with specific examples)
   - Potential challenges (with specific examples)
   - Growth opportunities
   - Compatibility rating

The results are displayed in a user-friendly format with a dynamic circular gauge showing the exact compatibility percentage.

## 🎨 Customization

You can customize the app by:

- Modifying the compatibility matrix in `src/app/page.tsx` to adjust compatibility scores
- Changing the color scheme in `src/app/globals.css`
- Adding more celebrity examples in the `celebrityExamples` array

## 📱 Screenshots

<!-- Replace these with actual screenshots -->
![image](https://github.com/user-attachments/assets/b263731f-dff3-49ae-9b4a-39ffd52abeaa)

![image](https://github.com/user-attachments/assets/b5f36d8c-8bcd-4322-acb1-623af50b873e)


## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/) for providing the API that powers the compatibility insights
- [MBTI Foundation](https://www.myersbriggs.org/) for the personality type framework
- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) for the beautiful icons
