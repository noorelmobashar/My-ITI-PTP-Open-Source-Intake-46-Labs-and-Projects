import { useEffect } from 'react';

export default function Settings() {
  useEffect(() => {
    document.title = "Settings | Course Platform";
  }, []);

  return (
    <div>Settings</div>
  )
}
