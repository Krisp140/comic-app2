'use client';
import React, { useState } from 'react';
import ComicPanel from './ComicPanel';

const ComicGenerator: React.FC = () => {
  const [storyPrompt, setStoryPrompt] = useState('');
  const [panels, setPanels] = useState([
    { prompt: '', imageUrl: '', caption: '' },
    { prompt: '', imageUrl: '', caption: '' },
    { prompt: '', imageUrl: '', caption: '' },
  ]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePromptChange = (index: number, prompt: string) => {
    const newPanels = [...panels];
    newPanels[index] = { ...newPanels[index], prompt };
    setPanels(newPanels);
  };

  const generatePlot = async () => {
    try {
      const response = await fetch('/api/generate_plot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: storyPrompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Plot response:', data); // Debug log

      // Check for both data.comics and data.result.comics
      const comics = data.comics || (data.result && data.result.comics);
      
      if (comics && Array.isArray(comics)) {
        const newPanels = comics.map((comic: any, index: number) => ({
          ...panels[index],
          prompt: comic.prompt,
          caption: comic.caption,
        }));
        setPanels(newPanels);
        return true;
      }
      
      console.error('Invalid response format:', data); // Debug log
      return false;
    } catch (error) {
      console.error('Error generating plot:', error);
      alert('Failed to generate plot. Please try again.');
      return false;
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // First generate the plot
      const plotGenerated = await generatePlot();
      if (!plotGenerated) {
        throw new Error('Failed to generate plot');
      }

      // Then generate images for all panels sequentially
      const newPanels = [...panels];
      for (let i = 0; i < panels.length; i++) {
        const response = await fetch('/api/generate_imgs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: newPanels[i].prompt }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        newPanels[i] = {
          ...newPanels[i],
          imageUrl: data.imageUrl || '',
        };
        
        // Update panels one by one as they're generated
        setPanels([...newPanels]);
      }
    } catch (error) {
      console.error('Error generating comics:', error);
      alert('Failed to generate comics. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h1 className="text-4xl font-bold text-gray-800">Comic Generator</h1>
      
      {/* Story Prompt Input */}
      <div className="w-full max-w-2xl">
        <textarea
          className="w-full p-4 border-2 border-gray-300 rounded-lg resize-none"
          placeholder="Describe your story idea..."
          value={storyPrompt}
          onChange={(e) => setStoryPrompt(e.target.value)}
          rows={3}
          disabled={isGenerating}
        />
      </div>

      <div className="flex flex-wrap gap-8 justify-center">
        {panels.map((panel, index) => (
          <div key={index} className="flex flex-col gap-2">
            <ComicPanel
              imageUrl={panel.imageUrl}
              prompt={panel.prompt}
              onPromptChange={(prompt) => handlePromptChange(index, prompt)}
              panelNumber={index + 1}
              isLoading={isGenerating}
              caption={panel.caption}
            />
            {panel.caption && (
              <div className="text-center text-gray-700 font-medium">
                {panel.caption}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default ComicGenerator;