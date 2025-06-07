import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../components/Card';
import Button from '../components/Button';
import walletService, { loginWithWeb3AuthAndAptos, fetchAllMoveBalances } from '../services/walletService';
import { loginWithWallet, fetchOutposts, fetchUserPasses, loginWithAptosWallet } from '../services/podiumApiService';
import { setToken, setLoading as setSessionLoading, setError as setSessionError } from '../redux/slices/sessionSlice';
import { RootState } from '../redux/store';
import { 
  selectWalletAddress, 
  selectWalletType, 
  selectWalletProvider 
} from '../redux/walletSelectors';
import store from '../redux/store';
import { checkIfUserHasPodiumDefinedEntryTicket, PODIUM_TARGET_ADDRESSES } from '../services/podiumProtocolService';
import podiumProtocol from '../services/podiumProtocol';
import { PODIUM_PROTOCOL_CONFIG } from '../config/config';
import { getUserTokenBalances } from '../services/movementIndexerService';
import { MOVE_COIN_TYPES } from '../config/config';
import podiumProtocolService from '../services/podiumProtocolService';

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

// Types for on-chain data
interface OnChainPass {
  outpostAddress: string;
  outpostName: string;
  balance: number;
  currentPrice: number;
}

// Helper to create a fallback label for a target address
const fallbackLabel = (address: string) => `Podium Pass: ${address.slice(0, 6)}...${address.slice(-4)}`;

// Helper to format MOVE/coin values (divide by 1e8, show up to 8 decimals, use commas)
const formatMoveAmount = (value: number | string) =>
  (Number(value) / 1e8).toLocaleString(undefined, { maximumFractionDigits: 8 });

// Helper to label asset types
const getAssetLabel = (assetType: string) => {
  if (assetType === '0x000000000000000000000000000000000000000000000000000000000000000a') {
    return 'MOVE';
  }
  return assetType;
};

// Utility: Copy to clipboard
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  } catch (e) {
    alert('Failed to copy!');
  }
};

// Utility: Shorten address
const shortenAddress = (address: string) => address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

// Utility: Tooltip (simple hover)
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = React.useState(false);
  return (
    <span className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <span className="absolute z-10 left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-[var(--color-surface)] text-xs text-[var(--color-text-main)] shadow-lg whitespace-nowrap">
          {text}
        </span>
      )}
    </span>
  );
};

// Utility: Calculate total sell value for passes (calls contract)
const calculateTotalSellValue = async (passAddress: string, amount: number) => {
  if (!passAddress || !amount) return 0;
  try {
    // Use podiumProtocol.calculate_sell_price_with_fees if available
    if (typeof podiumProtocol.calculate_sell_price_with_fees === 'function') {
      const [price] = await podiumProtocol.calculate_sell_price_with_fees(passAddress, amount);
      return price;
    }
    // Fallback: multiply by current price (not accurate for bonding curve)
    const currentPrice = await podiumProtocol.getPassPrice(passAddress);
    return currentPrice * amount;
  } catch (e) {
    console.error('[Dashboard] Error calculating total sell value:', e);
    return 0;
  }
};

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  // Redux selectors for wallet and session state
  const address = useSelector(selectWalletAddress);
  const walletType = useSelector(selectWalletType);
  const provider = useSelector(selectWalletProvider);
  const isConnected = Boolean(address);
  const jwt = useSelector((state: RootState) => state.session.token);
  const sessionLoading = useSelector((state: RootState) => state.session.loading);
  const sessionError = useSelector((state: RootState) => state.session.error);

  // State for user passes and outposts
  const [userPasses, setUserPasses] = useState<UserPass[]>([]);
  const [outposts, setOutposts] = useState<Outpost[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  // Prevent infinite login attempts
  const [loginAttempted, setLoginAttempted] = useState(false);
  // Provider rehydration state
  const [providerSyncing, setProviderSyncing] = useState(false);

  // State for on-chain balances
  const [moveBalance, setMoveBalance] = useState<string>('0');
  const [onChainPasses, setOnChainPasses] = useState<OnChainPass[]>([]);
  // moveBalances now includes metadata for each asset
  const [moveBalances, setMoveBalances] = useState<{ type: string; balance: string; metadata?: any }[]>([]);

  // Move these hooks outside the map function
  const [buyPrices, setBuyPrices] = React.useState<Record<string, number | null>>({});
  const [sellPrices, setSellPrices] = React.useState<Record<string, number | null>>({});
  const [totalValues, setTotalValues] = React.useState<Record<string, number | null>>({});
  const [showBuyModal, setShowBuyModal] = React.useState<Record<string, boolean>>({});
  const [showSellModal, setShowSellModal] = React.useState<Record<string, boolean>>({});
  const [tradeAmounts, setTradeAmounts] = React.useState<Record<string, number>>({});

  // Add new state for pass details
  const [passDetails, setPassDetails] = useState<Record<string, {
    symbol: string;
    prices: {
      singlePrice: number;
      buyPrice: number;
      sellPrice: number;
      buyPriceWithFees: number;
      sellPriceWithFees: number;
      fees: {
        buy: { protocol: number; subject: number; referral: number };
        sell: { protocol: number; subject: number };
      };
    };
    supply: number;
  }>>({});

  // Wallet login/authentication effect
  useEffect(() => {
    if (!isConnected || jwt || sessionLoading || loginAttempted) return;
    if (!walletType || !provider || typeof provider.request !== 'function') {
      // Try to rehydrate provider
      setProviderSyncing(true);
      walletService.syncWalletSession(dispatch).then(() => {
        const newProvider = store.getState().wallet.provider;
        setProviderSyncing(false);
        if (!newProvider || typeof newProvider.request !== 'function') {
          dispatch(setSessionError('Wallet provider not ready. Please reconnect your wallet.'));
          setLoginAttempted(true);
        }
      });
      return;
    }
    const doLogin = async () => {
      try {
        console.debug('[Dashboard] Attempting login with wallet:', address, walletType);
        await loginWithWeb3AuthAndAptos(dispatch, provider, address || '');
      } catch (e: any) {
        console.error('[Dashboard] Login error:', e);
        const errorMsg = (e && typeof e.message === 'string' && e.message) ? e.message : 'Login failed. Please reconnect your wallet.';
        dispatch(setSessionError(errorMsg));
      } finally {
        setLoginAttempted(true);
      }
    };
    doLogin();
  }, [isConnected, jwt, sessionLoading, loginAttempted, walletType, provider, address, dispatch]);

  // Fetch user passes and outposts after authentication
  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !jwt) return;
      setDataLoading(true);
      setDataError(null);
      try {
        // Fetch user passes
        console.debug('[Dashboard] Fetching user passes...');
        const passesData = await fetchUserPasses();
        const passes: UserPass[] = (passesData || []).map((p: any, idx: number) => ({
          id: idx,
          outpostName: p.outpost_name || p.outpostName || 'Unknown',
          balance: p.balance || 0,
          currentPrice: p.current_price || 0,
        }));
        setUserPasses(passes);

        // Fetch outposts
        console.debug('[Dashboard] Fetching outposts...');
        const outpostsData = await fetchOutposts();
        const outpostsList: Outpost[] = (outpostsData || []).map((o: any) => ({
          address: o.address || o.uuid || '',
          name: o.name || 'Unknown',
          description: o.description || '',
          currentPrice: o.current_price || 0,
        }));
        setOutposts(outpostsList);
      } catch (e: any) {
        console.error('[Dashboard] Data fetch error:', e);
        setDataError(e?.message || 'Failed to fetch data');
      } finally {
        setDataLoading(false);
      }
    };
    if (isConnected && jwt && !sessionLoading) {
      fetchData();
    }
  }, [isConnected, jwt, sessionLoading]);

  // Fetch MOVE balance and on-chain passes (prefer indexer)
  useEffect(() => {
    if (!isConnected || !address) return;
    setDataLoading(true);
    setDataError(null);
    (async () => {
      try {
        let indexerBalances: any[] = [];
        try {
          indexerBalances = await getUserTokenBalances(address);
          console.debug('[Dashboard] Indexer balances full:', indexerBalances);
        } catch (e) {
          console.error('[Dashboard] Indexer fetch failed, falling back to on-chain:', e);
        }
        if (indexerBalances && indexerBalances.length > 0) {
          // MOVE balances (include metadata)
          setMoveBalances(indexerBalances.filter((b: any) => MOVE_COIN_TYPES.includes(b.asset_type)).map((b: any) => ({ type: b.asset_type, balance: b.amount, metadata: b.metadata })));
          // Podium Passes: project_uri === 'https://podium.fi/pass/'
          const passResults: OnChainPass[] = indexerBalances
            .filter((b: any) => b.metadata && b.metadata.project_uri === 'https://podium.fi/pass/')
            .map((b: any) => ({
              outpostAddress: b.asset_type,
              outpostName: getAssetLabel(b.asset_type),
              balance: Number(b.amount),
              currentPrice: 0, // Price not available from indexer
            }));
          setOnChainPasses(passResults);
          // For backward compatibility, set the first as moveBalance
          const firstMove = indexerBalances.find((b: any) => MOVE_COIN_TYPES.includes(b.asset_type));
          setMoveBalance(firstMove ? firstMove.amount : '0');
        } else {
          // Fallback to on-chain fetchAllMoveBalances
          const allMoveBalances = await fetchAllMoveBalances(address);
          // Add metadata: null for fallback balances
          setMoveBalances(allMoveBalances.map((b: any) => ({ ...b, metadata: null })));
          if (allMoveBalances.length === 0) {
            setMoveBalance('0');
          } else {
            setMoveBalance(allMoveBalances[0].balance);
          }
          console.debug('[Dashboard] All MOVE balances (on-chain fallback):', allMoveBalances);
          // Fallback: fetch passes on-chain as before
          /*
          const passResults: OnChainPass[] = [];
          for (const targetAddress of PODIUM_TARGET_ADDRESSES) {
            let targetName = '';
            try {
              targetName = await podiumProtocol.getAssetSymbol(targetAddress);
              if (!targetName) {
                targetName = fallbackLabel(targetAddress);
                console.debug(`[Dashboard] No symbol for ${targetAddress}, using fallback.`);
              } else {
                console.debug(`[Dashboard] Got symbol for ${targetAddress}:`, targetName);
              }
            } catch (e) {
              targetName = fallbackLabel(targetAddress);
              console.debug(`[Dashboard] getAssetSymbol failed for ${targetAddress}, using fallback.`, e);
            }
            const balance = await podiumProtocol.getPassBalance(address, targetAddress);
            if (balance && Number(balance) > 0) {
              const currentPrice = await podiumProtocol.getPassPrice(targetAddress);
              passResults.push({ outpostAddress: targetAddress, outpostName: targetName, balance: Number(balance), currentPrice: Number(currentPrice) });
              console.debug(`[Dashboard] Pass for target ${targetName} (${targetAddress}): balance=${balance}, price=${currentPrice}`);
            }
          }
          setOnChainPasses(passResults);
          */
        }
      } catch (e: any) {
        console.error('[Dashboard] On-chain/indexer data fetch error:', e);
        setDataError(e?.message || 'Failed to fetch on-chain/indexer data');
      } finally {
        setDataLoading(false);
      }
    })();
  }, [isConnected, address]);

  // Fetch prices/values on mount
  useEffect(() => {
    const fetchPrices = async () => {
      const newBuyPrices: Record<string, number | null> = {};
      const newSellPrices: Record<string, number | null> = {};
      const newTotalValues: Record<string, number | null> = {};

      for (const pass of onChainPasses) {
        if (typeof pass.outpostAddress === 'string') {
          try {
            const price = await podiumProtocol.getPassPrice(pass.outpostAddress);
            newBuyPrices[pass.outpostAddress] = price;
            newSellPrices[pass.outpostAddress] = price;
            newTotalValues[pass.outpostAddress] = pass.balance * price;
          } catch (e) {
            console.error(`Error fetching price for ${pass.outpostAddress}:`, e);
          }
        }
      }

      setBuyPrices(newBuyPrices);
      setSellPrices(newSellPrices);
      setTotalValues(newTotalValues);
    };

    fetchPrices();
  }, [onChainPasses]);

  // Add new effect to fetch pass details
  useEffect(() => {
    const fetchPassDetails = async () => {
      const details: Record<string, any> = {};
      for (const pass of onChainPasses) {
        try {
          const passDetail = await podiumProtocolService.getPassDetails(pass.outpostAddress, pass.balance);
          details[pass.outpostAddress] = passDetail;
        } catch (error) {
          console.error(`Error fetching details for pass ${pass.outpostAddress}:`, error);
          // Show error toast or handle gracefully
        }
      }
      setPassDetails(details);
    };
    
    if (onChainPasses.length > 0) {
      fetchPassDetails();
    }
  }, [onChainPasses]);

  // Handlers
  const handleBuy = async (passAddress: string) => {
    if (!address) return;
    try {
      await podiumProtocol.buyPass(address, passAddress, tradeAmounts[passAddress] || 1);
      alert('Buy transaction submitted!');
    } catch (e) {
      alert('Buy failed!');
    }
    setShowBuyModal(prev => ({ ...prev, [passAddress]: false }));
  };

  const handleSell = async (passAddress: string) => {
    if (!address) return;
    try {
      await podiumProtocol.sellPass(address, passAddress, tradeAmounts[passAddress] || 1);
      alert('Sell transaction submitted!');
    } catch (e) {
      alert('Sell failed!');
    }
    setShowSellModal(prev => ({ ...prev, [passAddress]: false }));
  };

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
            <span>{sessionError ?? ''}</span>
            <div className="mt-2">
              <Button onClick={() => { setLoginAttempted(false); window.location.reload(); }}>
                Reconnect Wallet
              </Button>
            </div>
          </div>
        )}

        {/* Loading State (session login) */}
        {providerSyncing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mx-auto"></div>
            <p className="text-[var(--color-text-muted)] mt-2">Rehydrating wallet provider...</p>
          </div>
        )}

        {/* MOVE Balance Section */}
        {isConnected && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your MOVE Balances</h2>
            {moveBalances.length > 0 ? (
              <ul className="space-y-1">
                {moveBalances.map((mb, i) => (
                  <li key={mb.type} className="font-mono text-[var(--color-success)]">
                    {formatMoveAmount(mb.balance)} MOVE
                    <span className="ml-2 text-xs text-[var(--color-text-muted)]">[{mb.type.slice(-30)}]</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[var(--color-text-muted)]">No MOVE balances found.</p>
            )}
          </section>
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

        {/* On-Chain Passes Section (Refactored) */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Podium Passes (On-Chain)</h2>
          {onChainPasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {onChainPasses.map((pass) => {
                const meta = moveBalances.find((b) => b.type === pass.outpostAddress)?.metadata || {};
                const icon = meta.icon_uri || '/src/assets/images/podiumlogo.png';
                const passAddress = typeof pass.outpostAddress === 'string' ? pass.outpostAddress : '';
                const details = passDetails[passAddress];
                const externalName = meta.name || fallbackLabel(passAddress);

                return (
                  <Card key={passAddress} className="bg-[var(--color-bg)] flex flex-col items-center text-center p-6">
                    {/* Avatar/Icon */}
                    <img src={icon} alt="Pass Icon" className="w-16 h-16 rounded-full mb-3 border-2 border-[var(--color-primary)] bg-[var(--color-surface)] object-cover" />
                    
                    {/* Name and Symbol */}
                    <div className="text-lg font-bold mb-1">
                      {externalName} ({details?.symbol || '...'})
                    </div>
                    
                    {/* Balance */}
                    <div className="text-sm text-[var(--color-success)] mb-2">
                      Balance: {formatMoveAmount(pass.balance)}
                    </div>
                    
                    {/* Supply */}
                    <div className="text-xs text-[var(--color-text-muted)] mb-1">
                      Total Supply: {formatMoveAmount(details?.supply || 0)}
                    </div>
                    
                    {/* Prices */}
                    <div className="text-xs text-[var(--color-text-muted)] mb-1">
                      Current Price: {formatMoveAmount(details?.prices.singlePrice || 0)} MOVE
                    </div>
                    
                    {/* Buy/Sell Value */}
                    <div className="text-xs text-[var(--color-text-muted)] mb-1">
                      Buy Value: {formatMoveAmount(details?.prices.buyPriceWithFees || 0)} MOVE
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] mb-1">
                      Sell Value: {formatMoveAmount(details?.prices.sellPriceWithFees || 0)} MOVE
                    </div>
                    
                    {/* Fees */}
                    <div className="text-xs text-[var(--color-text-muted)] mb-2">
                      Fees: {formatMoveAmount(details?.prices.fees.buy.protocol || 0)} MOVE
                    </div>
                    
                    {/* Target Address (copyable) */}
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="font-mono text-xs text-[var(--color-text-muted)]">{shortenAddress(passAddress)}</span>
                      <button onClick={() => copyToClipboard(passAddress)} aria-label="Copy target address" className="text-[var(--color-primary)] hover:underline text-xs">Copy</button>
                    </div>
                    
                    {/* Buy/Sell Buttons */}
                    <div className="flex gap-2 justify-center">
                      <Button variant="primary" onClick={() => setShowBuyModal(prev => ({ ...prev, [passAddress]: true }))}>
                        Buy
                      </Button>
                      <Button variant="secondary" onClick={() => setShowSellModal(prev => ({ ...prev, [passAddress]: true }))}>
                        Sell
                      </Button>
                    </div>

                    {/* Buy Modal */}
                    {showBuyModal[passAddress] && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" aria-modal="true" role="dialog" tabIndex={-1}>
                        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-6 w-full max-w-xs mx-2 flex flex-col items-center">
                          <h3 className="text-lg font-bold mb-2">Buy Passes</h3>
                          <input 
                            type="number" 
                            min={1} 
                            value={tradeAmounts[passAddress] || 1} 
                            onChange={e => setTradeAmounts(prev => ({ ...prev, [passAddress]: Number(e.target.value) }))} 
                            className="w-full px-3 py-2 rounded border border-[var(--color-primary)] mb-3 bg-[var(--color-bg)] text-[var(--color-text-main)]" 
                          />
                          <div className="text-xs text-[var(--color-text-muted)] mb-3">
                            Total Cost: {formatMoveAmount(details?.prices.buyPriceWithFees || 0)} MOVE
                          </div>
                          <div className="flex gap-2">
                            <Button variant="primary" onClick={() => handleBuy(passAddress)}>Confirm</Button>
                            <Button variant="secondary" onClick={() => setShowBuyModal(prev => ({ ...prev, [passAddress]: false }))}>Cancel</Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Sell Modal */}
                    {showSellModal[passAddress] && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" aria-modal="true" role="dialog" tabIndex={-1}>
                        <div className="bg-[var(--color-surface)] rounded-lg shadow-lg p-6 w-full max-w-xs mx-2 flex flex-col items-center">
                          <h3 className="text-lg font-bold mb-2">Sell Passes</h3>
                          <input 
                            type="number" 
                            min={1} 
                            max={pass.balance} 
                            value={tradeAmounts[passAddress] || 1} 
                            onChange={e => setTradeAmounts(prev => ({ ...prev, [passAddress]: Number(e.target.value) }))} 
                            className="w-full px-3 py-2 rounded border border-[var(--color-primary)] mb-3 bg-[var(--color-bg)] text-[var(--color-text-main)]" 
                          />
                          <div className="text-xs text-[var(--color-text-muted)] mb-3">
                            Total Value: {formatMoveAmount(details?.prices.sellPriceWithFees || 0)} MOVE
                          </div>
                          <div className="flex gap-2">
                            <Button variant="primary" onClick={() => handleSell(passAddress)}>Confirm</Button>
                            <Button variant="secondary" onClick={() => setShowSellModal(prev => ({ ...prev, [passAddress]: false }))}>Cancel</Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-[var(--color-text-muted)]">No on-chain passes found.</p>
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