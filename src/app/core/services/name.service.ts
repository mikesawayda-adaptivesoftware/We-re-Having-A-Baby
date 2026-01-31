import { Injectable } from '@angular/core';
import { BOY_NAMES } from '../../data/boy-names';
import { GIRL_NAMES } from '../../data/girl-names';
import { NAME_INFO_MAP } from '../../data/name-info';
import { Gender, shuffleWithSeed } from '../models/session.model';
import { NameInfo, getDefaultNameInfo } from '../models/name-info.model';

@Injectable({
  providedIn: 'root'
})
export class NameService {
  
  private shuffledNames: string[] = [];
  private currentGender: Gender | null = null;
  private currentSeed: number | null = null;

  getNames(gender: Gender): string[] {
    return gender === 'boy' ? BOY_NAMES : GIRL_NAMES;
  }

  getNameInfo(name: string, gender: Gender): NameInfo {
    const info = NAME_INFO_MAP.get(name.toLowerCase());
    if (info) {
      return info;
    }
    // Return default info for names not in our database
    return getDefaultNameInfo(name, gender);
  }

  getShuffledNames(gender: Gender, seed: number): string[] {
    // Cache the shuffled names if same gender and seed
    if (this.currentGender === gender && this.currentSeed === seed) {
      return this.shuffledNames;
    }
    
    const names = this.getNames(gender);
    this.shuffledNames = shuffleWithSeed(names, seed);
    this.currentGender = gender;
    this.currentSeed = seed;
    
    return this.shuffledNames;
  }

  getNameAtIndex(gender: Gender, seed: number, index: number): string | null {
    const names = this.getShuffledNames(gender, seed);
    if (index >= 0 && index < names.length) {
      return names[index];
    }
    return null;
  }

  getTotalNames(gender: Gender): number {
    return this.getNames(gender).length;
  }

  clearCache(): void {
    this.shuffledNames = [];
    this.currentGender = null;
    this.currentSeed = null;
  }
}

