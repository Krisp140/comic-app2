import React from 'react';
import Image from 'next/image';

interface ComicPanelProps {
  imageUrl?: string;
  prompt: string;
  onPromptChange: (prompt: string) => void;
  panelNumber: number;
  isLoading: boolean;
  caption: string;
}

const ComicPanel: React.FC<ComicPanelProps> = ({
  imageUrl,
  prompt,
  onPromptChange,
  panelNumber,
  isLoading,
  caption,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="border-2 border-gray-300 rounded-lg p-2 w-[300px] h-[300px] relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : imageUrl && imageUrl.length > 0 ? (
          <Image
            src={imageUrl}
            alt={`Comic panel ${panelNumber}`}
            fill
            className="object-cover rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Panel {panelNumber}
          </div>
        )}
      </div>
      <textarea
        className="w-full p-2 border-2 border-gray-300 rounded-lg resize-none"
        placeholder={`Describe panel ${panelNumber}...`}
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        rows={3}
      />
    </div>
  );
};

export default ComicPanel;