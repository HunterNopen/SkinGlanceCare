import { Link, Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <>
      <header style={{ backgroundColor: '#222', padding: '1rem' }}>
        <nav
          style={{
            display: 'flex',
            // gap: '1rem',
            justifyContent: 'center',
          }}
        >
          <Link style={{ color: 'white' }} to="/">🏠 Strona główna</Link>
          <Link style={{ color: 'white' }} to="/FinalForm">🔑 Login</Link>
          <Link style={{ color: 'white' }} to="/SignUp">📝 Rejestracja</Link>
        </nav>
      </header>

      <main>
        {/* Tutaj wstawiany jest komponent aktualnej strony */}
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
