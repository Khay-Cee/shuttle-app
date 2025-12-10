// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the first screen of the onboarding flow
  return <Redirect href="/splash" />; 
}