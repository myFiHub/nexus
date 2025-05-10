import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../components/Card';
import Button from '../components/Button';
import walletService from '../services/walletService';
import { loginWithWallet, fetchOutposts } from '../services/podiumApiService';
import { setToken, setLoading as setSessionLoading, setError as setSessionError } from '../redux/slices/sessionSlice';
import { RootState } from '../redux/store';

// Types for mock data (to be replaced with real data)
interface UserPass {
  id: number;
  outpostName: string;
  balance: number;
  currentPrice: number;
}

interface Outpost {
  address: string;
  name: string;
  description: string;
  currentPrice: number;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  // Redux selectors for wallet and session state
  const address = useSelector((state: RootState) => state.wallet.address);
  // No walletType in Wallet type; use a generic label or infer from connection logic if needed
  const isConnected = Boolean(address);
  const jwt = useSelector((state: RootState) => state.session.token);
  const sessionLoading = useSelector((state: RootState) => state.session.loading);
  const sessionError = useSelector((state: RootState) => state.session.error);

  // State for user passes and outposts
  const [userPasses, setUserPasses] = useState<UserPass[]>([]);
  const [outposts, setOutposts] = useState<Outpost[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Wallet login/authentication effect
  useEffect(() => {
    const doLogin = async () => {
      if (!address || jwt) return;
      dispatch(setSessionLoading(true));
      try {
        const loginMessage = `Sign in to Podium Nexus at ${new Date().toISOString()}`;
        const signature = await walletService.signMessage(address, loginMessage);
        const result = await loginWithWallet(address, signature);
        if (result && result.token) {
          dispatch(setToken(result.token));
        } else {
          dispatch(setSessionError('Login failed: No token returned'));
        }
      } catch (e: any) {
        dispatch(setSessionError(e?.message || 'Login failed'));
      } finally {
        dispatch(setSessionLoading(false));
      }
    };
    if (isConnected && !jwt && !sessionLoading) {
      doLogin();
    }
  }, [isConnected, jwt, address, dispatch, sessionLoading]);

  // Fetch user passes and outposts after authentication
  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !jwt) return;
      setDataLoading(true);
      setDataError(null);
      try {
        // Fetch user passes
        const passesRes = await fetch('/api/v1/podium-passes/my-passes', {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const passesData = await passesRes.json();
        // Map to UserPass[]
        const passes: UserPass[] = (passesData.data || []).map((p: any, idx: number) => ({
          id: idx,
          outpostName: p.outpost_name || p.outpostName || 'Unknown',
          balance: p.balance || 0,
          currentPrice: p.current_price || 0,
        }));
        setUserPasses(passes);

        // Fetch outposts
        const outpostsData = await fetchOutposts();
        // Map to Outpost[]
        const outpostsList: Outpost[] = (outpostsData || []).map((o: any) => ({
          address: o.address || o.uuid || '',
          name: o.name || 'Unknown',
          description: o.description || '',
          currentPrice: o.current_price || 0,
        }));
        setOutposts(outpostsList);
      } catch (e: any) {
        setDataError(e?.message || 'Failed to fetch data');
      } finally {
        setDataLoading(false);
      }
    };
    if (isConnected && jwt && !sessionLoading) {
      fetchData();
    }
  }, [isConnected, jwt, sessionLoading]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <h1 className="text-3xl font-bold text-[var(--color-primary)] mb-6">Dashboard</h1>

        {/* Wallet Connection Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          {!isConnected ? (
            <div className="text-[var(--color-text-muted)]">Please connect your wallet using the button in the navbar.</div>
          ) : (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-[var(--color-text-main)]">Connected: <span className="font-mono">{address}</span></p>
                <p className="text-sm text-[var(--color-text-muted)]">Wallet Connected</p>
              </div>
            </div>
          )}
        </section>

        {/* Loading State (session login) */}
        {sessionLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="text-[var(--color-text-muted)] mt-2">Authenticating...</p>
          </div>
        )}

        {/* Error State (session login) */}
        {sessionError && (
          <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span>{sessionError}</span>
          </div>
        )}

        {/* User Passes Section (placeholder) */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Passes</h2>
          {userPasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPasses.map((pass) => (
                <Card key={pass.id} className="bg-[var(--color-bg)]">
                  <h3 className="font-semibold">{pass.outpostName}</h3>
                  <p className="text-[var(--color-text-muted)]">Balance: {pass.balance}</p>
                  <p className="text-[var(--color-text-muted)]">Current Price: {pass.currentPrice / 100000000} APT</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)]">No passes found.</p>
          )}
        </section>

        {/* Outposts Section (placeholder) */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Available Outposts</h2>
          {outposts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outposts.map((outpost) => (
                <Card key={outpost.address} className="bg-[var(--color-bg)]">
                  <h3 className="font-semibold">{outpost.name}</h3>
                  <p className="text-[var(--color-text-muted)]">{outpost.description}</p>
                  <p className="text-[var(--color-text-muted)] mt-2">Price: {outpost.currentPrice / 100000000} APT</p>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)]">No outposts available.</p>
          )}
        </section>

        {/* Loading State (data fetching) */}
        {dataLoading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="text-[var(--color-text-muted)] mt-2">Loading...</p>
          </div>
        )}

        {/* Error State (data fetching) */}
        {dataError && (
          <div className="bg-[var(--color-error)] bg-opacity-10 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span>{dataError}</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard; 