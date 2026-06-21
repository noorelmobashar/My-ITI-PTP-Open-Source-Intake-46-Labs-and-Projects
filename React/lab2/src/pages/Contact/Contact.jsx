import { useEffect } from 'react';

export default function Contact() {
  useEffect(() => {
    document.title = "Contact | Course Platform";
  }, []);

  return (
    <div>Contact</div>
  )
}
