'use client';
import { useState } from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<'realistic' | 'cartoon' | 'surreal'>('realistic');
  const [comicPanels, setComicPanels] = useState<Array<{
    prompt: string;
    caption: string;
    imageUrl?: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStory = async () => {
    try {
      setIsLoading(true);
      setComicPanels([]);
      setError(null);  // Reset error state
      
      const storyResponse = await fetch('/api/generate_plot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, style }),
      });
      
      const storyData = await storyResponse.json();

      
      setComicPanels(storyData.result.comics);
      // Start generating images for each panel
      generateNextImage(storyData.result.comics, 0);
    } catch (error) {
      console.error('Error:', error);
      setError("An error occurred while generating the story. Please try again.");
      setIsLoading(false);
    }
  };
  const generateNextImage = async (panels: typeof comicPanels, index: number) => {
    if (index >= panels.length) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate_imgs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: panels[index].prompt }),
      });
      
      const data = await response.json();
      if (data.imageUrl) {
        setComicPanels(prev => prev.map((panel, i) => 
          i === index ? { ...panel, imageUrl: data.imageUrl } : panel
        ));
        // Generate next panel's image
        generateNextImage(panels, index + 1);
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-500 via-sage-800 to-sage-900 p-4 sm:p-8"
         style={{ 
           backgroundColor: '#B2AC88',
         }}>
      {/* Comic Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center mb-12 pt-8"
      >
        <h1 className="text-5xl sm:text-6xl text-sage-50 
          tracking-wider transform 
          [text-shadow:2px_2px_0_#6B8E6B,4px_4px_0_#4A644A] 
          hover:scale-105 transition-transform duration-300">
          Cody Comic Creator
        </h1>
        <p className="text-xl mt-4 text-sage-200 font-medium tracking-wide">Give Cody an adventure!</p>
      </motion.header>

      <main className="max-w-7xl mx-auto">
        {/* Input Section */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-sage-900/80 backdrop-blur-sm rounded-xl shadow-[0_0_15px_rgba(107,142,107,0.3)] 
            p-8 mb-12 max-w-2xl mx-auto border border-sage-600/30"
          style={{ backgroundColor: 'rgba(45, 63, 47, 0.6)' }}
        >
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a short prompt (e.g. 'adventure in Vermont')"
            maxLength={50}
            className="w-full px-4 py-3 border-2 border-sage-600/50 rounded-lg 
              bg-sage-800/30 text-white placeholder-grey
              focus:border-sage-500 focus:ring-2 focus:ring-sage-500/50 
              transition-all min-h-[100px]"
            style={{ backgroundColor: 'rgba(45, 63, 47, 0.3)' }}
          />

          <div className="flex gap-4 mt-4">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as 'realistic' | 'cartoon' | 'surreal')}
              className="px-4 py-3 border-2 border-sage-600/50 rounded-lg 
                bg-sage-900/30 text-sage-50
                focus:border-sage-500 focus:ring-2 focus:ring-sage-500/50 
                transition-all"
              style={{ backgroundColor: 'rgba(45, 63, 47, 0.3)' }}
            >
              <option value="realistic">Realistic</option>
              <option value="cartoon">Cartoon</option>
              <option value="surreal">Surreal</option>
            </select>

            <motion.button 
              onClick={generateStory}
              disabled={isLoading}
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(107,142,107,0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-sage-700 to-sage-600 
                text-sage-50 rounded-lg font-bold hover:from-sage-600 hover:to-sage-500 
                transition-all disabled:from-sage-600 disabled:to-sage-400 
                disabled:text-sage-300 shadow-lg border border-sage-500/50"
            >
              {isLoading ? 'Creating Your Comic...' : '✨Generate Comic ✨'}
            </motion.button>
          </div>
          
          
          {error && (
            <div className="mt-4 p-4 bg-red-900/10 border border-red-500/50 
              rounded-lg text-red-400 backdrop-blur-sm">
              {error}
            </div>
          )}
        </motion.div>

        {/* Comics Grid */}
        {comicPanels.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-sage-900/80 backdrop-blur-sm rounded-xl opacity-100 
              p-8"
            style={{ backgroundColor: 'rgba(45, 63, 47, 0)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {comicPanels.map((panel, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.2
                  }}
                  className="comic-panel group"
                >
                  <div className="relative aspect-square bg-sage-800/30 
                    rounded-lg overflow-hidden border-4 border-white 
                    shadow-[0_0_15px_rgba(0,0,0,0.3)] 
                    group-hover:shadow-[0_0_20px_rgba(107,142,107,0.3)] 
                    transition-all duration-300">
                    {!panel.imageUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 
                          border-4 border-sage-500 border-t-transparent">
                        </div>
                      </div>
                    )}
                    {panel.imageUrl && (
                      <Image
                        src={panel.imageUrl}
                        alt={`Panel ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  {panel.imageUrl && (
                    <div className="mt-4 p-3 bg-sage-800/30 backdrop-blur-sm rounded-lg 
                      border-4 border-white font-medium text-white
                      transform -rotate-1 group-hover:rotate-0 transition-all duration-300">
                      {panel.caption}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}