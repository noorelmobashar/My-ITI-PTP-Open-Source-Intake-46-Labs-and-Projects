import { useEffect } from 'react';

export default function About() {
  useEffect(() => {
    document.title = "About | Course Platform";
  }, []);

  return (
    <div>About</div>
  )
}
