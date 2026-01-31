export interface NameInfo {
  name: string;
  gender: 'boy' | 'girl';
  meaning: string;
  origin: string;
  popularity?: number; // Rank (1 = most popular)
  peakDecade?: string; // e.g., "1990s"
  syllables: number;
  nicknames?: string[];
  famousPeople?: string[];
  variants?: string[];
}

// Helper to get a default NameInfo for names without data
export function getDefaultNameInfo(name: string, gender: 'boy' | 'girl'): NameInfo {
  return {
    name,
    gender,
    meaning: 'A beautiful name',
    origin: 'Various',
    syllables: countSyllables(name),
  };
}

// Simple syllable counter
function countSyllables(name: string): number {
  const vowels = 'aeiouyAEIOUY';
  let count = 0;
  let prevWasVowel = false;
  
  for (const char of name) {
    const isVowel = vowels.includes(char);
    if (isVowel && !prevWasVowel) {
      count++;
    }
    prevWasVowel = isVowel;
  }
  
  // Handle silent e
  if (name.toLowerCase().endsWith('e') && count > 1) {
    count--;
  }
  
  return Math.max(1, count);
}

