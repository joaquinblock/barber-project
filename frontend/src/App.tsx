import { AppRouter } from '@/routes/AppRouter';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      {/* El toast de sonner no se muestra por algún motivo */}
      <Toaster richColors position="top-right" />  
      <AppRouter />
    </>
  );
}

export default App;