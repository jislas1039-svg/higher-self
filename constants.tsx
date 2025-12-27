
import React from 'react';
import { Theme } from './types';

export const THEMES = {
  light: {
    bg: '#F8F7F4',
    primary: '#5E6B5A', // Sage
    secondary: '#8B7D6B', // Taupe
    accent: '#E6DED5', // Sand
    surface: '#FFFFFF',
    surfaceAlt: '#F8F7F4',
    text: '#2C2C2C',
    textDim: '#8B7D6B',
    border: '#F3F4F6',
    navBg: 'rgba(255, 255, 255, 0.8)',
  },
  dark: {
    bg: '#000000',
    primary: '#007AFF', // Vibrant Blue
    secondary: '#FFFFFF', // White
    accent: '#1A1A1A', // Dark Surface
    surface: '#121212',
    surfaceAlt: '#0A0A0A',
    text: '#FFFFFF',
    textDim: '#A0A0A0',
    border: '#2A2A2A',
    navBg: 'rgba(18, 18, 18, 0.9)',
  }
};

export const FOCUS_AREAS = [
  'Inner Thighs',
  'Outer Thighs',
  'Midsection/Abs',
  'Love Handles',
  'Chest/Pectorals',
  'Glutes',
  'Triceps/Arm Fat'
];

export const AUDIO_TRACKS = [
  { id: 'lFCIs9L-hm4', title: 'Japanese Spa Sanctuary', type: 'Spa', duration: '15:00' },
  { id: 'h_S3u_vF7D0', title: '528Hz DNA Repair/Clarity', type: 'Clarity', duration: '10:00' },
  { id: '1ZYbU82GVz4', title: 'Delta Wave Deep Sleep', type: 'Sleep', duration: '12:00' },
  { id: 'jfKfPfyJRdk', title: 'Lofi Focus Beats', type: 'Study', duration: '15:00' },
];

export const FREQUENCY_MODES = [
  { name: 'Pure Clarity', freq: 432, type: 'Alpha', description: 'Enhances focus and mental organization.' },
  { name: 'Deep Restoration', freq: 174, type: 'Delta', description: 'Promotes physical healing and deep rest.' },
  { name: 'Subconscious Cleanse', freq: 528, type: 'Theta', description: 'Unlocks creative blocks and heals the inner self.' },
];

export const VIDEO_AFFIRMATION = "https://player.vimeo.com/external/371433846.sd.mp4?s=231da6517a1baf963740553687a810d7204654b4&profile_id=164&oauth2_token_id=57447761";

export const ICONS = {
  steps: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  workout: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  mindfulness: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  support: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-3.536 5 5 0 015-5 4.978 4.978 0 013.536 1.414M7.05 16.95L4.222 19.778M3 21l1.778-1.778" />
    </svg>
  ),
  scanner: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
};
