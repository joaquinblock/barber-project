import { AppRouter } from '@/routes/AppRouter';
import { AuthProvider } from '@/core/auth/context/auth.context';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App;